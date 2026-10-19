// src/app/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Role, ProductItem, KPIAnalyticsData, CreateProductPayload } from '@/types';
import { Sidebar, NavTab } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { KPICards } from '@/components/dashboard/KPICards';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { InsightsPanel } from '@/components/dashboard/InsightsPanel';
import { FinancialAnalyticsView } from '@/components/dashboard/FinancialAnalyticsView';
import { ExecutiveReports } from '@/components/dashboard/ExecutiveReports';
import { RBACMatrix } from '@/components/dashboard/RBACMatrix';
import { InventoryTable } from '@/components/inventory/InventoryTable';
import { AddProductModal } from '@/components/inventory/AddProductModal';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [currentRole, setCurrentRole] = useState<Role>('ADMIN');
  const [kpiData, setKpiData] = useState<KPIAnalyticsData | null>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [canAdd, setCanAdd] = useState<boolean>(true);
  const [canExport, setCanExport] = useState<boolean>(true);

  // 1. Cargar KPIs desde la API route
  const fetchKPIs = useCallback(async () => {
    try {
      const res = await fetch('/api/analytics/kpis');
      const json = await res.json();
      if (json.success) {
        setKpiData(json.data);
      }
    } catch (err) {
      console.error('Error al obtener KPIs:', err);
    }
  }, []);

  // 2. Cargar productos con filtrado RBAC desde la API route
  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/inventory?role=${currentRole}&search=${encodeURIComponent(searchQuery)}`);
      const json = await res.json();
      if (json.success) {
        setProducts(json.data);
        setCanAdd(json.canAdd);
        setCanExport(json.canExport);
      }
    } catch (err) {
      console.error('Error al consultar inventario:', err);
    } finally {
      setLoading(false);
    }
  }, [currentRole, searchQuery]);

  useEffect(() => {
    fetchKPIs();
  }, [fetchKPIs]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  // 3. Crear nuevo producto vía POST
  const handleCreateProduct = async (payload: CreateProductPayload) => {
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        await fetchKPIs();
        await fetchInventory();
      } else {
        alert(`Error: ${json.message}`);
      }
    } catch (err) {
      console.error('Error creando producto:', err);
    }
  };

  // 4. Exportar CSV
  const handleExportCSV = async () => {
    try {
      const res = await fetch(`/api/inventory?role=${currentRole}`);
      const json = await res.json();
      if (!json.success) return;

      let csv = 'ID,Nombre,Categoria,Stock,PrecioVenta,Estado\n';
      json.data.forEach((p: ProductItem) => {
        csv += `${p.id},"${p.name}",${p.category},${p.stock},${p.unitPrice},${p.status}\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Strata_ERP_Inventario_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exportando CSV:', err);
    }
  };

  return (
    <div className="flex min-h-screen bg-bgDeep">
      {/* Sidebar de navegación interactivo */}
      <Sidebar currentRole={currentRole} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Área Principal de Trabajo */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Encabezado Principal & Switcher RBAC */}
        <Header currentRole={currentRole} onRoleChange={setCurrentRole} />

        {/* Vista: Dashboard Principal (Vista Completa) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <KPICards data={kpiData} loading={loading} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RevenueChart />
              </div>
              <div>
                <InsightsPanel />
              </div>
            </div>
            <InventoryTable
              products={products}
              loading={loading}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              canAdd={canAdd}
              canExport={canExport}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onExportCSV={handleExportCSV}
            />
          </div>
        )}

        {/* Vista: Analítica Financiera (BI & Rentabilidad) */}
        {activeTab === 'analytics' && (
          <FinancialAnalyticsView kpiData={kpiData} loading={loading} />
        )}

        {/* Vista: Inventario & Almacén */}
        {activeTab === 'inventory' && (
          <div className="space-y-8">
            <InventoryTable
              products={products}
              loading={loading}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              canAdd={canAdd}
              canExport={canExport}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onExportCSV={handleExportCSV}
            />
          </div>
        )}

        {/* Vista: Reportes Ejecutivos */}
        {activeTab === 'reports' && (
          <ExecutiveReports
            kpiData={kpiData}
            currentRole={currentRole}
            onExportCSV={handleExportCSV}
          />
        )}

        {/* Vista: Control Roles RBAC */}
        {activeTab === 'rbac' && (
          <RBACMatrix
            currentRole={currentRole}
            onRoleChange={setCurrentRole}
          />
        )}

        {/* Modal Interactivo para Registro de Productos */}
        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleCreateProduct}
        />
      </main>
    </div>
  );
}

