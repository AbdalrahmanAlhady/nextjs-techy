'use client';

import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface AuthLayoutProps {
  children: React.ReactNode;
  isLoggedIn?: boolean; // allow override if needed
}

export default function AuthLayout({ children, isLoggedIn = false }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={isLoggedIn} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
