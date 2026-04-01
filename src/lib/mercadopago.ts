import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN as string
});

export const requestPreference = async (name: string, email: string) => {

    console.log("SITE URL:", process.env.NEXT_PUBLIC_SITE_URL);
    const preference = new Preference(client);

    try {
        const response = await preference.create({
            body: {
                items: [
                    {
                        id: 'TICKET_FIESTA_PAGANA_01',
                        title: 'Entrada General - Fiesta Pagana',
                        quantity: 1,
                        unit_price: 15000, // Ajusta el precio aquí
                        currency_id: 'ARS',
                    }
                ],
                payer: {
                    name,
                    email,
                },
                back_urls: {
                    success: `http://localhost:3000/success`,
                    failure: `http://localhost:3000/`,
                    pending: `http://localhost:3000/`,
                },
                auto_return: 'all',
                notification_url: `http://localhost:3000/api/webhook`,
                external_reference: email // Guardaremos el email para identificar la transacción en el webhook
            }
        });

        return response.init_point;
    } catch (error) {
        console.error("Error Mercado Pago", error);
        throw new Error('Error creando la preferencia de pago');
    }
};
