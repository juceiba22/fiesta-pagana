-- Compra directa con tarjeta: el webhook crea el ticket al aprobarse el pago.
-- Este índice evita tickets duplicados si Mercado Pago notifica dos veces a la vez.
create unique index if not exists tickets_mercadopago_payment_id_key
  on tickets (mercadopago_payment_id)
  where mercadopago_payment_id is not null;
