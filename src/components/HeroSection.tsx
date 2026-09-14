import React from 'react';
import { ArrowDown, ExternalLink, Mail } from 'lucide-react';
import { Profile } from '../types';

interface HeroSectionProps {
  profile: Profile;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profile }) => {
  // Split name to color the main/first name in blue as required by PRD Section 4.1
  const nameParts = (profile.nama || 'Rania Amanda').trim().split(' ');
  const firstName = nameParts[0] || 'Rania';
  const restName = nameParts.slice(1).join(' ');

  return (
    <section id="tentang" className="py-12 sm:py-16 lg:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center">
          
          {/* Left Column (Desktop) / Top Item (Mobile): Profile Image 1:1 ratio, slightly rounded (not full circle) */}
          <div className="w-full max-w-sm mx-auto lg:max-w-none lg:col-span-5 flex flex-col items-center lg:items-start mb-8 lg:mb-0">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 aspect-square rounded-2xl overflow-hidden shadow-md border border-slate-100 bg-slate-50">
              <img
                id="hero-avatar"
                src={profile.avatar_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800'}
                alt={profile.nama}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Status label under photo */}
            {profile.status && (
              <div 
                id="hero-status-label"
                className="mt-3.5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100"
              >
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span>{profile.status.replace(/^[•\s]+/, '') || profile.status}</span>
              </div>
            )}
          </div>

          {/* Right Column (Desktop) / Bottom Content (Mobile) */}
          <div className="lg:col-span-7 flex flex-col items-center text-center lg:items-start lg:text-left">
            
            {/* Small badge above name */}
            <div 
              id="hero-badge"
              className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200 mb-3"
            >
              Portofolio Profesional
            </div>

            {/* Big name with primary name in blue */}
            <h1 id="hero-title" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              <span className="text-blue-600">{firstName}</span>
              {restName ? ` ${restName}` : ''}
            </h1>

            {/* Tagline / occupation */}
            <p id="hero-tagline" className="mt-3 text-lg sm:text-xl font-medium text-slate-700">
              {profile.tagline}
            </p>

            {/* Short description */}
            <p id="hero-description" className="mt-4 text-base text-slate-600 leading-relaxed max-w-2xl">
              {profile.deskripsi}
            </p>

            {/* Action buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full sm:w-auto">
              {/* Primary button: Hubungi Saya (blue) */}
              <a
                href="#kontak"
                id="hero-btn-contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full sm:w-auto"
              >
                <Mail className="w-4 h-4 mr-2" />
                Hubungi Saya
              </a>

              {/* Secondary/Outline button: Lihat Project */}
              <a
                href="#project"
                id="hero-btn-projects"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full sm:w-auto"
              >
                <ArrowDown className="w-4 h-4 mr-2 text-slate-500" />
                Lihat Project
              </a>

              {/* Resume button: conditionally rendered ONLY if profile.resume_url is present */}
              {profile.resume_url && profile.resume_url.trim() !== '' ? (
                <a
                  href={profile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="hero-btn-resume"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full sm:w-auto"
                >
                  <ExternalLink className="w-4 h-4 mr-2 text-blue-600" />
                  Resume
                </a>
              ) : null}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
