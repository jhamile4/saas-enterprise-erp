// src/app/api/inventory/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getPermissionsForRole } from '@/lib/rbac';
import { ProductItem, ProductStatus } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const roleParam = searchParams.get('role') || 'ADMIN';
    const search = searchParams.get('search') || '';

    const permissions = getPermissionsForRole(roleParam);

    const products = await prisma.product.findMany({
      include: { category: true },
      where: search ? {
        OR: [
          { name: { contains: search } },
          { sku: { contains: search } },
          { category: { name: { contains: search } } },
        ],
      } : {},
      orderBy: { createdAt: 'desc' },
    });

    const formattedProducts: ProductItem[] = products.map((p: any) => {
      let status: ProductStatus = 'NORMAL';
      if (p.stock <= p.minStock / 2) {
        status = 'CRITICAL';
      } else if (p.stock <= p.minStock) {
        status = 'REORDER';
      }

      const margin = p.unitPrice > 0 ? (((p.unitPrice - p.unitCost) / p.unitPrice) * 100).toFixed(1) : '0';

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
        status,
      };
    });

    return NextResponse.json({
      success: true,
      role: permissions.name,
      canAdd: permissions.canAdd,
      canExport: permissions.canExport,
      data: formattedProducts,
    });
  } catch (error) {
    console.error('Error al obtener inventario:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno en la consulta de inventario' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, categoryName, stock, minStock, unitCost, unitPrice } = body;

    if (!name || !categoryName || stock === undefined || unitCost === undefined || unitPrice === undefined) {
      return NextResponse.json(
        { success: false, message: 'Todos los campos requeridos deben ser provistos.' },
        { status: 400 }
      );
    }

    let category = await prisma.category.findUnique({ where: { name: categoryName } });
    if (!category) {
      category = await prisma.category.create({ data: { name: categoryName } });
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const sku = `SKU-${randomNum}`;

    const numStock = Number(stock);
    const numMinStock = Number(minStock) || 10;
    const numCost = Number(unitCost);
    const numPrice = Number(unitPrice);

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
        status,
      },
      include: { category: true },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Producto creado permanentemente en la base de datos.',
        data: newProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al registrar producto:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno al registrar producto en la BD' },
      { status: 500 }
    );
  }
}
