import React from 'react';
import {
  ClipboardList,
  UsersRound,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  MapPin,
  MoreHorizontal,
} from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import StatusBadge from '../components/ui/StatusBadge';

const sampleOrders = [
  { id: 'HVAC-1042', customer: 'Carlos Méndez', technician: 'Luis', status: 'Programada', priority: 'Alta', time: 'Hoy 2:30 PM', address: 'Olathe, KS' },
  { id: 'HVAC-1041', customer: 'María López', technician: 'Ana', status: 'En proceso', priority: 'Media', time: 'Hoy 12:00 PM', address: 'Kansas City, KS' },
  { id: 'HVAC-1040', customer: 'Ramos Residence', technician: 'Kevin', status: 'Completada', priority: 'Normal', time: 'Ayer 5:15 PM', address: 'Overland Park, KS' },
];

export default function ModernDashboard() {
  return (
    <div className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Órdenes activas" value="24" subtitle="6 requieren atención" icon={ClipboardList} tone="sky" />
        <StatCard title="Técnicos disponibles" value="8" subtitle="3 en ruta" icon={UsersRound} tone="emerald" />
        <StatCard title="Completadas" value="156" subtitle="Este mes" icon={CheckCircle2} tone="violet" />
        <StatCard title="Urgentes" value="5" subtitle="Prioridad alta" icon={AlertTriangle} tone="rose" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-950">Órdenes recientes</h3>
              <p className="text-sm text-slate-500">Vista rápida para operación diaria</p>
            </div>
            <button className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Ver todas
            </button>
          </div>

          <div className="space-y-3">
            {sampleOrders.map((order) => (
              <article key={order.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:border-sky-200 hover:bg-sky-50/40">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-slate-950">{order.id}</p>
                      <StatusBadge status={order.status} />
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
                        {order.priority}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-slate-800">{order.customer}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs font-medium text-slate-500">
                      <span className="inline-flex items-center gap-1"><UsersRound size={14} /> {order.technician}</span>
                      <span className="inline-flex items-center gap-1"><Clock3 size={14} /> {order.time}</span>
                      <span className="inline-flex items-center gap-1"><MapPin size={14} /> {order.address}</span>
                    </div>
                  </div>

                  <button className="self-start rounded-xl p-2 text-slate-500 hover:bg-white hover:text-slate-950 lg:self-center">
                    <MoreHorizontal size={20} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-bold text-slate-950">Prioridades de hoy</h3>
          <p className="mt-1 text-sm text-slate-500">Resumen operativo</p>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-rose-50 p-4 ring-1 ring-rose-100">
              <p className="text-sm font-bold text-rose-700">5 órdenes urgentes</p>
              <p className="mt-1 text-sm text-rose-600">Revisar asignación de técnicos.</p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-100">
              <p className="text-sm font-bold text-amber-700">3 reprogramaciones</p>
              <p className="mt-1 text-sm text-amber-600">Confirmar horario con clientes.</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
              <p className="text-sm font-bold text-emerald-700">12 listas para PDF</p>
              <p className="mt-1 text-sm text-emerald-600">Firmas completas y listas para imprimir.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
