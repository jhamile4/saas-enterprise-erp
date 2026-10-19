// src/lib/rbac.ts
import { Role, UserRolePermissions } from '@/types';

export const ROLE_PERMISSIONS: Record<Role, UserRolePermissions> = {
  ADMIN: {
    name: "Administradora General",
    showCost: true,
    canAdd: true,
    canExport: true,
  },
  ANALYST: {
    name: "Analista de Negocios",
    showCost: true,
    canAdd: false,
    canExport: true,
  },
  WAREHOUSE: {
    name: "Gerente de Almacén",
    showCost: false,
    canAdd: true,
    canExport: false,
  },
};

export function getPermissionsForRole(roleInput: string): UserRolePermissions {
  const normalized = (roleInput || 'ADMIN').toUpperCase() as Role;
  return ROLE_PERMISSIONS[normalized] || ROLE_PERMISSIONS.ADMIN;
}
