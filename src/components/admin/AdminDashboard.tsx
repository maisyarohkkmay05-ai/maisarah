import React, { useState, useRef } from 'react';
import {
  User,
  Briefcase,
  Award,
  Languages as LanguagesIcon,
  PhoneCall,
  FolderGit2,
  Sparkles,
  Save,
  Plus,
  Trash2,
  Edit2,
  LogOut,
  ExternalLink,
  Upload,
  CheckCircle2,
  AlertCircle,
  Database,
  RefreshCw,
  Eye,
  Clock,
  Link as LinkIcon,
  Copy,
  Check,
  FileCode,
  Terminal
} from 'lucide-react';
import {
  Contact,
  ContactType,
  Course,
  Experience,
  Language,
  PortfolioData,
  Profile,
  Project,
  Skill
} from '../../types';
import {
  deleteContact,
  deleteCourse,
  deleteExperience,
  deleteLanguage,
  deleteProject,
  deleteSkill,
  resetDataToDefault,
  saveContact,
  saveCourse,
  saveExperience,
  saveLanguage,
  saveProject,
  saveSkill,
  updateProfileData,
  uploadImageToStorage
} from '../../lib/dataService';
import { isSupabaseConfigured, SUPABASE_URL } from '../../lib/supabase';

interface AdminDashboardProps {
  data: PortfolioData;
  onRefreshData: () => Promise<void>;
  onLogout: () => void;
  onViewPublic: () => void;
}

type TabType = 'profile' | 'projects' | 'skills' | 'experience' | 'courses' | 'languages' | 'contacts' | 'system';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  data,
  onRefreshData,
  onLogout,
  onViewPublic
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState<Profile>({ ...data.profile });
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Project Modal / Edit state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState<Partial<Project>>({
    judul: '',
    deskripsi: '',
    gambar_url: '',
    link: '',
    urutan: 1
  });
  const [projectUploading, setProjectUploading] = useState(false);
  const projectInputRef = useRef<HTMLInputElement>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Skill state
  const [newSkillName, setNewSkillName] = useState('');
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  // Experience state
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [expForm, setExpForm] = useState<Partial<Experience>>({
    instansi: '',
    tahun: '',
    lokasi: '',
    deskripsi: ''
  });

  // Course state
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState<Partial<Course>>({
    nama_course: '',
    penyelenggara: '',
    tahun: '',
    lokasi: '',
    deskripsi: ''
  });

  // Language state
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [editingLang, setEditingLang] = useState<Language | null>(null);
  const [langForm, setLangForm] = useState<Partial<Language>>({
    nama_bahasa: '',
    level: ''
  });

  // Contact state
  const [contactForms, setContactForms] = useState<Record<string, string>>({
    whatsapp: data.contacts.find(c => c.jenis === 'whatsapp')?.value || '',
    email: data.contacts.find(c => c.jenis === 'email')?.value || '',
    instagram: data.contacts.find(c => c.jenis === 'instagram')?.value || '',
    linkedin: data.contacts.find(c => c.jenis === 'linkedin')?.value || ''
  });

  // Keep-alive test state
  const [keepAliveResult, setKeepAliveResult] = useState<string | null>(null);
  const [keepAliveLoading, setKeepAliveLoading] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  // Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfileData(profileForm);
      await onRefreshData();
      showToast('Profil berhasil diperbarui');
    } catch (err: any) {
      showToast('Gagal menyimpan profil: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Avatar Upload
  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const url = await uploadImageToStorage(file, 'avatars');
      setProfileForm(prev => ({ ...prev, avatar_url: url }));
      showToast('Foto profil berhasil diunggah. Klik Simpan Perubahan untuk menyimpan.');
    } catch (err: any) {
      showToast('Gagal mengunggah foto profil: ' + err.message, 'error');
    } finally {
      setAvatarUploading(false);
    }
  };

  // Project Save
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.judul || !projectForm.deskripsi) {
      showToast('Judul dan deskripsi project wajib diisi', 'error');
      return;
    }
    setIsSaving(true);
    try {
      const proj: Project = {
        id: editingProject ? editingProject.id : 'proj-' + Date.now(),
        judul: projectForm.judul || '',
        deskripsi: projectForm.deskripsi || '',
        gambar_url: projectForm.gambar_url || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800',
        link: projectForm.link || '',
        urutan: Number(projectForm.urutan) || 1
      };
      await saveProject(proj);
      await onRefreshData();
      setIsProjectModalOpen(false);
      setEditingProject(null);
      setProjectForm({ judul: '', deskripsi: '', gambar_url: '', link: '', urutan: 1 });
      showToast('Project berhasil disimpan');
    } catch (err: any) {
      showToast('Gagal menyimpan project: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Hapus project ini?')) return;
    try {
      await deleteProject(id);
      await onRefreshData();
      showToast('Project berhasil dihapus');
    } catch (err: any) {
      showToast('Gagal menghapus project: ' + err.message, 'error');
    }
  };

  // Project image upload
  const handleProjectFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProjectUploading(true);
    try {
      const url = await uploadImageToStorage(file, 'projects');
      setProjectForm(prev => ({ ...prev, gambar_url: url }));
      showToast('Gambar project berhasil diunggah');
    } catch (err: any) {
      showToast('Gagal mengunggah gambar: ' + err.message, 'error');
    } finally {
      setProjectUploading(false);
    }
  };

  // Skill Handlers
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    try {
      if (editingSkill) {
        await saveSkill({ id: editingSkill.id, nama: newSkillName.trim() });
        setEditingSkill(null);
        showToast('Keahlian berhasil diperbarui');
      } else {
        await saveSkill({ id: 'sk-' + Date.now(), nama: newSkillName.trim() });
        showToast('Keahlian berhasil ditambahkan');
      }
      setNewSkillName('');
      await onRefreshData();
    } catch (err: any) {
      showToast('Gagal menyimpan keahlian: ' + err.message, 'error');
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      await deleteSkill(id);
      await onRefreshData();
      showToast('Keahlian berhasil dihapus');
    } catch (err: any) {
      showToast('Gagal menghapus keahlian', 'error');
    }
  };

  // Experience Handlers
  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expForm.instansi || !expForm.tahun) return;
    try {
      const exp: Experience = {
        id: editingExp ? editingExp.id : 'exp-' + Date.now(),
        instansi: expForm.instansi || '',
        tahun: expForm.tahun || '',
        lokasi: expForm.lokasi || '',
        deskripsi: expForm.deskripsi || ''
      };
      await saveExperience(exp);
      await onRefreshData();
      setIsExpModalOpen(false);
      setEditingExp(null);
      setExpForm({ instansi: '', tahun: '', lokasi: '', deskripsi: '' });
      showToast('Pengalaman kerja berhasil disimpan');
    } catch (err: any) {
      showToast('Gagal menyimpan pengalaman', 'error');
    }
  };

  const handleDeleteExp = async (id: string) => {
    if (!window.confirm('Hapus entri pengalaman ini?')) return;
    try {
      await deleteExperience(id);
      await onRefreshData();
      showToast('Pengalaman kerja berhasil dihapus');
    } catch (err: any) {
      showToast('Gagal menghapus', 'error');
    }
  };

  // Course Handlers
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.nama_course || !courseForm.penyelenggara) return;
    try {
      const course: Course = {
        id: editingCourse ? editingCourse.id : 'crs-' + Date.now(),
        nama_course: courseForm.nama_course || '',
        penyelenggara: courseForm.penyelenggara || '',
        tahun: courseForm.tahun || '',
        lokasi: courseForm.lokasi || '',
        deskripsi: courseForm.deskripsi || ''
      };
      await saveCourse(course);
      await onRefreshData();
      setIsCourseModalOpen(false);
      setEditingCourse(null);
      setCourseForm({ nama_course: '', penyelenggara: '', tahun: '', lokasi: '', deskripsi: '' });
      showToast('Pelatihan berhasil disimpan');
    } catch (err: any) {
      showToast('Gagal menyimpan pelatihan', 'error');
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!window.confirm('Hapus entri pelatihan ini?')) return;
    try {
      await deleteCourse(id);
      await onRefreshData();
      showToast('Pelatihan berhasil dihapus');
    } catch (err: any) {
      showToast('Gagal menghapus', 'error');
    }
  };

  // Language Handlers
  const handleSaveLanguage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!langForm.nama_bahasa || !langForm.level) return;
    try {
      const lang: Language = {
        id: editingLang ? editingLang.id : 'lang-' + Date.now(),
        nama_bahasa: langForm.nama_bahasa || '',
        level: langForm.level || ''
      };
      await saveLanguage(lang);
      await onRefreshData();
      setIsLangModalOpen(false);
      setEditingLang(null);
      setLangForm({ nama_bahasa: '', level: '' });
      showToast('Bahasa berhasil disimpan');
    } catch (err: any) {
      showToast('Gagal menyimpan bahasa', 'error');
    }
  };

  const handleDeleteLang = async (id: string) => {
    try {
      await deleteLanguage(id);
      await onRefreshData();
      showToast('Bahasa berhasil dihapus');
    } catch (err: any) {
      showToast('Gagal menghapus', 'error');
    }
  };

  // Contact Handlers
  const handleSaveContacts = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const types: ContactType[] = ['whatsapp', 'email', 'instagram', 'linkedin'];
      for (const t of types) {
        const existing = data.contacts.find(c => c.jenis === t);
        const val = contactForms[t] || '';
        await saveContact({
          id: existing ? existing.id : `cnt-${t}`,
          jenis: t,
          value: val
        });
      }
      await onRefreshData();
      showToast('Kontak berhasil diperbarui');
    } catch (err: any) {
      showToast('Gagal memperbarui kontak', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Test keepalive route
  const handleTestKeepAlive = async () => {
    setKeepAliveLoading(true);
    setKeepAliveResult(null);
    try {
      const res = await fetch('/api/cron/keepalive');
      const json = await res.json();
      setKeepAliveResult(JSON.stringify(json, null, 2));
    } catch (err: any) {
      setKeepAliveResult('Error: ' + err.message);
    } finally {
      setKeepAliveLoading(false);
    }
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profil', icon: <User className="w-4 h-4" /> },
    { id: 'projects', label: 'Project', icon: <FolderGit2 className="w-4 h-4" /> },
    { id: 'skills', label: 'Keahlian', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'experience', label: 'Pengalaman', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'courses', label: 'Pelatihan', icon: <Award className="w-4 h-4" /> },
    { id: 'languages', label: 'Bahasa', icon: <LanguagesIcon className="w-4 h-4" /> },
    { id: 'contacts', label: 'Kontak', icon: <PhoneCall className="w-4 h-4" /> },
    { id: 'system', label: 'Sistem & Supabase', icon: <Database className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              A
            </span>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">
                Panel Admin Portofolio
              </h1>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured() ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                <span>{isSupabaseConfigured() ? 'Supabase Database' : 'Penyimpanan Lokal'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onViewPublic}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Lihat Halaman Publik</span>
            </button>

            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs sm:text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Feedback */}
      {feedback && (
        <div className="fixed top-20 right-4 z-50 animate-bounce">
          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
            feedback.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
          }`}>
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{feedback.message}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Mobile Horizontal Tabs Navigation (Scrollable without truncation) */}
        <div className="overflow-x-auto pb-2 scrollbar-none mb-6">
          <div className="flex space-x-2 border-b border-slate-200 min-w-max pb-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* TAB 1: PROFILE MANAGEMENT */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-xs">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">Kelola Data Profil</h2>
              <p className="text-sm text-slate-500">
                Informasi utama yang tampil pada hero section halaman depan portofolio.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Profile Avatar Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Foto Profil (1:1 Rasio, Disimpan di bucket 'avatars')
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className="w-28 h-28 aspect-square rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-100 relative shrink-0">
                    <img
                      src={profileForm.avatar_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800'}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                    />
                    {avatarUploading && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs">
                        Mengunggah...
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 flex-1 w-full">
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFileChange}
                      className="hidden"
                    />
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        disabled={avatarUploading}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm font-semibold hover:bg-blue-100 transition-colors border border-blue-200"
                      >
                        <Upload className="w-4 h-4" />
                        Pilih & Unggah Gambar
                      </button>
                    </div>
                    <p className="text-xs text-slate-500">
                      Format PNG/JPG/WebP, maksimal 5MB. Anda juga dapat memasukkan URL gambar langsung di bawah.
                    </p>
                    <input
                      type="text"
                      value={profileForm.avatar_url}
                      onChange={(e) => setProfileForm({ ...profileForm, avatar_url: e.target.value })}
                      placeholder="Atau tempel URL gambar (https://...)"
                      className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Nama */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.nama}
                    onChange={(e) => setProfileForm({ ...profileForm, nama: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <p className="text-xs text-slate-400 mt-1">Kata pertama akan otomatis berwarna biru sebagai aksen visual.</p>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">
                    Label Status (di bawah foto profil)
                  </label>
                  <input
                    type="text"
                    value={profileForm.status}
                    onChange={(e) => setProfileForm({ ...profileForm, status: e.target.value })}
                    placeholder="• Terbuka untuk Kolaborasi"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">
                  Tagline / Jabatan Profesional
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.tagline}
                  onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Deskripsi Singkat */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">
                  Deskripsi Singkat Profil
                </label>
                <textarea
                  rows={4}
                  required
                  value={profileForm.deskripsi}
                  onChange={(e) => setProfileForm({ ...profileForm, deskripsi: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Resume Link (Conditional render trigger) */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">
                  Link Resume (URL Google Drive / Dokumen)
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={profileForm.resume_url || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, resume_url: e.target.value })}
                    placeholder="https://drive.google.com/file/d/..."
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  *Ketentuan PRD Section 4.1: Tombol "Resume" di beranda hanya dirender jika URL ini terisi. Jika dikosongkan, tombol otomatis tidak tampil sama sekali.
                </p>
              </div>

              {/* Save Button */}
              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan Profil'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: PROJECTS MANAGEMENT */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Koleksi Project / Portofolio</h2>
                <p className="text-sm text-slate-500">
                  Kelola kartu project, tautan Google Drive / Web, dan gambar sampul (PRD Section 4.3 & 7).
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingProject(null);
                  setProjectForm({
                    judul: '',
                    deskripsi: '',
                    gambar_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800',
                    link: '',
                    urutan: data.projects.length + 1
                  });
                  setIsProjectModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Project Baru</span>
              </button>
            </div>

            {/* Projects List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {data.projects.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-video w-full bg-slate-100">
                      <img
                        src={proj.gambar_url}
                        alt={proj.judul}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 right-2 px-2 py-1 rounded bg-black/60 text-white text-xs font-semibold">
                        Urutan #{proj.urutan}
                      </span>
                    </div>

                    <div className="p-5">
                      <h3 className="text-base font-bold text-slate-900">{proj.judul}</h3>
                      <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                        {proj.deskripsi}
                      </p>
                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline truncate max-w-full"
                        >
                          <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{proj.link}</span>
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProject(proj);
                        setProjectForm({ ...proj });
                        setIsProjectModalOpen(true);
                      }}
                      className="p-2 text-slate-600 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
                      title="Edit project"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProject(proj.id)}
                      className="p-2 text-slate-600 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                      title="Hapus project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Add / Edit Project */}
            {isProjectModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">
                    {editingProject ? 'Edit Project' : 'Tambah Project Baru'}
                  </h3>

                  <form onSubmit={handleSaveProject} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Judul Project
                      </label>
                      <input
                        type="text"
                        required
                        value={projectForm.judul}
                        onChange={(e) => setProjectForm({ ...projectForm, judul: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Deskripsi Singkat
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={projectForm.deskripsi}
                        onChange={(e) => setProjectForm({ ...projectForm, deskripsi: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    {/* Image upload / URL */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Gambar Sampul Project (Bucket 'projects')
                      </label>
                      <div className="flex gap-2 mb-2">
                        <input
                          ref={projectInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleProjectFileChange}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => projectInputRef.current?.click()}
                          disabled={projectUploading}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{projectUploading ? 'Mengunggah...' : 'Upload File'}</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        value={projectForm.gambar_url}
                        onChange={(e) => setProjectForm({ ...projectForm, gambar_url: e.target.value })}
                        placeholder="Atau masukkan URL gambar"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      {projectForm.gambar_url && (
                        <div className="mt-2 aspect-video w-full max-h-36 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                          <img
                            src={projectForm.gambar_url}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Tautan Project (URL Web / Google Drive)
                        </label>
                        <input
                          type="url"
                          value={projectForm.link}
                          onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
                          placeholder="https://drive.google.com/..."
                          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Urutan Tampil
                        </label>
                        <input
                          type="number"
                          value={projectForm.urutan}
                          onChange={(e) => setProjectForm({ ...projectForm, urutan: parseInt(e.target.value) || 1 })}
                          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsProjectModalOpen(false)}
                        className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                      >
                        Simpan Project
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SKILLS MANAGEMENT */}
        {activeTab === 'skills' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-xs">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">Kelola Keahlian (Skills)</h2>
              <p className="text-sm text-slate-500">
                Sesuai PRD Section 4.2: Ditampilkan sebagai badge sederhana dengan nama keahlian saja tanpa level.
              </p>
            </div>

            {/* Add Skill Form */}
            <form onSubmit={handleAddSkill} className="mb-8 flex gap-2">
              <input
                type="text"
                required
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="Contoh: Canva, Microsoft Word, Adobe Illustrator..."
                className="flex-1 px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>{editingSkill ? 'Perbarui' : 'Tambah Keahlian'}</span>
              </button>
              {editingSkill && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingSkill(null);
                    setNewSkillName('');
                  }}
                  className="px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
              )}
            </form>

            {/* Skills Badges List with Delete / Edit */}
            <div className="flex flex-wrap gap-2.5">
              {data.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium"
                >
                  <span>{skill.nama}</span>
                  <div className="flex items-center gap-1 ml-1 border-l border-slate-200 pl-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSkill(skill);
                        setNewSkillName(skill.nama);
                      }}
                      className="text-slate-400 hover:text-blue-600"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="text-slate-400 hover:text-red-600"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {data.skills.length === 0 && (
                <p className="text-slate-400 text-sm italic">Belum ada keahlian yang terdaftar.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: EXPERIENCE MANAGEMENT */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Riwayat Pengalaman Kerja</h2>
                <p className="text-sm text-slate-500">
                  Kelola instansi, periode tahun, lokasi, dan deskripsi tugas (PRD Section 4.4).
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingExp(null);
                  setExpForm({ instansi: '', tahun: '', lokasi: '', deskripsi: '' });
                  setIsExpModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Pengalaman</span>
              </button>
            </div>

            <div className="space-y-4">
              {data.experience.map((exp) => (
                <div
                  key={exp.id}
                  className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                >
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-slate-900">{exp.instansi}</h3>
                    <p className="text-xs font-semibold text-blue-600 mt-0.5">
                      {exp.tahun} • {exp.lokasi}
                    </p>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">{exp.deskripsi}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingExp(exp);
                        setExpForm({ ...exp });
                        setIsExpModalOpen(true);
                      }}
                      className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteExp(exp.id)}
                      className="p-2 text-slate-600 hover:text-red-600 hover:bg-slate-100 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Exp */}
            {isExpModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">
                    {editingExp ? 'Edit Pengalaman' : 'Tambah Pengalaman Baru'}
                  </h3>
                  <form onSubmit={handleSaveExperience} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Instansi / Perusahaan</label>
                      <input
                        type="text"
                        required
                        value={expForm.instansi}
                        onChange={(e) => setExpForm({ ...expForm, instansi: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Tahun / Periode</label>
                        <input
                          type="text"
                          required
                          value={expForm.tahun}
                          onChange={(e) => setExpForm({ ...expForm, tahun: e.target.value })}
                          placeholder="2023 - Sekarang"
                          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Lokasi</label>
                        <input
                          type="text"
                          required
                          value={expForm.lokasi}
                          onChange={(e) => setExpForm({ ...expForm, lokasi: e.target.value })}
                          placeholder="Jakarta"
                          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Singkat Peran</label>
                      <textarea
                        rows={3}
                        required
                        value={expForm.deskripsi}
                        onChange={(e) => setExpForm({ ...expForm, deskripsi: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsExpModalOpen(false)}
                        className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                      >
                        Simpan Pengalaman
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: COURSES & TRAINING */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Pelatihan & Kursus</h2>
                <p className="text-sm text-slate-500">
                  Sesuai PRD Section 4.5: Nama course, penyelenggara, tahun, lokasi, dan deskripsi singkat.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingCourse(null);
                  setCourseForm({ nama_course: '', penyelenggara: '', tahun: '', lokasi: '', deskripsi: '' });
                  setIsCourseModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Pelatihan</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{course.nama_course}</h3>
                    <p className="text-xs font-semibold text-blue-600 mt-1">{course.penyelenggara}</p>
                    <p className="text-xs text-slate-500 mt-1">{course.tahun} • {course.lokasi}</p>
                    <p className="text-sm text-slate-600 mt-3 leading-relaxed">{course.deskripsi}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCourse(course);
                        setCourseForm({ ...course });
                        setIsCourseModalOpen(true);
                      }}
                      className="p-1.5 text-slate-600 hover:text-blue-600 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCourse(course.id)}
                      className="p-1.5 text-slate-600 hover:text-red-600 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Course Modal */}
            {isCourseModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">
                    {editingCourse ? 'Edit Pelatihan' : 'Tambah Pelatihan Baru'}
                  </h3>
                  <form onSubmit={handleSaveCourse} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Course / Pelatihan</label>
                      <input
                        type="text"
                        required
                        value={courseForm.nama_course}
                        onChange={(e) => setCourseForm({ ...courseForm, nama_course: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Penyelenggara</label>
                      <input
                        type="text"
                        required
                        value={courseForm.penyelenggara}
                        onChange={(e) => setCourseForm({ ...courseForm, penyelenggara: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Tahun</label>
                        <input
                          type="text"
                          required
                          value={courseForm.tahun}
                          onChange={(e) => setCourseForm({ ...courseForm, tahun: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Lokasi</label>
                        <input
                          type="text"
                          required
                          value={courseForm.lokasi}
                          onChange={(e) => setCourseForm({ ...courseForm, lokasi: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Singkat</label>
                      <textarea
                        rows={3}
                        required
                        value={courseForm.deskripsi}
                        onChange={(e) => setCourseForm({ ...courseForm, deskripsi: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsCourseModalOpen(false)}
                        className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                      >
                        Simpan Pelatihan
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: LANGUAGES MANAGEMENT */}
        {activeTab === 'languages' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Kemampuan Bahasa</h2>
                <p className="text-sm text-slate-500">
                  Format teks: "Nama Bahasa — Level" (PRD Section 4.6). Tanpa progress bar.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingLang(null);
                  setLangForm({ nama_bahasa: '', level: '' });
                  setIsLangModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Bahasa</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {data.languages.map((lang) => (
                <div
                  key={lang.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-slate-900">{lang.nama_bahasa}</span>
                    <span className="text-slate-400 mx-1">—</span>
                    <span className="text-blue-600 font-medium">{lang.level}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingLang(lang);
                        setLangForm({ ...lang });
                        setIsLangModalOpen(true);
                      }}
                      className="p-1 text-slate-400 hover:text-blue-600"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteLang(lang.id)}
                      className="p-1 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Language */}
            {isLangModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">
                    {editingLang ? 'Edit Bahasa' : 'Tambah Bahasa'}
                  </h3>
                  <form onSubmit={handleSaveLanguage} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Bahasa</label>
                      <input
                        type="text"
                        required
                        value={langForm.nama_bahasa}
                        onChange={(e) => setLangForm({ ...langForm, nama_bahasa: e.target.value })}
                        placeholder="Contoh: Bahasa Inggris"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Tingkat Kemampuan (Level)</label>
                      <input
                        type="text"
                        required
                        value={langForm.level}
                        onChange={(e) => setLangForm({ ...langForm, level: e.target.value })}
                        placeholder="Contoh: Native, Intermediate, Fluent"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsLangModalOpen(false)}
                        className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                      >
                        Simpan
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 7: CONTACTS MANAGEMENT */}
        {activeTab === 'contacts' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-xs">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">Kelola Informasi Kontak</h2>
              <p className="text-sm text-slate-500">
                Sesuai PRD Section 4.7: WhatsApp, Email, Instagram, dan LinkedIn.
              </p>
            </div>

            <form onSubmit={handleSaveContacts} className="space-y-5 max-w-2xl">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">
                  Nomor WhatsApp / Link wa.me
                </label>
                <input
                  type="text"
                  value={contactForms.whatsapp}
                  onChange={(e) => setContactForms({ ...contactForms, whatsapp: e.target.value })}
                  placeholder="https://wa.me/6281234567890 atau 081234567890"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">
                  Alamat Email Resmi
                </label>
                <input
                  type="email"
                  value={contactForms.email}
                  onChange={(e) => setContactForms({ ...contactForms, email: e.target.value })}
                  placeholder="nama.profesional@example.com"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">
                  Tautan Profil Instagram
                </label>
                <input
                  type="text"
                  value={contactForms.instagram}
                  onChange={(e) => setContactForms({ ...contactForms, instagram: e.target.value })}
                  placeholder="https://instagram.com/username"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">
                  Tautan Profil LinkedIn
                </label>
                <input
                  type="text"
                  value={contactForms.linkedin}
                  onChange={(e) => setContactForms({ ...contactForms, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-200">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Kontak</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 8: SYSTEM, SUPABASE & KEEP-ALIVE */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900 mb-1">Status Integrasi Supabase & Database</h2>
              <p className="text-sm text-slate-500 mb-6">
                Informasi konfigurasi basis data, variabel lingkungan (.env), dan storage bucket sesuai PRD.
              </p>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Status Koneksi:</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    isSupabaseConfigured() ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {isSupabaseConfigured() ? 'Terhubung Supabase (Live Database)' : 'Penyimpanan Lokal Aktif (Data Tersimpan di Browser)'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Supabase URL:</span>
                  <span className="text-xs font-mono text-slate-600 truncate max-w-[240px] sm:max-w-md">
                    {SUPABASE_URL || 'Belum diisi di .env'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Storage Buckets:</span>
                  <span className="text-xs font-mono text-slate-600">avatars (publik), projects (publik)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Endpoint Keep-Alive:</span>
                  <span className="text-xs font-mono text-slate-600">GET /api/cron/keepalive</span>
                </div>
              </div>

              {/* Panduan Langkah Cepat */}
              <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 sm:p-5 mb-6">
                <h3 className="text-sm font-bold text-blue-950 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  3 Langkah Menghubungkan Supabase
                </h3>
                <ol className="text-xs sm:text-sm text-blue-900 space-y-2 list-decimal list-inside">
                  <li>
                    <strong>Jalankan Skema SQL:</strong> Salin script SQL dari bagian di bawah, buka <em>Supabase Dashboard &gt; SQL Editor &gt; New Query</em>, tempel dan klik <strong>Run</strong>.
                  </li>
                  <li>
                    <strong>Ambil Kredensial:</strong> Buka <em>Project Settings &gt; API</em> di Supabase, salin <em>Project URL</em> dan <em>anon/public key</em>.
                  </li>
                  <li>
                    <strong>Isi Berkas .env:</strong> Masukkan URL dan Anon Key ke file <code>.env</code> aplikasi ini.
                  </li>
                </ol>
              </div>

              {/* Section File .env */}
              <div className="border-t border-slate-200 pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-slate-700" />
                      Konfigurasi Berkas .env
                    </h3>
                    <p className="text-xs text-slate-500">
                      Variabel lingkungan yang digunakan oleh aplikasi di file <code>.env</code>.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const envText = `# Supabase Configuration\nVITE_SUPABASE_URL=https://your-project.supabase.co\nVITE_SUPABASE_ANON_KEY=your-anon-key\nNEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key\nSUPABASE_SERVICE_ROLE_KEY=your-service-role-key\n\n# Cron Secret\nCRON_SECRET=portfolio-keepalive-secret-2026\n`;
                      navigator.clipboard.writeText(envText);
                      setCopiedEnv(true);
                      setTimeout(() => setCopiedEnv(false), 2500);
                      showToast('Format .env disalin ke clipboard');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors self-start sm:self-auto"
                  >
                    {copiedEnv ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedEnv ? 'Tersalin!' : 'Salin Contoh .env'}</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto">
                  <pre className="leading-relaxed">
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
CRON_SECRET=portfolio-keepalive-secret-2026`}
                  </pre>
                </div>
              </div>

              {/* Section File supabase_schema.sql */}
              <div className="border-t border-slate-200 pt-6 mt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-blue-600" />
                      Skema SQL Lengkap (supabase_schema.sql)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Mencakup 7 tabel, Row Level Security (RLS), bucket storage <em>avatars</em> &amp; <em>projects</em>, dan data awal.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const res = await fetch('/supabase_schema.sql');
                        const text = await res.text();
                        await navigator.clipboard.writeText(text);
                        setCopiedSql(true);
                        setTimeout(() => setCopiedSql(false), 2500);
                        showToast('Skema SQL berhasil disalin ke clipboard');
                      } catch {
                        showToast('Silakan buka file supabase_schema.sql langsung dari proyek', 'error');
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs self-start sm:self-auto"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSql ? 'Tersalin!' : 'Salin Seluruh Skema SQL'}</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 text-slate-300 font-mono text-xs overflow-x-auto max-h-56">
                  <pre className="leading-relaxed">
{`-- 1. Profile (Singleton)
CREATE TABLE IF NOT EXISTS public.profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama TEXT NOT NULL DEFAULT 'Rania Amanda',
  tagline TEXT NOT NULL DEFAULT 'Spesialis Komunikasi Strategis...',
  deskripsi TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT '• Terbuka untuk Kolaborasi',
  avatar_url TEXT NOT NULL DEFAULT '',
  resume_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Skills, 3. Projects, 4. Experience, 5. Courses, 6. Languages, 7. Contacts
-- + RLS Policies + Storage Buckets ('avatars', 'projects')
-- Lihat file /supabase_schema.sql untuk isi lengkapnya.`}
                  </pre>
                </div>
              </div>

              {/* Keep-Alive Test Runner */}
              <div className="border-t border-slate-200 pt-6 mt-6">
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Uji Supabase Keep-Alive (Cron Job - PRD Section 8)
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Mencegah pause otomatis free-tier Supabase. Cron Vercel dijadwalkan setiap pukul 01:00 UTC (08:00 WIB) via endpoint <code>/api/cron/keepalive</code>.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleTestKeepAlive}
                    disabled={keepAliveLoading}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-white text-xs sm:text-sm font-semibold hover:bg-slate-900 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${keepAliveLoading ? 'animate-spin' : ''}`} />
                    <span>{keepAliveLoading ? 'Menguji...' : 'Jalankan Uji Keep-Alive Endpoint'}</span>
                  </button>
                </div>

                {keepAliveResult && (
                  <pre className="mt-3 p-3 rounded-lg bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto">
                    {keepAliveResult}
                  </pre>
                )}
              </div>

              {/* Reset Data Button */}
              <div className="border-t border-slate-200 pt-6 mt-6">
                <h3 className="text-base font-bold text-slate-900 mb-1">Muat Ulang Contoh Data Versi PRD</h3>
                <p className="text-xs text-slate-500 mb-3">
                  Kembalikan data ke contoh portofolio serba guna (Rania Amanda - Spesialis Komunikasi).
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Reset seluruh data ke contoh default?')) {
                      resetDataToDefault();
                      onRefreshData();
                      showToast('Data berhasil di-reset ke default');
                    }
                  }}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Reset ke Data Awal
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
