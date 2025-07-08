import React from 'react';
import Header from './Header';
import { getSessionFromCookie } from '@/app/actions/auth/get-session';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  const session = await getSessionFromCookie();
  const isLoggedIn = !!session && typeof session === 'object' && 'id' in session;
  const role = isLoggedIn && typeof session === 'object' && 'role' in session ? (session as any).role : undefined;
  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={isLoggedIn} role={role} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
