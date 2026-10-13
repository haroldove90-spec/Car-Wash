import React, { useState } from 'react';
import {
  CreditCard,
  TicketPercent,
  CheckCircle,
  AlertCircle,
  Lock,
  ChevronLeft,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Banknote,
  Building2,
  Calendar,
  Clock,
  MapPin,
  Car,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ClientCheckoutProps {
  bookingData: any;
  onBack: () => void;
  onOrderSuccess: (order: any) => void;
}

export const ClientCheckout: React.FC<ClientCheckoutProps> = ({
  bookingData,
  onBack,
  onOrderSuccess,
}) => {
  const { validateCoupon, createOrder, coupons } = useApp();

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'transfer'>('card');

  // Card details (inspired by the CARD screen in image.png)
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState('Alejandro Morales');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('888');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);

  const basePricing = bookingData.pricing;
  const currentSubtotal = basePricing.subtotal;

  // Recalculate discount
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discountAmount = Math.round((currentSubtotal * appliedCoupon.value) / 100 * 100) / 100;
    } else {
      discountAmount = Math.min(appliedCoupon.value, currentSubtotal);
    }
  }

  const finalTotal = Math.max(0, Math.round((currentSubtotal - discountAmount) * 100) / 100);

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = codeToApply || couponCode;
    if (!code) return;

    setCouponError(null);
    setCouponSuccess(null);

    const result = validateCoupon(code, currentSubtotal);
    if (result.valid && result.coupon) {
      setAppliedCoupon(result.coupon);
      setCouponSuccess(result.message);
      setCouponCode(result.coupon.code);
    } else {
      setCouponError(result.message);
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccess(null);
    setCouponError(null);
    setCouponCode('');
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const finalPricing = {
        ...basePricing,
        discountAmount,
        couponCodeApplied: appliedCoupon ? appliedCoupon.code : undefined,
        total: finalTotal,
      };

      const newOrder = createOrder({
        vehicle: bookingData.vehicle,
        scheduledDate: bookingData.scheduledDate,
        scheduledTimeSlot: bookingData.scheduledTimeSlot,
        address: bookingData.address,
        extras: bookingData.extras,
        pricing: finalPricing,
        paymentMethod,
        cardLastFour: paymentMethod === 'card' ? '4242' : undefined,
        clientNotes: bookingData.clientNotes,
      });

      setIsProcessing(false);
      onOrderSuccess(newOrder);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs transition cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Modificar cita</span>
        </button>

        <span className="text-xs font-semibold text-slate-500">
          Paso 3 de 3: Cupones y Pago
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Coupon Input & Payment Methods (7 cols) */}
        <div className="md:col-span-7 space-y-6">
          {/* Coupon Code Module (Módulo de cupones cliente) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <TicketPercent className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Cupón de Descuento
                </h3>
                <p className="text-xs text-slate-500">
                  Ingresa tu código promocional antes de pagar
                </p>
              </div>
            </div>

            {/* Input & Apply Button */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Ej. LAVADO10, BIENVENIDA20"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value.toUpperCase())}
                  disabled={!!appliedCoupon}
                  className="w-full text-xs font-mono font-bold uppercase tracking-wider bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3 outline-none focus:border-indigo-600 focus:bg-white transition"
                />
              </div>

              {appliedCoupon ? (
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="px-4 py-3 bg-rose-50 border border-rose-200 text-rose-600 font-bold text-xs rounded-2xl hover:bg-rose-100 transition cursor-pointer"
                >
                  Quitar
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleApplyCoupon()}
                  className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl transition shadow-md shadow-indigo-500/20 active:scale-95 cursor-pointer"
                >
                  Aplicar
                </button>
              )}
            </div>

            {/* Validation Feedback */}
            {couponSuccess && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium animate-in fade-in">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{couponSuccess}</span>
              </div>
            )}

            {couponError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{couponError}</span>
              </div>
            )}

            {/* Quick Available Promo Pills */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Cupones vigentes disponibles:
              </span>
              <div className="flex flex-wrap gap-2">
                {coupons
                  .filter(c => c.isActive)
                  .map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleApplyCoupon(c.code)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-50/70 border border-indigo-200/60 hover:bg-indigo-100 text-[11px] font-bold text-indigo-700 transition cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-indigo-500" />
                      <span>{c.code}</span>
                      <span className="text-slate-500 font-normal">
                        ({c.type === 'percentage' ? `${c.value}%` : `$${c.value}`})
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* Payment Gateway (Pasarela de Pago Integrada) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-extrabold text-slate-900">Método de Pago</h3>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cifrado SSL 256-bit</span>
              </div>
            </div>

            {/* Selector Method Tabs */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'card', label: 'Tarjeta Bancaria', icon: CreditCard },
                { id: 'cash', label: 'Efectivo al Final', icon: Banknote },
                { id: 'transfer', label: 'Transferencia SPEI', icon: Building2 },
              ].map(method => {
                const Icon = method.icon;
                const isSelected = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/60 text-indigo-900 font-bold shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-slate-50/50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span className="text-[11px] leading-tight">{method.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Interactive Card UI matching sample screenshot */}
            {paymentMethod === 'card' && (
              <div className="space-y-4 pt-2">
                {/* Visual Debit/Credit Card inspired by image.png */}
                <div className="relative rounded-3xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-purple-600 p-6 text-white shadow-xl shadow-indigo-600/30 overflow-hidden select-none">
                  {/* Subtle shine lines */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex items-center justify-between mb-8">
                    <span className="text-xs font-mono uppercase tracking-widest text-indigo-200 font-bold">
                      CAR WASH PAY
                    </span>
                    <span className="text-sm font-black italic tracking-wider text-white">
                      VISA / MC
                    </span>
                  </div>

                  {/* Card Number display */}
                  <div className="text-lg sm:text-xl font-mono tracking-widest text-white/95 mb-6">
                    {cardNumber}
                  </div>

                  <div className="flex items-end justify-between text-xs">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-indigo-200 block">
                        Titular
                      </span>
                      <span className="font-bold tracking-wide">{cardHolder}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-indigo-200 block">
                        Expira
                      </span>
                      <span className="font-mono font-bold">{cardExpiry}</span>
                    </div>
                  </div>
                </div>

                {/* Card input fields */}
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">
                      Nombre del Titular
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={e => setCardHolder(e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-indigo-600 focus:bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">
                        Fecha de Vencimiento
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={e => setCardExpiry(e.target.value)}
                        placeholder="MM/AA"
                        className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-indigo-600 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">
                        Código CVV
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={e => setCardCvv(e.target.value)}
                        placeholder="123"
                        className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-indigo-600 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'cash' && (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-amber-800">
                  <Banknote className="w-4 h-4" /> Pago en Efectivo al Concluir
                </span>
                <p className="text-amber-700">
                  Pagarás el total exacto directamente al lavador una vez que revise y concluya el servicio a tu entera satisfacción.
                </p>
              </div>
            )}

            {paymentMethod === 'transfer' && (
              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 text-xs text-sky-900 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-sky-800">
                  <Building2 className="w-4 h-4" /> Transferencia Electrónica (SPEI)
                </span>
                <p className="text-sky-700">
                  CLABE Interbancaria: <strong>646180123456789012</strong> • Banco: STP • Beneficiario: Car Wash Mobile SA de CV.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary & Final Total (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900">Resumen de la Cita</h3>

            {/* Service brief info */}
            <div className="space-y-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs">
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <Car className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>{bookingData.vehicle.name}</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  ({bookingData.vehicle.plates})
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>{bookingData.scheduledDate}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>{bookingData.scheduledTimeSlot}</span>
              </div>
              <div className="flex items-start gap-2 text-slate-600">
                <MapPin className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{bookingData.address.address}</span>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="space-y-2 text-xs text-slate-600 border-b border-slate-100 pb-3">
              <div className="flex justify-between items-center">
                <span>Tarifa Base:</span>
                <span className="font-bold text-slate-900">${basePricing.basePrice.toFixed(2)} MXN</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Traslado ({basePricing.distanceKm} km):</span>
                <span className="font-bold text-slate-900">${basePricing.distanceFee.toFixed(2)} MXN</span>
              </div>
              {bookingData.extras.map((ex: any) => (
                <div key={ex.id} className="flex justify-between items-center text-slate-600">
                  <span>+ {ex.name}:</span>
                  <span className="font-bold text-slate-800">${ex.price.toFixed(2)} MXN</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-1 border-t border-dashed border-slate-200">
                <span className="font-medium text-slate-500">Subtotal:</span>
                <span className="font-bold text-slate-700">${currentSubtotal.toFixed(2)} MXN</span>
              </div>

              {/* Discount Line */}
              {discountAmount > 0 && (
                <div className="flex justify-between items-center text-emerald-600 font-bold bg-emerald-50/70 p-2 rounded-xl">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Descuento ({appliedCoupon?.code}):</span>
                  </span>
                  <span>-${discountAmount.toFixed(2)} MXN</span>
                </div>
              )}
            </div>

            {/* Final Total */}
            <div className="flex justify-between items-baseline pt-1">
              <div>
                <span className="text-xs font-bold text-slate-400 block uppercase">
                  Total Final a Pagar
                </span>
                {discountAmount > 0 && (
                  <span className="text-[11px] font-bold text-emerald-600">
                    Ahorras ${discountAmount.toFixed(2)} MXN
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  ${finalTotal.toFixed(2)}
                </span>
                <span className="text-xs font-bold text-slate-500 ml-1">MXN</span>
              </div>
            </div>

            {/* Final Action Button */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleSubmitPayment}
              className="w-full py-4 px-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white rounded-2xl text-sm font-black shadow-xl shadow-indigo-500/30 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Procesando pago seguro...</span>
                </>
              ) : (
                <>
                  <span>Pagar Ahora • ${finalTotal.toFixed(2)} MXN</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
              <span>Garantía de satisfacción Car Wash o te devolvemos tu dinero</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
