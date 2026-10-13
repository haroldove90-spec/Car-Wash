import React, { useState } from 'react';
import { Download, CheckCircle, Smartphone, HelpCircle, X, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'primary' | 'outline' | 'header' | 'minimal';
  showLabel?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'primary',
  showLabel = true,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [installedNotice, setInstalledNotice] = useState(false);

  const handleInstallClick = async () => {
    if (isInstalled) {
      setInstalledNotice(true);
      setTimeout(() => setInstalledNotice(false), 3000);
      return;
    }

    if (isInstallable) {
      const outcome = await install();
      if (outcome) {
        setInstalledNotice(true);
        setTimeout(() => setInstalledNotice(false), 3000);
        return;
      }
    }

    // If on iOS or generic browser without active beforeinstallprompt
    setShowModal(true);
  };

  const getButtonStyles = () => {
    switch (variant) {
      case 'header':
        return 'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition border border-indigo-200/80 shadow-xs active:scale-95';
      case 'outline':
        return 'inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-2xl border-2 border-indigo-600 text-indigo-700 hover:bg-indigo-50 transition active:scale-98';
      case 'minimal':
        return 'p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition';
      case 'primary':
      default:
        return 'inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 hover:from-indigo-700 hover:to-violet-700 transition active:scale-98';
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        className={`${getButtonStyles()} ${className}`}
        title="Instalar Car Wash en tu dispositivo"
        type="button"
      >
        {isInstalled ? (
          <>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            {showLabel && <span>App Instalada</span>}
          </>
        ) : (
          <>
            <Download className="w-4 h-4 animate-bounce" />
            {showLabel && <span>Instalar App</span>}
          </>
        )}
      </button>

      {/* Installed Toast Notice */}
      {installedNotice && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="w-5 h-5" />
          <span>¡Car Wash ya está instalado en este dispositivo!</span>
        </div>
      )}

      {/* Installation Guide Modal (For iOS, Desktop Chrome/Edge or non-prompted browsers) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Instalar Car Wash</h3>
                <p className="text-xs text-slate-500">Acceso rápido sin descargas de tiendas</p>
              </div>
            </div>

            {isIOS ? (
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm text-slate-700">
                <div className="font-semibold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Instrucciones para iPhone o iPad (Safari):
                </div>
                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600">
                  <li>
                    Presiona el botón <strong>Compartir</strong> <span className="inline-block px-1.5 py-0.5 bg-slate-200 rounded text-slate-800">⎋ / Compartir</span> en la barra inferior de Safari.
                  </li>
                  <li>
                    Desliza hacia abajo y selecciona <strong>"Agregar al inicio"</strong> <span className="inline-block px-1.5 py-0.5 bg-slate-200 rounded text-slate-800">＋</span>.
                  </li>
                  <li>
                    Toca <strong>"Agregar"</strong> en la esquina superior derecha.
                  </li>
                </ol>
              </div>
            ) : (
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm text-slate-700">
                <div className="font-semibold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Instrucciones en Android y Computadora:
                </div>
                <div className="space-y-2 text-xs text-slate-600">
                  <p>
                    <strong>En Android (Chrome):</strong> Toca el menú de 3 puntos (⋮) en la esquina superior derecha y selecciona <strong>"Instalar aplicación"</strong> o <strong>"Agregar a la pantalla principal"</strong>.
                  </p>
                  <p>
                    <strong>En PC o Mac (Chrome / Edge):</strong> Haz clic en el ícono de instalación <span className="inline-block px-1.5 py-0.5 bg-slate-200 rounded text-slate-800">⊕</span> en la barra de direcciones superior del navegador.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-full py-2.5 px-4 bg-indigo-600 text-white font-semibold rounded-xl text-sm hover:bg-indigo-700 transition"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
