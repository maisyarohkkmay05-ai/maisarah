import { PortfolioData } from '../types';

export const initialPortfolioData: PortfolioData = {
  profile: {
    nama: 'Rania Amanda',
    tagline: 'Spesialis Komunikasi Strategis & Manajemen Proyek Kreatif',
    deskripsi: 'Berpengalaman lebih dari 5 tahun dalam mengelola kampanye komunikasi publik, koordinasi program kemitraan multisektoral, serta pengembangan konten kreatif yang berdampak tinggi bagi organisasi dan komunitas.',
    status: '• Terbuka untuk Kolaborasi',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
    resume_url: 'https://drive.google.com/file/d/1example-resume-portfolio/view?usp=sharing'
  },
  skills: [
    { id: 'sk-1', nama: 'Canva' },
    { id: 'sk-2', nama: 'Microsoft Word & Excel' },
    { id: 'sk-3', nama: 'Adobe Illustrator' },
    { id: 'sk-4', nama: 'Manajemen Proyek' },
    { id: 'sk-5', nama: 'Copywriting & Publikasi' },
    { id: 'sk-6', nama: 'Public Speaking' },
    { id: 'sk-7', nama: 'Riset Pasar & Analisis Audiens' },
    { id: 'sk-8', nama: 'Strategi Media Sosial' },
    { id: 'sk-9', nama: 'Negosiasi Kemitraan' },
    { id: 'sk-10', nama: 'Event Planning' }
  ],
  projects: [
    {
      id: 'proj-1',
      judul: 'Kampanye Edukasi Publik Literasi Berkelanjutan',
      deskripsi: 'Penyusunan strategi komunikasi komprehensif, desain infografis interaktif, dan koordinasi publikasi lintas media yang menjangkau lebih dari 45.000 peserta aktif.',
      gambar_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800',
      link: 'https://drive.google.com/drive/folders/1example-campaign-docs',
      urutan: 1
    },
    {
      id: 'proj-2',
      judul: 'Brand Identity & Visual Guidelines Yayasan Bina Cita',
      deskripsi: 'Pengembangan identitas visual organisasi nirlaba, pedoman tipografi dan tata warna, modul pelatihan internal, serta aset presentasi formal.',
      gambar_url: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&q=80&w=800',
      link: 'https://drive.google.com/file/d/1example-brandbook/view',
      urutan: 2
    },
    {
      id: 'proj-3',
      judul: 'Dokumentasi Video & Podcast Mini-Series Komunitas',
      deskripsi: 'Produksi serial audio visual 6 episode mengenai kewirausahaan sosial lokal, mulai dari penulisan naskah, wawancara narasumber, hingga distribusi digital.',
      gambar_url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800',
      link: 'https://drive.google.com/file/d/1example-podcast-video/view',
      urutan: 3
    },
    {
      id: 'proj-4',
      judul: 'Laporan Tahunan & Publikasi Riset Dampak Organisasi',
      deskripsi: 'Penyusunan tata letak publikasi 80 halaman, kurasi data kuantitatif ke dalam diagram yang mudah dipahami oleh donor dan pemangku kepentingan internasional.',
      gambar_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800',
      link: 'https://drive.google.com/file/d/1example-annual-report/view',
      urutan: 4
    }
  ],
  experience: [
    {
      id: 'exp-1',
      instansi: 'Lembaga Inovasi Komunikasi Nusantara',
      tahun: '2023 - Sekarang',
      lokasi: 'Jakarta Selatan',
      deskripsi: 'Memimpin tim komunikasi dalam mengelola program kerja sama strategis dengan lebih dari 20 mitra institusi dan memfasilitasi lokakarya publik berkala.'
    },
    {
      id: 'exp-2',
      instansi: 'PT Media Kreatif Sinergi',
      tahun: '2021 - 2023',
      lokasi: 'Bandung',
      deskripsi: 'Mengembangkan kampanye konten multimedia terpadu, riset tren konsumen, dan mengawasi pelaksanaan pameran karya industri kreatif.'
    },
    {
      id: 'exp-3',
      instansi: 'Yayasan Pemberdayaan Generasi Maju',
      tahun: '2019 - 2021',
      lokasi: 'Yogyakarta',
      deskripsi: 'Mengelola komunikasi relawan, penyusunan siaran pers, publikasi buletin bulanan, dan koordinasi logistik kegiatan kemasyarakatan.'
    }
  ],
  courses: [
    {
      id: 'crs-1',
      nama_course: 'Sertifikasi Manajemen Proyek Profesional (PMP Prep)',
      penyelenggara: 'Indonesia Project Management Academy',
      tahun: '2024',
      lokasi: 'Jakarta (Daring)',
      deskripsi: 'Pelatihan intensif manajemen ruang lingkup proyek, mitigasi risiko, alokasi anggaran, dan koordinasi tim lintas fungsi.'
    },
    {
      id: 'crs-2',
      nama_course: 'Desain Komunikasi Visual & Tata Letak Editorial',
      penyelenggara: 'Balai Pengembangan Industri Kreatif',
      tahun: '2023',
      lokasi: 'Bandung',
      deskripsi: 'Penguasaan prinsip tipografi, hierarki informasi visual, dan standarisasi dokumen terbitan berkala menggunakan Adobe Creative Suite.'
    },
    {
      id: 'crs-3',
      nama_course: 'Strategi Komunikasi Krisis & Hubungan Media',
      penyelenggara: 'Asosiasi Praktisi Komunikasi Publik',
      tahun: '2022',
      lokasi: 'Yogyakarta',
      deskripsi: 'Studi kasus respon komunikasi cepat, penyusunan pernyataan resmi, dan simulasi konferensi pers.'
    }
  ],
  languages: [
    {
      id: 'lang-1',
      nama_bahasa: 'Bahasa Indonesia',
      level: 'Native'
    },
    {
      id: 'lang-2',
      nama_bahasa: 'Bahasa Inggris',
      level: 'Professional Working'
    },
    {
      id: 'lang-3',
      nama_bahasa: 'Bahasa Mandarin',
      level: 'Conversational'
    }
  ],
  contacts: [
    {
      id: 'cnt-1',
      jenis: 'whatsapp',
      value: 'https://wa.me/6281234567890'
    },
    {
      id: 'cnt-2',
      jenis: 'email',
      value: 'rania.amanda.work@example.com'
    },
    {
      id: 'cnt-3',
      jenis: 'instagram',
      value: 'https://instagram.com/rania.amanda'
    },
    {
      id: 'cnt-4',
      jenis: 'linkedin',
      value: 'https://linkedin.com/in/rania-amanda-pro'
    }
  ]
};
