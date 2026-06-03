import React from 'react';

const statusStyles = {
  pendiente: 'bg-amber-50 text-amber-700 ring-amber-200',
  programada: 'bg-sky-50 text-sky-700 ring-sky-200',
  'en proceso': 'bg-violet-50 text-violet-700 ring-violet-200',
  completada: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  cancelada: 'bg-rose-50 text-rose-700 ring-rose-200',
};

export default function StatusBadge({ status }) {
  const normalized = String(status || '').toLowerCase();
  const style = statusStyles[normalized] || 'bg-slate-50 text-slate-700 ring-slate-200';

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ${style}`}>
      {status || 'Sin estado'}
    </span>
  );
}
