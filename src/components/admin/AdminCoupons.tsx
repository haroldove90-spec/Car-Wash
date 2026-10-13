import React, { useState } from 'react';
import {
  TicketPercent,
  Plus,
  Trash2,
  CheckCircle,
  Calendar,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  Percent,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminCoupons: React.FC = () => {
  const { coupons, addCoupon, toggleCoupon, deleteCoupon } = useApp();

  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form fields
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState<number>(15);
  const [minOrderValue, setMinOrderValue] = useState<number>(120);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString().split('T')[0]
  );
  const [maxUses, setMaxUses] = useState<number>(100);
  const [userLimitOnce, setUserLimitOnce] = useState(true);
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setFormError('Por favor ingresa un código.');
      return;
    }

    if (coupons.some(c => c.code.toUpperCase() === code.trim().toUpperCase())) {
      setFormError('Ya existe un cupón con este código.');
      return;
    }

    addCoupon({
      code: code.trim().toUpperCase(),
      type,
      value: Number(value),
      minOrderValue: Number(minOrderValue),
      startDate,
      endDate,
      maxUses: Number(maxUses),
      isActive: true,
      userLimitOnce,
      description: description || `Descuento de ${type === 'percentage' ? `${value}%` : `$${value} MXN`} en tu orden`,
    });

    setShowCreateModal(false);
    setCode('');
    setDescription('');
    setFormError(null);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Módulo de Cupones & Promociones
          </h2>
          <p className="text-xs text-slate-500">
            Crea códigos de descuento (porcentaje o monto fijo), define vigencia y límites de canje
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-indigo-500/25 active:scale-95 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Cupón</span>
        </button>
      </div>

      {/* Coupons Table / Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map(coupon => {
          const isExpired = new Date().toISOString().split('T')[0] > coupon.endDate;
          const isMaxedOut = coupon.currentUses >= coupon.maxUses;

          return (
            <div
              key={coupon.id}
              className={`p-5 rounded-3xl border transition-all duration-200 bg-white flex flex-col justify-between space-y-4 shadow-xs ${
                !coupon.isActive
                  ? 'border-slate-200 opacity-60 bg-slate-50/50'
                  : 'border-indigo-100 hover:border-indigo-300 hover:shadow-md'
              }`}
            >
              <div>
                {/* Code and Switch */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-black tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-200/80">
                      {coupon.code}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        coupon.type === 'percentage'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `$${coupon.value} MXN`}
                    </span>
                  </div>

                  {/* Toggle Active Button */}
                  <button
                    type="button"
                    onClick={() => toggleCoupon(coupon.id)}
                    className="cursor-pointer transition-transform hover:scale-105"
                    title={coupon.isActive ? 'Desactivar cupón' : 'Activar cupón'}
                  >
                    {coupon.isActive ? (
                      <ToggleRight className="w-7 h-7 text-indigo-600" />
                    ) : (
                      <ToggleLeft className="w-7 h-7 text-slate-300" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-600 leading-snug line-clamp-2">
                  {coupon.description}
                </p>

                {/* Status Badges */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-500 border-t border-slate-100 pt-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Vigencia:</span>
                    <span className="font-semibold text-slate-700">
                      {coupon.startDate} al {coupon.endDate}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Uso por cliente:</span>
                    <span className="font-semibold text-slate-700">
                      {coupon.userLimitOnce ? '1 uso por usuario' : 'Ilimitado'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Pedido mínimo:</span>
                    <span className="font-semibold text-slate-700">
                      ${coupon.minOrderValue || 0} MXN
                    </span>
                  </div>

                  {/* Progress of usages */}
                  <div className="pt-1">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-400">Canjes realizados:</span>
                      <span className="font-bold text-indigo-600">
                        {coupon.currentUses} / {coupon.maxUses}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full"
                        style={{
                          width: `${Math.min(100, (coupon.currentUses / coupon.maxUses) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <span
                  className={`text-[10px] font-bold uppercase ${
                    coupon.isActive && !isExpired && !isMaxedOut
                      ? 'text-emerald-600'
                      : 'text-slate-400'
                  }`}
                >
                  {isExpired
                    ? '● Expirado'
                    : isMaxedOut
                    ? '● Límite alcanzado'
                    : coupon.isActive
                    ? '● Activo para clientes'
                    : '● Desactivado'}
                </span>

                <button
                  type="button"
                  onClick={() => deleteCoupon(coupon.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                  title="Eliminar cupón"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal to Create Coupon */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 relative space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <TicketPercent className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Crear Nuevo Cupón de Descuento
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Código del Cupón (Sin espacios)
                </label>
                <input
                  type="text"
                  placeholder="Ej. LAVADO10, SUPER50, CLIENTEVIP"
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  className="w-full mt-1 font-mono font-bold uppercase bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-indigo-600 focus:bg-white"
                  required
                />
              </div>

              {/* Type and Value */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Tipo de Descuento
                  </label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full mt-1 font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-indigo-600 focus:bg-white cursor-pointer"
                  >
                    <option value="percentage">Porcentaje (%)</option>
                    <option value="fixed">Monto Fijo ($ MXN)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Valor del Descuento ({type === 'percentage' ? '%' : '$ MXN'})
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={type === 'percentage' ? '90' : '1000'}
                    value={value}
                    onChange={e => setValue(Number(e.target.value))}
                    className="w-full mt-1 font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-indigo-600 focus:bg-white"
                    required
                  />
                </div>
              </div>

              {/* Min Order and Max Uses */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Pedido Mínimo ($ MXN)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={minOrderValue}
                    onChange={e => setMinOrderValue(Number(e.target.value))}
                    className="w-full mt-1 font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Límite Total de Usos
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={maxUses}
                    onChange={e => setMaxUses(Number(e.target.value))}
                    className="w-full mt-1 font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Validity Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Fecha de Inicio
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full mt-1 font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Fecha de Vencimiento
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full mt-1 font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Usage rule checkbox */}
              <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={userLimitOnce}
                  onChange={e => setUserLimitOnce(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-0 w-4 h-4"
                />
                <span className="text-xs text-slate-700 font-medium">
                  Limitar a un solo uso por cliente (usuario)
                </span>
              </label>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Descripción Visible para el Cliente
                </label>
                <input
                  type="text"
                  placeholder="Ej. 15% de descuento en tu primer lavado a domicilio"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition shadow-md shadow-indigo-500/20 cursor-pointer"
                >
                  Guardar y Activar Cupón
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
