import React from 'react';
import { Languages as LanguagesIcon } from 'lucide-react';
import { Language } from '../types';

interface LanguagesSectionProps {
  languages: Language[];
}

export const LanguagesSection: React.FC<LanguagesSectionProps> = ({ languages }) => {
  return (
    <section id="bahasa" className="py-12 sm:py-16 bg-slate-50/60 border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center sm:text-left mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 mb-2">
            <LanguagesIcon className="w-3.5 h-3.5 text-blue-600" />
            Kemampuan Bahasa
          </div>
          <h2 id="languages-heading" className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Bahasa
          </h2>
        </div>

        {/* PRD Section 4.6: Text format 'Nama Bahasa — Level'. No progress bar or visual level indicator */}
        <div id="languages-list" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {languages.map((lang) => (
            <div
              key={lang.id}
              id={`language-item-${lang.id}`}
              className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs"
            >
              <p className="text-base font-semibold text-slate-900">
                {lang.nama_bahasa} <span className="text-slate-400 font-normal mx-1">—</span> <span className="text-blue-600 font-medium">{lang.level}</span>
              </p>
            </div>
          ))}

          {languages.length === 0 && (
            <div className="col-span-full py-6 text-center text-slate-400 italic">
              Belum ada data bahasa.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
