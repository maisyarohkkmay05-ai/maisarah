import React from 'react';
import { Award, Calendar, MapPin } from 'lucide-react';
import { Course } from '../types';

interface CoursesSectionProps {
  courses: Course[];
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({ courses }) => {
  return (
    <section id="pelatihan" className="py-12 sm:py-16 lg:py-20 bg-white border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center sm:text-left mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 mb-2">
            <Award className="w-3.5 h-3.5 text-blue-600" />
            Pengembangan Diri
          </div>
          <h2 id="courses-heading" className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Pelatihan & Sertifikasi
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Program peningkatan kapasitas profesional, lokakarya khusus, dan sertifikasi keahlian.
          </p>
        </div>

        {/* Mobile-first: 1 col stacked cards */}
        <div id="courses-list" className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              id={`course-item-${course.id}`}
              className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {course.nama_course}
                </h3>
                <p className="mt-1 text-sm font-semibold text-blue-600">
                  {course.penyelenggara}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {course.tahun}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {course.lokasi}
                  </span>
                </div>

                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  {course.deskripsi}
                </p>
              </div>
            </div>
          ))}

          {courses.length === 0 && (
            <div className="col-span-full py-10 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              Belum ada data pelatihan yang ditambahkan.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
