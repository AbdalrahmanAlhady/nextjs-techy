"use client";
import ReduxProvider from '@/app/providers/ReduxProvider';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return <ReduxProvider>{children}</ReduxProvider>;
}
