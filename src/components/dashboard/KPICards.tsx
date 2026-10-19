// src/components/dashboard/KPICards.tsx
'use client';

import React from 'react';
import { KPIAnalyticsData } from '@/types';
import { TrendingUp, DollarSign, Users, RefreshCw } from 'lucide-react';

interface KPICardsProps {
  data: KPIAnalyticsData | null;
  loading: boolean;
}

export const KPICards: React.FC<KPICardsProps> = ({ data, loading }) => {
  if (loading || !data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-bgCard p-5 rounded-2xl border border-borderSubtle animate-pulse h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {/* KPI 1: MRR */}
      <div className="bg-bgCard p-5 rounded-2xl border border-borderSubtle hover:border-goldAccent/40 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-zinc-400">Ingreso Mensual Recurrente (MRR)</span>
          <span className="flex items-center gap-1 text-xs font-bold text-greenAccent bg-greenAccent/10 px-2 py-0.5 rounded-md">
            <TrendingUp size={12} /> +15.2%
          </span>
        </div>
        <div className="text-2xl font-black text-white tracking-tight">
          S/. {data.mrr.toLocaleString('es-PE', { maximumFractionDigits: 0 })}
        </div>
        <div className="text-xs text-zinc-500 mt-1">Calculado en tiempo real en Soles (S/.)</div>
      </div>

      {/* KPI 2: Inventario */}
      <div className="bg-bgCard p-5 rounded-2xl border border-borderSubtle hover:border-goldAccent/40 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-zinc-400">Valoración Total de Inventario</span>
          <span className="flex items-center gap-1 text-xs font-bold text-cyanAccent bg-cyanAccent/10 px-2 py-0.5 rounded-md">
            <DollarSign size={12} /> Activo
          </span>
        </div>
        <div className="text-2xl font-black text-white tracking-tight">
          S/. {data.totalInventoryValue.toLocaleString('es-PE', { maximumFractionDigits: 0 })}
        </div>
        <div className="text-xs text-zinc-500 mt-1">Margen Bruto promedio: {data.grossMarginPercentage}%</div>
      </div>

      {/* KPI 3: Cuentas */}
      <div className="bg-bgCard p-5 rounded-2xl border border-borderSubtle hover:border-goldAccent/40 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-zinc-400">Cuentas / Licencias Activas</span>
          <span className="flex items-center gap-1 text-xs font-bold text-goldAccent bg-goldAccent/10 px-2 py-0.5 rounded-md">
            <Users size={12} /> +6.1%
          </span>
        </div>
        <div className="text-2xl font-black text-white tracking-tight">
          {data.activeAccounts.toLocaleString()}
        </div>
        <div className="text-xs text-zinc-500 mt-1">En plataformas SaaS integradas</div>
      </div>

      {/* KPI 4: Rotación */}
      <div className="bg-bgCard p-5 rounded-2xl border border-borderSubtle hover:border-goldAccent/40 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-zinc-400">Rotación de Inventario</span>
          <span className="flex items-center gap-1 text-xs font-bold text-greenAccent bg-greenAccent/10 px-2 py-0.5 rounded-md">
            <RefreshCw size={12} /> Optimizada
          </span>
        </div>
        <div className="text-2xl font-black text-white tracking-tight">
          {data.turnoverRate.toFixed(1)}x
        </div>
        <div className="text-xs text-zinc-500 mt-1">Ítems Críticos de Stock: {data.criticalStockItems}</div>
      </div>
    </div>
  );
};
