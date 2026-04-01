'use client';

import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { BMCData, BMCViewerProps } from '@/app/types/types';
import { useRouter } from 'next/navigation';

export default function BMCPdfViewer({ data, userId }: BMCViewerProps) {
  const bmcRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const saveData = async ({ data }: BMCViewerProps) => {
    if (!data || !userId) {
      const message = 'Data and user ID are required to save BMC';
      setError(message);
      console.error(message, { data, userId });
      return;
    }

    // Validate BMC fields
    const requiredFields: (keyof BMCData)[] = [
      'KeyPartners',
      'KeyActivities',
      'KeyResources',
      'ValuePropositions',
      'CustomerRelationships',
      'Channels',
      'CustomerSegments',
      'CostStructure',
      'RevenueStreams',
    ];
    for (const field of requiredFields) {
      if (!data[field] || !Array.isArray(data[field])) {
        const message = `Field ${field} is required and must be an array`;
        setError(message);
        console.error(message, { field, value: data[field] });
        return;
      }
    }

    setIsSaving(true);
    try {
      console.log('Sending BMC data:', JSON.stringify(data, null, 2));
      const response = await fetch('/api/bmcresults', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'userId': userId,
        },
        body: JSON.stringify({ ...data, userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error response:', errorData);
        throw new Error(errorData.error || 'Failed to save BMC data');
      }

      const result = await response.json();
      console.log('BMC data saved successfully:', result);
      setError(null);
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save BMC data';
      console.error('Error saving BMC data:', { error, data });
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const downloadPDF = async () => {
    setError(null);
    const result = await saveData({ data });
    if (!result) return;

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
    pdf.save(`${data?.projectName || 'bmc'}_BMC.pdf`);
    router.push('/main'); // Redirect to workspace after download

  };

  if (!data) return <p className="text-gray-500">Start generating your BMC</p>;

  const renderBlock = (title: string, items: string[]) => (
    <>
      <h3 className="font-bold mb-3 text-md">{title}</h3>
      {items && items.length > 0 ? (
        items.map((item, index) => <div key={index}>- {item}</div>)
      ) : (
        <div>No data available</div>
      )}
    </>
  );

  return (
    <div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <div ref={bmcRef} className="m-4">
        <div className="bg-white/10 backdrop-blur-md border-2 border-gray-200/50 m-4 flex flex-col justify-center items-center rounded-xl">
          <h2 className="text-lg font-bold m-3 text-center text-gray-800">
            Business Model Canvas: {data.projectName}
          </h2>
          <div className="grid grid-cols-5 grid-rows-3 text-sm">
            <div className="row-span-2 border-2 p-2 border-gray-200/50 bg-white/30 backdrop-blur-sm">
              {renderBlock('Partenaires Clés', data.KeyPartners)}
            </div>
            <div className="border-2 p-2 border-gray-200/50 bg-white/30 backdrop-blur-sm">
              {renderBlock('Activités Clés', data.KeyActivities)}
            </div>
            <div className="col-start-2 row-start-2 border-2 p-2 border-gray-200/50 bg-white/30 backdrop-blur-sm">
              {renderBlock('Ressources Clés', data.KeyResources)}
            </div>
            <div className="row-span-2 col-start-3 row-start-1 border-2 p-2 border-gray-200/50 bg-white/30 backdrop-blur-sm">
              {renderBlock('Proposition de valeur', data.ValuePropositions)}
            </div>
            <div className="col-start-4 row-start-1 border-2 p-2 border-gray-200/50 bg-white/30 backdrop-blur-sm">
              {renderBlock('Relation Clients', data.CustomerRelationships)}
            </div>
            <div className="col-start-4 row-start-2 border-2 p-2 border-gray-200/50 bg-white/30 backdrop-blur-sm">
              {renderBlock('Canaux', data.Channels)}
            </div>
            <div className="row-span-2 col-start-5 row-start-1 border-2 p-2 border-gray-200/50 bg-white/30 backdrop-blur-sm">
              {renderBlock('Segments Clients', data.CustomerSegments)}
            </div>
            <div className="bmc-section col-span-3 row-start-3 border-2 p-2 border-gray-200/50 bg-white/30 backdrop-blur-sm">
              {renderBlock('Structure de Coûts', data.CostStructure)}
            </div>
            <div className="bmc-section col-span-3 col-start-4 row-start-3 border-2 p-2 border-gray-200/50 bg-white/30 backdrop-blur-sm">
              {renderBlock('Sources de Revenus', data.RevenueStreams)}
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={downloadPDF}
        disabled={isSaving}
        className={`px-4 py-2 bg-linear-to-r from-indigo-500 to-purple-500 text-gray-500 rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 mb-4 ${
          isSaving ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSaving ? 'Saving...' : 'Download BMC as PDF'}
      </button>
    </div>
  );
}