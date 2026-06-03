import React, { useState } from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  UsersRound,
  History,
  BarChart3,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  PlusCircle,
  Wrench,
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders', label: 'Órdenes', icon: ClipboardList },
  { id: 'technicians', label: 'Técnicos', icon: UsersRound },
  { id: 'history', label: 'Historial', icon: History },
  { id: 'reports', label: 'Reportes', icon: BarChart3 },
  { id: 'settings', label: 'Configuración', icon: Settings },
];

const titles = {
  dashboard: 'Dashboard general',
  orders: 'Órdenes HVAC',
  technicians: 'Técnicos',
  history: 'Historial de órdenes',
  reports: 'Reportes',
  settings: 'Configuración',
};

function Sidebar({ activePage, onNavigate, isOpen, onClose }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-slate-200 bg-white px-4 py-5 shadow-xl transition-transform lg:static lg:z-auto lg:translate-x-0 lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-600/25">
              <Wrench size={22} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-950">HVAC Manager</h1>
              <p className="text-xs font-medium text-slate-500">Sistema profesional</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                  active
                    ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/25'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                <Icon size={20} className={active ? 'text-white' : 'text-slate-400 group-hover:text-sky-600'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
          <p className="text-sm font-bold text-slate-900">Acción rápida</p>
          <p className="mt-1 text-xs text-slate-600">Crea una orden HVAC sin salir del panel.</p>
          <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
            <PlusCircle size={17} /> Nueva orden
          </button>
        </div>
      </aside>
    </>
  );
}

function Header({ activePage, onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-slate-50/90 px-4 py-4 backdrop-blur-xl lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm hover:bg-slate-100 lg:hidden"
            aria-label="Abrir menú"
          >
            <Menu size={21} />
          </button>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">Panel de control</p>
            <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">{titles[activePage] || 'HVAC Manager'}</h2>
          </div>
        </div>

        <div className="hidden min-w-0 flex-1 justify-center px-6 md:flex">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="search"
              placeholder="Buscar cliente, técnico, orden o estado..."
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none ring-sky-500/20 transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm hover:bg-slate-100">
            <Bell size={20} />
          </button>
          <button className="hidden items-center gap-2 rounded-2xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-600/25 hover:bg-sky-700 sm:flex">
            <PlusCircle size={18} /> Nueva orden
          </button>
        </div>
      </div>
    </header>
  );
}

export default function AppLayout({ children, activePage = 'dashboard', onNavigate = () => {} }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="flex min-h-screen">
        <Sidebar
          activePage={activePage}
          onNavigate={onNavigate}
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
        />

        <div className="min-w-0 flex-1">
          <Header activePage={activePage} onMenuClick={() => setMenuOpen(true)} />
          <main className="px-4 py-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
