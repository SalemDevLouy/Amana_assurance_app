import BMCGenerator from '@/app/components/dashboard/BMCGenerator'
import React from 'react'
import { FaWandMagicSparkles } from 'react-icons/fa6'

export default function page() {
  return (
    <div className='min-h-screen bg-[#06060f]'>
      <div className='max-w-7xl mx-auto px-6 pt-28 pb-16'>
        <div className='mb-8'>
          <div className='inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-blue-300 bg-blue-600/10 border border-blue-600/20 px-3 py-1.5 rounded-full mb-4'>
            <FaWandMagicSparkles className='text-[10px]' />
            Générateur IA
          </div>

          <div className='flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4'>
            <div>
              <h1 className='text-3xl sm:text-4xl font-extrabold text-gray-500'>
                Créer un{' '}
                <span className='text-transparent bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text'>
                  Business Model Canvas
                </span>
              </h1>
              <p className='text-gray-500/45 text-sm sm:text-base mt-2 max-w-2xl'>
                Décrivez votre projet, répondez aux questions guidées, puis laissez Amana générer un canvas clair et structuré.
              </p>
            </div>

            <div className='rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-500/60 inline-flex items-center gap-3'>
              <span className='w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/20 to-cyan-500/20 border border-white/10 flex items-center justify-center'>
                <FaWandMagicSparkles className='text-blue-300' />
              </span>
              <span>Assistant interactif pour construire votre BMC étape par étape.</span>
            </div>
          </div>
        </div>

        <div className='rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/30 overflow-hidden'>
          <div className='h-px w-full bg-gradient-to-r from-transparent via-blue-600/40 to-transparent' />
          <div className='p-3 sm:p-5'>
            <BMCGenerator/>
          </div>
        </div>
      </div>
    </div>
  )
}
