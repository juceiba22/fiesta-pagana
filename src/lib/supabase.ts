import { createClient } from '@supabase/supabase-js';

// Usamos el SERVICE_ROLE para el backend (para saltar RLS en inserciones)
export const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string,
    {
        auth: {
            persistSession: false,
        }
    }
);
