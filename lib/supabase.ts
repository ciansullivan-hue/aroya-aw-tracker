import { createClient } from '@supabase/supabase-js';

// Public (anon) client — safe to use in Server Components for reads.
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false } }
);

// Admin (service role) client — ONLY import from server code (server actions,
// API routes, Server Components that render server-only). Never ship to browser.
export function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

// Shared types
export type Bracket = 'High Rollers' | 'Open Strain' | 'Other';

export interface Reading {
  id: string;
  contestant: string;
  strain: string;
  bracket: Bracket;
  aw: number;
  temp_f: number | null;
  cultivator: string | null;
  cure_days: number | null;
  notes: string | null;
  photo_url: string | null;
  created_at: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  sample_count: number | null;
  preferred_contact: 'email' | 'phone' | 'text' | null;
  notes: string | null;
  created_at: string;
}

/** aW sweet spot: 0.55-0.65 ideal for cannabis cure. */
export function awZone(aw: number): 'dry' | 'ideal' | 'wet' {
  if (aw < 0.55) return 'dry';
  if (aw > 0.65) return 'wet';
  return 'ideal';
}

export function awZoneLabel(zone: 'dry' | 'ideal' | 'wet'): string {
  return zone === 'dry' ? 'Over-dried' : zone === 'wet' ? 'Moisture risk' : 'Ideal cure';
}
