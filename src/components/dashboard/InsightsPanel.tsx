// src/components/dashboard/InsightsPanel.tsx
'use client';

import React from 'react';
import { Lightbulb, AlertTriangle, ArrowRight } from 'lucide-react';

export const InsightsPanel: React.FC = () => {
  return (
    <div className="bg-bgCard p-6 rounded-2xl border border-borderSubtle flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-4 text-goldAccent font-bold text-sm">
          <Lightbulb size={18} />
          <span>Insights de Análisis de Negocio</span>
        </div>

        <div className="space-y-4 text-xs leading-relaxed text-zinc-300">
          <div className="p-3 bg-bgSurface rounded-xl border border-borderSubtle">
            <strong className="text-white block mb-1">Optimización de Margen Bruto:</strong>
            El margen promedio de servicios cloud alcanza el <span className="text-greenAccent font-bold">44.8%</span>. Se recomienda priorizar la renovación de licencias SaaS Enterprise.
          </div>

          <div className="p-3 bg-bgSurface rounded-xl border border-borderSubtle">
            <strong className="text-white block mb-1">Alerta de Cadena de Suministro:</strong>
            Existen ítems que alcanzaron su nivel mínimo de seguridad.
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-goldAccent/10 border border-goldAccent/20 rounded-xl flex items-center justify-between text-xs text-goldAccent font-semibold">
        <span className="flex items-center gap-1.5">
          <AlertTriangle size={15} /> Sugerencia: Aprobar orden de compra SSL
        </span>
        <ArrowRight size={14} />
      </div>
    </div>
  );
};
