import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Profile } from '../types';

interface NavbarProps {
  profile: Profile;
}

export const Navbar: React.FC<NavbarProps> = ({ profile }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Tentang', href: '#tentang' },
    { label: 'Keahlian', href: '#skills' },
    { label: 'Project', href: '#project' },
    { label: 'Pengalaman', href: '#pengalaman' },
    { label: 'Pelatihan', href: '#pelatihan' },
    { label: 'Bahasa', href: '#bahasa' },
    { label: 'Kontak', href: '#kontak' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a 
          href="#tentang" 
          id="nav-logo"
          className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2 group"
        >
          <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:bg-blue-700 transition-colors">
            {profile.nama ? profile.nama.charAt(0) : 'P'}
          </span>
          <span className="truncate max-w-[200px] sm:max-w-xs">{profile.nama}</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 rounded-md hover:bg-slate-50 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#kontak"
            id="nav-cta-desktop"
            className="ml-3 inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
          >
            Hubungi
          </a>
        </nav>

        {/* Mobile menu toggle */}
        <button
          id="mobile-menu-button"
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-100 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2">
            <a
              href="#kontak"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center px-4 py-2.5 rounded-lg text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Hubungi Saya
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
