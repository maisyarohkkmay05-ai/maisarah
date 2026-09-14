import React from 'react';
import { Profile } from '../types';

interface FooterProps {
  profile: Profile;
  onAdminTrigger?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ profile, onAdminTrigger }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs sm:text-sm text-slate-500">
        <div>
          <p
            onClick={onAdminTrigger}
            title={onAdminTrigger ? "Klik untuk akses halaman admin" : undefined}
            className={`cursor-pointer transition-colors select-none ${onAdminTrigger ? 'hover:text-slate-700 active:text-blue-600' : ''}`}
          >
            © {currentYear} {profile.nama}. Seluruh hak cipta dilindungi undang-undang.
          </p>
        </div>
        <div className="text-slate-400">
          <span>Portofolio Pribadi Profesional</span>
        </div>
      </div>
    </footer>
  );
};
