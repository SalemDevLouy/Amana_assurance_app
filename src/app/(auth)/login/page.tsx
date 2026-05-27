"use client"
import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaEnvelope, FaLock, FaArrowRight, FaShieldAlt } from 'react-icons/fa';
import { signIn, useSession } from "next-auth/react";
import { FormErrorsLogin, LoginFormData } from '@/app/types/types';
import { getProfileStatusCached } from '@/app/lib/clientCache';

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  const [errors, setErrors] = useState<FormErrorsLogin>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.role) return;

    if (session.user.role === 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    let isCancelled = false;

    const resolveUserDestination = async () => {
      try {
        const profileCompleted = await getProfileStatusCached();
        if (!profileCompleted) { router.push('/main/profile?complete=1'); return; }
        if (!isCancelled) router.push('/main');
      } catch {
        if (!isCancelled) router.push('/main/profile?complete=1');
      }
    };

    void resolveUserDestination();
    return () => { isCancelled = true; };
  }, [status, session, router]);

  const validateForm = (): FormErrorsLogin => {
    const newErrors: FormErrorsLogin = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Minimum 6 characters';
    return newErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const signInData = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });
      if (signInData?.error) {
        setErrors({ general: 'Invalid email or password. Please try again.' });
        setIsSubmitting(false);
      }
    } catch (error: unknown) {
      setErrors({ general: error instanceof Error ? error.message : 'Sign in failed. Please try again.' });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#f4f6fb] overflow-hidden flex items-center justify-center px-4 py-20">
      {/* Gradient orbs */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-cyan-400/10 blur-[100px]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <FaShieldAlt className="text-white text-sm" />
            </div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent tracking-tight">
              Amaneka
            </span>
          </Link>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-2xl shadow-blue-900/8 p-8 sm:p-10">
          <div className="mb-8">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full mb-4">
              Welcome back
            </span>
            <h1 className="text-2xl font-extrabold text-gray-800">Sign in to your account</h1>
            <p className="text-sm text-gray-500 mt-1.5">Access your insurance dashboard and policies.</p>
          </div>

          {errors.general && (
            <div className="mb-5 flex items-start gap-3 text-sm text-rose-700 border border-rose-200 bg-rose-50 p-3.5 rounded-2xl">
              <span className="mt-0.5">⚠</span>
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                <FaEnvelope className="text-blue-500 text-xs" />
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full rounded-2xl border px-4 py-3 bg-gray-50 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 focus:bg-white transition-all text-sm ${
                  errors.email ? 'border-rose-300 bg-rose-50' : 'border-gray-200'
                }`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-rose-500 text-xs mt-1.5">{errors.email}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <FaLock className="text-blue-500 text-xs" />
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-blue-500 hover:text-blue-600 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full rounded-2xl border px-4 py-3 bg-gray-50 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 focus:bg-white transition-all text-sm ${
                  errors.password ? 'border-rose-300 bg-rose-50' : 'border-gray-200'
                }`}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-rose-500 text-xs mt-1.5">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-3.5 rounded-2xl text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all duration-300 ${
                isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.02] hover:shadow-blue-500/40'
              }`}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
              {!isSubmitting && <FaArrowRight className="text-xs" />}
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
              Create one for free
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Protected by Amaneka · Your data is encrypted
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
