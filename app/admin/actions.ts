'use server';

import { supabaseAdmin, type Bracket } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addReading(formData: FormData) {
  const contestant = String(formData.get('contestant') ?? '').trim();
  const strain = String(formData.get('strain') ?? '').trim();
  const bracket = String(formData.get('bracket') ?? 'High Rollers') as Bracket;
  const awRaw = String(formData.get('aw') ?? '').trim();
  const aw = parseFloat(awRaw);

  const tempRaw = String(formData.get('temp_f') ?? '').trim();
  const temp_f = tempRaw ? parseFloat(tempRaw) : null;

  const cultivator = String(formData.get('cultivator') ?? '').trim() || null;

  const cureRaw = String(formData.get('cure_days') ?? '').trim();
  const cure_days = cureRaw ? parseInt(cureRaw, 10) : null;

  const notes = String(formData.get('notes') ?? '').trim() || null;

  if (!contestant || !strain || !awRaw) {
    redirect('/admin?error=missing');
  }
  if (!Number.isFinite(aw) || aw < 0 || aw > 1) {
    redirect('/admin?error=aw');
  }

  const sb = supabaseAdmin();

  // Optional photo upload
  const photo = formData.get('photo') as File | null;
  let photo_url: string | null = null;
  if (photo && photo.size > 0) {
    const ext = (photo.name.split('.').pop() || 'jpg').toLowerCase();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const buffer = Buffer.from(await photo.arrayBuffer());
    const { error: upErr } = await sb.storage
      .from('sample-photos')
      .upload(path, buffer, { contentType: photo.type || 'image/jpeg' });
    if (!upErr) {
      const { data } = sb.storage.from('sample-photos').getPublicUrl(path);
      photo_url = data.publicUrl;
    } else {
      console.error('Photo upload failed:', upErr);
    }
  }

  const { error } = await sb.from('readings').insert({
    contestant,
    strain,
    bracket,
    aw,
    temp_f,
    cultivator,
    cure_days: Number.isFinite(cure_days) ? cure_days : null,
    notes,
    photo_url,
  });

  if (error) {
    console.error('Reading insert failed:', error);
    redirect('/admin?error=server');
  }

  revalidatePath('/');
  revalidatePath('/admin');
  redirect('/admin?ok=1');
}

export async function deleteReading(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  const sb = supabaseAdmin();
  await sb.from('readings').delete().eq('id', id);
  revalidatePath('/');
  revalidatePath('/admin');
}
