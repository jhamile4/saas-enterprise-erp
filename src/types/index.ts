// src/types/index.ts

export type Role = 'ADMIN' | 'ANALYST' | 'WAREHOUSE';

export type ProductStatus = 'NORMAL' | 'REORDER' | 'CRITICAL';

export interface UserRolePermissions {
  name: string;
  showCost: boolean;
  canAdd: boolean;
  canExport: boolean;
}

export interface ProductItem {
  id: string;             // SKU (ej. SKU-9021)
  databaseId: string;     // UUID en la BD
  name: string;
  category: string;
  stock: number;
  minStock: number;
  unitCost: number | null; // Oculto / enmascarado si rol es WAREHOUSE
  unitPrice: number;
  marginPercentage: string | null;
  status: ProductStatus;
}

export interface KPIAnalyticsData {
  mrr: number;
  arr: number;
  totalInventoryValue: number;
  totalInventoryCost: number;
  grossMarginPercentage: number;
  activeProducts: number;
  criticalStockItems: number;
  turnoverRate: number;
  activeAccounts: number;
}

export interface CreateProductPayload {
  name: string;
  categoryName: string;
  stock: number;
  minStock: number;
  unitCost: number;
  unitPrice: number;
}
