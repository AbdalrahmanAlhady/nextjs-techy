'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function signOut() {
  (cookies() as any).set('auth_token', '', { path: '/', expires: new Date(0) });
  redirect('/sign-in');
}
