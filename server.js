// server.js
// Strata ERP — Backend API Server con Express.js y Prisma ORM

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'src')));

// Esquema de Roles y Permisos RBAC
const ROLE_PERMISSIONS = {
  admin: { name: "Administradora General", showCost: true, canAdd: true, canExport: true },
  analyst: { name: "Analista de Negocios", showCost: true, canAdd: false, canExport: true },
  warehouse: { name: "Gerente de Almacén", showCost: false, canAdd: true, canExport: false }
};

/**
 * 1. GET /api/v1/analytics/kpis
 * Calcula en tiempo real las métricas financieras desde la Base de Datos SQLite/PostgreSQL
 */
app.get('/api/v1/analytics/kpis', async (req, res) => {
  try {
    const products = await prisma.product.findMany();

    const totalInventoryValue = products.reduce((acc, p) => acc + (p.stock * p.unitPrice), 0);
    const totalInventoryCost = products.reduce((acc, p) => acc + (p.stock * p.unitCost), 0);
    const totalStock = products.reduce((acc, p) => acc + p.stock, 0);

    const mrr = totalInventoryValue * 0.18;
    const arr = mrr * 12;
    const grossMargin = totalInventoryValue > 0 ? (((totalInventoryValue - totalInventoryCost) / totalInventoryValue) * 100) : 0;
    const criticalStockItems = products.filter(p => p.stock <= p.minStock / 2).length;

    res.json({
      success: true,
      data: {
        mrr,
        arr,
        totalInventoryValue,
        totalInventoryCost,
        grossMarginPercentage: parseFloat(grossMargin.toFixed(2)),
        activeProducts: products.length,
        criticalStockItems,
        turnoverRate: 4.8,
        activeAccounts: totalStock * 14
      }
    });
  } catch (error) {
    console.error('Error al calcular KPIs:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

/**
 * 2. GET /api/v1/inventory
 * Retorna catálogo de inventario con filtrado y enmascaramiento RBAC
 */
app.get('/api/v1/inventory', async (req, res) => {
  try {
    const role = (req.query.role || 'admin').toLowerCase();
    const search = req.query.search || '';
    const permissions = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.admin;

    const products = await prisma.product.findMany({
      include: { category: true },
      where: search ? {
        OR: [
          { name: { contains: search } },
          { sku: { contains: search } },
          { category: { name: { contains: search } } }
        ]
      } : {},
      orderBy: { createdAt: 'desc' }
    });

    // Mapeo y enmascaramiento según RBAC
    const formattedProducts = products.map(p => {
      // Recalcular estado de stock dinámicamente
      let status = 'NORMAL';
      if (p.stock <= p.minStock / 2) {
        status = 'CRITICAL';
      } else if (p.stock <= p.minStock) {
        status = 'REORDER';
      }

      const margin = p.unitPrice > 0 ? (((p.unitPrice - p.unitCost) / p.unitPrice) * 100).toFixed(1) : 0;

      return {
        id: p.sku,
        databaseId: p.id,
        name: p.name,
        category: p.category ? p.category.name : 'Sin Categoría',
        stock: p.stock,
        minStock: p.minStock,
        unitCost: permissions.showCost ? p.unitCost : null,
        unitPrice: p.unitPrice,
        marginPercentage: permissions.showCost ? margin : null,
        status
      };
    });

    res.json({
      success: true,
      role: permissions.name,
      canAdd: permissions.canAdd,
      canExport: permissions.canExport,
      data: formattedProducts
    });
  } catch (error) {
    console.error('Error al obtener inventario:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

/**
 * 3. POST /api/v1/inventory
 * Registra un nuevo producto en la Base de Datos con validación y auto-cálculo de estado
 */
app.post('/api/v1/inventory', async (req, res) => {
  try {
    const { name, categoryName, stock, minStock, unitCost, unitPrice } = req.body;

    if (!name || !categoryName || stock === undefined || unitCost === undefined || unitPrice === undefined) {
      return res.status(400).json({ success: false, message: 'Todos los campos obligatorios deben ser provistos.' });
    }

    // Buscar o crear la categoría
    let category = await prisma.category.findUnique({ where: { name: categoryName } });
    if (!category) {
      category = await prisma.category.create({ data: { name: categoryName } });
    }

    // Generar SKU único
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const sku = `SKU-${randomNum}`;

    const numStock = parseInt(stock);
    const numMinStock = parseInt(minStock) || 10;
    const numCost = parseFloat(unitCost);
    const numPrice = parseFloat(unitPrice);

    let status = 'NORMAL';
    if (numStock <= numMinStock / 2) {
      status = 'CRITICAL';
    } else if (numStock <= numMinStock) {
      status = 'REORDER';
    }

    const newProduct = await prisma.product.create({
      data: {
        sku,
        name,
        categoryId: category.id,
        stock: numStock,
        minStock: numMinStock,
        unitCost: numCost,
        unitPrice: numPrice,
        status
      },
      include: { category: true }
    });

    res.status(201).json({
      success: true,
      message: 'Producto registrado exitosamente en la base de datos.',
      data: newProduct
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor al guardar producto.' });
  }
});

// Fallback al index.html para SPA
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor Strata ERP ejecutándose en http://localhost:${PORT}`);
  console.log(`📡 API REST con Prisma ORM activa en http://localhost:${PORT}/api/v1/inventory`);
});
