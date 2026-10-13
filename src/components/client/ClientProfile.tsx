import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, Plus, Check, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ClientProfile: React.FC = () => {
  const { clientProfile, updateClientProfile, addClientAddress } = useApp();

  const [name, setName] = useState(clientProfile.name);
  const [phone, setPhone] = useState(clientProfile.phone);
  const [email, setEmail] = useState(clientProfile.email);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Address modal
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newAddressText, setNewAddressText] = useState('');
  const [newRef, setNewRef] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateClientProfile({ name, phone, email });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel || !newAddressText) return;
    const distanceKm = Math.round((2.0 + Math.random() * 6) * 10) / 10;
    addClientAddress({
      label: newLabel,
      address: newAddressText,
      references: newRef,
      distanceKm,
      lat: 19.43,
      lng: -99.13,
    });
    setShowAddAddress(false);
    setNewLabel('');
    setNewAddressText('');
    setNewRef('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-in fade-in">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          Mi Perfil y Direcciones
        </h2>
        <p className="text-xs text-slate-500">
          Administra tus datos de contacto y ubicaciones de servicio a domicilio
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>¡Datos de perfil actualizados con éxito!</span>
        </div>
      )}

      {/* Contact Details Form */}
      <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <User className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-extrabold text-slate-900">Datos Personales y Contacto</h3>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Nombre Completo
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full mt-1 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-indigo-600 focus:bg-white"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Teléfono de Contacto
              </label>
              <div className="relative mt-1">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 outline-none focus:border-indigo-600 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Correo Electrónico
              </label>
              <div className="relative mt-1">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 outline-none focus:border-indigo-600 focus:bg-white"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition active:scale-95 cursor-pointer"
        >
          Guardar Cambios
        </button>
      </form>

      {/* Saved Addresses Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-extrabold text-slate-900">Direcciones Frecuentes</h3>
          </div>
          <button
            type="button"
            onClick={() => setShowAddAddress(!showAddAddress)}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agregar Dirección</span>
          </button>
        </div>

        {/* Address List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {clientProfile.addresses.map(addr => (
            <div
              key={addr.id}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  {addr.label}
                </span>
                <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                  {addr.distanceKm} km base
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-snug">{addr.address}</p>
              {addr.references && (
                <p className="text-[11px] text-slate-400 italic">{addr.references}</p>
              )}
            </div>
          ))}
        </div>

        {/* Add Address Form */}
        {showAddAddress && (
          <form onSubmit={handleAddAddress} className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-3 animate-in fade-in">
            <div className="text-xs font-extrabold text-indigo-900">Nueva Dirección de Servicio</div>
            <input
              type="text"
              placeholder="Etiqueta (ej. Departamento de Mamá, Casa)"
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 rounded-xl p-2.5 outline-none focus:border-indigo-500"
              required
            />
            <input
              type="text"
              placeholder="Dirección completa (Calle, Número, Colonia, CP)"
              value={newAddressText}
              onChange={e => setNewAddressText(e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 rounded-xl p-2.5 outline-none focus:border-indigo-500"
              required
            />
            <input
              type="text"
              placeholder="Referencias específicas para el lavador"
              value={newRef}
              onChange={e => setNewRef(e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 rounded-xl p-2.5 outline-none focus:border-indigo-500"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="py-2 px-4 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition"
              >
                Guardar Dirección
              </button>
              <button
                type="button"
                onClick={() => setShowAddAddress(false)}
                className="py-2 px-3 bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-300 transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
