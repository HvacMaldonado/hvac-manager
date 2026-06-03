import React, { useState } from 'react';
import AppLayout from './components/layout/AppLayout';
import ModernDashboard from './pages/ModernDashboard';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <AppLayout activePage={activePage} onNavigate={setActivePage}>
      {activePage === 'dashboard' && <ModernDashboard />}

      {activePage !== 'dashboard' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h3 className="text-xl font-bold text-slate-950">{activePage}</h3>
          <p className="mt-2 text-slate-500">
            Conecta aquí tu componente actual de esta sección. Este layout no borra tu lógica existente.
          </p>
        </div>
      )}
    </AppLayout>
  );
}
