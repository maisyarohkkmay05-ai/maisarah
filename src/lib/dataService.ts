import { initialPortfolioData } from '../data/defaultData';
import { Contact, Course, Experience, Language, PortfolioData, Profile, Project, Skill } from '../types';
import { getSupabaseClient, isSupabaseConfigured } from './supabase';

const STORAGE_KEY = 'portfolio_app_data_v1';

export const getLocalData = (): PortfolioData => {
  if (typeof window === 'undefined') {
    return initialPortfolioData;
  }
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPortfolioData));
    return initialPortfolioData;
  }
  try {
    const parsed = JSON.parse(raw);
    return {
      profile: parsed.profile || initialPortfolioData.profile,
      skills: Array.isArray(parsed.skills) ? parsed.skills : initialPortfolioData.skills,
      projects: Array.isArray(parsed.projects) ? parsed.projects : initialPortfolioData.projects,
      experience: Array.isArray(parsed.experience) ? parsed.experience : initialPortfolioData.experience,
      courses: Array.isArray(parsed.courses) ? parsed.courses : initialPortfolioData.courses,
      languages: Array.isArray(parsed.languages) ? parsed.languages : initialPortfolioData.languages,
      contacts: Array.isArray(parsed.contacts) ? parsed.contacts : initialPortfolioData.contacts
    };
  } catch (e) {
    console.error('Failed parsing local data, resetting to default', e);
    return initialPortfolioData;
  }
};

export const saveLocalData = (data: PortfolioData): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event('portfolio-data-updated'));
  }
};

export const fetchPortfolioData = async (): Promise<PortfolioData> => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return getLocalData();
  }

  try {
    const [
      profileRes,
      skillsRes,
      projectsRes,
      expRes,
      coursesRes,
      langRes,
      contactsRes
    ] = await Promise.all([
      supabase.from('profile').select('*').limit(1).maybeSingle(),
      supabase.from('skills').select('*').order('created_at', { ascending: true }),
      supabase.from('projects').select('*').order('urutan', { ascending: true }),
      supabase.from('experience').select('*').order('created_at', { ascending: false }),
      supabase.from('courses').select('*').order('created_at', { ascending: false }),
      supabase.from('languages').select('*').order('created_at', { ascending: true }),
      supabase.from('contacts').select('*').order('created_at', { ascending: true })
    ]);

    const localFallback = getLocalData();

    return {
      profile: profileRes.data || localFallback.profile,
      skills: (skillsRes.data && skillsRes.data.length > 0) ? skillsRes.data : localFallback.skills,
      projects: (projectsRes.data && projectsRes.data.length > 0) ? projectsRes.data : localFallback.projects,
      experience: (expRes.data && expRes.data.length > 0) ? expRes.data : localFallback.experience,
      courses: (coursesRes.data && coursesRes.data.length > 0) ? coursesRes.data : localFallback.courses,
      languages: (langRes.data && langRes.data.length > 0) ? langRes.data : localFallback.languages,
      contacts: (contactsRes.data && contactsRes.data.length > 0) ? contactsRes.data : localFallback.contacts
    };
  } catch (err) {
    console.warn('Supabase fetch failed, falling back to local data:', err);
    return getLocalData();
  }
};

export const updateProfileData = async (profileUpdate: Partial<Profile>): Promise<Profile> => {
  const current = getLocalData();
  const updatedProfile: Profile = {
    ...current.profile,
    ...profileUpdate
  };
  current.profile = updatedProfile;
  saveLocalData(current);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data: existing } = await supabase.from('profile').select('id').limit(1).maybeSingle();
      if (existing?.id) {
        await supabase.from('profile').update({
          nama: updatedProfile.nama,
          tagline: updatedProfile.tagline,
          deskripsi: updatedProfile.deskripsi,
          status: updatedProfile.status,
          avatar_url: updatedProfile.avatar_url,
          resume_url: updatedProfile.resume_url || '',
          updated_at: new Date().toISOString()
        }).eq('id', existing.id);
      } else {
        await supabase.from('profile').insert({
          nama: updatedProfile.nama,
          tagline: updatedProfile.tagline,
          deskripsi: updatedProfile.deskripsi,
          status: updatedProfile.status,
          avatar_url: updatedProfile.avatar_url,
          resume_url: updatedProfile.resume_url || ''
        });
      }
    } catch (err) {
      console.warn('Could not sync profile to Supabase:', err);
    }
  }

  return updatedProfile;
};

// Skill CRUD
export const saveSkill = async (skill: Skill): Promise<void> => {
  const data = getLocalData();
  const idx = data.skills.findIndex(s => s.id === skill.id);
  if (idx >= 0) {
    data.skills[idx] = skill;
  } else {
    data.skills.push(skill);
  }
  saveLocalData(data);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('skills').upsert({ id: skill.id, nama: skill.nama });
    } catch (err) {
      console.warn('Supabase skill upsert failed:', err);
    }
  }
};

export const deleteSkill = async (id: string): Promise<void> => {
  const data = getLocalData();
  data.skills = data.skills.filter(s => s.id !== id);
  saveLocalData(data);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('skills').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase skill delete failed:', err);
    }
  }
};

// Project CRUD
export const saveProject = async (project: Project): Promise<void> => {
  const data = getLocalData();
  const idx = data.projects.findIndex(p => p.id === project.id);
  if (idx >= 0) {
    data.projects[idx] = project;
  } else {
    data.projects.push(project);
  }
  // Sort projects by urutan
  data.projects.sort((a, b) => a.urutan - b.urutan);
  saveLocalData(data);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('projects').upsert({
        id: project.id,
        judul: project.judul,
        deskripsi: project.deskripsi,
        gambar_url: project.gambar_url,
        link: project.link,
        urutan: project.urutan
      });
    } catch (err) {
      console.warn('Supabase project upsert failed:', err);
    }
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  const data = getLocalData();
  data.projects = data.projects.filter(p => p.id !== id);
  saveLocalData(data);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('projects').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase project delete failed:', err);
    }
  }
};

// Experience CRUD
export const saveExperience = async (exp: Experience): Promise<void> => {
  const data = getLocalData();
  const idx = data.experience.findIndex(e => e.id === exp.id);
  if (idx >= 0) {
    data.experience[idx] = exp;
  } else {
    data.experience.push(exp);
  }
  saveLocalData(data);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('experience').upsert({
        id: exp.id,
        instansi: exp.instansi,
        tahun: exp.tahun,
        lokasi: exp.lokasi,
        deskripsi: exp.deskripsi
      });
    } catch (err) {
      console.warn('Supabase experience upsert failed:', err);
    }
  }
};

export const deleteExperience = async (id: string): Promise<void> => {
  const data = getLocalData();
  data.experience = data.experience.filter(e => e.id !== id);
  saveLocalData(data);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('experience').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase experience delete failed:', err);
    }
  }
};

// Course CRUD
export const saveCourse = async (course: Course): Promise<void> => {
  const data = getLocalData();
  const idx = data.courses.findIndex(c => c.id === course.id);
  if (idx >= 0) {
    data.courses[idx] = course;
  } else {
    data.courses.push(course);
  }
  saveLocalData(data);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('courses').upsert({
        id: course.id,
        nama_course: course.nama_course,
        penyelenggara: course.penyelenggara,
        tahun: course.tahun,
        lokasi: course.lokasi,
        deskripsi: course.deskripsi
      });
    } catch (err) {
      console.warn('Supabase course upsert failed:', err);
    }
  }
};

export const deleteCourse = async (id: string): Promise<void> => {
  const data = getLocalData();
  data.courses = data.courses.filter(c => c.id !== id);
  saveLocalData(data);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('courses').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase course delete failed:', err);
    }
  }
};

// Language CRUD
export const saveLanguage = async (lang: Language): Promise<void> => {
  const data = getLocalData();
  const idx = data.languages.findIndex(l => l.id === lang.id);
  if (idx >= 0) {
    data.languages[idx] = lang;
  } else {
    data.languages.push(lang);
  }
  saveLocalData(data);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('languages').upsert({
        id: lang.id,
        nama_bahasa: lang.nama_bahasa,
        level: lang.level
      });
    } catch (err) {
      console.warn('Supabase language upsert failed:', err);
    }
  }
};

export const deleteLanguage = async (id: string): Promise<void> => {
  const data = getLocalData();
  data.languages = data.languages.filter(l => l.id !== id);
  saveLocalData(data);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('languages').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase language delete failed:', err);
    }
  }
};

// Contact CRUD
export const saveContact = async (contact: Contact): Promise<void> => {
  const data = getLocalData();
  const idx = data.contacts.findIndex(c => c.id === contact.id);
  if (idx >= 0) {
    data.contacts[idx] = contact;
  } else {
    data.contacts.push(contact);
  }
  saveLocalData(data);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('contacts').upsert({
        id: contact.id,
        jenis: contact.jenis,
        value: contact.value
      });
    } catch (err) {
      console.warn('Supabase contact upsert failed:', err);
    }
  }
};

export const deleteContact = async (id: string): Promise<void> => {
  const data = getLocalData();
  data.contacts = data.contacts.filter(c => c.id !== id);
  saveLocalData(data);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('contacts').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase contact delete failed:', err);
    }
  }
};

// Storage upload (avatars / projects)
export const uploadImageToStorage = async (
  file: File,
  bucket: 'avatars' | 'projects'
): Promise<string> => {
  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
      const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
      if (error) {
        throw error;
      }
      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
      return publicUrlData.publicUrl;
    } catch (err) {
      console.warn('Supabase upload failed, storing as local data URL:', err);
    }
  }

  // Local fallback: convert to base64 data URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const resetDataToDefault = (): PortfolioData => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPortfolioData));
    window.dispatchEvent(new Event('portfolio-data-updated'));
  }
  return initialPortfolioData;
};
