// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando semillado de datos para Strata ERP (Next.js + Prisma)...');

  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Usuarios RBAC
  await prisma.user.create({
    data: {
      name: 'Jhamile Macavilca',
      email: 'admin@strata.erp',
      passwordHash: 'hash_demo_admin_123',
      role: 'ADMIN',
    },
  });

  await prisma.user.create({
    data: {
      name: 'Analista de Negocios',
      email: 'analyst@strata.erp',
      passwordHash: 'hash_demo_analyst_123',
      role: 'ANALYST',
    },
  });

  await prisma.user.create({
    data: {
      name: 'Gerente de Almacén',
      email: 'warehouse@strata.erp',
      passwordHash: 'hash_demo_warehouse_123',
      role: 'WAREHOUSE',
    },
  });

  // Categorías
  const catCloud = await prisma.category.create({
    data: { name: 'Infraestructura Cloud', description: 'Servidores y clusters cloud' },
  });
  const catSoftware = await prisma.category.create({
    data: { name: 'Licencias Software', description: 'Suscripciones y licencias SaaS' },
  });
  const catHardware = await prisma.category.create({
    data: { name: 'Hardware Redes', description: 'Equipamiento de telecomunicaciones' },
  });
  const catSecurity = await prisma.category.create({
    data: { name: 'Seguridad', description: 'Certificados y soluciones de seguridad' },
  });

  // Productos
  const products = [
    {
      sku: 'SKU-9021',
      name: 'AWS Cloud Server Instances (m5.2xlarge)',
      categoryId: catCloud.id,
      stock: 45,
      minStock: 20,
      unitCost: 320.0,
      unitPrice: 580.0,
      status: 'NORMAL',
    },
    {
      sku: 'SKU-8812',
      name: 'Licencias SaaS Enterprise (Per Seat)',
      categoryId: catSoftware.id,
      stock: 12,
      minStock: 15,
      unitCost: 45.0,
      unitPrice: 99.0,
      status: 'REORDER',
    },
    {
      sku: 'SKU-7734',
      name: 'Cisco Core Gateway Router 9000',
      categoryId: catHardware.id,
      stock: 4,
      minStock: 5,
      unitCost: 2400.0,
      unitPrice: 4200.0,
      status: 'REORDER',
    },
    {
      sku: 'SKU-6120',
      name: 'PostgreSQL High-Availability Node',
      categoryId: catCloud.id,
      stock: 28,
      minStock: 10,
      unitCost: 180.0,
      unitPrice: 390.0,
      status: 'NORMAL',
    },
    {
      sku: 'SKU-5409',
      name: 'Wildcard SSL/TLS Security Certificates',
      categoryId: catSecurity.id,
      stock: 2,
      minStock: 8,
      unitCost: 120.0,
      unitPrice: 299.0,
      status: 'CRITICAL',
    },
    {
      sku: 'SKU-4115',
      name: 'Redis Enterprise Cache Cluster',
      categoryId: catCloud.id,
      stock: 19,
      minStock: 10,
      unitCost: 150.0,
      unitPrice: 320.0,
      status: 'NORMAL',
    },
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  console.log('🎉 Semillado finalizado con éxito!');
}

main()
  .catch((e) => {
    console.error('❌ Error semillando datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
