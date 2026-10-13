import React from 'react';
import { User, Wrench, ShieldCheck, Download, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { CarLogo } from './common/CarLogo';
import { PWAInstallButton } from './common/PWAInstallButton';

export const RoleSelector: React.FC = () => {
  const { setCurrentRole } = useApp();

  const roles: {
    id: UserRole;
    name: string;
    icon: React.ReactNode;
    color: string;
    badge: string;
  }[] = [
    {
      id: 'cliente',
      name: 'Cliente',
      badge: 'Usuario Final',
      icon: (
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
          <User className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>
      ),
      color: 'from-indigo-500/10 to-indigo-50/50 hover:border-indigo-400',
    },
    {
      id: 'lavador',
      name: 'Lavador',
      badge: 'Operador de Servicio',
      icon: (
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/30 group-hover:scale-105 transition-transform duration-300">
          <Wrench className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>
      ),
      color: 'from-violet-500/10 to-violet-50/50 hover:border-violet-400',
    },
    {
      id: 'admin',
      name: 'Administrador',
      badge: 'Dueño / Panel',
      icon: (
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/30 group-hover:scale-105 transition-transform duration-300">
          <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>
      ),
      color: 'from-sky-500/10 to-sky-50/50 hover:border-sky-400',
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 via-indigo-50/30 to-slate-100 flex flex-col justify-between p-4 sm:p-8 lg:p-12">
      {/* Top subtle branding without redundant headers */}
      <div className="w-full flex justify-between items-center max-w-6xl mx-auto pt-2">
        <CarLogo size="lg" />
        <PWAInstallButton variant="header" showLabel={true} />
      </div>

      {/* Main role selection grid */}
      <div className="w-full max-w-6xl mx-auto my-auto py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Acceso Rápido al Sistema
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Selecciona tu Rol de Acceso
          </h1>
        </div>

        {/* Cuadrícula 2 Columnas Móvil / 4 Columnas Escritorio */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {roles.map(role => (
            <button
              key={role.id}
              onClick={() => setCurrentRole(role.id)}
              className="group relative flex flex-col items-center justify-center p-6 sm:p-8 bg-white rounded-3xl border-2 border-slate-200/80 hover:border-indigo-500 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 text-center active:scale-95 cursor-pointer"
            >
              {role.icon}
              <span className="mt-4 text-base sm:text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                {role.name}
              </span>
              <span className="mt-1 text-[11px] sm:text-xs font-medium text-slate-500 uppercase tracking-wide">
                {role.badge}
              </span>
            </button>
          ))}

          {/* 4th Column Card on Desktop: Direct Quick PWA Install Card */}
          <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-700 rounded-3xl text-white shadow-lg shadow-indigo-500/25 text-center col-span-2 md:col-span-1 lg:col-span-1">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-white mb-4">
              <Download className="w-8 h-8 sm:w-10 sm:h-10 animate-bounce" />
            </div>
            <span className="text-base sm:text-xl font-bold">Instalar App</span>
            <span className="mt-1 text-[11px] sm:text-xs text-indigo-100 font-medium">
              Android, iOS & PC
            </span>
            <div className="mt-4 w-full">
              <PWAInstallButton
                variant="primary"
                className="w-full !bg-white !text-indigo-700 hover:!bg-slate-100 shadow-none !py-2.5 !text-xs !font-bold"
                showLabel={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom info bar */}
      <div className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 border-t border-slate-200/80 pt-4">
        <span>Car Wash Mobile & Desktop PWA © 2026 • Fullscreen & Responsivo</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Servicio a Domicilio Activo
          </span>
        </div>
      </div>
    </div>
  );
};
