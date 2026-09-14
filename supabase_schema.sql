-- ==============================================================================
-- SQL SCHEMA FOR WEBSITE PORTOFOLIO PRIBADI (PRD Versi 1.5)
-- ==============================================================================
-- CARA PENGGUNAAN DI SUPABASE:
-- 1. Buka dashboard Supabase: https://supabase.com/dashboard
-- 2. Pilih project Anda
-- 3. Di menu sebelah kiri, klik "SQL Editor"
-- 4. Klik tombol "New Query", tempel (paste) seluruh script ini, lalu klik "Run"
-- ==============================================================================

-- Aktifkan ekstensi UUID jika belum aktif
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. Tabel `profile` (Singleton untuk data pemilik portofolio)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama TEXT NOT NULL DEFAULT 'Rania Amanda',
  tagline TEXT NOT NULL DEFAULT 'Spesialis Komunikasi Strategis & Manajemen Proyek Kreatif',
  deskripsi TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT '• Terbuka untuk Kolaborasi',
  avatar_url TEXT NOT NULL DEFAULT '',
  resume_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 2. Tabel `skills` (Keahlian sederhana tanpa level)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 3. Tabel `projects` (Koleksi portofolio & project)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judul TEXT NOT NULL,
  deskripsi TEXT NOT NULL,
  gambar_url TEXT NOT NULL,
  link TEXT NOT NULL DEFAULT '',
  urutan INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 4. Tabel `experience` (Riwayat Pengalaman Kerja)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instansi TEXT NOT NULL,
  tahun TEXT NOT NULL,
  lokasi TEXT NOT NULL,
  deskripsi TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 5. Tabel `courses` (Pelatihan & Kursus)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_course TEXT NOT NULL,
  penyelenggara TEXT NOT NULL,
  tahun TEXT NOT NULL,
  lokasi TEXT NOT NULL,
  deskripsi TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 6. Tabel `languages` (Kemampuan Bahasa)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_bahasa TEXT NOT NULL,
  level TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 7. Tabel `contacts` (Informasi Kontak: WhatsApp, Email, Instagram, LinkedIn)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jenis TEXT NOT NULL CHECK (jenis IN ('whatsapp', 'email', 'instagram', 'linkedin')),
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- Publik: Boleh membaca (SELECT) seluruh data
-- Admin (Pengguna yang Terotentikasi): Boleh INSERT, UPDATE, DELETE
-- ==============================================================================
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Hapus policy lama jika ada agar idempotent saat dieksekusi ulang
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profile;
DROP POLICY IF EXISTS "Admin can modify profile" ON public.profile;

DROP POLICY IF EXISTS "Public skills are viewable by everyone" ON public.skills;
DROP POLICY IF EXISTS "Admin can modify skills" ON public.skills;

DROP POLICY IF EXISTS "Public projects are viewable by everyone" ON public.projects;
DROP POLICY IF EXISTS "Admin can modify projects" ON public.projects;

DROP POLICY IF EXISTS "Public experience is viewable by everyone" ON public.experience;
DROP POLICY IF EXISTS "Admin can modify experience" ON public.experience;

DROP POLICY IF EXISTS "Public courses are viewable by everyone" ON public.courses;
DROP POLICY IF EXISTS "Admin can modify courses" ON public.courses;

DROP POLICY IF EXISTS "Public languages are viewable by everyone" ON public.languages;
DROP POLICY IF EXISTS "Admin can modify languages" ON public.languages;

DROP POLICY IF EXISTS "Public contacts are viewable by everyone" ON public.contacts;
DROP POLICY IF EXISTS "Admin can modify contacts" ON public.contacts;

-- Buat Policy Baru
CREATE POLICY "Public profiles are viewable by everyone" ON public.profile FOR SELECT USING (true);
CREATE POLICY "Admin can modify profile" ON public.profile FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public skills are viewable by everyone" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Admin can modify skills" ON public.skills FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public projects are viewable by everyone" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Admin can modify projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public experience is viewable by everyone" ON public.experience FOR SELECT USING (true);
CREATE POLICY "Admin can modify experience" ON public.experience FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public courses are viewable by everyone" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Admin can modify courses" ON public.courses FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public languages are viewable by everyone" ON public.languages FOR SELECT USING (true);
CREATE POLICY "Admin can modify languages" ON public.languages FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public contacts are viewable by everyone" ON public.contacts FOR SELECT USING (true);
CREATE POLICY "Admin can modify contacts" ON public.contacts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- STORAGE BUCKETS (avatars dan projects)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('avatars', 'avatars', true),
  ('projects', 'projects', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Hapus policy storage lama jika ada
DROP POLICY IF EXISTS "Public read avatars" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Admin update avatars" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete avatars" ON storage.objects;

DROP POLICY IF EXISTS "Public read projects" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload projects" ON storage.objects;
DROP POLICY IF EXISTS "Admin update projects" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete projects" ON storage.objects;

-- Buat policy storage baru
CREATE POLICY "Public read avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Admin upload avatars" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Admin update avatars" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'avatars');
CREATE POLICY "Admin delete avatars" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'avatars');

CREATE POLICY "Public read projects" ON storage.objects FOR SELECT USING (bucket_id = 'projects');
CREATE POLICY "Admin upload projects" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'projects');
CREATE POLICY "Admin update projects" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'projects');
CREATE POLICY "Admin delete projects" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'projects');

-- ==============================================================================
-- DATA AWAL (SEED DATA)
-- Mengisi data default hanya jika tabel dalam kondisi kosong
-- ==============================================================================

-- 1. Seed Profile
INSERT INTO public.profile (nama, tagline, deskripsi, status, avatar_url, resume_url)
SELECT 
  'Rania Amanda',
  'Spesialis Komunikasi Strategis & Manajemen Proyek Kreatif',
  'Berpengalaman lebih dari 5 tahun dalam mengelola kampanye komunikasi publik, koordinasi program kemitraan multisektoral, serta pengembangan konten kreatif yang berdampak tinggi bagi organisasi dan komunitas.',
  '• Terbuka untuk Kolaborasi',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
  'https://drive.google.com/file/d/1example-resume-portfolio/view?usp=sharing'
WHERE NOT EXISTS (SELECT 1 FROM public.profile);

-- 2. Seed Skills
INSERT INTO public.skills (nama)
SELECT val FROM (VALUES 
  ('Canva'),
  ('Microsoft Word & Excel'),
  ('Adobe Illustrator'),
  ('Manajemen Proyek'),
  ('Copywriting & Publikasi'),
  ('Public Speaking'),
  ('Riset Pasar & Analisis Audiens'),
  ('Strategi Media Sosial'),
  ('Negosiasi Kemitraan'),
  ('Event Planning')
) AS t(val)
WHERE NOT EXISTS (SELECT 1 FROM public.skills);

-- 3. Seed Projects
INSERT INTO public.projects (judul, deskripsi, gambar_url, link, urutan)
SELECT val.judul, val.deskripsi, val.gambar_url, val.link, val.urutan 
FROM (VALUES 
  (
    'Kampanye Edukasi Publik Literasi Berkelanjutan',
    'Penyusunan strategi komunikasi komprehensif, desain infografis interaktif, dan koordinasi publikasi lintas media yang menjangkau lebih dari 45.000 peserta aktif.',
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800',
    'https://drive.google.com/drive/folders/1example-campaign-docs',
    1
  ),
  (
    'Brand Identity & Visual Guidelines Yayasan Bina Cita',
    'Pengembangan identitas visual organisasi nirlaba, pedoman tipografi dan tata warna, modul pelatihan internal, serta aset presentasi formal.',
    'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&q=80&w=800',
    'https://drive.google.com/file/d/1example-brandbook/view',
    2
  ),
  (
    'Dokumentasi Video & Podcast Mini-Series Komunitas',
    'Produksi serial audio visual 6 episode mengenai kewirausahaan sosial lokal, mulai dari penulisan naskah, wawancara narasumber, hingga distribusi digital.',
    'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800',
    'https://drive.google.com/file/d/1example-podcast-video/view',
    3
  ),
  (
    'Laporan Tahunan & Publikasi Riset Dampak Organisasi',
    'Penyusunan tata letak publikasi 80 halaman, kurasi data kuantitatif ke dalam diagram yang mudah dipahami oleh donor dan pemangku kepentingan internasional.',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800',
    'https://drive.google.com/file/d/1example-annual-report/view',
    4
  )
) AS val(judul, deskripsi, gambar_url, link, urutan)
WHERE NOT EXISTS (SELECT 1 FROM public.projects);

-- 4. Seed Experience
INSERT INTO public.experience (instansi, tahun, lokasi, deskripsi)
SELECT val.instansi, val.tahun, val.lokasi, val.deskripsi
FROM (VALUES 
  (
    'Lembaga Inovasi Komunikasi Nusantara',
    '2023 - Sekarang',
    'Jakarta Selatan',
    'Memimpin tim komunikasi dalam mengelola program kerja sama strategis dengan lebih dari 20 mitra institusi dan memfasilitasi lokakarya publik berkala.'
  ),
  (
    'PT Media Kreatif Sinergi',
    '2021 - 2023',
    'Bandung',
    'Mengembangkan kampanye konten multimedia terpadu, riset tren konsumen, dan mengawasi pelaksanaan pameran karya industri kreatif.'
  ),
  (
    'Yayasan Pemberdayaan Generasi Maju',
    '2019 - 2021',
    'Yogyakarta',
    'Mengelola komunikasi relawan, penyusunan siaran pers, publikasi buletin bulanan, dan koordinasi logistik kegiatan kemasyarakatan.'
  )
) AS val(instansi, tahun, lokasi, deskripsi)
WHERE NOT EXISTS (SELECT 1 FROM public.experience);

-- 5. Seed Courses
INSERT INTO public.courses (nama_course, penyelenggara, tahun, lokasi, deskripsi)
SELECT val.nama_course, val.penyelenggara, val.tahun, val.lokasi, val.deskripsi
FROM (VALUES 
  (
    'Sertifikasi Manajemen Proyek Profesional (PMP Prep)',
    'Indonesia Project Management Academy',
    '2024',
    'Jakarta (Daring)',
    'Pelatihan intensif manajemen ruang lingkup proyek, mitigasi risiko, alokasi anggaran, dan koordinasi tim lintas fungsi.'
  ),
  (
    'Desain Komunikasi Visual & Tata Letak Editorial',
    'Balai Pengembangan Industri Kreatif',
    '2023',
    'Bandung',
    'Penguasaan prinsip tipografi, hierarki informasi visual, dan standarisasi dokumen terbitan berkala menggunakan Adobe Creative Suite.'
  ),
  (
    'Strategi Komunikasi Krisis & Hubungan Media',
    'Asosiasi Praktisi Komunikasi Publik',
    '2022',
    'Yogyakarta',
    'Studi kasus respon komunikasi cepat, penyusunan pernyataan resmi, dan simulasi konferensi pers.'
  )
) AS val(nama_course, penyelenggara, tahun, lokasi, deskripsi)
WHERE NOT EXISTS (SELECT 1 FROM public.courses);

-- 6. Seed Languages
INSERT INTO public.languages (nama_bahasa, level)
SELECT val.nama_bahasa, val.level
FROM (VALUES 
  ('Bahasa Indonesia', 'Native'),
  ('Bahasa Inggris', 'Professional Working'),
  ('Bahasa Mandarin', 'Conversational')
) AS val(nama_bahasa, level)
WHERE NOT EXISTS (SELECT 1 FROM public.languages);

-- 7. Seed Contacts
INSERT INTO public.contacts (jenis, value)
SELECT val.jenis, val.value
FROM (VALUES 
  ('whatsapp', 'https://wa.me/6281234567890'),
  ('email', 'rania.amanda.work@example.com'),
  ('instagram', 'https://instagram.com/rania.amanda'),
  ('linkedin', 'https://linkedin.com/in/rania-amanda-pro')
) AS val(jenis, value)
WHERE NOT EXISTS (SELECT 1 FROM public.contacts);
