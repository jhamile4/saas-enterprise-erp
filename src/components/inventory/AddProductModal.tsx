// src/components/inventory/AddProductModal.tsx
'use client';

import React, { useState } from 'react';
import { CreateProductPayload } from '@/types';
import { X } from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateProductPayload) => Promise<void>;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [categoryName, setCategoryName] = useState('Infraestructura Cloud');
  const [stock, setStock] = useState('');
  const [minStock, setMinStock] = useState('10');
  const [unitCost, setUnitCost] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        name,
        categoryName,
        stock: parseInt(stock, 10),
        minStock: parseInt(minStock, 10),
        unitCost: parseFloat(unitCost),
        unitPrice: parseFloat(unitPrice),
      });

      // Reset form
      setName('');
      setStock('');
      setMinStock('10');
      setUnitCost('');
      setUnitPrice('');
      onClose();
    } catch (err) {
      console.error('Error enviando formulario:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-bgCard border border-borderSubtle rounded-2xl w-full max-w-lg p-6 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-extrabold text-white mb-6">Registrar Nuevo Producto / Servicio</h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-300 font-semibold mb-1.5">Nombre del Producto / Servicio</label>
            <input
              type="text"
              required
              placeholder="Ej. Balanceador NGINX Plus Enterprise"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-bgSurface text-white px-3.5 py-2.5 rounded-xl border border-borderSubtle focus:outline-none focus:border-goldAccent"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-semibold mb-1.5">Categoría</label>
            <select
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full bg-bgSurface text-white px-3.5 py-2.5 rounded-xl border border-borderSubtle focus:outline-none focus:border-goldAccent"
            >
              <option value="Infraestructura Cloud">Infraestructura Cloud</option>
              <option value="Licencias Software">Licencias Software</option>
              <option value="Hardware Redes">Hardware Redes</option>
              <option value="Seguridad">Seguridad</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1.5">Stock Inicial</label>
              <input
                type="number"
                required
                placeholder="Ej. 25"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full bg-bgSurface text-white px-3.5 py-2.5 rounded-xl border border-borderSubtle focus:outline-none focus:border-goldAccent"
              />
            </div>
            <div>
              <label className="block text-zinc-300 font-semibold mb-1.5">Stock Mínimo (Alerta)</label>
              <input
                type="number"
                required
                placeholder="Ej. 10"
                value={minStock}
                onChange={(e) => setMinStock(e.target.value)}
                className="w-full bg-bgSurface text-white px-3.5 py-2.5 rounded-xl border border-borderSubtle focus:outline-none focus:border-goldAccent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1.5">Precio de Costo (S/.)</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="Ej. 150.00"
                value={unitCost}
                onChange={(e) => setUnitCost(e.target.value)}
                className="w-full bg-bgSurface text-white px-3.5 py-2.5 rounded-xl border border-borderSubtle focus:outline-none focus:border-goldAccent"
              />
            </div>
            <div>
              <label className="block text-zinc-300 font-semibold mb-1.5">Precio de Venta (S/.)</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="Ej. 290.00"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                className="w-full bg-bgSurface text-white px-3.5 py-2.5 rounded-xl border border-borderSubtle focus:outline-none focus:border-goldAccent"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-bgSurface text-zinc-300 hover:text-white px-4 py-2 rounded-xl border border-borderSubtle transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-goldAccent hover:bg-goldHover text-bgDeep font-bold px-5 py-2 rounded-xl transition-all cursor-pointer shadow-lg shadow-goldAccent/20 disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
