// src/components/dashboard/RBACMatrix.tsx
'use client';

import React from 'react';
import { Shield, Check, X, Lock, Eye, PlusCircle, Download, UserCheck } from 'lucide-react';
import { Role } from '@/types';
import { ROLE_PERMISSIONS } from '@/lib/rbac';

interface RBACMatrixProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
}

export const RBACMatrix: React.FC<RBACMatrixProps> = ({ currentRole, onRoleChange }) => {
  const rolesList: { role: Role; name: string; desc: string; color: string }[] = [
    {
      role: 'ADMIN',
      name: 'Administradora General',
      desc: 'Acceso total a métricas financieras, costos de compra, creación de productos y exportación de reportes.',
      color: 'border-goldAccent text-goldAccent bg-goldAccent/10',
    },
    {
      role: 'ANALYST',
      name: 'Analista de Negocios',
      desc: 'Enfocado en inteligencia financiera y reportes. Puede ver costos de adquisición pero no modificar inventario.',
      color: 'border-emerald-500 text-emerald-400 bg-emerald-500/10',
    },
    {
      role: 'WAREHOUSE',
      name: 'Gerente de Almacén',
      desc: 'Rol operativo. Puede registrar y modificar stock de productos, pero los costos sensibles permanecen enmascarados.',
      color: 'border-blue-500 text-blue-400 bg-blue-500/10',
    },
  ];

  const permissionsMatrix = [
    {
      feature: 'Visualizar Precios de Venta & Métricas BI',
      admin: true,
      analyst: true,
      warehouse: true,
      icon: Eye,
    },
    {
      feature: 'Ver Costo de Adquisición Unitario & Margen Real',
      admin: true,
      analyst: true,
      warehouse: false,
      icon: Lock,
    },
    {
      feature: 'Registrar y Crear Nuevos Productos',
      admin: true,
      analyst: false,
      warehouse: true,
      icon: PlusCircle,
    },
    {
      feature: 'Exportar Reportes Ejecutivos (CSV / PDF)',
      admin: true,
      analyst: true,
      warehouse: false,
      icon: Download,
    },
    {
      feature: 'Modificación Directa de Cantidad en Stock',
      admin: true,
      analyst: false,
      warehouse: true,
      icon: UserCheck,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Banner de Presentación RBAC */}
      <div className="bg-bgCard p-6 rounded-2xl border border-borderSubtle shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-goldAccent/10 text-goldAccent rounded-xl border border-goldAccent/20">
            <Shield size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Control de Acceso Basado en Roles (RBAC)</h2>
            <p className="text-sm text-zinc-400">
              Gestión de seguridad empresarial para la protección de datos financieros sensibles y segregación de funciones.
            </p>
          </div>
        </div>
      </div>

      {/* Tarjetas de Selección de Roles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {rolesList.map((r) => {
          const isSelected = currentRole === r.role;
          return (
            <div
              key={r.role}
              onClick={() => onRoleChange(r.role)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-bgCard border-goldAccent shadow-lg shadow-goldAccent/10 ring-1 ring-goldAccent'
                  : 'bg-bgCard/60 border-borderSubtle hover:border-zinc-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${r.color}`}>
                    {r.role}
                  </span>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-goldAccent">
                      <Check size={14} /> Activo Ahora
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-white text-base mb-1">{r.name}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{r.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-borderSubtle text-xs text-zinc-500 font-medium">
                Haz clic para simular este rol
              </div>
            </div>
          );
        })}
      </div>

      {/* Matriz de Permisos */}
      <div className="bg-bgCard p-6 rounded-2xl border border-borderSubtle shadow-xl overflow-x-auto">
        <h3 className="text-base font-bold text-white mb-4">Matriz de Matriz Comparativa de Permisos</h3>

        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-borderSubtle text-zinc-400 text-xs uppercase tracking-wider">
              <th className="py-3 px-4">Funcionalidad / Módulo</th>
              <th className="py-3 px-4 text-center">ADMIN</th>
              <th className="py-3 px-4 text-center">ANALYST</th>
              <th className="py-3 px-4 text-center">WAREHOUSE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borderSubtle/60">
            {permissionsMatrix.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <tr key={idx} className="hover:bg-bgSurface/50 transition-colors">
                  <td className="py-3.5 px-4 flex items-center gap-3 text-white font-medium text-xs">
                    <IconComponent size={16} className="text-goldAccent shrink-0" />
                    <span>{item.feature}</span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {item.admin ? (
                      <span className="inline-flex p-1 bg-emerald-500/10 text-emerald-400 rounded-full">
                        <Check size={16} />
                      </span>
                    ) : (
                      <span className="inline-flex p-1 bg-rose-500/10 text-rose-400 rounded-full">
                        <X size={16} />
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {item.analyst ? (
                      <span className="inline-flex p-1 bg-emerald-500/10 text-emerald-400 rounded-full">
                        <Check size={16} />
                      </span>
                    ) : (
                      <span className="inline-flex p-1 bg-rose-500/10 text-rose-400 rounded-full">
                        <X size={16} />
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {item.warehouse ? (
                      <span className="inline-flex p-1 bg-emerald-500/10 text-emerald-400 rounded-full">
                        <Check size={16} />
                      </span>
                    ) : (
                      <span className="inline-flex p-1 bg-rose-500/10 text-rose-400 rounded-full">
                        <X size={16} />
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
