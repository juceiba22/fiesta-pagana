-- Los vales por transferencia quedan pendientes hasta que el admin verifica el pago.
-- "comprobante" guarda lo que escribió el comprador (n° de operación o titular) para buscarlo en el banco.
alter table entradas_2x1 add column if not exists comprobante text;
