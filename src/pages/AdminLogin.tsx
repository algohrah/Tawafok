import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck, Eye, EyeOff, LogIn } from 'lucide-react';
import { verifyLocalAdmin } from '../lib/adminAuth';
import { useApp } from '../lib/AppContext';

const ADMIN_EMAIL = 'admin@tawafok.com';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { loginWithSession, showToast } = useApp();
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const ok = await verifyLocalAdmin(ADMIN_EMAIL, password);
      if (!ok) {
        setError('كلمة المرور غير صحيحة.');
        setLoading(false);
        return;
      }
      localStorage.setItem('twafok_demo_admin', 'true');
      localStorage.setItem('twafok_active_admin_email', ADMIN_EMAIL);
      loginWithSession({
        id: 'admin-1',
        nickname: 'المدير العام',
        email: ADMIN_EMAIL,
        verified: true,
        plan: 'featured',
      } as any, ADMIN_EMAIL);
      showToast('مرحباً بك في لوحة الإدارة', 'success');
      navigate('/admin');
    } catch (err: any) {
      setError(err?.message || 'حدث خطأ، حاول مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-950 p-4" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
            <ShieldCheck className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="font-cairo font-extrabold text-2xl text-navy-900">لوحة الإدارة</h1>
          <p className="text-sm text-slate-500 font-tajawal mt-1">ادخل كلمة مرور المدير للمتابعة</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-3 text-sm font-tajawal text-center">
              {error}
            </div>
          )}

          <div className="text-center text-xs text-slate-400 font-tajawal bg-slate-50 rounded-xl py-2 px-3">
            {ADMIN_EMAIL}
          </div>

          <div className="relative">
            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type={showPass ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pr-12 pl-12 py-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-amber-500 focus:outline-none font-tajawal text-navy-900 transition-colors"
              dir="ltr"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-cairo font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <LogIn className="w-5 h-5" />
            {loading ? 'جارٍ الدخول...' : 'دخول للوحة الإدارة'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
