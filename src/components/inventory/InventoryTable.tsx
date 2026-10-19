// src/components/inventory/InventoryTable.tsx
'use client';

import React from 'react';
import { ProductItem, Role } from '@/types';
import { Search, Download, Plus } from 'lucide-react';

interface InventoryTableProps {
  products: ProductItem[];
  loading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  canAdd: boolean;
  canExport: boolean;
  onOpenAddModal: () => void;
  onExportCSV: () => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  products,
  loading,
  searchQuery,
  onSearchChange,
  canAdd,
  canExport,
  onOpenAddModal,
  onExportCSV,
}) => {
  return (
    <section className="bg-bgCard p-6 rounded-2xl border border-borderSubtle">
      {/* Header controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-white">Gestión Inteligente de Inventario</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Control de existencias, precios de costo, precio de venta y reorden automático</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar SKU, producto o categoría..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-bgSurface text-white text-xs pl-9 pr-4 py-2 rounded-xl border border-borderSubtle focus:outline-none focus:border-goldAccent w-64 transition-colors"
            />
          </div>

          {canExport && (
            <button
              onClick={onExportCSV}
              className="flex items-center gap-1.5 bg-bgSurface hover:bg-zinc-800 text-zinc-200 text-xs font-semibold px-4 py-2 rounded-xl border border-borderSubtle transition-colors cursor-pointer"
            >
              <Download size={14} /> Exportar CSV
            </button>
          )}

          {canAdd && (
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 bg-goldAccent hover:bg-goldHover text-bgDeep text-xs font-extrabold px-4 py-2 rounded-xl shadow-lg shadow-goldAccent/20 transition-all cursor-pointer"
            >
              <Plus size={15} /> Nuevo Producto
            </button>
          )}
        </div>
      </div>

      {/* Table Wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-borderSubtle text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              <th className="pb-3 px-3">SKU / ID</th>
              <th className="pb-3 px-3">Producto / Servicio</th>
              <th className="pb-3 px-3">Categoría</th>
              <th className="pb-3 px-3">Existencias</th>
              <th className="pb-3 px-3">Precio Costo</th>
              <th className="pb-3 px-3">Precio Venta</th>
              <th className="pb-3 px-3">Margen %</th>
              <th className="pb-3 px-3">Estado Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borderSubtle text-xs">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-zinc-400">
                  Cargando catálogo desde la Base de Datos...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-zinc-500">
                  No se encontraron productos coincidentes.
                </td>
              </tr>
            ) : (
              products.map((item) => {
                let badgeStyle = "bg-greenAccent/10 text-greenAccent border-greenAccent/20";
                let statusLabel = "Normal";

                if (item.status === 'CRITICAL') {
                  badgeStyle = "bg-redAccent/10 text-redAccent border-redAccent/20";
                  statusLabel = "Crítico";
                } else if (item.status === 'REORDER') {
                  badgeStyle = "bg-yellowAccent/10 text-yellowAccent border-yellowAccent/20";
                  statusLabel = "Reorden";
                }

                return (
                  <tr key={item.id} className="hover:bg-bgSurface/50 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-cyanAccent">{item.id}</td>
                    <td className="py-3.5 px-3 font-semibold text-white">{item.name}</td>
                    <td className="py-3.5 px-3 text-zinc-300">{item.category}</td>
                    <td className="py-3.5 px-3 font-extrabold text-white">{item.stock} unidades</td>
                    <td className="py-3.5 px-3 text-zinc-300">
                      {item.unitCost !== null ? `S/. ${item.unitCost.toFixed(2)}` : '—'}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-white">S/. {item.unitPrice.toFixed(2)}</td>
                    <td className="py-3.5 px-3 font-bold text-greenAccent">
                      {item.marginPercentage !== null ? `${item.marginPercentage}%` : '—'}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-block px-2.5 py-1 rounded-full border text-[10px] font-extrabold ${badgeStyle}`}>
                        {statusLabel}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
