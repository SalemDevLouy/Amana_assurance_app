'use client';
import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {  BMCViewerProps } from '@/app/types/types';
import { FaDownload, FaFileLines } from 'react-icons/fa6';

export default function BMCViewer({ data ,projectName}: BMCViewerProps) {
  const bmcRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving] = useState(false);

  const downloadPDF = async () => {
    setError(null);

    const element = bmcRef.current;
    if (!element) {
      setError('Failed to capture BMC content');
      return;
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a3',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${projectName || 'bmc'}_BMC.pdf`);
  };

  if (!data) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
        <p className="text-gray-500/40">Aucune donnée BMC disponible.</p>
      </div>
    );
  }

  const renderBlock = (title: string, items: string[]) => (
    <>
      <h3 className="font-bold mb-3 text-sm uppercase tracking-wide text-slate-700">{title}</h3>
      {items && items.length > 0 ? (
        items.map((item, index) => (
          <div key={index} className="mb-2 leading-relaxed text-slate-700">
            • {item}
          </div>
        ))
      ) : (
        <div className="text-slate-400 italic">Aucune donnée</div>
      )}
    </>
  );

  return (
    <div className="space-y-5">
      {error && (
        <div className="text-rose-300 border border-rose-400/20 bg-rose-500/10 rounded-2xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600/20 to-cyan-500/20 border border-white/10 flex items-center justify-center">
            <FaFileLines className="text-cyan-300" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-semibold">{projectName || 'Business Model Canvas'}</p>
            <p className="text-gray-500/40 text-xs">Version prête pour consultation et export PDF.</p>
          </div>
        </div>

        <button
          onClick={downloadPDF}
          disabled={isSaving}
          className={`inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-gray-500 rounded-xl font-semibold shadow-lg shadow-blue-600/20 transition-all duration-200 ${
            isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] hover:shadow-blue-600/35'
          }`}
        >
          <FaDownload className="text-sm" />
          {isSaving ? 'Téléchargement...' : 'Télécharger en PDF'}
        </button>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-xl shadow-2xl shadow-black/25 overflow-x-auto">
        <div ref={bmcRef} className="min-w-[1100px]">
          <div className="bg-white border border-slate-200 flex flex-col justify-center items-center rounded-2xl overflow-hidden shadow-xl">
            <div className="w-full px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-xl font-bold text-center text-slate-800">
                Business Model Canvas: {projectName}
              </h2>
            </div>

            <div className="grid grid-cols-5 grid-rows-3 text-sm w-full">
              <div className="row-span-2 border p-3 border-slate-200 bg-white min-h-[220px]">
                {renderBlock('Key Partners', data.KeyPartners)}
              </div>
              <div className="border p-3 border-slate-200 bg-slate-50/60 min-h-[110px]">
                {renderBlock('Key Activities', data.KeyActivities)}
              </div>
              <div className="col-start-2 row-start-2 border p-3 border-slate-200 bg-white min-h-[110px]">
                {renderBlock('Key Resources', data.KeyResources)}
              </div>
              <div className="row-span-2 col-start-3 row-start-1 border p-3 border-slate-200 bg-slate-50/60 min-h-[220px]">
                {renderBlock('Value Propositions', data.ValuePropositions)}
              </div>
              <div className="col-start-4 row-start-1 border p-3 border-slate-200 bg-white min-h-[110px]">
                {renderBlock('Customer Relationships', data.CustomerRelationships)}
              </div>
              <div className="col-start-4 row-start-2 border p-3 border-slate-200 bg-slate-50/60 min-h-[110px]">
                {renderBlock('Channels', data.Channels)}
              </div>
              <div className="row-span-2 col-start-5 row-start-1 border p-3 border-slate-200 bg-white min-h-[220px]">
                {renderBlock('Customer Segments', data.CustomerSegments)}
              </div>
              <div className="bmc-section col-span-3 row-start-3 border p-3 border-slate-200 bg-slate-50/60 min-h-[140px]">
                {renderBlock('Cost Structure', data.CostStructure)}
              </div>
              <div className="bmc-section col-span-2 col-start-4 row-start-3 border p-3 border-slate-200 bg-white min-h-[140px]">
                {renderBlock('Revenue Streams', data.RevenueStreams)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}