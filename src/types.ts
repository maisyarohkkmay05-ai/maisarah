export interface Profile {
  id?: string;
  nama: string;
  tagline: string;
  deskripsi: string;
  status: string;
  avatar_url: string;
  resume_url?: string;
}

export interface Skill {
  id: string;
  nama: string;
}

export interface Project {
  id: string;
  judul: string;
  deskripsi: string;
  gambar_url: string;
  link: string;
  urutan: number;
}

export interface Experience {
  id: string;
  instansi: string;
  tahun: string;
  lokasi: string;
  deskripsi: string;
}

export interface Course {
  id: string;
  nama_course: string;
  penyelenggara: string;
  tahun: string;
  lokasi: string;
  deskripsi: string;
}

export interface Language {
  id: string;
  nama_bahasa: string;
  level: string;
}

export type ContactType = 'whatsapp' | 'email' | 'instagram' | 'linkedin';

export interface Contact {
  id: string;
  jenis: ContactType;
  value: string;
}

export interface PortfolioData {
  profile: Profile;
  skills: Skill[];
  projects: Project[];
  experience: Experience[];
  courses: Course[];
  languages: Language[];
  contacts: Contact[];
}
