// lib/supabase.ts

import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

// For client-side components (like SelfCareBlob)
export const supabase = createPagesBrowserClient();

// For server-side functions like API routes
export const createServerClientHelper = (ctx: any) => {
  return createPagesServerClient(ctx);
};
