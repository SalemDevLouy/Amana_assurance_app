'use client';
import useAOS from '@/app/hooks/useAOS';
import Link from 'next/link';
import Footer from '../components/UI/Footer';
import { FaShieldAlt, FaRocket, FaMapMarkerAlt, FaArrowRight, FaUsers, FaBrain, FaCar } from 'react-icons/fa';

const values = [
  {
    icon: FaShieldAlt,
    color: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    title: 'Our Mission',
    description: 'We make auto insurance accessible, transparent, and fast for every driver in Algeria — from subscription to claim resolution, all from a single digital space.',
  },
  {
    icon: FaRocket,
    color: 'from-cyan-500 to-blue-500',
    bg: 'bg-cyan-50',
    border: 'border-cyan-100',
    title: 'Our Vision',
    description: 'We aim to make Amaneka the leading insurtech platform in Algeria — where AI-powered tools eliminate bureaucracy and give every driver the modern experience they deserve.',
  },
  {
    icon: FaMapMarkerAlt,
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    title: 'Built for Algeria',
    description: 'Amaneka is designed around Algerian insurance regulations, partnering with SAA, CAAT, and CASH Assurance to deliver locally compliant, fully digital coverage.',
  },
];

const team = [
  { name: 'Amani.C', role: 'CEO & Co-Founder', avatar: 'AC', color: 'from-blue-500 to-cyan-500' },
  { name: 'Hadjer.G', role: 'CEO & Co-Founder', avatar: 'HG', color: 'from-indigo-500 to-purple-500' },
  { name: 'Salem.L', role: 'CTO', avatar: 'SL', color: 'from-emerald-500 to-teal-500' },
];

export default function AboutPage() {
  useAOS();
  return (
    <div className="min-h-screen bg-[#f4f6fb] font-sans overflow-x-hidden">

      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden pt-24 pb-20 px-4">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-blue-500/10 blur-[140px]" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-blue-100 text-blue-600 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-8 shadow-sm">
            <FaUsers className="text-xs" />
            Our Story
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-800 leading-tight mb-6">
            About{' '}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Amaneka
            </span>
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
            A digital insurance platform born in Algeria, built to replace every paper form and agency visit with a seamless, AI-powered experience for drivers.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-gray-100 py-12 px-4">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-6 text-center">
          {[
            { value: '500+', label: 'Insured Clients' },
            { value: '1K+', label: 'Claims Processed' },
            { value: '100%', label: 'Digital Journey' },
          ].map((s) => (
            <div key={s.label} data-aos="fade-up">
              <p className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">{s.value}</p>
              <p className="text-xs text-gray-400 uppercase tracking-widest mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-4 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14" data-aos="fade-up">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full mb-4">
              Our Values
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-800 leading-tight mb-4">
              What{' '}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                drives us
              </span>
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Our commitments to every driver who trusts Amaneka with their insurance.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <div
                key={v.title}
                className={`bg-white/80 border rounded-3xl p-7 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/8 transition-all duration-300 ${v.border}`}
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${v.color} flex items-center justify-center mb-5 shadow-md`}>
                  <v.icon className="text-white text-base" />
                </div>
                <h3 className="text-base font-bold text-gray-800 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How AI powers us */}
      <section className="py-24 px-4 border-t border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full mb-4">
              Technology
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 leading-tight mb-4">
              AI at the core of everything
            </h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              Amaneka uses machine learning and computer vision to automate the most painful parts of insurance — from pricing to fraud detection.
            </p>
            <ul className="space-y-3">
              {[
                { icon: FaBrain, text: 'AI Risk Scoring — personalized premiums based on your driving profile' },
                { icon: FaCar, text: 'Damage Detection — computer vision analyzes accident photos in seconds' },
                { icon: FaShieldAlt, text: 'Fraud Prevention — pattern recognition flags suspicious claims automatically' },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-3 text-sm text-gray-600">
                  <div className="w-7 h-7 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon className="text-blue-600 text-xs" />
                  </div>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4" data-aos="fade-left">
            {[
              { label: "AI Risk Score", value: "< 3s", sub: "Average scoring time" },
              { label: "Fraud Detection", value: "94%", sub: "Accuracy rate" },
              { label: "Claim Processing", value: "48h", sub: "Average resolution" },
              { label: "Customer Satisfaction", value: "4.8★", sub: "Average rating" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/80 border border-gray-100 rounded-3xl p-5 shadow-sm">
                <p className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">{stat.value}</p>
                <p className="text-xs font-bold text-gray-700 mt-1">{stat.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-4 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center mb-12" data-aos="fade-up">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full mb-4">
            Team
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800">The people behind Amaneka</h2>
        </div>
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5">
          {team.map((member, i) => (
            <div
              key={member.name}
              className="bg-white/80 border border-gray-100 rounded-3xl p-6 text-center shadow-sm hover:-translate-y-1 transition-transform"
              data-aos="fade-up"
              data-aos-delay={i * 100}
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-xl font-extrabold mx-auto mb-4`}>
                {member.avatar}
              </div>
              <p className="text-sm font-bold text-gray-800">{member.name}</p>
              <p className="text-xs text-gray-500 mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-24 px-4 border-t border-gray-100 text-center">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-[600px] h-[300px] rounded-full bg-blue-500/8 blur-[120px]" />
        <div className="relative z-10 max-w-2xl mx-auto" data-aos="fade-up">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 leading-tight mb-4">
            Ready to experience{' '}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              modern insurance?
            </span>
          </h2>
          <p className="text-gray-500 text-base mb-8 max-w-lg mx-auto">
            Join hundreds of Algerian drivers who manage their auto insurance entirely online. Get your quote in minutes.
          </p>
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-2xl text-sm font-bold shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300"
          >
            Get a Free Quote
            <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
