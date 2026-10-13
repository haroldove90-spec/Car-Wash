import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Car,
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Shield,
  Navigation,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VehicleCategory } from '../../types';
import { VehicleIllustration } from '../common/VehicleIllustrations';

interface ClientBookingProps {
  selectedVehicleId: VehicleCategory;
  onProceedToCheckout: (bookingData: any) => void;
  onBackToVehicles: () => void;
}

export const ClientBooking: React.FC<ClientBookingProps> = ({
  selectedVehicleId,
  onProceedToCheckout,
  onBackToVehicles,
}) => {
  const { vehicles, clientProfile, pricingSettings, addClientAddress } = useApp();

  const vehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];

  // Date selection (interactive calendar)
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState<number>(today.getDate());
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(today.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Time slot selection
  const timeSlots = [
    { id: 't1', label: '7:00 AM - 9:00 AM', status: 'disponible' },
    { id: 't2', label: '9:00 AM - 11:00 AM', status: 'disponible' },
    { id: 't3', label: '11:00 AM - 1:00 PM', status: 'disponible' },
    { id: 't4', label: '2:00 PM - 4:00 PM', status: 'disponible' },
    { id: 't5', label: '4:00 PM - 6:00 PM', status: 'disponible' },
  ];
  const [selectedSlot, setSelectedSlot] = useState<string>('t3');

  // Address selection
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    clientProfile.selectedAddressId || clientProfile.addresses[0]?.id || ''
  );
  const activeAddress =
    clientProfile.addresses.find(a => a.id === selectedAddressId) || clientProfile.addresses[0];

  // Vehicle specific details
  const [plates, setPlates] = useState('PXR-829-B');
  const [color, setColor] = useState('Gris Grafito');
  const [brandModel, setBrandModel] = useState('Mazda CX-5');
  const [notes, setNotes] = useState('Dejar el auto cerrado, avisar por timbre al llegar.');

  // Extras selection
  const [selectedExtras, setSelectedExtras] = useState<string[]>(['ext_cera']);

  // New address modal / quick toggle
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newAddressText, setNewAddressText] = useState('');
  const [newRef, setNewRef] = useState('');

  const toggleExtra = (extraId: string) => {
    setSelectedExtras(prev =>
      prev.includes(extraId) ? prev.filter(id => id !== extraId) : [...prev, extraId]
    );
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressText || !newLabel) return;
    const dist = Math.round((2.5 + Math.random() * 5) * 10) / 10;
    addClientAddress({
      label: newLabel,
      address: newAddressText,
      references: newRef,
      distanceKm: dist,
      lat: 19.4326,
      lng: -99.1332,
    });
    setShowAddAddress(false);
    setNewLabel('');
    setNewAddressText('');
    setNewRef('');
  };

  // Pricing calculation
  const distanceKm = activeAddress?.distanceKm || 3.5;
  const distanceFee = Math.round(distanceKm * pricingSettings.distanceRatePerKm * 100) / 100;
  const baseRate = vehicle.basePrice;

  const extrasObjList = pricingSettings.extraServices
    .filter(e => selectedExtras.includes(e.id))
    .map(e => ({ id: e.id, name: e.name, price: e.price }));

  const extrasTotal = extrasObjList.reduce((acc, curr) => acc + curr.price, 0);
  const subtotal = baseRate + distanceFee + extrasTotal;

  const handleContinue = () => {
    const formattedDate = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    const slotObj = timeSlots.find(s => s.id === selectedSlot);

    onProceedToCheckout({
      vehicle: {
        category: vehicle.id,
        name: vehicle.name,
        plates,
        color,
        brandModel,
      },
      scheduledDate: formattedDate,
      scheduledTimeSlot: slotObj ? slotObj.label : '11:00 AM - 1:00 PM',
      address: activeAddress,
      extras: extrasObjList,
      pricing: {
        basePrice: baseRate,
        distanceFee,
        distanceKm,
        extrasTotal,
        subtotal,
        discountAmount: 0,
        total: subtotal,
      },
      clientNotes: notes,
    });
  };

  // Generate calendar days
  const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const firstDayWeek = new Date(currentYear, currentMonthIndex, 1).getDay(); // 0 is Sun

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in">
      {/* Top back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToVehicles}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs transition cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Cambiar vehículo</span>
        </button>

        <span className="text-xs font-semibold text-slate-500">
          Paso 2 de 3: Fecha y Ubicación
        </span>
      </div>

      {/* Selected Vehicle Summary Card */}
      <div className="bg-gradient-to-r from-indigo-50/80 via-white to-purple-50/60 p-4 sm:p-5 rounded-3xl border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-20 h-14 bg-white rounded-2xl border border-indigo-100 flex items-center justify-center p-1 shadow-2xs shrink-0">
            <VehicleIllustration type={vehicle.imageSvgType} className="w-full h-full" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
              Vehículo Seleccionado
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">{vehicle.name}</h2>
            <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
              <span>Tarifa base: ${vehicle.basePrice} MXN</span>
              <span>•</span>
              <span>~{vehicle.estMinutes} min</span>
            </div>
          </div>
        </div>

        {/* Inputs for Car Details */}
        <div className="w-full sm:w-auto grid grid-cols-3 gap-2 text-left">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Modelo</label>
            <input
              type="text"
              value={brandModel}
              onChange={e => setBrandModel(e.target.value)}
              className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2 py-1.5 focus:border-indigo-500 outline-none"
              placeholder="Ej. CX-5"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Color</label>
            <input
              type="text"
              value={color}
              onChange={e => setColor(e.target.value)}
              className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2 py-1.5 focus:border-indigo-500 outline-none"
              placeholder="Ej. Gris"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Placas</label>
            <input
              type="text"
              value={plates}
              onChange={e => setPlates(e.target.value.toUpperCase())}
              className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2 py-1.5 focus:border-indigo-500 outline-none uppercase font-mono"
              placeholder="ABC-123"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Calendar & Schedule) - 7 cols */}
        <div className="lg:col-span-7 space-y-6">
          {/* Calendar Picker (Inspired by JUNE 2020 layout in reference screenshot) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
                  Fecha del Servicio
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {monthNames[currentMonthIndex].toUpperCase()} {currentYear}
                </h3>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    if (currentMonthIndex > 0) setCurrentMonthIndex(currentMonthIndex - 1);
                  }}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (currentMonthIndex < 11) setCurrentMonthIndex(currentMonthIndex + 1);
                  }}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days of week header */}
            <div className="grid grid-cols-7 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Do</span>
              <span>Lu</span>
              <span>Ma</span>
              <span>Mi</span>
              <span>Ju</span>
              <span>Vi</span>
              <span>Sá</span>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {Array.from({ length: firstDayWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="h-9 sm:h-11" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const isSelected = selectedDay === dayNum;
                const isPast = dayNum < today.getDate() && currentMonthIndex === today.getMonth();

                return (
                  <button
                    key={dayNum}
                    type="button"
                    disabled={isPast}
                    onClick={() => setSelectedDay(dayNum)}
                    className={`h-9 sm:h-11 rounded-2xl flex flex-col items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/30 scale-105'
                        : isPast
                        ? 'text-slate-300 cursor-not-allowed'
                        : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-600'
                    }`}
                  >
                    <span>{dayNum}</span>
                    {isSelected && <span className="w-1 h-1 bg-white rounded-full mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slot Picker (Inspired by 7AM-10AM / 10PM-10AM slots in sample image) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-extrabold text-slate-900">Horario de Llegada</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {timeSlots.map(slot => {
                const isSelected = selectedSlot === slot.id;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSelectedSlot(slot.id)}
                    className={`flex items-center justify-between p-3 rounded-2xl border text-left transition cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-bold shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-3 h-3 rounded-full border-2 ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-600'
                            : 'border-slate-300 bg-white'
                        }`}
                      />
                      <span className="text-xs font-bold">{slot.label}</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Disponible
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Additional Services (Extras) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-extrabold text-slate-900">Servicios Adicionales Opcionales</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Mejora el acabado</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {pricingSettings.extraServices.map(extra => {
                const isChecked = selectedExtras.includes(extra.id);
                return (
                  <div
                    key={extra.id}
                    onClick={() => toggleExtra(extra.id)}
                    className={`p-3 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-2 ${
                      isChecked
                        ? 'border-indigo-600 bg-indigo-50/40 text-slate-900 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`w-4 h-4 mt-0.5 rounded-md flex items-center justify-center border transition ${
                          isChecked
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold leading-tight">{extra.name}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                          {extra.description}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-black text-indigo-700 shrink-0">
                      +${extra.price}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (Address, Map & Price Breakdown) - 5 cols */}
        <div className="lg:col-span-5 space-y-6">
          {/* Address Selection Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-extrabold text-slate-900">Ubicación del Servicio</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddAddress(!showAddAddress)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nueva</span>
              </button>
            </div>

            {/* Saved Addresses Selector */}
            <div className="space-y-2">
              {clientProfile.addresses.map(addr => (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  className={`p-3 rounded-2xl border transition cursor-pointer text-left ${
                    selectedAddressId === addr.id
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-600" />
                      {addr.label}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      {addr.distanceKm} km desde base
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-1">{addr.address}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 italic">{addr.references}</p>
                </div>
              ))}
            </div>

            {/* Form to add address */}
            {showAddAddress && (
              <form onSubmit={handleCreateAddress} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 animate-in fade-in">
                <div className="text-xs font-bold text-slate-800">Agregar Nueva Dirección</div>
                <input
                  type="text"
                  placeholder="Etiqueta (ej. Oficina, Casa de Playa)"
                  value={newLabel}
                  onChange={e => setNewLabel(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-xl p-2 outline-none focus:border-indigo-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Dirección completa con calle y número"
                  value={newAddressText}
                  onChange={e => setNewAddressText(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-xl p-2 outline-none focus:border-indigo-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Referencias (portón, timbre, color de fachada)"
                  value={newRef}
                  onChange={e => setNewRef(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-xl p-2 outline-none focus:border-indigo-500"
                />
                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddAddress(false)}
                    className="py-1.5 px-3 bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-300 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            {/* Simulated Live Map Preview (Matching the route aesthetic from image.png) */}
            <div className="relative h-36 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 flex flex-col justify-between p-3">
              {/* SVG Map Lines Simulation */}
              <svg className="absolute inset-0 w-full h-full text-indigo-300 opacity-60" viewBox="0 0 300 150" fill="none">
                <path d="M 10 140 L 80 100 L 140 110 L 200 40 L 280 20" stroke="#818CF8" strokeWidth="4" strokeDasharray="6 4" />
                <path d="M 30 10 L 100 60 L 180 80 L 260 140" stroke="#CBD5E1" strokeWidth="2" />
                <circle cx="80" cy="100" r="4" fill="#6366F1" />
                <circle cx="200" cy="40" r="5" fill="#4F46E5" />
              </svg>

              {/* Pin at destination */}
              <div className="relative z-10 self-end flex items-center gap-1.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-xl shadow-md border border-slate-200 text-xs font-bold text-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                <span>{activeAddress?.label || 'Destino'}</span>
              </div>

              <div className="relative z-10 flex items-center justify-between text-[11px] font-bold bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700">
                <div className="flex items-center gap-1">
                  <Navigation className="w-3 h-3 text-indigo-600" />
                  <span>Distancia: {distanceKm} km</span>
                </div>
                <span className="text-indigo-600 font-extrabold">Cobertura Confirmada</span>
              </div>
            </div>

            {/* Special Instructions Input */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                Notas especiales para el lavador
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={2}
                className="w-full mt-1 text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-indigo-500"
                placeholder="Ej. Tocar timbre 2 veces, coche estacionado en batería..."
              />
            </div>
          </div>

          {/* Real-time Calculation Breakdown Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900">Cálculo de Tarifa</h3>

            <div className="space-y-2 text-xs text-slate-600 border-b border-slate-100 pb-3">
              <div className="flex justify-between items-center">
                <span>Tarifa Base ({vehicle.name}):</span>
                <span className="font-bold text-slate-900">${baseRate.toFixed(2)} MXN</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <span>Traslado ({distanceKm} km x ${pricingSettings.distanceRatePerKm}/km):</span>
                </span>
                <span className="font-bold text-slate-900">${distanceFee.toFixed(2)} MXN</span>
              </div>
              {extrasObjList.map(extra => (
                <div key={extra.id} className="flex justify-between items-center text-indigo-600">
                  <span>+ {extra.name}:</span>
                  <span className="font-bold">+${extra.price.toFixed(2)} MXN</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-baseline pt-1">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Subtotal estimado</span>
                <span className="text-xs text-emerald-600 font-bold">Cupón se aplica en el siguiente paso</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-slate-900">
                  ${subtotal.toFixed(2)}
                </span>
                <span className="text-xs font-bold text-slate-500 ml-1">MXN</span>
              </div>
            </div>

            {/* CTA Continue to Checkout */}
            <button
              type="button"
              onClick={handleContinue}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-2xl text-sm font-extrabold shadow-lg shadow-indigo-500/25 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continuar a Pago & Cupones</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
