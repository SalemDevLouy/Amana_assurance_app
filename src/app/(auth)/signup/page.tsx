'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { SignupFormData, FormErrors } from '@/app/types/types';
import Link from 'next/link';
import { FaArrowRight, FaEnvelope, FaLock, FaUser, FaShieldAlt } from 'react-icons/fa';
import { signIn } from 'next-auth/react';

const SignupForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [errorsps, setErrorsps] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): { fieldErrors: FormErrors; passwordErrors: string[] } => {
    const newErrors: FormErrors = {};
    const passwordErrors: string[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name) newErrors.name = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) passwordErrors.push('Password is required');
    else if (formData.password.length < 6) passwordErrors.push('Password must be at least 6 characters');
    if (!formData.confirmPassword) passwordErrors.push('Please confirm your password');
    else if (formData.password !== formData.confirmPassword) passwordErrors.push('Passwords do not match');

    return { fieldErrors: newErrors, passwordErrors };
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setErrorsps([]);
    setIsSubmitting(true);

    const { fieldErrors, passwordErrors } = validateForm();
    if (Object.keys(fieldErrors).length > 0 || passwordErrors.length > 0) {
      setErrors(fieldErrors);
      setErrorsps(passwordErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.message || 'Signup failed');

      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        throw new Error('Account created, but auto sign-in failed. Please sign in manually.');
      }

      router.push('/main/profile?complete=1&welcome=1');
    } catch (error: unknown) {
      setErrors({ general: error instanceof Error ? error.message : 'An unknown error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full rounded-2xl border px-4 py-3 bg-gray-50 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 focus:bg-white transition-all text-sm ${
      hasError ? 'border-rose-300 bg-rose-50' : 'border-gray-200'
    }`;

  return (
    <div className="relative min-h-screen bg-[#f4f6fb] overflow-hidden flex items-center justify-center px-4 py-20">
      <div className="pointer-events-none absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-cyan-400/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[100px]" />

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
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full mb-4">
              Get started for free
            </span>
            <h1 className="text-2xl font-extrabold text-gray-800">Create your account</h1>
            <p className="text-sm text-gray-500 mt-1.5">Join thousands of Algerian drivers on Amaneka.</p>
          </div>

          {errors.general && (
            <div className="mb-5 flex items-start gap-3 text-sm text-rose-700 border border-rose-200 bg-rose-50 p-3.5 rounded-2xl">
              <span className="mt-0.5">⚠</span>
              {errors.general}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                <FaUser className="text-blue-500 text-xs" />
                Full name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={inputClass(!!errors.name)}
                placeholder="Your full name"
              />
              {errors.name && <p className="text-rose-500 text-xs mt-1.5">{errors.name}</p>}
            </div>

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
                className={inputClass(!!errors.email)}
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-rose-500 text-xs mt-1.5">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                <FaLock className="text-blue-500 text-xs" />
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={inputClass(false)}
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                <FaLock className="text-cyan-500 text-xs" />
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className={inputClass(false)}
                placeholder="••••••••"
              />
            </div>

            {errorsps.length > 0 && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
                <ul className="list-disc pl-4 text-rose-600 text-xs space-y-1">
                  {errorsps.map((error, i) => <li key={i}>{error}</li>)}
                </ul>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-3.5 rounded-2xl text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all duration-300 mt-2 ${
                isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.02] hover:shadow-blue-500/40'
              }`}
            >
              {isSubmitting ? 'Creating account...' : 'Create Account'}
              {!isSubmitting && <FaArrowRight className="text-xs" />}
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
              By creating an account you agree to our{' '}
              <Link href="/terms" className="text-blue-500 hover:underline">Terms</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</Link>.
            </p>
          </form>

          <p className="text-sm text-gray-500 text-center mt-5">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
              Sign in
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

export default SignupForm;
