// src/components/dashboard/RevenueChart.tsx
'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const chartData = [
  { month: 'Ene', revenue: 65000 },
  { month: 'Feb', revenue: 78000 },
  { month: 'Mar', revenue: 92000 },
  { month: 'Abr', revenue: 88000 },
  { month: 'May', revenue: 105000 },
  { month: 'Jun', revenue: 125400 },
];

export const RevenueChart: React.FC = () => {
  return (
    <div className="bg-bgCard p-6 rounded-2xl border border-borderSubtle">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-bold text-white">Crecimiento de Ingresos Recurrentes (2026)</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Proyección financiera basada en ventas de servicios e infraestructura cloud</p>
        </div>
        <span className="text-xs font-bold text-goldAccent bg-goldAccent/10 px-3 py-1 rounded-full border border-goldAccent/20">
          En Soles (S/.)
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c9a063" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#c9a063" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" stroke="#a1a1aa" fontSize={12} tickLine={false} />
            <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} tickFormatter={(val) => `S/. ${val / 1000}k`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#18181b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
              labelStyle={{ color: '#fff', fontWeight: 'bold' }}
              formatter={(value: any) => [`S/. ${Number(value).toLocaleString()}`, 'Ingreso Recurrente']}
            />
            <Area type="monotone" dataKey="revenue" stroke="#c9a063" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
