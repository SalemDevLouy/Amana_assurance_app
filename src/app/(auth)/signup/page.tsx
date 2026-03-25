'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { SignupFormData, FormErrors } from '@/app/types/types';
import Link from 'next/link';
import { FaArrowRight, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';

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

    if (!formData.name) {
      newErrors.name = 'Nom requis';
    }

    if (!formData.email) {
      newErrors.email = 'Email requis';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Format email invalide';
    }

    if (!formData.password) {
      passwordErrors.push('Mot de passe requis');
    } else if (formData.password.length < 6) {
      passwordErrors.push('Le mot de passe doit contenir au moins 6 caractères');
    }

    if (!formData.confirmPassword) {
      passwordErrors.push('Confirmation du mot de passe requise');
    } else if (formData.password !== formData.confirmPassword) {
      passwordErrors.push('Les mots de passe ne correspondent pas');
    }

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
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Signup failed');

      router.push('/login');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: 'An unknown error occurred. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#06060f] overflow-hidden flex items-center justify-center px-4 py-20">
      <div className="pointer-events-none absolute -top-40 -left-40 w-[420px] h-[420px] rounded-full bg-blue-700/25 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[420px] h-[420px] rounded-full bg-cyan-600/20 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/30 p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-full mb-5">
            Créer un compte
          </div>
          <h1 className="text-3xl font-extrabold text-gray-500">Inscription</h1>
          <p className="text-gray-500/45 text-sm mt-2">Rejoignez Amana en quelques secondes.</p>
        </div>

        {errors.general && (
          <p className="text-rose-300 border border-rose-400/30 bg-rose-500/10 mb-5 text-sm text-center p-3 rounded-xl">
            {errors.general}
          </p>
        )}

        <form
          className="space-y-5"
          onSubmit={handleSubmit}
        >
          <div>
            <label htmlFor="name" className="flex items-center gap-2 text-gray-500/70 text-sm mb-2">
              <FaUser className="text-blue-500" />
              Nom complet
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full rounded-xl border px-4 py-3 bg-white/5 text-gray-500 placeholder:text-gray-500/30 focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all ${
                errors.name ? 'border-rose-500/60' : 'border-white/15'
              }`}
              placeholder="Votre nom"
            />
            {errors.name && <p className="text-rose-300 text-xs mt-1.5">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="flex items-center gap-2 text-gray-500/70 text-sm mb-2">
              <FaEnvelope className="text-cyan-400" />
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full rounded-xl border px-4 py-3 bg-white/5 text-gray-500 placeholder:text-gray-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all ${
                errors.email ? 'border-rose-500/60' : 'border-white/15'
              }`}
              placeholder="vous@email.com"
            />
            {errors.email && <p className="text-rose-300 text-xs mt-1.5">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="flex items-center gap-2 text-gray-500/70 text-sm mb-2">
              <FaLock className="text-blue-500" />
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full rounded-xl border border-white/15 px-4 py-3 bg-white/5 text-gray-500 placeholder:text-gray-500/30 focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="flex items-center gap-2 text-gray-500/70 text-sm mb-2">
              <FaLock className="text-cyan-400" />
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full rounded-xl border border-white/15 px-4 py-3 bg-white/5 text-gray-500 placeholder:text-gray-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              placeholder="••••••••"
            />
          </div>

          {errorsps.length > 0 && (
            <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3">
              <ul className="list-disc pl-5 text-rose-300 text-xs space-y-1">
                {errorsps.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-gray-500 px-4 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-blue-600/25 ${
              isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.02] hover:shadow-blue-600/40'
            }`}
          >
            {isSubmitting ? 'Inscription...' : 'Créer un compte'}
            {!isSubmitting && <FaArrowRight className="text-xs" />}
          </button>

          <div className="text-sm text-gray-500/45 text-center mt-5">
            Vous avez déjà un compte ?{' '}
            <Link href="/login" className="text-blue-300 hover:text-blue-200 font-semibold transition-colors">
              Connectez-vous ici
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
