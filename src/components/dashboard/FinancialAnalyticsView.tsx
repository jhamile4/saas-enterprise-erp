// src/components/dashboard/FinancialAnalyticsView.tsx
'use client';

import React from 'react';
import { KPIAnalyticsData } from '@/types';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { InsightsPanel } from '@/components/dashboard/InsightsPanel';
import { TrendingUp, PieChart, DollarSign, ArrowUpRight, Award, Layers } from 'lucide-react';

interface FinancialAnalyticsViewProps {
  kpiData: KPIAnalyticsData | null;
  loading: boolean;
}

export const FinancialAnalyticsView: React.FC<FinancialAnalyticsViewProps> = ({ kpiData, loading }) => {
  const categoryMargins = [
    { name: 'Infraestructura Cloud', revenue: 'S/. 142,500', cost: 'S/. 78,000', margin: '45.2%', trend: '+8.4%' },
    { name: 'Licencias Software SaaS', revenue: 'S/. 98,200', cost: 'S/. 34,000', margin: '65.3%', trend: '+12.1%' },
    { name: 'Hardware Redes Enterprise', revenue: 'S/. 64,800', cost: 'S/. 42,000', margin: '35.1%', trend: '+4.0%' },
    { name: 'Seguridad & Firewalls', revenue: 'S/. 51,400', cost: 'S/. 26,500', margin: '48.4%', trend: '+15.3%' },
  ];

  return (
    <div className="space-y-8">
      {/* Banner de Cabecera Financiera */}
      <div className="bg-gradient-to-r from-zinc-900 via-bgCard to-zinc-900 p-6 rounded-2xl border border-goldAccent/30 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
              <TrendingUp size={13} /> Inteligencia Financiera BI & P&L
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight">Análisis de Rentabilidad & Margen Bruto</h2>
            <p className="text-xs text-zinc-400 mt-1">
              Evaluación avanzada del rendimiento de ingresos recurrentes, estructuras de costo y márgenes de ganancia por línea de negocio.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-bgDeep p-3 rounded-xl border border-borderSubtle">
            <div>
              <span className="text-[11px] text-zinc-400 block">Moneda de Balance</span>
              <span className="text-sm font-extrabold text-goldAccent">Soles Peruanos (S/.)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Superior de Métricas Financieras Clave */}
      {kpiData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-bgCard p-5 rounded-2xl border border-borderSubtle">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-zinc-400">Ingreso Anual Proyectado (ARR)</span>
              <span className="p-2 rounded-lg bg-goldAccent/10 text-goldAccent">
                <DollarSign size={18} />
              </span>
            </div>
            <div className="text-2xl font-black text-white">
              S/. {kpiData.arr.toLocaleString('es-PE', { maximumFractionDigits: 0 })}
            </div>
            <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1 font-semibold">
              <ArrowUpRight size={14} /> +18.4% vs año anterior
            </div>
          </div>

          <div className="bg-bgCard p-5 rounded-2xl border border-borderSubtle">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-zinc-400">Margen Bruto Ponderado</span>
              <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <PieChart size={18} />
              </span>
            </div>
            <div className="text-2xl font-black text-emerald-400">
              {kpiData.grossMarginPercentage}%
            </div>
            <div className="text-xs text-zinc-400 mt-2">
              Costo total de existencias: S/. {kpiData.totalInventoryCost.toLocaleString()}
            </div>
          </div>

          <div className="bg-bgCard p-5 rounded-2xl border border-borderSubtle">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-zinc-400">Línea de Negocio Líder</span>
              <span className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <Award size={18} />
              </span>
            </div>
            <div className="text-lg font-bold text-white">Infraestructura Cloud</div>
            <div className="text-xs text-zinc-400 mt-2">Genera el 39.8% de los ingresos totales</div>
          </div>
        </div>
      )}

      {/* Gráficos de Tendencia & Insights BI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <InsightsPanel />
        </div>
      </div>

      {/* Tabla Desglose de Rentabilidad por Categoría */}
      <div className="bg-bgCard p-6 rounded-2xl border border-borderSubtle shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Layers size={18} className="text-goldAccent" />
          <h3 className="text-base font-bold text-white">Desglose de Margen Bruto por Categoría de Negocio</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-borderSubtle text-zinc-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4">Ingreso Bruto (S/.)</th>
                <th className="py-3 px-4">Costo Directo (S/.)</th>
                <th className="py-3 px-4">Margen Bruto %</th>
                <th className="py-3 px-4">Tendencia Mensual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderSubtle/60">
              {categoryMargins.map((cat, idx) => (
                <tr key={idx} className="hover:bg-bgSurface/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">{cat.name}</td>
                  <td className="py-3.5 px-4 font-semibold text-zinc-200">{cat.revenue}</td>
                  <td className="py-3.5 px-4 text-zinc-400">{cat.cost}</td>
                  <td className="py-3.5 px-4 font-extrabold text-emerald-400">{cat.margin}</td>
                  <td className="py-3.5 px-4 font-bold text-goldAccent">{cat.trend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
