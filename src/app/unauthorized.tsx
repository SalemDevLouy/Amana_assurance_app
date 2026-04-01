"use client"
import useAOS from '@/app/hooks/useAOS';
import Link from 'next/link';

export default function Page() {
  useAOS();
  return (
    <div className="min-h-screen bg-linear-to-br from-green-100 via-blue-100 to-purple-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-center ">
        <div className="lg:w-full text-center space-y-6 flex flex-col gap-4 items-center justify-center">
          <h1 
            className="text-2xl sm:text-5xl lg:text-5xl font-extrabold text-gray-900 tracking-tight" 
            data-aos="fade-up"
          >
            <span className="block text-5xl md:text-6xl bg-linear-to-r pb-2 from-blue-600 to-cyan-500 bg-clip-text text-transparent">Amana </span>
            <span className="block text-2xl md:text-5xl   bg-linear-to-r pb-2 from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            401 - Accès non autorisé
            </span>
          </h1>
          
          <div 
            className="flex justify-center lg:justify-start gap-4"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <Link
              href="/"
              className="inline-block bg-linear-to-r from-blue-600 to-cyan-500 text-gray-500 px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-700 transition duration-300 shadow-lg"
            >
                Retour à l&apos;accueil
            </Link>
            
          </div>
        </div>
        
      </div>
    </div>
  )
}