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
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { currentRole, activeTab, setActiveTab, activeOrder } = useApp();

  if (!currentRole) return null;

  const clientItems = [
    { id: 'vehiculos', label: 'Vehículos', icon: Car },
    { id: 'agendar', label: 'Agendar', icon: Calendar },
    {
      id: 'monitoreo',
      label: 'En Vivo',
      icon: Radio,
      badge: activeOrder && activeOrder.status !== 'concluido' ? 'Activo' : undefined,
    },
    { id: 'historial', label: 'Servicios', icon: Clock },
    { id: 'perfil', label: 'Perfil', icon: User },
  ];

  const washerItems = [
    { id: 'ordenes', label: 'Servicios', icon: ListChecks },
    { id: 'ruta', label: 'Ruta/Mapa', icon: Navigation },
    { id: 'historial', label: 'Historial', icon: Clock },
    { id: 'perfil', label: 'Mi Cuenta', icon: User },
  ];

  const adminItems = [
    { id: 'dashboard', label: 'Panel', icon: BarChart3 },
    { id: 'solicitudes', label: 'Órdenes', icon: Layers },
    { id: 'cupones', label: 'Cupones', icon: TicketPercent },
    { id: 'precios', label: 'Tarifas', icon: Sliders },
    { id: 'metricas', label: 'Calidad', icon: Star },
  ];

  let items = clientItems;
  if (currentRole === 'lavador') items = washerItems;
  if (currentRole === 'admin') items = adminItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-lg md:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-1">
        {items.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-colors duration-150 active:scale-95 cursor-pointer ${
                isActive
                  ? 'text-indigo-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'
                  }`}
                />
                {item.badge && (
                  <span className="absolute -top-1 -right-2.5 px-1 py-0.2 bg-rose-500 text-[9px] font-black text-white rounded-full animate-pulse">
                    ●
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight truncate max-w-[64px]">
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-6 h-1 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
