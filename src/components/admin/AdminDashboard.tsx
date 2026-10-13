import React from 'react';
import {
  DollarSign,
  TrendingUp,
  Percent,
  Layers,
  Users,
  Award,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminDashboard: React.FC = () => {
  const { orders, coupons, washers, setActiveTab } = useApp();

  // Financial calculations
  const totalBilled = orders.reduce((acc, curr) => acc + curr.pricing.total, 0);
  const totalDiscounts = orders.reduce(
    (acc, curr) => acc + (curr.pricing.discountAmount || 0),
    0
  );
  const washerPayouts = totalBilled * 0.45;
  const netEarnings = totalBilled - washerPayouts;

  const activeOrdersCount = orders.filter(
    o => o.status !== 'concluido' && o.status !== 'cancelado'
  ).length;

  const activeCouponsCount = coupons.filter(c => c.isActive).length;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Panel de Control Financiero & Operativo
          </h2>
          <p className="text-xs text-slate-500">
            Resumen global de ingresos cobrados, descuentos aplicados y estatus en tiempo real
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Sistema Car Wash Operativo
          </span>
        </div>
      </div>

      {/* Financial Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Billed / Cobrado */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Facturado / Cobrado
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            ${totalBilled.toFixed(2)} MXN
          </div>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> Ingresos netos recaudados
          </span>
        </div>

        {/* Total Discounts Applied */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Descuentos Aplicados
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-700">
            ${totalDiscounts.toFixed(2)} MXN
          </div>
          <span className="text-[11px] text-purple-600 font-bold block">
            En {orders.filter(o => o.pricing.discountAmount > 0).length} órdenes con cupón
          </span>
        </div>

        {/* Washer Payouts */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Comisiones a Lavadores
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-700">
            ${washerPayouts.toFixed(2)} MXN
          </div>
          <span className="text-[11px] text-amber-600 font-bold block">
            45% promedio por servicio
          </span>
        </div>

        {/* Net Profit */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Ganancia Neta Empresa
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700">
            ${netEarnings.toFixed(2)} MXN
          </div>
          <span className="text-[11px] text-emerald-600 font-bold block">
            Margen neto saludable
          </span>
        </div>
      </div>

      {/* Operational Highlights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Quick Orders Overview (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900">
              Órdenes Recientes en Vivo
            </h3>
            <button
              onClick={() => setActiveTab('solicitudes')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
            >
              Ver todas ({orders.length}) →
            </button>
          </div>

          <div className="space-y-3">
            {orders.slice(0, 4).map(o => (
              <div
                key={o.id}
                className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-700 bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px]">
                      {o.orderNumber}
                    </span>
                    <span className="font-bold text-slate-900">{o.vehicle.name}</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Cliente: {o.clientName} • Lavador: {o.washer?.name || 'Sin asignar'}
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-black text-slate-900 block">
                    ${o.pricing.total.toFixed(2)}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                      o.status === 'concluido'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-indigo-100 text-indigo-800'
                    }`}
                  >
                    {o.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Coupons & Washers Activity (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Promo Codes Snippet */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900">Cupones Activos</h3>
              <button
                onClick={() => setActiveTab('cupones')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                Administrar →
              </button>
            </div>

            <div className="space-y-2">
              {coupons.map(c => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                      {c.code}
                    </span>
                    <span className="text-slate-600 text-[11px]">
                      {c.type === 'percentage' ? `${c.value}% OFF` : `$${c.value} MXN`}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {c.currentUses} canjes
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Washers Status Snippet */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900">Personal de Servicio</h3>
              <button
                onClick={() => setActiveTab('metricas')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                Ver métricas →
              </button>
            </div>

            <div className="space-y-2.5">
              {washers.map(w => (
                <div
                  key={w.id}
                  className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center gap-2.5">
                    <img src={w.avatar} alt={w.name} className="w-8 h-8 rounded-lg object-cover" />
                    <div>
                      <span className="font-bold text-slate-900 block">{w.name}</span>
                      <span className="text-[10px] text-slate-400">{w.vehicleType}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-amber-500 block">★ {w.rating}</span>
                    <span className="text-[10px] text-slate-500">{w.completedServices} servicios</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
