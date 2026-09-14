import React from 'react';
import { Mail, MessageSquare, Instagram, Linkedin, Send } from 'lucide-react';
import { Contact, Profile } from '../types';

interface ContactSectionProps {
  contacts: Contact[];
  profile: Profile;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ contacts, profile }) => {
  const getContactIcon = (jenis: string) => {
    switch (jenis) {
      case 'whatsapp':
        return <MessageSquare className="w-5 h-5 text-emerald-600" />;
      case 'email':
        return <Mail className="w-5 h-5 text-blue-600" />;
      case 'instagram':
        return <Instagram className="w-5 h-5 text-pink-600" />;
      case 'linkedin':
        return <Linkedin className="w-5 h-5 text-blue-700" />;
      default:
        return <Send className="w-5 h-5 text-slate-600" />;
    }
  };

  const getContactTitle = (jenis: string) => {
    switch (jenis) {
      case 'whatsapp':
        return 'WhatsApp';
      case 'email':
        return 'Email Resmi';
      case 'instagram':
        return 'Instagram';
      case 'linkedin':
        return 'LinkedIn';
      default:
        return jenis;
    }
  };

  const getFormattedHref = (jenis: string, value: string) => {
    if (!value) return '#';
    const trimmed = value.trim();
    if (jenis === 'email') {
      return trimmed.startsWith('mailto:') ? trimmed : `mailto:${trimmed}`;
    }
    if (jenis === 'whatsapp') {
      if (trimmed.startsWith('http')) return trimmed;
      const cleanNum = trimmed.replace(/[^\d+]/g, '');
      return `https://wa.me/${cleanNum.replace(/^\+/, '')}`;
    }
    if (trimmed.startsWith('http')) {
      return trimmed;
    }
    return `https://${trimmed}`;
  };

  return (
    <section id="kontak" className="py-12 sm:py-16 lg:py-24 bg-white border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 mb-3">
            Komunikasi Langsung
          </div>
          <h2 id="contact-heading" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Hubungi Saya
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Terbuka untuk diskusi proyek, kerja sama institusi, lokakarya, maupun konsultasi profesional.
          </p>
        </div>

        {/* 4 Contact cards responsive grid: 1 col mobile, 2 col tablet, 4 col desktop */}
        <div id="contact-cards-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {contacts.map((contact) => (
            <a
              key={contact.id}
              href={getFormattedHref(contact.jenis, contact.value)}
              target={contact.jenis === 'email' ? '_self' : '_blank'}
              rel="noopener noreferrer"
              id={`contact-card-${contact.jenis}`}
              className="p-5 sm:p-6 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all group flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                {getContactIcon(contact.jenis)}
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {getContactTitle(contact.jenis)}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 truncate max-w-full">
                {contact.value.replace(/^https?:\/\/(www\.)?/, '')}
              </p>
              <span className="mt-4 inline-flex items-center text-xs font-semibold text-blue-600 group-hover:underline">
                Buka Komunikasi &rarr;
              </span>
            </a>
          ))}

          {contacts.length === 0 && (
            <div className="col-span-full py-8 text-center text-slate-400">
              Belum ada informasi kontak yang ditambahkan.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
