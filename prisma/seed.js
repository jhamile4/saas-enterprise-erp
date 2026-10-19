// prisma/seed.js
// Script de semillado (Seed) para poblar la base de datos inicial de Strata ERP

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando proceso de semillado (Seed) de la Base de Datos...');

  // 1. Limpiar datos existentes
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // 2. Crear Usuarios con Roles RBAC
  console.log('👤 Creando usuarios con roles RBAC...');
  const adminUser = await prisma.user.create({
    data: {
      name: 'Jhamile Macavilca',
      email: 'admin@strata.erp',
      passwordHash: 'hash_demo_admin_123',
      role: 'ADMIN'
    }
  });

  const analystUser = await prisma.user.create({
    data: {
      name: 'Analista de Negocios',
      email: 'analyst@strata.erp',
      passwordHash: 'hash_demo_analyst_123',
      role: 'ANALYST'
    }
  });

  const warehouseUser = await prisma.user.create({
    data: {
      name: 'Gerente de Almacén',
      email: 'warehouse@strata.erp',
      passwordHash: 'hash_demo_warehouse_123',
      role: 'WAREHOUSE'
    }
  });

  console.log(`✅ Usuarios creados: Admin (${adminUser.email}), Analyst (${analystUser.email}), Warehouse (${warehouseUser.email})`);

  // 3. Crear Categorías
  console.log('🏷️ Creando categorías de productos...');
  const catCloud = await prisma.category.create({
    data: { name: 'Infraestructura Cloud', description: 'Servidores, clusters y almacenamiento cloud' }
  });
  const catSoftware = await prisma.category.create({
    data: { name: 'Licencias Software', description: 'Licencias de software y subsripciones SaaS' }
  });
  const catHardware = await prisma.category.create({
    data: { name: 'Hardware Redes', description: 'Routers, switches y equipamiento físico' }
  });
  const catSecurity = await prisma.category.create({
    data: { name: 'Seguridad', description: 'Certificados SSL, firewalls y licencias de seguridad' }
  });

  // 4. Crear Productos con cálculo de estado inicial
  console.log('📦 Creando catálogo de productos inicial...');
  const initialProducts = [
    {
      sku: 'SKU-9021',
      name: 'AWS Cloud Server Instances (m5.2xlarge)',
      categoryId: catCloud.id,
      stock: 45,
      minStock: 20,
      unitCost: 320.00,
      unitPrice: 580.00,
      status: 'NORMAL'
    },
    {
      sku: 'SKU-8812',
      name: 'Licencias SaaS Enterprise (Per Seat)',
      categoryId: catSoftware.id,
      stock: 12,
      minStock: 15,
      unitCost: 45.00,
      unitPrice: 99.00,
      status: 'REORDER'
    },
    {
      sku: 'SKU-7734',
      name: 'Cisco Core Gateway Router 9000',
      categoryId: catHardware.id,
      stock: 4,
      minStock: 5,
      unitCost: 2400.00,
      unitPrice: 4200.00,
      status: 'REORDER'
    },
    {
      sku: 'SKU-6120',
      name: 'PostgreSQL High-Availability Node',
      categoryId: catCloud.id,
      stock: 28,
      minStock: 10,
      unitCost: 180.00,
      unitPrice: 390.00,
      status: 'NORMAL'
    },
    {
      sku: 'SKU-5409',
      name: 'Wildcard SSL/TLS Security Certificates',
      categoryId: catSecurity.id,
      stock: 2,
      minStock: 8,
      unitCost: 120.00,
      unitPrice: 299.00,
      status: 'CRITICAL'
    },
    {
      sku: 'SKU-4115',
      name: 'Redis Enterprise Cache Cluster',
      categoryId: catCloud.id,
      stock: 19,
      minStock: 10,
      unitCost: 150.00,
      unitPrice: 320.00,
      status: 'NORMAL'
    }
  ];

  for (const prod of initialProducts) {
    await prisma.product.create({ data: prod });
  }

  console.log(`✅ ${initialProducts.length} productos insertados con éxito en la base de datos!`);
  console.log('🎉 Semillado finalizado exitosamente.');
}

main()
  .catch((e) => {
    console.error('❌ Error en el semillado:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
