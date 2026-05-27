'use client'
import { useState } from 'react'
import useAOS from '../../hooks/useAOS';
import { FaChevronDown } from 'react-icons/fa';

const faqs = [
  {
    q: 'What types of auto insurance does Amaneka offer?',
    a: 'We offer three coverage types: Third-Party (RC), Full Coverage (Tous Risques), and Commercial Vehicle insurance. You can compare them and simulate your price before subscribing.',
  },
  {
    q: 'Which insurance companies are available on the platform?',
    a: 'We currently partner with major Algerian insurers including SAA, CAAT, and CASH Assurance. You can compare pricing, coverage details, and ratings before choosing.',
  },
  {
    q: 'How does the AI risk score work?',
    a: 'Our AI model evaluates your driver age, vehicle type, annual mileage, driving history, and region to compute a risk score. This score determines your personalized premium — safer drivers pay less.',
  },
  {
    q: 'How do I declare an accident?',
    a: 'Open the app, tap "Declare Accident", and follow the guided steps: capture location via GPS, upload photos of the damage, fill in the digital constat form, and optionally request a towing service. A regional expert is assigned automatically.',
  },
  {
    q: 'How long does claim processing take?',
    a: 'Most claims are reviewed within 24–48 hours. Once the expert validates your case, a partner garage is assigned and you can track every repair stage in real-time inside the app.',
  },
  {
    q: 'Is my data secure?',
    a: 'Absolutely. Amaneka uses JWT authentication, encrypted storage, and role-based access control. All documents are stored securely on cloud infrastructure. We are fully GDPR-compliant.',
  },
];

export default function FAQ() {
  useAOS();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-28 px-4">
      <div className="max-w-3xl mx-auto">

        <div className="text-center mb-16" data-aos="fade-up">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-cyan-600 bg-cyan-50 border border-cyan-100 px-3 py-1 rounded-full mb-4">
            FAQ
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-800 leading-tight mb-4">
            Common{' '}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              questions.
            </span>
          </h2>
          <p className="text-gray-500 text-lg">Everything you need to know before getting started.</p>
        </div>

        <div className="space-y-3" data-aos="fade-up" data-aos-delay="100">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl overflow-hidden transition-all duration-200 hover:border-blue-100"
            >
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="text-sm font-semibold text-gray-700">{faq.q}</span>
                <FaChevronDown
                  className={`shrink-0 text-blue-400 text-xs transition-transform duration-300 ${
                    open === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  open === i ? 'max-h-40 pb-5' : 'max-h-0'
                }`}
              >
                <p className="px-6 text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
