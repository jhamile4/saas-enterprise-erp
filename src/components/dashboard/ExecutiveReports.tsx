// src/components/dashboard/ExecutiveReports.tsx
'use client';

import React, { useState } from 'react';
import { FileText, Download, CheckCircle2, TrendingUp, AlertTriangle, ShieldAlert, Sparkles } from 'lucide-react';
import { KPIAnalyticsData, Role } from '@/types';

interface ExecutiveReportsProps {
  kpiData: KPIAnalyticsData | null;
  currentRole: Role;
  onExportCSV: () => void;
}

export const ExecutiveReports: React.FC<ExecutiveReportsProps> = ({ kpiData, currentRole, onExportCSV }) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const reports = [
    {
      id: 'financial-summary',
      title: 'Estado de Rendimiento Financiero',
      description: 'Resumen consolidado de MRR, ARR, márgenes brutos y métricas de crecimiento mensual.',
      type: 'PDF / CSV',
      updated: 'Hace 5 minutos',
      icon: TrendingUp,
      color: 'text-emerald-400',
    },
    {
      id: 'inventory-audit',
      title: 'Auditoría y Valoración de Inventario',
      description: 'Detalle de activos en almacén, costo de adquisición, precio de venta estimado y valoración total.',
      type: 'CSV Export',
      updated: 'Tiempo Real',
      icon: FileText,
      color: 'text-goldAccent',
    },
    {
      id: 'reorder-forecast',
      title: 'Plan de Reabastecimiento & Alertas de Stock',
      description: 'Informe de productos en estado crítico y reorden para optimizar el capital de trabajo.',
      type: 'PDF Executive',
      updated: 'Hoy, 08:00 AM',
      icon: AlertTriangle,
      color: 'text-amber-400',
    },
    {
      id: 'rbac-security-audit',
      title: 'Auditoría de Seguridad y Accesos RBAC',
      description: 'Registro de trazabilidad de cambios en stock y permisos de usuarios por nivel de acceso.',
      type: 'PDF Audit Log',
      updated: 'Ayer',
      icon: ShieldAlert,
      color: 'text-purple-400',
    },
  ];

  const handleGenerateReport = (id: string) => {
    if (id === 'inventory-audit') {
      onExportCSV();
      return;
    }
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
      alert(`✅ Reporte "${id}" generado con éxito. Se ha iniciado la descarga del documento executive.`);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Banner de Presentación */}
      <div className="bg-gradient-to-r from-bgCard via-zinc-900 to-bgCard p-6 rounded-2xl border border-goldAccent/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles size={160} className="text-goldAccent" />
        </div>
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-goldAccent/10 text-goldAccent border border-goldAccent/20 mb-3">
            <Sparkles size={13} /> Motor de Reportes C-Level
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight">Centro de Reportes Ejecutivos</h2>
          <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
            Genera e imprime informes consolidados de Inteligencia de Negocios, estados financieros y auditorías de inventario optimizados para la toma de decisiones directivas.
          </p>
        </div>
      </div>

      {/* Grid de Reportes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((rep) => {
          const IconComponent = rep.icon;
          const isDownloading = downloadingId === rep.id;
          return (
            <div
              key={rep.id}
              className="bg-bgCard p-6 rounded-2xl border border-borderSubtle hover:border-goldAccent/40 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className={`p-3 rounded-xl bg-bgSurface border border-borderSubtle ${rep.color}`}>
                    <IconComponent size={24} />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-bgSurface text-zinc-400 border border-borderSubtle">
                    {rep.type}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-goldAccent transition-colors">
                  {rep.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{rep.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-borderSubtle/60 flex items-center justify-between">
                <span className="text-xs text-zinc-500 font-medium">Actualizado: {rep.updated}</span>
                <button
                  onClick={() => handleGenerateReport(rep.id)}
                  disabled={isDownloading}
                  className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl bg-goldAccent text-bgDeep hover:bg-goldHover transition-all shadow-md shadow-goldAccent/10 active:scale-95 disabled:opacity-50"
                >
                  {isDownloading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-bgDeep border-t-transparent rounded-full animate-spin" />
                      <span>Generando...</span>
                    </>
                  ) : (
                    <>
                      <Download size={14} />
                      <span>Generar Reporte</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumen Métrico de Respaldo */}
      {kpiData && (
        <div className="bg-bgCard p-6 rounded-2xl border border-borderSubtle">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-goldAccent" /> Indicadores Consolidados para Auditoría
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-bgSurface rounded-xl border border-borderSubtle">
              <span className="text-zinc-400 block mb-1">Valoración Total Stock</span>
              <span className="text-base font-extrabold text-goldAccent">
                S/. {kpiData.totalInventoryValue.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="p-4 bg-bgSurface rounded-xl border border-borderSubtle">
              <span className="text-zinc-400 block mb-1">Margen Bruto General</span>
              <span className="text-base font-extrabold text-emerald-400">
                {kpiData.grossMarginPercentage}%
              </span>
            </div>
            <div className="p-4 bg-bgSurface rounded-xl border border-borderSubtle">
              <span className="text-zinc-400 block mb-1">ARR (Ingreso Anual)</span>
              <span className="text-base font-extrabold text-white">
                S/. {kpiData.arr.toLocaleString('es-PE')}
              </span>
            </div>
            <div className="p-4 bg-bgSurface rounded-xl border border-borderSubtle">
              <span className="text-zinc-400 block mb-1">Índice de Rotación</span>
              <span className="text-base font-extrabold text-zinc-300">
                {kpiData.turnoverRate}x / año
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
