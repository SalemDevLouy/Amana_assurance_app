"use client"
import useAOS from '../../hooks/useAOS';
import { FaShieldAlt, FaBrain, FaCar, FaCamera, FaTools, FaMapMarkerAlt } from 'react-icons/fa';

const features = [
  {
    icon: FaShieldAlt,
    color: 'bg-blue-50 text-blue-600',
    ring: 'ring-blue-100',
    title: 'Digital Subscription',
    description:
      'Subscribe to auto insurance in minutes — select coverage, upload documents, and receive your PDF contract with a verification QR code.',
  },
  {
    icon: FaBrain,
    color: 'bg-emerald-50 text-emerald-600',
    ring: 'ring-emerald-100',
    title: 'AI Risk Evaluation',
    description:
      'Our AI model analyzes your driver profile, vehicle type, mileage, and history to deliver a precise risk score and the best pricing for you.',
  },
  {
    icon: FaCamera,
    color: 'bg-cyan-50 text-cyan-600',
    ring: 'ring-cyan-100',
    title: 'Smart Accident Declaration',
    description:
      'Declare accidents from your phone with GPS capture, photo upload, and AI damage detection — no paperwork, no agency visits.',
  },
  {
    icon: FaCar,
    color: 'bg-indigo-50 text-indigo-600',
    ring: 'ring-indigo-100',
    title: 'Real-time Repair Tracking',
    description:
      "Follow your vehicle's repair progress live — from expert inspection to parts delivery and garage completion.",
  },
  {
    icon: FaTools,
    color: 'bg-orange-50 text-orange-600',
    ring: 'ring-orange-100',
    title: 'Partner Garage Network',
    description:
      'Get automatically matched with the nearest certified repair garage. Approved budgets and work orders handled digitally.',
  },
  {
    icon: FaMapMarkerAlt,
    color: 'bg-rose-50 text-rose-600',
    ring: 'ring-rose-100',
    title: 'Emergency Towing',
    description:
      'Request roadside assistance instantly. We locate the nearest towing partner and track their arrival in real-time on the map.',
  },
];

export default function Features() {
  useAOS();
  return (
    <section id="features" className="py-28 px-4">
      <div className="max-w-6xl mx-auto">

        <div className="text-center max-w-2xl mx-auto mb-16" data-aos="fade-up">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full mb-4">
            Platform Features
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-800 leading-tight mb-4">
            Everything your insurance
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent"> needs.</span>
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            From subscription to claim resolution — Amaneka handles the entire lifecycle of your auto insurance digitally.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group bg-white/80 backdrop-blur-sm border border-gray-100 rounded-3xl p-7 hover:shadow-xl hover:shadow-blue-900/8 hover:-translate-y-1 transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay={i * 80}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ring-4 ${f.color} ${f.ring} mb-5`}>
                <f.icon className="text-lg" />
              </div>
              <h3 className="text-base font-bold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
