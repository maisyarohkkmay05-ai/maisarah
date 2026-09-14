import React from 'react';
import { Profile } from '../types';

interface FooterProps {
  profile: Profile;
}

export const Footer: React.FC<FooterProps> = ({ profile }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs sm:text-sm text-slate-500">
        <div>
          <p>© {currentYear} {profile.nama}. Seluruh hak cipta dilindungi undang-undang.</p>
        </div>
        <div className="text-slate-400">
          <span>Portofolio Pribadi Profesional</span>
        </div>
      </div>
    </footer>
  );
};
