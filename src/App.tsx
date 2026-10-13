import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { RoleSelector } from './components/RoleSelector';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { OfflineBanner } from './components/common/OfflineBanner';
import { RatingModal } from './components/client/RatingModal';

// Client Views
import { ClientHome } from './components/client/ClientHome';
import { ClientBooking } from './components/client/ClientBooking';
import { ClientCheckout } from './components/client/ClientCheckout';
import { ClientTracking } from './components/client/ClientTracking';
import { ClientHistory } from './components/client/ClientHistory';
import { ClientProfile } from './components/client/ClientProfile';

// Washer Views
import { WasherOrders } from './components/washer/WasherOrders';
import { WasherRoute } from './components/washer/WasherRoute';
import { WasherHistory } from './components/washer/WasherHistory';
import { WasherProfile } from './components/washer/WasherProfile';

// Admin Views
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminOrders } from './components/admin/AdminOrders';
import { AdminCoupons } from './components/admin/AdminCoupons';
import { AdminPricing } from './components/admin/AdminPricing';
import { AdminMetrics } from './components/admin/AdminMetrics';

import { VehicleCategory } from './types';

const AppContent: React.FC = () => {
  const { currentRole, activeTab, setActiveTab, setActiveOrder } = useApp();

  // Booking draft state for client flow
  const [selectedVehicleCategory, setSelectedVehicleCategory] = useState<VehicleCategory>('suv');
  const [checkoutDraft, setCheckoutDraft] = useState<any>(null);

  // If no role is selected, show initial role selector screen
  if (!currentRole) {
    return (
      <main className="w-full min-h-screen">
        <OfflineBanner />
        <RoleSelector />
      </main>
    );
  }

  // Render content based on current active role and tab
  const renderMainContent = () => {
    // 1. ROL: CLIENTE
    if (currentRole === 'cliente') {
      switch (activeTab) {
        case 'vehiculos':
          return (
            <ClientHome
              onSelectVehicle={cat => {
                setSelectedVehicleCategory(cat);
                setActiveTab('agendar');
              }}
            />
          );
        case 'agendar':
          return (
            <ClientBooking
              selectedVehicleId={selectedVehicleCategory}
              onBackToVehicles={() => setActiveTab('vehiculos')}
              onProceedToCheckout={bookingData => {
                setCheckoutDraft(bookingData);
                setActiveTab('checkout');
              }}
            />
          );
        case 'checkout':
          return checkoutDraft ? (
            <ClientCheckout
              bookingData={checkoutDraft}
              onBack={() => setActiveTab('agendar')}
              onOrderSuccess={order => {
                setActiveOrder(order);
                setActiveTab('monitoreo');
              }}
            />
          ) : (
            <ClientHome
              onSelectVehicle={cat => {
                setSelectedVehicleCategory(cat);
                setActiveTab('agendar');
              }}
            />
          );
        case 'monitoreo':
          return <ClientTracking />;
        case 'historial':
          return <ClientHistory />;
        case 'perfil':
          return <ClientProfile />;
        default:
          return (
            <ClientHome
              onSelectVehicle={cat => {
                setSelectedVehicleCategory(cat);
                setActiveTab('agendar');
              }}
            />
          );
      }
    }

    // 2. ROL: LAVADOR
    if (currentRole === 'lavador') {
      switch (activeTab) {
        case 'ordenes':
          return <WasherOrders />;
        case 'ruta':
          return <WasherRoute />;
        case 'historial':
          return <WasherHistory />;
        case 'perfil':
          return <WasherProfile />;
        default:
          return <WasherOrders />;
      }
    }

    // 3. ROL: ADMINISTRADOR
    if (currentRole === 'admin') {
      switch (activeTab) {
        case 'dashboard':
          return <AdminDashboard />;
        case 'solicitudes':
          return <AdminOrders />;
        case 'cupones':
          return <AdminCoupons />;
        case 'precios':
          return <AdminPricing />;
        case 'metricas':
          return <AdminMetrics />;
        default:
          return <AdminDashboard />;
      }
    }

    return null;
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col font-sans">
      <OfflineBanner />

      {/* Cabecera Institucional Unificada */}
      <Header />

      {/* Main Body Layout: Sidebar on Desktop, Content in Center, BottomNav on Mobile/Tablet */}
      <div className="flex-1 flex w-full">
        {/* Menú Lateral Desplegable en Escritorio */}
        <Sidebar />

        {/* Dynamic Responsive Main Content Area (Fullscreen, no simulation frame) */}
        <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto overflow-y-auto mb-16 md:mb-0">
          {renderMainContent()}
        </main>
      </div>

      {/* Navegación Móvil y Tablet (Bottom Bar fija) */}
      <BottomNav />

      {/* Rating Modal for service review */}
      <RatingModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
