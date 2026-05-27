"use client"
import useAOS from '../../hooks/useAOS';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

const testimonials = [
  {
    name: 'Karim Benali',
    role: 'Private Driver · Algiers',
    avatar: 'KB',
    color: 'from-blue-500 to-cyan-500',
    rating: 5,
    quote:
      'I subscribed to full coverage in 8 minutes from my phone. The AI gave me a better price than what I had at the agency. The contract arrived as a PDF instantly.',
  },
  {
    name: 'Samira Hadj',
    role: 'Business Owner · Oran',
    avatar: 'SH',
    color: 'from-emerald-500 to-teal-500',
    rating: 5,
    quote:
      'After my accident, I just opened the app, took photos, and the expert was assigned within the hour. The garage tracking was incredibly reassuring.',
  },
  {
    name: 'Mohamed Chérif',
    role: 'Taxi Driver · Constantine',
    avatar: 'MC',
    color: 'from-indigo-500 to-purple-500',
    rating: 5,
    quote:
      'As a professional driver, I need reliable insurance. Amaneka covers my commercial vehicle and the claim process is 10x faster than before. No more waiting.',
  },
];

export default function Testimonials() {
  useAOS();
  return (
    <section className="py-28 px-4">
      <div className="max-w-6xl mx-auto">

        <div className="text-center max-w-2xl mx-auto mb-16" data-aos="fade-up">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full mb-4">
            Customer Stories
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-800 leading-tight mb-4">
            Trusted by drivers
            <span className="bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent"> across Algeria.</span>
          </h2>
          <p className="text-gray-500 text-lg">Real people, real claims, real results.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-3xl p-7 hover:shadow-xl hover:shadow-blue-900/8 hover:-translate-y-1 transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay={i * 100}
            >
              <FaQuoteLeft className="text-blue-100 text-3xl mb-4" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <FaStar key={j} className="text-amber-400 text-xs" />
                ))}
              </div>

              <p className="text-sm text-gray-600 leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
