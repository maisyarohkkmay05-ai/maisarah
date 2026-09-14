import React from 'react';
import { Skill } from '../types';

interface SkillsSectionProps {
  skills: Skill[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  return (
    <section id="skills" className="py-12 sm:py-16 bg-slate-50/50 border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center sm:text-left mb-8 sm:mb-10">
          <h2 id="skills-heading" className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Keahlian & Kemampuan
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Perangkat lunak, metodologi kerja, dan kompetensi teruji dalam praktik profesional.
          </p>
        </div>

        {/* Badges/Boxes with skill name only - No level indicators */}
        <div id="skills-list" className="flex flex-wrap gap-2.5 sm:gap-3">
          {skills.map((skill) => (
            <div
              key={skill.id}
              id={`skill-item-${skill.id}`}
              className="px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-sm sm:text-base font-medium shadow-xs hover:border-blue-300 hover:text-blue-700 transition-colors cursor-default select-none"
            >
              {skill.nama}
            </div>
          ))}
          {skills.length === 0 && (
            <p className="text-slate-400 text-sm italic">Belum ada data keahlian yang ditambahkan.</p>
          )}
        </div>
      </div>
    </section>
  );
};
