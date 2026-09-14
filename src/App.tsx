import React, { useEffect, useState } from 'react';
import { initialPortfolioData } from './data/defaultData';
import { fetchPortfolioData } from './lib/dataService';
import { getCurrentAuthSession, logoutAdmin } from './lib/auth';
import { PortfolioData } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ExperienceSection } from './components/ExperienceSection';
import { CoursesSection } from './components/CoursesSection';
import { LanguagesSection } from './components/LanguagesSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';

export default function App() {
  const [data, setData] = useState<PortfolioData>(initialPortfolioData);
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check URL route for /admin or #/admin or ?admin=true
  const checkRoute = () => {
    if (typeof window === 'undefined') return;
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const searchParams = new URLSearchParams(window.location.search);
    
    const isAdmin = 
      path.startsWith('/admin') || 
      hash.startsWith('#/admin') || 
      hash.startsWith('#admin') ||
      searchParams.get('page') === 'admin' ||
      searchParams.get('admin') === 'true';

    setIsAdminRoute(isAdmin);
  };

  const loadData = async () => {
    try {
      const fetched = await fetchPortfolioData();
      setData(fetched);
    } catch (err) {
      console.error('Failed to load portfolio data:', err);
    }
  };

  const checkAuth = async () => {
    const session = await getCurrentAuthSession();
    setIsAuthenticated(session.isAuthenticated);
  };

  useEffect(() => {
    checkRoute();
    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);

    const init = async () => {
      await Promise.all([loadData(), checkAuth()]);
      setLoading(false);
    };
    init();

    const handleDataUpdate = () => {
      loadData();
    };
    window.addEventListener('portfolio-data-updated', handleDataUpdate);

    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
      window.removeEventListener('portfolio-data-updated', handleDataUpdate);
    };
  }, []);

  // Update Dynamic Metadata Title as per PRD Section 5
  // Title format: "{nama}" | Personal Portfolio Website
  useEffect(() => {
    if (data.profile?.nama) {
      document.title = `${data.profile.nama} | Personal Portfolio Website`;
    }
  }, [data.profile?.nama]);

  const navigateToAdmin = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '#/admin');
      setIsAdminRoute(true);
    }
  };

  const navigateToHome = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', window.location.pathname);
      window.location.hash = '';
      setIsAdminRoute(false);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
          <p className="text-sm font-medium text-slate-500">Memuat portofolio...</p>
        </div>
      </div>
    );
  }

  // Admin Route View (PRD Section 6)
  if (isAdminRoute) {
    if (!isAuthenticated) {
      return (
        <AdminLogin
          onLoginSuccess={() => {
            setIsAuthenticated(true);
            loadData();
          }}
          onBackToHome={navigateToHome}
        />
      );
    }

    return (
      <AdminDashboard
        data={data}
        onRefreshData={loadData}
        onLogout={handleLogout}
        onViewPublic={navigateToHome}
      />
    );
  }

  // Public View (PRD Section 4)
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      {/* 4.8 Aturan Akses Admin: Tidak ada link admin di navbar atau halaman manapun */}
      <Navbar profile={data.profile} />

      <main className="flex-1">
        {/* 4.1 Hero Section */}
        <HeroSection profile={data.profile} />

        {/* 4.2 Keahlian (Skills) */}
        <SkillsSection skills={data.skills} />

        {/* 4.3 Portofolio / Project */}
        <ProjectsSection projects={data.projects} />

        {/* 4.4 Pengalaman Kerja */}
        <ExperienceSection experience={data.experience} />

        {/* 4.5 Pelatihan & Kursus */}
        <CoursesSection courses={data.courses} />

        {/* 4.6 Kemampuan Bahasa */}
        <LanguagesSection languages={data.languages} />

        {/* 4.7 Kontak */}
        <ContactSection contacts={data.contacts} profile={data.profile} />
      </main>

      {/* Footer */}
      <Footer profile={data.profile} />
    </div>
  );
}
