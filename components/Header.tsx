'use client';
import { signOut } from '@/app/actions/auth/sign-out';
import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import TechyButton from './TechyButton';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';

interface HeaderProps { isLoggedIn?: boolean; role?: string }

const Header = ({ isLoggedIn = false, role }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { href: '/products', label: 'Products' },
    ...(role === 'ADMIN'
      ? [{ href: '/admin', label: 'Dashboard' }]
      : role === 'VENDOR'
      ? [{ href: '/vendor/products', label: 'Dashboard' }]
      : []),
    ...(role === 'BUYER' ? [{ href: '/vendor-application', label: 'Apply as Vendor' }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary mr-5">Techy</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-neutral hover:text-primary font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-muted w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/cart" className="relative p-2 text-neutral hover:text-primary transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            {isLoggedIn && (
              <Link href="/profile" className="p-2 text-neutral hover:text-primary transition-colors">
                <User className="w-5 h-5" />
              </Link>
            )}
            {isLoggedIn ? (
              <form action={signOut}>
                <TechyButton type="submit" variant="secondary" size="sm">
                  Sign Out
                </TechyButton>
              </form>
            ) : (
              <Link href="/sign-in">
                <TechyButton variant="secondary" size="sm">
                  Sign In
                </TechyButton>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-neutral hover:text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 text-neutral hover:text-primary font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-muted w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex items-center justify-between px-3">
                  <Link href="/cart" className="flex items-center text-neutral hover:text-primary">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Cart{itemCount > 0 ? ` (${itemCount})` : ''}
                  </Link>
                  <Link href="/sign-in">
                    <TechyButton variant="secondary" size="sm">
                      Sign In
                    </TechyButton>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
