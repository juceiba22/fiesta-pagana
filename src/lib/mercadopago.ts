import { MercadoPagoConfig, Preference } from 'mercadopago';
import { PRECIO_2X1, RECARGO_MERCADOPAGO, PREFIJO_REFERENCIA_2X1 } from '@/lib/promo2x1';

const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN as string
});

// Compra directa con tarjeta: sin datos previos, el pagador completa su mail en Mercado Pago.
// El webhook crea el ticket al aprobarse el pago (external_reference con prefijo "web:").
export const PREFIJO_REFERENCIA_DIRECTA = 'web:';

export const requestPreferenceDirecta = async (referencia: string) => {

    const preference = new Preference(client);

    try {
        const response = await preference.create({
            body: {
                items: [
                    {
                        id: 'TICKET_FIESTA_PAGANA_01',
                        title: 'Entrada General - Fiesta Pagana',
                        quantity: 1,
                        unit_price: 12000,
                        currency_id: 'ARS',
                    }
                ],
                back_urls: {
                    success: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
                    failure: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
                    pending: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
                },
                auto_return: 'all',
                notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhook`,
                external_reference: `${PREFIJO_REFERENCIA_DIRECTA}${referencia}`
            }
        });

        return response.init_point;
    } catch (error) {
        console.error("Error Mercado Pago", error);
        throw new Error('Error creando la preferencia de pago');
    }
};

export const requestPreference = async (name: string, email: string, ticketId: string) => {

    const preference = new Preference(client);

    try {
        const response = await preference.create({
            body: {
                items: [
                    {
                        id: 'TICKET_FIESTA_PAGANA_01',
                        title: 'Entrada General - Fiesta Pagana',
                        quantity: 1,
                        unit_price: 12000,
                        currency_id: 'ARS',
                    }
                ],
                payer: {
                    name,
                    email,
                },
                back_urls: {
                    success: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
                    failure: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
                    pending: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
                },
                auto_return: 'all',
                notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhook`,
                external_reference: ticketId // Guardaremos el email para identificar la transacción en el webhook
            }
        });

        return response.init_point;
    } catch (error) {
        console.error("Error Mercado Pago", error);
        throw new Error('Error creando la preferencia de pago');
    }
};

// Vale 2x1: $10.000 por 2 entradas + recargo por comisión de Mercado Pago.
// El external_reference lleva el prefijo "2x1:" para que el webhook lo distinga.
export const requestPreference2x1 = async (name: string, email: string, entradaId: string) => {

    const preference = new Preference(client);

    try {
        const response = await preference.create({
            body: {
                items: [
                    {
                        id: 'VALE_2X1_FIESTA_PAGANA',
                        title: 'Vale 2x1 (2 entradas) - Fiesta Pagana',
                        quantity: 1,
                        unit_price: PRECIO_2X1,
                        currency_id: 'ARS',
                    },
                    {
                        id: 'RECARGO_MERCADOPAGO',
                        title: 'Recargo por comisión de Mercado Pago',
                        quantity: 1,
                        unit_price: RECARGO_MERCADOPAGO,
                        currency_id: 'ARS',
                    }
                ],
                payer: {
                    name,
                    email,
                },
                back_urls: {
                    success: `${process.env.NEXT_PUBLIC_SITE_URL}/entrada/${entradaId}`,
                    failure: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
                    pending: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
                },
                auto_return: 'all',
                notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhook`,
                external_reference: `${PREFIJO_REFERENCIA_2X1}${entradaId}`
            }
        });

        return response.init_point;
    } catch (error) {
        console.error("Error Mercado Pago", error);
        throw new Error('Error creando la preferencia de pago');
    }
};
