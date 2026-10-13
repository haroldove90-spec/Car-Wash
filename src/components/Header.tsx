import React, { useState } from 'react';
import { LogOut, Bell, User, Wrench, ShieldCheck, ChevronDown, CheckCircle, Car } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CarLogo } from './common/CarLogo';
import { PWAInstallButton } from './common/PWAInstallButton';
import { UserRole } from '../types';

export const Header: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    notifications,
    markNotificationsAsRead,
    setActiveTab,
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const roleMeta = {
    cliente: {
      label: 'Cliente',
      badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: <User className="w-3.5 h-3.5" />,
    },
    lavador: {
      label: 'Lavador',
      badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: <Wrench className="w-3.5 h-3.5" />,
    },
    admin: {
      label: 'Administrador',
      badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
    },
  };

  const currentMeta = currentRole ? roleMeta[currentRole] : null;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (currentRole === 'cliente') setActiveTab('vehiculos');
              else if (currentRole === 'lavador') setActiveTab('ordenes');
              else if (currentRole === 'admin') setActiveTab('dashboard');
            }}
            className="flex items-center text-left hover:opacity-90 transition cursor-pointer"
          >
            <CarLogo size="sm" showText={true} />
          </button>
        </div>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Identificación del Rol Activo + Quick Switch dropdown */}
          {currentRole && currentMeta && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition shadow-2xs hover:bg-slate-50 cursor-pointer ${currentMeta.badgeClass}`}
                title="Cambiar rol activo"
              >
                {currentMeta.icon}
                <span className="hidden sm:inline">Rol:</span>
                <span>{currentMeta.label}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Role Dropdown */}
              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Cambiar de Rol
                  </div>
                  {(['cliente', 'lavador', 'admin'] as UserRole[]).map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setCurrentRole(r);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold hover:bg-indigo-50/60 transition ${
                        currentRole === r ? 'text-indigo-600 bg-indigo-50/40 font-bold' : 'text-slate-700'
                      }`}
                    >
                      {roleMeta[r].icon}
                      <span className="capitalize">{roleMeta[r].label}</span>
                      {currentRole === r && <span className="ml-auto text-indigo-600 font-bold">✓</span>}
                    </button>
                  ))}
                  <div className="border-t border-slate-100 my-1" />
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentRole(null);
                      setShowRoleMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Selector de Roles</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Botón de instalación rápida de la aplicación (PWA) */}
          <PWAInstallButton variant="header" showLabel={false} />
          <div className="hidden sm:block">
            <PWAInstallButton variant="header" showLabel={true} />
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) markNotificationsAsRead();
              }}
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition active:scale-95 cursor-pointer"
              title="Notificaciones"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-bold text-slate-900">Notificaciones</span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {notifications.length} avisos
                  </span>
                </div>

                <div className="max-h-80 overflow-y-auto space-y-2.5 divide-y divide-slate-50">
                  {notifications.map(n => (
                    <div key={n.id} className="pt-2 first:pt-0">
                      <div className="text-xs font-bold text-slate-900">{n.title}</div>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                      <span className="text-[10px] text-slate-400 mt-1 inline-block">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Botón de cierre de sesión */}
          <button
            type="button"
            onClick={() => setCurrentRole(null)}
            className="p-2 sm:px-3 sm:py-1.5 text-xs font-semibold rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition border border-transparent hover:border-rose-100 flex items-center gap-1.5 active:scale-95 cursor-pointer"
            title="Cerrar sesión / Salir"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
};
