// src/components/layout/Header.tsx
'use client';

import React from 'react';
import { Role } from '@/types';
import { Shield } from 'lucide-react';

interface HeaderProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRole, onRoleChange }) => {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-borderSubtle">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Dashboard de Análisis de Negocio</h1>
        <p className="text-sm text-zinc-400 mt-1">Monitoreo financiero en tiempo real y gestión inteligente de inventarios</p>
      </div>

      <div className="flex items-center gap-3 bg-bgCard p-2.5 rounded-xl border border-borderSubtle">
        <Shield size={18} className="text-goldAccent" />
        <span className="text-xs font-semibold text-zinc-300">Simulador de Rol:</span>
        <select
          value={currentRole}
          onChange={(e) => onRoleChange(e.target.value as Role)}
          className="bg-bgSurface text-white text-xs font-medium px-3 py-1.5 rounded-lg border border-borderSubtle focus:outline-none focus:border-goldAccent transition-colors cursor-pointer"
        >
          <option value="ADMIN">Administradora General (Full Access)</option>
          <option value="ANALYST">Analista de Negocios (Vista Financiera)</option>
          <option value="WAREHOUSE">Gerente de Almacén (Operativo)</option>
        </select>
      </div>
    </header>
  );
};
