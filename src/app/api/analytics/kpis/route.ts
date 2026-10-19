// src/app/api/analytics/kpis/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { KPIAnalyticsData } from '@/types';
import { Product } from '@prisma/client';

export async function GET() {
  try {
    const products: Product[] = await prisma.product.findMany();

    const totalInventoryValue = products.reduce((acc: number, p: Product) => acc + (p.stock * p.unitPrice), 0);
    const totalInventoryCost = products.reduce((acc: number, p: Product) => acc + (p.stock * p.unitCost), 0);
    const totalStock = products.reduce((acc: number, p: Product) => acc + p.stock, 0);

    const mrr = totalInventoryValue * 0.18;
    const arr = mrr * 12;
    const grossMargin = totalInventoryValue > 0 ? (((totalInventoryValue - totalInventoryCost) / totalInventoryValue) * 100) : 0;
    const criticalStockItems = products.filter((p: Product) => p.stock <= p.minStock / 2).length;

    const data: KPIAnalyticsData = {
      mrr,
      arr,
      totalInventoryValue,
      totalInventoryCost,
      grossMarginPercentage: parseFloat(grossMargin.toFixed(2)),
      activeProducts: products.length,
      criticalStockItems,
      turnoverRate: 4.8,
      activeAccounts: totalStock * 14,
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error al obtener KPIs:', error);
    return NextResponse.json(
      { success: false, message: 'Error en el motor de analítica de la base de datos' },
      { status: 500 }
    );
  }
}
