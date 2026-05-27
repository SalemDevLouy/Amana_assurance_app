"use client"
import useAOS from '../../hooks/useAOS';
import Link from 'next/link';
import { FaArrowRight, FaShieldAlt } from 'react-icons/fa';

export default function FinalCTA() {
  useAOS();
  return (
    <section className="py-28 px-4">
      <div className="max-w-4xl mx-auto" data-aos="fade-up">
        <div className="relative bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl p-12 text-center overflow-hidden shadow-2xl shadow-blue-600/30">
          {/* Background decoration */}
          <div className="pointer-events-none absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 border border-white/30">
              <FaShieldAlt className="text-white text-xl" />
            </div>

            <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
              Your car deserves
              <br />
              smarter protection.
            </h2>
            <p className="text-blue-100 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Join thousands of Algerian drivers who manage their insurance digitally. Get your quote in under 10 minutes — no agency visit needed.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2.5 bg-white text-blue-600 px-8 py-4 rounded-2xl text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Get a Free Quote
                <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white border border-white/30 hover:border-white/60 px-8 py-4 rounded-2xl text-sm font-medium transition-all duration-300"
              >
                Sign In to My Account
              </Link>
            </div>

            <p className="text-blue-100/70 text-xs mt-8">
              No commitment required · Instant pricing · 100% digital
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
