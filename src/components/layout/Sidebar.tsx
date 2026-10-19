// src/components/layout/Sidebar.tsx
'use client';

import React from 'react';
import { LayoutDashboard, BarChart3, Package, FileText, ShieldCheck } from 'lucide-react';
import { Role } from '@/types';
import { ROLE_PERMISSIONS } from '@/lib/rbac';

export type NavTab = 'dashboard' | 'analytics' | 'inventory' | 'reports' | 'rbac';

interface SidebarProps {
  currentRole: Role;
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentRole, activeTab, onTabChange }) => {
  const roleInfo = ROLE_PERMISSIONS[currentRole];

  const menuItems: { id: NavTab; label: string; icon: React.FC<{ size?: number }> }[] = [
    { id: 'dashboard', label: 'Dashboard Principal', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analítica Financiera', icon: BarChart3 },
    { id: 'inventory', label: 'Inventario & Almacén', icon: Package },
    { id: 'reports', label: 'Reportes Ejecutivos', icon: FileText },
    { id: 'rbac', label: 'Control Roles RBAC', icon: ShieldCheck },
  ];

  return (
    <aside className="w-64 bg-bgCard border-r border-borderSubtle flex flex-col justify-between p-6 h-screen sticky top-0">
      <div>
        {/* Brand Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-goldAccent to-goldHover flex items-center justify-center font-extrabold text-bgDeep text-xl shadow-lg shadow-goldAccent/20">
            S
          </div>
          <div>
            <div className="font-extrabold tracking-wider text-base text-white">STRATA ERP</div>
            <div className="text-xs text-zinc-400 font-medium">Business Intelligence</div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav>
          <ul className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-goldAccent/10 text-goldAccent border border-goldAccent/30 shadow-sm shadow-goldAccent/10'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50 border border-transparent'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* User Badge */}
      <div className="p-4 bg-bgSurface rounded-xl border border-borderSubtle">
        <div className="font-semibold text-sm text-white">Jhamile Macavilca</div>
        <div className="text-xs text-goldAccent font-medium mt-0.5">{roleInfo.name}</div>
      </div>
    </aside>
  );
};

