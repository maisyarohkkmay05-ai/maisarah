import React, { useState } from 'react';
import { Lock, Mail, AlertCircle, CheckCircle2, ShieldCheck, ArrowLeft, KeyRound, Sparkles, HelpCircle } from 'lucide-react';
import { loginAdmin, loginDemoAdmin } from '../../lib/auth';
import { isSupabaseConfigured, SUPABASE_URL } from '../../lib/supabase';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToHome }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isConfigured = isSupabaseConfigured();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await loginAdmin(email, password);
      if (res.success) {
        onLoginSuccess();
      } else {
        setErrorMsg(res.error || 'Gagal masuk. Periksa kembali email dan kata sandi Anda.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem saat mencoba login.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await loginDemoAdmin();
      onLoginSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-slate-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Kembali ke Beranda Portofolio
        </button>

        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
            <Lock className="w-6 h-6" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Masuk Dashboard Admin
        </h2>
        <p className="mt-2 text-center text-xs sm:text-sm text-slate-600">
          Kelola seluruh data portofolio, keahlian, dan konten pribadi
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-5 sm:px-10 shadow-sm border border-slate-200 rounded-2xl">
          {/* Status Supabase Auth */}
          <div className="mb-6 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800">
                {isConfigured ? 'Terhubung dengan Supabase Auth' : 'Mode Demo & Pratinjau Aktif'}
              </p>
              <p className="mt-1 text-slate-500 leading-relaxed">
                {isConfigured
                  ? 'Gunakan akun admin yang didaftarkan di Supabase Dashboard (menu Authentication > Users).'
                  : 'Supabase URL belum diatur di .env. Anda dapat masuk langsung menggunakan mode demo di bawah.'}
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span className="font-medium">{errorMsg}</span>
              </div>
              {errorMsg.toLowerCase().includes('confirm') && (
                <p className="text-xs text-red-600 bg-red-100/60 p-2 rounded-lg">
                  💡 <strong>Solusi:</strong> Di Supabase Dashboard, buka <em>Authentication &gt; Users</em>, klik titik tiga di samping user Anda, lalu pilih <em>Confirm User</em> agar tidak perlu membuka link email.
                </p>
              )}
              {errorMsg.toLowerCase().includes('invalid') && (
                <p className="text-xs text-red-600 bg-red-100/60 p-2 rounded-lg">
                  💡 <strong>Solusi:</strong> Pastikan user sudah dibuat di Supabase Dashboard (<em>Authentication &gt; Users &gt; Add User &gt; Create User</em> dengan opsi <em>Auto Confirm User</em> dicentang).
                </p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Alamat Email
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="block w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Kata Sandi
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
            </div>

            <button
              id="admin-login-submit"
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-xs text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Memvalidasi...' : 'Masuk ke Dashboard'}
            </button>
          </form>

          {/* Opsi Mode Demo / Bypass */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-xs font-medium text-slate-600 transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5 text-slate-500" />
              Masuk Mode Pratinjau / Bypass Langsung
            </button>
          </div>

          {/* Petunjuk Akses */}
          <div className="mt-5 p-3 rounded-lg bg-blue-50/70 border border-blue-100 text-[11px] text-blue-900/80 space-y-1">
            <p className="font-semibold text-blue-950 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
              Cara Mengakses Halaman Ini Kapan Saja:
            </p>
            <p>• Buka URL: <code>/admin</code>, <code>/login</code>, atau <code>#/admin</code></p>
            <p>• Tekan tombol <code>Ctrl + Shift + A</code> di keyboard pada halaman utama</p>
            <p>• Klik teks hak cipta (copyright) pada bagian paling bawah halaman</p>
          </div>
        </div>
      </div>
    </div>
  );
};
