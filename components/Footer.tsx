
import React from 'react';
import Link from 'next/link';

const Footer = () => {
  const footerLinks = {
    Company: [
      { href: '/about', label: 'About Us' },
      { href: '/contact', label: 'Contact' },
      { href: '/careers', label: 'Careers' },
      { href: '/press', label: 'Press' },
    ],
    Support: [
      { href: '/help', label: 'Help Center' },
      { href: '/shipping', label: 'Shipping Info' },
      { href: '/returns', label: 'Returns' },
      { href: '/warranty', label: 'Warranty' },
    ],
    Legal: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
      { href: '/cookies', label: 'Cookie Policy' },
    ],
  };

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="text-2xl font-bold mb-4 block">
              Techy
            </Link>
            <p className="text-white/80 text-sm mb-4">
              Discover curated, high-quality tech products from trusted vendors worldwide.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                   prefetch={false} href={link.href}
                      className="text-white/80 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-white/60 text-sm">
            © 2024 Techy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
