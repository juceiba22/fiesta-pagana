import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Solo protegemos la ruta /admin
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const authHeader = request.headers.get('authorization');

        // Si no hay cabecera de autenticación básica, pedimos login al navegador
        if (!authHeader) {
            return new NextResponse('Autenticación requerida', {
                status: 401,
                headers: {
                    'WWW-Authenticate': 'Basic realm="Acceso Admin Fiesta Pagana"',
                },
            });
        }

        const auth = authHeader.split(' ')[1];
        const [user, password] = Buffer.from(auth, 'base64').toString().split(':');

        // Validamos contra las variables de entorno
        const ADMIN_USER = 'admin'; // Tu usuario
        const ADMIN_PASS = process.env.ADMIN_PASSWORD;

        if (user === ADMIN_USER && password === ADMIN_PASS) {
            return NextResponse.next();
        }

        return new NextResponse('Credenciales incorrectas', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="Acceso Admin Fiesta Pagana"',
            },
        });
    }

    return NextResponse.next();
}

// Configuramos para que solo actúe en /admin
export const config = {
    matcher: '/admin/:path*',
};