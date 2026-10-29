-- Códigos 2x1 y vales por 2 entradas.
-- Ejecutar una vez en el SQL Editor de Supabase.

create table if not exists codigos_2x1 (
  codigo        text primary key,
  usos_maximos  integer not null default 1 check (usos_maximos > 0),
  usos          integer not null default 0 check (usos >= 0),
  activo        boolean not null default true,
  nota          text,
  created_at    timestamptz not null default now()
);

create table if not exists entradas_2x1 (
  id                      uuid primary key default gen_random_uuid(),
  codigo                  text not null references codigos_2x1(codigo),
  nombre                  text not null,
  email                   text not null,
  metodo                  text not null check (metodo in ('transferencia', 'mercadopago')),
  estado_pago             text not null default 'pending' check (estado_pago in ('pending', 'approved')),
  monto                   integer not null,
  cantidad                integer not null default 2,
  ingresos                integer not null default 0,
  mercadopago_payment_id  text,
  created_at              timestamptz not null default now()
);

create index if not exists entradas_2x1_codigo_email_idx on entradas_2x1 (codigo, email);

-- Solo accede el backend (service role); se bloquea el acceso con la anon key.
alter table codigos_2x1 enable row level security;
alter table entradas_2x1 enable row level security;
