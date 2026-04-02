"use client"
import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa';
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
    if (status !== 'authenticated' || !session?.user?.role) {
      return;
    }

    if (session.user.role === 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    let isCancelled = false;

    const resolveUserDestination = async () => {
      try {
        const profileCompleted = await getProfileStatusCached();

        if (!profileCompleted) {
          router.push('/main/profile?complete=1');
          return;
        }

        if (!isCancelled) {
          router.push('/main');
        }
      } catch {
        if (!isCancelled) {
          router.push('/main/profile?complete=1');
        }
      }
    };

    void resolveUserDestination();

    return () => {
      isCancelled = true;
    };
  }, [status, session, router]);

  const validateForm = (): FormErrorsLogin => {
    const newErrors: FormErrorsLogin = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email = 'Email requis';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Format email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Minimum 6 caractères';
    }

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
        setErrors({ general: signInData.error });
        setIsSubmitting(false);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrors({ general: error.message || 'Connexion échouée. Réessayez.' });
      } else {
        setErrors({ general: 'Une erreur inconnue est survenue.' });
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#ededed] overflow-hidden flex items-center justify-center px-4 py-20">
      <div className="pointer-events-none absolute -top-40 -left-40 w-[420px] h-[420px] rounded-full bg-blue-700/25 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[420px] h-[420px] rounded-full bg-cyan-600/20 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-cyan-200/5 backdrop-blur-xl shadow-2xl shadow-black/30 p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-blue-300 bg-blue-600/10 border border-blue-600/20 px-3 py-1.5 rounded-full mb-5">
            Bon retour
          </div>
          <h1 className="text-3xl font-extrabold text-gray">Connexion</h1>
          <p className="text-gray/45 text-sm mt-2">Accédez à votre espace Amana.</p>
        </div>

        {errors.general && (
          <p className="text-rose-300 border border-rose-400/30 bg-red-500/10 mb-5 text-sm text-center p-3 rounded-xl">
            {errors.general}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="flex items-center gap-2 text-gray/70 text-sm mb-2">
              <FaEnvelope className="text-cyan-400" />
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full rounded-xl border px-4 py-3 bg-white/5 text-gray placeholder:text-gray/30 focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all ${
                errors.email ? 'border-rose-500/60' : 'border-white/15'
              }`}
              placeholder="vous@email.com"
            />
            {errors.email && <p className="text-rose-300 text-xs mt-1.5">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="flex items-center gap-2 text-gray/70 text-sm mb-2">
              <FaLock className="text-cyan-400" />
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`w-full rounded-xl border px-4 py-3 bg-white/5 text-gray placeholder:text-gray/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all ${
                errors.password ? 'border-rose-500/60' : 'border-white/15'
              }`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-rose-300 text-xs mt-1.5">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full inline-flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-cyan-500 text-gray-500 px-4 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-blue-600/25 ${
              isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.02] hover:shadow-blue-600/40'
            }`}
          >
            {isSubmitting ? 'Connexion...' : 'Se connecter'}
            {!isSubmitting && <FaArrowRight className="text-xs" />}
          </button>
        </form>

        <p className="text-gray/45 text-sm text-center mt-6">
          Vous n&apos;avez pas de compte ?{' '}
          <Link href="/signup" className="text-blue-300 hover:text-blue-200 font-semibold transition-colors">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;