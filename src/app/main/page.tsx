"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AddProjectCard from '@/app/components/UI/AddProjectCard';
import ProjectCard from '../components/UI/ProjectCard';
import { useSession } from 'next-auth/react';
import { FaLayerGroup, FaRegIdCard, FaShieldAlt } from 'react-icons/fa';
import Link from 'next/link';
import { IoIosWarning } from "react-icons/io";
import { getProfileStatusCached } from '@/app/lib/clientCache';


interface Project {
  id: string;
  projectName?: string;
}

export default function Page() {
  const [assuranceResults] = useState<Project[]>([]);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== 'authenticated') {
      setIsCheckingProfile(false);
      return;
    }

    let isCancelled = false;

    const loadProfileStatus = async () => {
      try {
        const profileCompletedValue = await getProfileStatusCached();

        if (!isCancelled) {
          setProfileCompleted(Boolean(profileCompletedValue));
        }
      } catch {
        if (!isCancelled) {
          setProfileCompleted(false);
        }
      } finally {
        if (!isCancelled) {
          setIsCheckingProfile(false);
        }
      }
    };

    void loadProfileStatus();

    return () => {
      isCancelled = true;
    };
  }, [status]);

 
  const handleCardClick = (id: string) => {
    router.push(`/main/newassurance`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-20 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.15),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_45%)]" />

      <div className="relative z-10 mx-auto max-w-6xl overflow-hidden rounded-3xl border border-cyan-300/40 bg-white/75 p-6 shadow-2xl shadow-cyan-100 backdrop-blur md:p-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-700">Espace client</p>
          <h1 className="mt-2 text-3xl font-black text-gray-800 md:text-4xl">
            Tableau de bord <span className="text-cyan-700">Amana</span>
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Bienvenue, <span className="font-semibold text-gray-800">{session?.user?.name || session?.user?.email}</span>
          </p>
        </div>

        <div className="grid w-full max-w-md grid-cols-2 gap-3">
          <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-3">
            <p className="text-xs uppercase tracking-wide text-cyan-700">Profil</p>
            <p className="mt-1 text-sm font-bold text-cyan-900">{profileCompleted ? 'Complet' : 'A completer'}</p>
          </div>
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-3">
            <p className="text-xs uppercase tracking-wide text-blue-700">Contrats</p>
            <p className="mt-1 text-sm font-bold text-blue-900">{assuranceResults.length}</p>
          </div>
        </div>
      </div>

      {!profileCompleted && (
      <div className='mb-6 flex items-start gap-4 rounded-2xl border border-rose-300 bg-rose-50/90 p-4'>
        <IoIosWarning className='mt-0.5 text-2xl text-rose-600'/>
        <div className="space-y-1">
          <p className='text-sm font-semibold text-rose-800'>Finalisez votre profil avant toute souscription</p>
          <p className='text-sm text-rose-700'>Vous devez renseigner les informations personnelles et de permis pour creer une assurance.</p>
          <Link href="/main/profile" className='inline-flex items-center gap-2 text-sm font-bold text-rose-700 underline underline-offset-2'>
            <FaRegIdCard /> Completer mon profil
          </Link>
        </div>
      </div>
      )}

      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <FaShieldAlt className="text-cyan-700" />
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-600">
            Demarrer une demande
          </h2>
        </div>

        <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
          
          <AddProjectCard
          title="Creer un nouveau Assurance"
          desc="Commencer"
          small="à construire"
          link="/main/newassurance"
          available={profileCompleted && !isCheckingProfile}
        />
        <AddProjectCard
          title="Demande d'assurance"
          desc="Commencer"
          small="à demmande"
          link="/main/demmande"
          available={profileCompleted && !isCheckingProfile}
        />
        </div>
        
      </div>

      <div className='mb-8'>
        <div className="mb-4 flex items-center gap-3">
          <FaLayerGroup className="text-sm text-cyan-700" />
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-600">
            Mes assurances
          </h2>
          {assuranceResults.length > 0 && (
            <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-xs text-cyan-700">
              {assuranceResults.length}
            </span>
          )}
        </div>

        {assuranceResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {assuranceResults.map((project, index) => (
              <ProjectCard
                key={project.id || index}
                title={project.projectName || 'Projet sans titre'}
                desc="Continuer"
                small="le projet"
                link="/main/newassurance"
                available={true}
                onClick={() => handleCardClick(project.id)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <FaLayerGroup className="mx-auto mb-3 text-3xl text-cyan-200" />
            <p className="text-sm font-semibold text-gray-700">Aucune assurance pour l&apos;instant.</p>
            <p className="mt-1 text-xs text-gray-500">Commencez par creer votre premier contrat.</p>
          </div>
        )}
      </div>

      <div>
        <div className="mb-4 flex items-center gap-3">
          <FaLayerGroup className="text-sm text-blue-700" />
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-600">
            Demandes en attente
          </h2>
          {assuranceResults.length > 0 && (
            <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
              {assuranceResults.length}
            </span>
          )}
        </div>

        {assuranceResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {assuranceResults.map((project, index) => (
              <ProjectCard
                key={project.id || index}
                title={project.projectName || 'Projet sans titre'}
                desc="Continuer"
                small="le projet"
                link="/main/newassurance"
                available={true}
                onClick={() => handleCardClick(project.id)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <FaLayerGroup className="mx-auto mb-3 text-3xl text-blue-200" />
            <p className="text-sm font-semibold text-gray-700">Aucune demande en attente.</p>
            <p className="mt-1 text-xs text-gray-500">Vos prochaines demandes apparaitront ici.</p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}