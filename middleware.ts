import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Forzamos la protección en /admin y cualquier sub-ruta
    if (pathname.startsWith('/admin')) {
        const authHeader = request.headers.get('authorization');

        if (!authHeader) {
            return new NextResponse('Acceso restringido', {
                status: 401,
                headers: {
                    'WWW-Authenticate': 'Basic realm="Dashboard Login"',
                },
            });
        }

        try {
            const auth = authHeader.split(' ')[1];
            const decoded = Buffer.from(auth, 'base64').toString();
            const [user, password] = decoded.split(':');

            const ADMIN_USER = 'admin';
            const ADMIN_PASS = process.env.ADMIN_PASSWORD;

            // Si la contraseña coincide, permitimos el paso
            if (user === ADMIN_USER && password === ADMIN_PASS && ADMIN_PASS !== undefined) {
                return NextResponse.next();
            }
        } catch (e) {
            console.error('Error decodificando auth', e);
        }

        // Si llega aquí es porque falló la clave
        return new NextResponse('Credenciales inválidas', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="Dashboard Login"',
            },
        });
    }

    return NextResponse.next();
}

// El matcher debe ser preciso
export const config = {
    matcher: ['/admin', '/admin/:path*'],
};