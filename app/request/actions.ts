'use server';

import { supabaseAdmin } from '@/lib/supabase';
import { redirect } from 'next/navigation';

export async function submitLead(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim() || null;
  const company = String(formData.get('company') ?? '').trim() || null;
  const sampleCountRaw = String(formData.get('sample_count') ?? '').trim();
  const sample_count = sampleCountRaw ? parseInt(sampleCountRaw, 10) : null;
  const preferred_contact = String(formData.get('preferred_contact') ?? 'email') as 'email' | 'phone' | 'text';
  const notes = String(formData.get('notes') ?? '').trim() || null;

  if (!name || !email) {
    redirect('/request?error=missing');
  }

  // Basic email sanity
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    redirect('/request?error=email');
  }

  const sb = supabaseAdmin();
  const { error } = await sb.from('leads').insert({
    name,
    email,
    phone,
    company,
    sample_count: Number.isFinite(sample_count) ? sample_count : null,
    preferred_contact,
    notes,
  });

  if (error) {
    console.error('Lead insert failed:', error);
    redirect('/request?error=server');
  }

  redirect('/request?ok=1');
}
