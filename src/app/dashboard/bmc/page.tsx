"use client"
import React from 'react'
import dynamic from 'next/dynamic';
const QuestionsTable = dynamic(() => import('@/app/components/UI/QuestionsTable'), { ssr: false });

export default function page() {
  return (
    <div>
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-blue-300 bg-blue-600/10 border border-blue-600/20 px-3 py-1.5 rounded-full mb-3">
          Administration
        </div>
        <h1 className="text-2xl font-extrabold text-gray-500">
          Gestion des{' '}
          <span className="text-transparent bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text">questions BMC</span>
        </h1>
        <p className="text-gray-500/40 text-sm mt-1">Ajoutez, modifiez ou supprimez les questions du canvas.</p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden p-4">
        <QuestionsTable />
      </div>
    </div>
  )
}
