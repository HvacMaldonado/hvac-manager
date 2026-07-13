create extension if not exists pgcrypto;

create sequence if not exists public.informes_co_numero_seq
  start with 1
  increment by 1;

create table if not exists public.informes_co (
  id uuid primary key default gen_random_uuid(),

  numero_informe text not null unique,

  orden_id uuid not null unique
    references public.ordenes(id)
    on delete cascade,

  cliente_id uuid,
  direccion_id uuid,
  tecnico_id text not null,

  idioma text not null default 'es'
    check (idioma in ('es', 'en')),

  estado text not null default 'borrador'
    check (estado in ('borrador', 'firmado')),

  fecha date not null default current_date,

  cliente_nombre text not null default '',
  direccion_trabajo text not null default '',
  ubicacion_etiqueta text not null default '',
  tecnico_nombre text not null default '',

  equipo text not null default '',
  modelo_serie text not null default '',

  medicion_ambiente numeric,
  medicion_equipo numeric,
  medicion_ventilacion numeric,

  medicion_otros_activa boolean not null default false,
  medicion_otros_detalle text not null default '',
  medicion_otros_valor numeric,

  alarma_activada boolean not null default true,
  inspeccion_visual boolean not null default true,

  hallazgos jsonb not null default '{}'::jsonb,
  hallazgos_otros_activa boolean not null default false,
  hallazgos_otros text not null default '',

  recomendaciones jsonb not null default '{}'::jsonb,
  recomendaciones_otros_activa boolean not null default false,
  recomendaciones_otros text not null default '',

  observaciones text not null default '',

  firma_cliente text not null default '',
  nombre_firmante text not null default '',
  firmado_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.asignar_numero_informe_co()
returns trigger
language plpgsql
as $$
begin
  if new.numero_informe is null or trim(new.numero_informe) = '' then
    new.numero_informe :=
      'CO-' ||
      to_char(current_date, 'YYYY') ||
      '-' ||
      lpad(nextval('public.informes_co_numero_seq')::text, 6, '0');
  end if;

  return new;
end;
$$;

drop trigger if exists trigger_asignar_numero_informe_co
on public.informes_co;

create trigger trigger_asignar_numero_informe_co
before insert on public.informes_co
for each row
execute function public.asignar_numero_informe_co();

create or replace function public.actualizar_fecha_informe_co()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trigger_actualizar_fecha_informe_co
on public.informes_co;

create trigger trigger_actualizar_fecha_informe_co
before update on public.informes_co
for each row
execute function public.actualizar_fecha_informe_co();

create index if not exists informes_co_orden_id_idx
  on public.informes_co (orden_id);

create index if not exists informes_co_tecnico_id_idx
  on public.informes_co (tecnico_id);

create index if not exists informes_co_estado_idx
  on public.informes_co (estado);

alter table public.informes_co enable row level security;

drop policy if exists "informes_co_lectura" on public.informes_co;
drop policy if exists "informes_co_creacion" on public.informes_co;
drop policy if exists "informes_co_actualizacion" on public.informes_co;
drop policy if exists "informes_co_eliminacion" on public.informes_co;

create policy "informes_co_lectura"
on public.informes_co
for select
to anon, authenticated
using (true);

create policy "informes_co_creacion"
on public.informes_co
for insert
to anon, authenticated
with check (true);

create policy "informes_co_actualizacion"
on public.informes_co
for update
to anon, authenticated
using (true)
with check (true);

create policy "informes_co_eliminacion"
on public.informes_co
for delete
to anon, authenticated
using (true);
