"use client"
import useAOS from '../../hooks/useAOS';
import { FaShieldAlt, FaFileAlt, FaUserCheck, FaTools } from 'react-icons/fa';

const steps = [
  {
    number: '01',
    icon: FaShieldAlt,
    color: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    title: 'Choose Your Coverage',
    description:
      'Select your insurance type (third-party, full coverage, or commercial), pick a partner company, and enter your vehicle details.',
  },
  {
    number: '02',
    icon: FaFileAlt,
    color: 'from-cyan-500 to-cyan-600',
    bg: 'bg-cyan-50',
    title: 'Submit Your Documents',
    description:
      'Upload your ID, driving license, and vehicle registration. Our OCR system auto-fills your data — no manual typing needed.',
  },
  {
    number: '03',
    icon: FaUserCheck,
    color: 'from-emerald-500 to-emerald-600',
    bg: 'bg-emerald-50',
    title: 'Get AI-Scored & Pay',
    description:
      'Receive your personalized risk score and price instantly. Pay securely via card, Edahabia, or CIB — then download your contract.',
  },
  {
    number: '04',
    icon: FaTools,
    color: 'from-indigo-500 to-indigo-600',
    bg: 'bg-indigo-50',
    title: 'Declare & Track Claims',
    description:
      'In case of an accident, declare it from your phone with photos and GPS. Track expert review, garage repair, and status updates in real-time.',
  },
];

export default function HowItWorks() {
  useAOS();
  return (
    <section id="how-it-works" className="py-28 px-4">
      <div className="max-w-6xl mx-auto">

        <div className="text-center max-w-2xl mx-auto mb-16" data-aos="fade-up">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full mb-4">
            How It Works
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-800 leading-tight mb-4">
            Insured in{' '}
            <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
              4 simple steps.
            </span>
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            The entire insurance journey — from first quote to claim resolution — happens right here.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="relative bg-white/80 backdrop-blur-sm border border-gray-100 rounded-3xl p-7 hover:shadow-xl hover:shadow-blue-900/8 hover:-translate-y-1 transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay={i * 100}
            >
              {/* Step number */}
              <span className="absolute top-5 right-6 text-4xl font-black text-gray-100 select-none">
                {step.number}
              </span>

              {/* Icon */}
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-5 shadow-md`}>
                <step.icon className="text-white text-base" />
              </div>

              <h3 className="text-base font-bold text-gray-800 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>

              {/* Connector line for desktop */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-11 -right-3 w-6 h-px bg-gradient-to-r from-gray-200 to-transparent z-10" />
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
