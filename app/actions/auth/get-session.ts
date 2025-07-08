"use server";

import { cookies } from 'next/headers';
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface UserSession extends JwtPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function getSessionFromCookie(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserSession;
    return decoded;
  } catch {
    return null;
  }
}

