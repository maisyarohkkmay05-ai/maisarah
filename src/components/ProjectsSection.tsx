import React from 'react';
import { ExternalLink, FolderGit2 } from 'lucide-react';
import { Project } from '../types';

interface ProjectsSectionProps {
  projects: Project[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  // Sort projects by urutan
  const sortedProjects = [...projects].sort((a, b) => a.urutan - b.urutan);

  return (
    <section id="project" className="py-12 sm:py-16 lg:py-20 bg-white border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center sm:text-left mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 mb-2">
            <FolderGit2 className="w-3.5 h-3.5 text-blue-600" />
            Portofolio & Karya
          </div>
          <h2 id="projects-heading" className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Koleksi Project Terpilih
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
            Inisiatif, program kerja sama, publikasi, dan karya audio-visual yang pernah dirancang serta dieksekusi.
          </p>
        </div>

        {/* Mobile-first: 1 col on mobile, 2 cols on tablet/desktop */}
        <div id="projects-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {sortedProjects.map((project) => (
            <div
              key={project.id}
              id={`project-card-${project.id}`}
              className="flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow group"
            >
              {/* Project Image */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                <img
                  src={project.gambar_url || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800'}
                  alt={project.judul}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {project.judul}
                  </h3>
                  <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
                    {project.deskripsi}
                  </p>
                </div>

                {/* Link (Web, Google Drive, etc.) */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={project.link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    id={`project-link-${project.id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <span>Buka Detail / Tautan Karya</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}

          {sortedProjects.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              Belum ada data project yang ditambahkan.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
