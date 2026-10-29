-- Tablas base del portal (necesarias si el proyecto de Supabase es nuevo y está vacío).
-- Ejecutar ANTES de supabase/2x1.sql en el SQL Editor de Supabase.

-- Entradas compradas online (Mercado Pago)
create table if not exists tickets (
  id                      uuid primary key default gen_random_uuid(),
  nombre_comprador        text not null,
  email_comprador         text not null,
  estado_pago             text not null default 'pending',
  monto                   numeric not null,
  mercadopago_payment_id  text,
  created_at              timestamptz not null default now()
);

-- Entradas físicas con QR (/entrada/[id] y escáner)
create table if not exists entradas_fisicas (
  id                  text primary key,
  nombre              text not null,
  ingreso_registrado  boolean not null default false,
  created_at          timestamptz not null default now()
);

alter table tickets enable row level security;
alter table entradas_fisicas enable row level security;

-- Ids de los QR que ya están generados en public/qrs_generados.
-- El nombre se dedujo del nombre del archivo: corregilo si hace falta.
insert into entradas_fisicas (id, nombre)
select 'Adicional_' || n, 'General' from generate_series(1, 30) as n
on conflict (id) do nothing;

insert into entradas_fisicas (id, nombre) values
  ('FrancoSubcodigo1', 'Franco'), ('FrancoAPT2', 'Franco'), ('FrancoAPT3', 'Franco'),
  ('ChompaAPT4', 'Chompa'), ('ChompaAPT5', 'Chompa'), ('ChompaAPT6', 'Chompa'),
  ('MartiAPT7', 'Marti'), ('MartiAPT8', 'Marti'), ('MartiAPT9', 'Marti'),
  ('LucianaAPT10', 'Luciana'), ('LucianaAPT11', 'Luciana'), ('LucianaAPT12', 'Luciana'),
  ('AixaAPT13', 'Aixa'), ('AixaAPT14', 'Aixa'), ('AixaAPT15', 'Aixa'),
  ('BelenAPT16', 'Belen'), ('BelenAPT17', 'Belen'), ('BelenAPT18', 'Belen'),
  ('GloriaAPT19', 'Gloria'), ('GloriaAPT20', 'Gloria'), ('GloriaAPT21', 'Gloria'),
  ('OlmoAPT22', 'Olmo'), ('OlmoAPT23', 'Olmo'), ('OlmoAPT24', 'Olmo'),
  ('TomasAPT25', 'Tomas'), ('TomasAPT26', 'Tomas'), ('TomasAPT27', 'Tomas'),
  ('FlorAPT28', 'Flor'), ('FlorAPT29', 'Flor'), ('FlorAPT30', 'Flor'),
  ('OriAPT31', 'Ori'), ('OriAPT32', 'Ori'), ('OriAPT33', 'Ori'),
  ('DarioAPT34', 'Dario'), ('DarioAPT35', 'Dario'), ('DarioAPT36', 'Dario'),
  ('JulioAPT37', 'Julio'), ('JulioAPT38', 'Julio'), ('JulioAPT39', 'Julio'),
  ('UlisesAPT40', 'Ulises'), ('UlisesAPT41', 'Ulises'), ('UlisesAPT42', 'Ulises')
on conflict (id) do nothing;
