'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const password = String(formData.get('password') ?? '');
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    console.error('ADMIN_PASSWORD not set in env');
    redirect('/admin/login?error=server');
  }

  if (password !== expected) {
    redirect('/admin/login?error=invalid');
  }

  cookies().set('aroya-auth', 'ok', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 12, // 12 hours — covers the event day
    path: '/',
  });

  redirect('/admin');
}

export async function logout() {
  cookies().delete('aroya-auth');
  redirect('/admin/login');
}
