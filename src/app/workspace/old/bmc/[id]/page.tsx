'use client';

import BMCViewer from '@/app/components/dashboard/BmcViewer';
// import BMCViewer from '@/app/components/dashboard/BMCPdfView'
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaFileLines, FaTriangleExclamation } from 'react-icons/fa6';
// import { BMCViewerProps } from '@/app/types/types';

interface BmcResult {
  id: string;
  userId: string;
  projectName: string;
  data: {
    KeyPartners: string[];
    KeyActivities: string[];
    KeyResources: string[];
    ValuePropositions: string[];
    CustomerRelationships: string[];
    Channels: string[];
    CustomerSegments: string[];
    CostStructure: string[];
    RevenueStreams: string[];
  };
  itSaved: boolean;
  createdAt: string;
}

export default function ProjectPage() {
  const [data, setData] = useState<BmcResult['data'] | null>(null);
  const [userId, setUserId] = useState<string>(''); // Replace with actual userId from auth
  const [projectName, setProjectName] = useState<string>(''); // Replace with actual project name if needed
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const id = pathname.split('/').pop(); // Get the last segment of the URL

  useEffect(() => {
    if (!id || id === '') {
      setError('Invalid BMC ID');
      setIsLoading(false);
      return;
    }

    const fetchBmcData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log(`Fetching BMC data for ID: ${id}`);
        const response = await fetch(`/api/bmcresults/unique?id=${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('API error response:', errorData);
          throw new Error(errorData.error || 'Failed to fetch BMC data');
        }

        const result: BmcResult = await response.json();
        console.log('BMC data fetched successfully:', result);
        setData(result.data);
        setUserId(result.userId); // Update userId if needed
        setProjectName(result.projectName || ''); // Update projectName if needed
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch BMC data';
        console.error('Error fetching BMC data:', err);
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBmcData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#06060f]">
        <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">
            <div className="animate-pulse space-y-6">
              <div className="h-4 w-32 rounded bg-white/10" />
              <div className="h-10 w-80 max-w-full rounded bg-white/10" />
              <div className="h-[520px] rounded-3xl bg-white/5 border border-white/10" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#06060f]">
        <div className="max-w-4xl mx-auto px-6 pt-28 pb-16">
          <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8 text-center">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 bg-rose-500/15 border border-rose-400/20 flex items-center justify-center">
              <FaTriangleExclamation className="text-rose-300 text-xl" />
            </div>
            <h1 className="text-gray-500 text-2xl font-bold mb-2">Impossible de charger ce BMC</h1>
            <p className="text-rose-200/85 text-sm mb-6">{error}</p>
            <Link
              href="/workspace"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-gray-500/80 hover:bg-white/10 transition-all"
            >
              <FaArrowLeft className="text-xs" />
              Retour au workspace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06060f]">
      <div className='max-w-7xl mx-auto px-6 pt-28 pb-16'>
        <div className='mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
          <div>
            <Link
              href="/workspace"
              className="inline-flex items-center gap-2 text-sm text-gray-500/45 hover:text-gray-500/75 transition-colors mb-4"
            >
              <FaArrowLeft className="text-xs" />
              Retour au workspace
            </Link>

            <div className='inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-full mb-4'>
              <FaFileLines className='text-[10px]' />
              Canvas généré
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-500">
              {projectName || 'Business Model Canvas'}
            </h1>
            <p className="text-gray-500/45 text-sm sm:text-base mt-2 max-w-2xl">
              Consultez, exportez et partagez votre canvas généré pour structurer votre projet plus clairement.
            </p>
          </div>

          <div className='rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-500/55'>
            Projet ID: <span className='text-gray-500/80 font-medium'>{id}</span>
          </div>
        </div>

        <BMCViewer data={data} userId={userId} projectName={projectName}  />
      </div>
    </div>
  );
}
