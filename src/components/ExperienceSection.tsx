import React from 'react';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import { Experience } from '../types';

interface ExperienceSectionProps {
  experience: Experience[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experience }) => {
  return (
    <section id="pengalaman" className="py-12 sm:py-16 lg:py-20 bg-slate-50/60 border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center sm:text-left mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 mb-2">
            <Briefcase className="w-3.5 h-3.5 text-blue-600" />
            Riwayat Karier
          </div>
          <h2 id="experience-heading" className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Pengalaman Kerja
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Jejak profesional dan kontribusi di berbagai instansi dan organisasi.
          </p>
        </div>

        {/* Mobile-first: 1 col stacked cards */}
        <div id="experience-list" className="space-y-4 sm:space-y-6">
          {experience.map((exp) => (
            <div
              key={exp.id}
              id={`experience-item-${exp.id}`}
              className="bg-white p-5 sm:p-7 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    {exp.instansi}
                  </h3>
                  <div className="mt-1.5 flex flex-wrap items-center gap-y-1 gap-x-3 text-xs sm:text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1 font-medium text-blue-600">
                      <Calendar className="w-3.5 h-3.5" />
                      {exp.tahun}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {exp.lokasi}
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-3.5 text-sm sm:text-base text-slate-600 leading-relaxed">
                {exp.deskripsi}
              </p>
            </div>
          ))}

          {experience.length === 0 && (
            <div className="py-10 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
              Belum ada riwayat pengalaman kerja yang ditambahkan.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
