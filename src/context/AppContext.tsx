import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  VehicleOption,
  VehicleCategory,
  ServiceOrder,
  OrderStatus,
  Coupon,
  Washer,
  PricingSettings,
  ServiceAddress,
  Review,
} from '../types';

interface AppContextType {
  // Role & Navigation
  currentRole: UserRole | null;
  setCurrentRole: (role: UserRole | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Vehicles
  vehicles: VehicleOption[];

  // Orders
  orders: ServiceOrder[];
  activeOrder: ServiceOrder | null;
  setActiveOrder: (order: ServiceOrder | null) => void;
  createOrder: (orderData: Partial<ServiceOrder>) => ServiceOrder;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  submitReview: (orderId: string, rating: number, comment: string, tags: string[]) => void;

  // Washers
  washers: Washer[];
  activeWasherId: string;
  setActiveWasherId: (id: string) => void;
  assignOrderWasher: (orderId: string, washerId: string) => void;

  // Coupons
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, 'id' | 'currentUses'>) => void;
  toggleCoupon: (couponId: string) => void;
  deleteCoupon: (couponId: string) => void;
  validateCoupon: (code: string, currentTotal: number) => { valid: boolean; coupon?: Coupon; discount: number; message: string };

  // Pricing
  pricingSettings: PricingSettings;
  updateBaseRate: (category: VehicleCategory, price: number) => void;
  updateDistanceRate: (rate: number) => void;

  // Client Profile
  clientProfile: {
    name: string;
    phone: string;
    email: string;
    addresses: ServiceAddress[];
    selectedAddressId: string;
  };
  updateClientProfile: (profile: Partial<AppContextType['clientProfile']>) => void;
  addClientAddress: (address: Omit<ServiceAddress, 'id'>) => void;

  // Notifications
  notifications: {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    orderId?: string;
  }[];
  markNotificationsAsRead: () => void;
  pushNotification: (title: string, message: string, orderId?: string) => void;

  // Rating modal helper
  ratingModalOrder: ServiceOrder | null;
  setRatingModalOrder: (order: ServiceOrder | null) => void;
}

const DEFAULT_VEHICLES: VehicleOption[] = [
  {
    id: 'chico',
    name: 'Sedán Compacto / Chico',
    tagline: 'Ideal para autos compactos y hatchback',
    basePrice: 130,
    estMinutes: 45,
    rating: 4.9,
    reviewsCount: 142,
    features: ['Lavado exterior con cera líquida', 'Aspirado profundo de interiores', 'Limpieza de rines y llantas', 'Aromatizante premium'],
    imageSvgType: 'sedan',
  },
  {
    id: 'sedan',
    name: 'Sedán Mediano / Ejecutivo',
    tagline: 'Para sedanes familiares y ejecutivos',
    basePrice: 170,
    estMinutes: 50,
    rating: 4.9,
    reviewsCount: 218,
    features: ['Lavado con espuma activa pH neutro', 'Aspirado y desinfección de tablero', 'Abrillantador de llantas y tolvas', 'Limpieza profunda de cristales'],
    imageSvgType: 'sport',
  },
  {
    id: 'suv',
    name: 'SUV / Crossover',
    tagline: 'Camionetas medianas de 5 y 7 plazas',
    basePrice: 230,
    estMinutes: 60,
    rating: 4.8,
    reviewsCount: 310,
    features: ['Lavado a presión alta eficiencia', 'Aspirado de cajuela y 3 filas', 'Limpieza de tapetes de hule/alfombra', 'Protector UV en molduras'],
    imageSvgType: 'suv',
  },
  {
    id: 'pickup',
    name: 'Pick-up / Todo Terreno',
    tagline: 'Pick-ups y camionetas de carga',
    basePrice: 290,
    estMinutes: 75,
    rating: 4.9,
    reviewsCount: 94,
    features: ['Lavado de batea / caja trasera', 'Remoción de lodo en tolvas y suspensión', 'Desengrasado de rines reforzado', 'Acondicionador de plásticos exteriores'],
    imageSvgType: 'pickup',
  },
  {
    id: 'vip',
    name: 'VIP / Deportivo & Alta Gama',
    tagline: 'Tratamiento exclusivo con cera carnauba',
    basePrice: 380,
    estMinutes: 90,
    rating: 5.0,
    reviewsCount: 65,
    features: ['Sellador cerámico express 30 días', 'Detallado minucioso de ventilas', 'Tratamiento hidratante para piel', 'Toallas de microfibra de alta densidad'],
    imageSvgType: 'vip',
  },
];

const DEFAULT_COUPONS: Coupon[] = [
  {
    id: 'c1',
    code: 'LAVADO10',
    type: 'percentage',
    value: 10,
    minOrderValue: 100,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    maxUses: 500,
    currentUses: 124,
    isActive: true,
    userLimitOnce: false,
    description: '10% de descuento en tu servicio de lavado a domicilio',
  },
  {
    id: 'c2',
    code: 'BIENVENIDA20',
    type: 'percentage',
    value: 20,
    minOrderValue: 150,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    maxUses: 200,
    currentUses: 89,
    isActive: true,
    userLimitOnce: true,
    description: '20% de bienvenida para nuevos usuarios de Car Wash',
  },
  {
    id: 'c3',
    code: 'PROMO50',
    type: 'fixed',
    value: 50,
    minOrderValue: 200,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    maxUses: 100,
    currentUses: 45,
    isActive: true,
    userLimitOnce: true,
    description: '$50 MXN de descuento directo en SUVs y Pick-ups',
  },
  {
    id: 'c4',
    code: 'VERANO15',
    type: 'percentage',
    value: 15,
    minOrderValue: 130,
    startDate: '2026-05-01',
    endDate: '2026-11-30',
    maxUses: 150,
    currentUses: 18,
    isActive: true,
    userLimitOnce: false,
    description: '15% de descuento especial de temporada',
  },
];

const DEFAULT_WASHERS: Washer[] = [
  {
    id: 'w1',
    name: 'Carlos Méndez',
    phone: '+52 55 4123 8899',
    rating: 4.95,
    completedServices: 342,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    status: 'en_servicio',
    vehicleType: 'Motocicleta con hidrolavadora móvil',
  },
  {
    id: 'w2',
    name: 'Roberto Silva',
    phone: '+52 55 9876 5432',
    rating: 4.88,
    completedServices: 215,
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    status: 'disponible',
    vehicleType: 'Furgón utilitario ecológico',
  },
  {
    id: 'w3',
    name: 'Andrea Gómez',
    phone: '+52 55 7766 5544',
    rating: 5.0,
    completedServices: 180,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    status: 'disponible',
    vehicleType: 'Unidad móvil híbrida',
  },
];

const DEFAULT_PRICING: PricingSettings = {
  distanceRatePerKm: 12, // $12 MXN por km
  baseRates: {
    chico: 130,
    sedan: 170,
    suv: 230,
    pickup: 290,
    vip: 380,
  },
  extraServices: [
    {
      id: 'ext_cera',
      name: 'Encerado Cerámico Express',
      description: 'Capa hidrofóbica con brillo intenso por 30 días',
      price: 85,
      enabled: true,
    },
    {
      id: 'ext_ozono',
      name: 'Sanitización con Ozono',
      description: 'Eliminación del 99.9% de bacterias, virus y olores',
      price: 60,
      enabled: true,
    },
    {
      id: 'ext_motor',
      name: 'Limpieza Detallada de Motor',
      description: 'Lavado en seco sin riesgo eléctrico',
      price: 95,
      enabled: true,
    },
    {
      id: 'ext_piel',
      name: 'Hidratación de Asientos de Piel',
      description: 'Bálsamo restaurador con aroma original',
      price: 75,
      enabled: true,
    },
  ],
};

const DEFAULT_ADDRESSES: ServiceAddress[] = [
  {
    id: 'addr1',
    label: 'Casa',
    address: 'Av. Insurgentes Sur 1450, Del Valle, CDMX',
    references: 'Portón gris, timbre blanco con placa "Fam. Torres"',
    distanceKm: 3.5,
    lat: 19.3732,
    lng: -99.1789,
  },
  {
    id: 'addr2',
    label: 'Oficina',
    address: 'Paseo de la Reforma 222, Juárez, CDMX',
    references: 'Estacionamiento subterráneo nivel E-2, cajón 44',
    distanceKm: 6.8,
    lat: 19.4290,
    lng: -99.1623,
  },
];

const INITIAL_ORDERS: ServiceOrder[] = [
  {
    id: 'ord-101',
    orderNumber: 'CW-8942',
    clientName: 'Alejandro Morales',
    clientPhone: '+52 55 1234 5678',
    clientEmail: 'alejandro.m@gmail.com',
    address: DEFAULT_ADDRESSES[0],
    vehicle: {
      category: 'suv',
      name: 'SUV / Crossover',
      plates: 'PXR-829-B',
      color: 'Gris Grafito',
      brandModel: 'Mazda CX-5',
    },
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTimeSlot: '11:00 AM - 1:00 PM',
    extras: [
      { id: 'ext_cera', name: 'Encerado Cerámico Express', price: 85 },
    ],
    pricing: {
      basePrice: 230,
      distanceFee: 42,
      distanceKm: 3.5,
      extrasTotal: 85,
      subtotal: 357,
      discountAmount: 35.7,
      couponCodeApplied: 'LAVADO10',
      total: 321.3,
    },
    paymentMethod: 'card',
    paymentStatus: 'paid',
    cardLastFour: '4242',
    status: 'en_camino', // Active in progress
    statusUpdatedAt: new Date().toISOString(),
    washer: DEFAULT_WASHERS[0],
    statusHistory: [
      {
        status: 'asignada',
        timestamp: new Date(Date.now() - 35 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        note: 'Orden asignada a Carlos Méndez',
      },
      {
        status: 'en_camino',
        timestamp: new Date(Date.now() - 15 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        note: 'Carlos salió de base en camino a tu domicilio',
      },
    ],
    clientNotes: 'Coche en cochera, llaves con portero si no respondo de inmediato',
    createdAt: new Date(Date.now() - 40 * 60000).toISOString(),
  },
  {
    id: 'ord-100',
    orderNumber: 'CW-7721',
    clientName: 'Alejandro Morales',
    clientPhone: '+52 55 1234 5678',
    clientEmail: 'alejandro.m@gmail.com',
    address: DEFAULT_ADDRESSES[1],
    vehicle: {
      category: 'sedan',
      name: 'Sedán Mediano / Ejecutivo',
      plates: 'NZA-194-C',
      color: 'Azul Marino',
      brandModel: 'Volkswagen Jetta',
    },
    scheduledDate: '2026-10-10',
    scheduledTimeSlot: '2:00 PM - 4:00 PM',
    extras: [],
    pricing: {
      basePrice: 170,
      distanceFee: 81.6,
      distanceKm: 6.8,
      extrasTotal: 0,
      subtotal: 251.6,
      discountAmount: 50.32,
      couponCodeApplied: 'BIENVENIDA20',
      total: 201.28,
    },
    paymentMethod: 'card',
    paymentStatus: 'paid',
    cardLastFour: '8812',
    status: 'concluido',
    statusUpdatedAt: '2026-10-10T16:10:00Z',
    washer: DEFAULT_WASHERS[1],
    statusHistory: [
      { status: 'asignada', timestamp: '14:00', note: 'Asignado a Roberto Silva' },
      { status: 'en_camino', timestamp: '14:15', note: 'En camino' },
      { status: 'en_domicilio', timestamp: '14:38', note: 'Llegó al domicilio' },
      { status: 'iniciado', timestamp: '14:42', note: 'Lavado iniciado' },
      { status: 'concluido', timestamp: '15:45', note: 'Servicio concluido exitosamente' },
    ],
    review: {
      id: 'rev-1',
      orderId: 'ord-100',
      clientName: 'Alejandro Morales',
      washerId: 'w2',
      rating: 5,
      comment: '¡Quedó impecable! Roberto fue súper puntual y muy cuidadoso con la pintura.',
      createdAt: '2026-10-10T16:15:00Z',
      tags: ['Muy puntual', 'Excelente acabado', 'Trato amable'],
    },
    createdAt: '2026-10-10T12:00:00Z',
  },
];

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence in localStorage
  const [currentRole, setCurrentRoleState] = useState<UserRole | null>(() => {
    const saved = localStorage.getItem('carwash_role');
    return (saved as UserRole) || null;
  });

  const [activeTab, setActiveTab] = useState<string>(() => {
    return 'vehiculos';
  });

  const [vehicles, setVehicles] = useState<VehicleOption[]>(() => {
    const saved = localStorage.getItem('carwash_vehicles');
    return saved ? JSON.parse(saved) : DEFAULT_VEHICLES;
  });

  const [orders, setOrders] = useState<ServiceOrder[]>(() => {
    const saved = localStorage.getItem('carwash_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [activeOrder, setActiveOrder] = useState<ServiceOrder | null>(() => {
    // Default to the first in-progress order
    const inProg = INITIAL_ORDERS.find(o => o.status !== 'concluido' && o.status !== 'cancelado');
    return inProg || null;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('carwash_coupons');
    return saved ? JSON.parse(saved) : DEFAULT_COUPONS;
  });

  const [washers, setWashers] = useState<Washer[]>(() => {
    const saved = localStorage.getItem('carwash_washers');
    return saved ? JSON.parse(saved) : DEFAULT_WASHERS;
  });

  const [activeWasherId, setActiveWasherId] = useState<string>('w1');

  const [pricingSettings, setPricingSettings] = useState<PricingSettings>(() => {
    const saved = localStorage.getItem('carwash_pricing');
    return saved ? JSON.parse(saved) : DEFAULT_PRICING;
  });

  const [clientProfile, setClientProfile] = useState({
    name: 'Alejandro Morales',
    phone: '+52 55 1234 5678',
    email: 'alejandro.m@gmail.com',
    addresses: DEFAULT_ADDRESSES,
    selectedAddressId: 'addr1',
  });

  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Lavador en camino',
      message: 'Carlos Méndez va en camino a tu domicilio en Av. Insurgentes Sur. ETA: ~12 min.',
      time: 'Hace 10 min',
      read: false,
      orderId: 'ord-101',
    },
    {
      id: 'notif-2',
      title: 'Cupón activado',
      message: 'Aprovecha tu cupón BIENVENIDA20 en tu próximo lavado.',
      time: 'Ayer',
      read: true,
    },
  ]);

  const [ratingModalOrder, setRatingModalOrder] = useState<ServiceOrder | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    if (currentRole) {
      localStorage.setItem('carwash_role', currentRole);
    } else {
      localStorage.removeItem('carwash_role');
    }
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('carwash_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('carwash_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('carwash_pricing', JSON.stringify(pricingSettings));
  }, [pricingSettings]);

  const setCurrentRole = (role: UserRole | null) => {
    setCurrentRoleState(role);
    if (role === 'cliente') setActiveTab('vehiculos');
    else if (role === 'lavador') setActiveTab('ordenes');
    else if (role === 'admin') setActiveTab('dashboard');
  };

  const pushNotification = (title: string, message: string, orderId?: string) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      title,
      message,
      time: 'Ahora mismo',
      read: false,
      orderId,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const createOrder = (orderData: Partial<ServiceOrder>): ServiceOrder => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const assignedWasher = washers.find(w => w.status === 'disponible') || washers[0];

    const newOrder: ServiceOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `CW-${randomNum}`,
      clientName: clientProfile.name,
      clientPhone: clientProfile.phone,
      clientEmail: clientProfile.email,
      address: clientProfile.addresses.find(a => a.id === clientProfile.selectedAddressId) || clientProfile.addresses[0],
      vehicle: orderData.vehicle || {
        category: 'suv',
        name: 'SUV / Crossover',
        plates: 'PXR-829-B',
        color: 'Gris Grafito',
        brandModel: 'Mazda CX-5',
      },
      scheduledDate: orderData.scheduledDate || new Date().toISOString().split('T')[0],
      scheduledTimeSlot: orderData.scheduledTimeSlot || '11:00 AM - 1:00 PM',
      extras: orderData.extras || [],
      pricing: orderData.pricing || {
        basePrice: 230,
        distanceFee: 42,
        distanceKm: 3.5,
        extrasTotal: 0,
        subtotal: 272,
        discountAmount: 0,
        total: 272,
      },
      paymentMethod: orderData.paymentMethod || 'card',
      paymentStatus: 'paid',
      cardLastFour: orderData.cardLastFour || '4242',
      status: 'asignada',
      statusUpdatedAt: new Date().toISOString(),
      washer: assignedWasher,
      statusHistory: [
        {
          status: 'asignada',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: `Servicio asignado a ${assignedWasher.name}`,
        },
      ],
      clientNotes: orderData.clientNotes || '',
      createdAt: new Date().toISOString(),
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrder(newOrder);

    // Increment coupon use if applied
    if (newOrder.pricing.couponCodeApplied) {
      setCoupons(prev =>
        prev.map(c =>
          c.code.toUpperCase() === newOrder.pricing.couponCodeApplied?.toUpperCase()
            ? { ...c, currentUses: c.currentUses + 1 }
            : c
        )
      );
    }

    pushNotification(
      '¡Cita Agendada Exitosamente!',
      `Tu orden ${newOrder.orderNumber} fue confirmada y asignada a ${assignedWasher.name}.`,
      newOrder.id
    );

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let defaultNote = '';

    switch (newStatus) {
      case 'asignada':
        defaultNote = 'Servicio asignado a lavador';
        break;
      case 'en_camino':
        defaultNote = 'El lavador va en camino a tu domicilio';
        break;
      case 'en_domicilio':
        defaultNote = 'El lavador ha llegado a la ubicación del servicio';
        break;
      case 'iniciado':
        defaultNote = 'Lavado en proceso (exterior e interiores)';
        break;
      case 'concluido':
        defaultNote = '¡Servicio terminado! Tu auto ha quedado reluciente.';
        break;
      case 'cancelado':
        defaultNote = 'El servicio fue cancelado';
        break;
    }

    const appliedNote = note || defaultNote;

    setOrders(prev =>
      prev.map(o => {
        if (o.id === orderId) {
          const updated: ServiceOrder = {
            ...o,
            status: newStatus,
            statusUpdatedAt: new Date().toISOString(),
            statusHistory: [
              ...o.statusHistory,
              {
                status: newStatus,
                timestamp,
                note: appliedNote,
              },
            ],
          };
          if (activeOrder?.id === orderId) {
            setActiveOrder(updated);
          }
          return updated;
        }
        return o;
      })
    );

    // Push notification to user
    let notifTitle = 'Actualización de Servicio';
    if (newStatus === 'en_camino') notifTitle = '🚗 Lavador en camino';
    if (newStatus === 'en_domicilio') notifTitle = '📍 Lavador en tu domicilio';
    if (newStatus === 'iniciado') notifTitle = '🧼 Lavado iniciado';
    if (newStatus === 'concluido') notifTitle = '✨ ¡Lavado Concluido!';

    pushNotification(notifTitle, appliedNote, orderId);

    // If completed and current role is client or view is client, trigger rating modal
    if (newStatus === 'concluido') {
      const targetOrder = orders.find(o => o.id === orderId);
      if (targetOrder) {
        setRatingModalOrder(targetOrder);
      }
    }
  };

  const submitReview = (orderId: string, rating: number, comment: string, tags: string[]) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      orderId,
      clientName: targetOrder.clientName,
      washerId: targetOrder.washer?.id || 'w1',
      rating,
      comment,
      tags,
      createdAt: new Date().toISOString(),
    };

    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, review: newReview } : o))
    );

    // Update washer average rating
    if (targetOrder.washer) {
      setWashers(prev =>
        prev.map(w => {
          if (w.id === targetOrder.washer?.id) {
            const newCount = w.completedServices + 1;
            const newRating = Number(((w.rating * w.completedServices + rating) / newCount).toFixed(2));
            return {
              ...w,
              completedServices: newCount,
              rating: newRating,
            };
          }
          return w;
        })
      );
    }

    pushNotification('¡Gracias por tu valoración!', `Tu reseña de ${rating} estrellas fue enviada con éxito.`);
    setRatingModalOrder(null);
  };

  const assignOrderWasher = (orderId: string, washerId: string) => {
    const selectedWasher = washers.find(w => w.id === washerId);
    if (!selectedWasher) return;

    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, washer: selectedWasher } : o))
    );

    if (activeOrder?.id === orderId) {
      setActiveOrder(prev => (prev ? { ...prev, washer: selectedWasher } : null));
    }
  };

  const addCoupon = (newCouponData: Omit<Coupon, 'id' | 'currentUses'>) => {
    const newCoupon: Coupon = {
      ...newCouponData,
      id: `c-${Date.now()}`,
      code: newCouponData.code.trim().toUpperCase(),
      currentUses: 0,
    };
    setCoupons(prev => [newCoupon, ...prev]);
  };

  const toggleCoupon = (couponId: string) => {
    setCoupons(prev =>
      prev.map(c => (c.id === couponId ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const deleteCoupon = (couponId: string) => {
    setCoupons(prev => prev.filter(c => c.id !== couponId));
  };

  const validateCoupon = (code: string, currentTotal: number) => {
    const cleanCode = code.trim().toUpperCase();
    const coupon = coupons.find(c => c.code.toUpperCase() === cleanCode);

    if (!coupon) {
      return { valid: false, discount: 0, message: 'El cupón ingresado no existe.' };
    }

    if (!coupon.isActive) {
      return { valid: false, discount: 0, message: 'Este cupón se encuentra inactivo actualmente.' };
    }

    const today = new Date().toISOString().split('T')[0];
    if (coupon.startDate && today < coupon.startDate) {
      return { valid: false, discount: 0, message: `El cupón no es válido hasta el ${coupon.startDate}.` };
    }

    if (coupon.endDate && today > coupon.endDate) {
      return { valid: false, discount: 0, message: `El cupón ha vencido el ${coupon.endDate}.` };
    }

    if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
      return { valid: false, discount: 0, message: 'Este cupón ha alcanzado el límite máximo de usos.' };
    }

    if (coupon.minOrderValue && currentTotal < coupon.minOrderValue) {
      return {
        valid: false,
        discount: 0,
        message: `El pedido mínimo para aplicar este cupón es de $${coupon.minOrderValue} MXN.`,
      };
    }

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (currentTotal * coupon.value) / 100;
    } else {
      discount = Math.min(coupon.value, currentTotal);
    }

    // Round to 2 decimals
    discount = Math.round(discount * 100) / 100;

    return {
      valid: true,
      coupon,
      discount,
      message: `¡Cupón ${coupon.code} aplicado! Ahorras $${discount.toFixed(2)} MXN`,
    };
  };

  const updateBaseRate = (category: VehicleCategory, price: number) => {
    setPricingSettings(prev => ({
      ...prev,
      baseRates: {
        ...prev.baseRates,
        [category]: price,
      },
    }));

    setVehicles(prev =>
      prev.map(v => (v.id === category ? { ...v, basePrice: price } : v))
    );
  };

  const updateDistanceRate = (rate: number) => {
    setPricingSettings(prev => ({
      ...prev,
      distanceRatePerKm: rate,
    }));
  };

  const updateClientProfile = (profile: Partial<AppContextType['clientProfile']>) => {
    setClientProfile(prev => ({ ...prev, ...profile }));
  };

  const addClientAddress = (address: Omit<ServiceAddress, 'id'>) => {
    const newAddr: ServiceAddress = {
      ...address,
      id: `addr-${Date.now()}`,
    };
    setClientProfile(prev => ({
      ...prev,
      addresses: [...prev.addresses, newAddr],
      selectedAddressId: newAddr.id,
    }));
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activeTab,
        setActiveTab,
        vehicles,
        orders,
        activeOrder,
        setActiveOrder,
        createOrder,
        updateOrderStatus,
        submitReview,
        washers,
        activeWasherId,
        setActiveWasherId,
        assignOrderWasher,
        coupons,
        addCoupon,
        toggleCoupon,
        deleteCoupon,
        validateCoupon,
        pricingSettings,
        updateBaseRate,
        updateDistanceRate,
        clientProfile,
        updateClientProfile,
        addClientAddress,
        notifications,
        markNotificationsAsRead,
        pushNotification,
        ratingModalOrder,
        setRatingModalOrder,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
