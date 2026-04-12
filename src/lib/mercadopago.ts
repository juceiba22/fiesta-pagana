import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN as string
});

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
                        unit_price: 5000, // Precio ajustado para evitar restricciones de monto mínimo de Mercado Pago
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
