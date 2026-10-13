export type UserRole = 'cliente' | 'lavador' | 'admin';

export type VehicleCategory = 'chico' | 'sedan' | 'suv' | 'pickup' | 'vip';

export interface VehicleOption {
  id: VehicleCategory;
  name: string;
  tagline: string;
  basePrice: number;
  estMinutes: number;
  rating: number;
  reviewsCount: number;
  features: string[];
  imageSvgType: 'sport' | 'suv' | 'sedan' | 'pickup' | 'vip';
}

export type OrderStatus =
  | 'asignada'      // 1. Solicitud asignada
  | 'en_camino'     // 2. Lavador en camino
  | 'en_domicilio'  // 3. Lavador en el domicilio
  | 'iniciado'      // 4. Lavado iniciado
  | 'concluido'     // 5. Lavado concluido
  | 'cancelado';

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed'; // % o $ MXN
  value: number; // 10 (10%) o 50 ($50 MXN)
  minOrderValue?: number;
  startDate: string;
  endDate: string;
  maxUses: number;
  currentUses: number;
  isActive: boolean;
  userLimitOnce: boolean;
  description: string;
}

export interface Washer {
  id: string;
  name: string;
  phone: string;
  rating: number;
  completedServices: number;
  avatar: string;
  status: 'disponible' | 'en_servicio' | 'desconectado';
  vehicleType: string;
}

export interface Review {
  id: string;
  orderId: string;
  clientName: string;
  washerId: string;
  rating: number;
  comment: string;
  createdAt: string;
  tags: string[];
}

export interface ServiceAddress {
  id: string;
  label: string; // "Casa", "Oficina", etc.
  address: string;
  references: string;
  distanceKm: number;
  lat: number;
  lng: number;
}

export interface ServiceOrder {
  id: string;
  orderNumber: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  address: ServiceAddress;
  vehicle: {
    category: VehicleCategory;
    name: string;
    plates: string;
    color: string;
    brandModel: string;
  };
  scheduledDate: string; // YYYY-MM-DD
  scheduledTimeSlot: string; // "10:00 AM - 12:00 PM"
  extras: {
    id: string;
    name: string;
    price: number;
  }[];
  pricing: {
    basePrice: number;
    distanceFee: number;
    distanceKm: number;
    extrasTotal: number;
    subtotal: number;
    discountAmount: number;
    couponCodeApplied?: string;
    total: number;
  };
  paymentMethod: 'card' | 'cash' | 'transfer';
  paymentStatus: 'paid' | 'pending';
  cardLastFour?: string;
  status: OrderStatus;
  statusUpdatedAt: string;
  washer?: Washer;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note: string;
  }[];
  review?: Review;
  clientNotes?: string;
  createdAt: string;
}

export interface PricingSettings {
  distanceRatePerKm: number; // $ MXN por km
  baseRates: Record<VehicleCategory, number>;
  extraServices: {
    id: string;
    name: string;
    description: string;
    price: number;
    enabled: boolean;
  }[];
}
