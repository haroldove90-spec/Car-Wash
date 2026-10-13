import React from 'react';
import {
  Car,
  Calendar,
  Radio,
  Clock,
  User,
  ListChecks,
  Navigation,
  BarChart3,
  TicketPercent,
  Sliders,
  Star,
  Layers,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Wrench,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar: React.FC = () => {
  const { currentRole, activeTab, setActiveTab, activeOrder, setCurrentRole } = useApp();

  if (!currentRole) return null;

  const clientItems = [
    { id: 'vehiculos', label: 'Catálogo de Vehículos', icon: Car, subtitle: 'Tarifas base y tipos' },
    { id: 'agendar', label: 'Agendar Cita', icon: Calendar, subtitle: 'Fecha, hora y domicilio' },
    {
      id: 'monitoreo',
      label: 'Monitoreo en Vivo',
      icon: Radio,
      subtitle: 'Semáforo de 5 estatus',
      badge: activeOrder && activeOrder.status !== 'concluido' ? 'En Curso' : undefined,
    },
    { id: 'historial', label: 'Mis Servicios', icon: Clock, subtitle: 'Historial y recibos' },
    { id: 'perfil', label: 'Mi Perfil', icon: User, subtitle: 'Direcciones y datos' },
  ];

  const washerItems = [
    { id: 'ordenes', label: 'Servicios Asignados', icon: ListChecks, subtitle: 'Recepción y estatus' },
    { id: 'ruta', label: 'Ruta & Mapa', icon: Navigation, subtitle: 'Navegación al domicilio' },
    { id: 'historial', label: 'Historial y Ganancias', icon: Clock, subtitle: 'Comisiones del día/semana' },
    { id: 'perfil', label: 'Perfil de Operador', icon: User, subtitle: 'Datos y métricas' },
  ];

  const adminItems = [
    { id: 'dashboard', label: 'Panel de Control', icon: BarChart3, subtitle: 'Resumen financiero' },
    { id: 'solicitudes', label: 'Gestión de Solicitudes', icon: Layers, subtitle: 'Monitoreo y asignación' },
    { id: 'cupones', label: 'Gestión de Cupones', icon: TicketPercent, subtitle: 'Códigos y descuentos' },
    { id: 'precios', label: 'Configuración de Precios', icon: Sliders, subtitle: 'Tarifas y traslado' },
    { id: 'metricas', label: 'Métricas y Calificaciones', icon: Star, subtitle: 'Valoraciones al personal' },
  ];

  let items = clientItems;
  if (currentRole === 'lavador') items = washerItems;
  if (currentRole === 'admin') items = adminItems;

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-r border-slate-200/80 p-4 shrink-0 min-h-[calc(100vh-4rem)] justify-between select-none">
      <div className="space-y-6">
        {/* Role identification card */}
        <div className="p-3.5 bg-gradient-to-tr from-indigo-50/70 via-indigo-50/40 to-slate-50 rounded-2xl border border-indigo-100/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
              {currentRole === 'cliente' && <User className="w-5 h-5" />}
              {currentRole === 'lavador' && <Wrench className="w-5 h-5" />}
              {currentRole === 'admin' && <ShieldCheck className="w-5 h-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
                Sesión Activa
              </span>
              <h3 className="text-sm font-extrabold text-slate-900 capitalize truncate">
                {currentRole === 'cliente' && 'Cliente (Usuario)'}
                {currentRole === 'lavador' && 'Lavador Operador'}
                {currentRole === 'admin' && 'Administrador General'}
              </h3>
            </div>
          </div>
        </div>

        {/* Modules navigation */}
        <div className="space-y-1.5">
          <div className="px-2 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Módulos del Sistema</span>
            <Sparkles className="w-3 h-3 text-indigo-400" />
          </div>

          {items.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-left transition-all duration-150 group cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                          isActive
                            ? 'bg-white text-indigo-700'
                            : 'bg-indigo-100 text-indigo-700 animate-pulse'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div
                    className={`text-[10px] truncate ${
                      isActive ? 'text-indigo-100' : 'text-slate-400'
                    }`}
                  >
                    {item.subtitle}
                  </div>
                </div>
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform ${
                    isActive ? 'text-white/80 translate-x-0.5' : 'text-slate-300 opacity-0 group-hover:opacity-100'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom logout / change role button */}
      <div className="pt-4 border-t border-slate-100 space-y-2">
        <button
          onClick={() => setCurrentRole(null)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:border-rose-200 border border-transparent transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Cambiar de Rol / Salir</span>
        </button>
        <p className="text-[10px] text-center text-slate-400">
          Car Wash App • V1.0 PWA
        </p>
      </div>
    </aside>
  );
};
