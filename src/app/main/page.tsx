"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AddProjectCard from '@/app/components/UI/AddProjectCard';
import ProjectCard from '../components/UI/ProjectCard';
import { useSession } from 'next-auth/react';
import { FaLayerGroup } from 'react-icons/fa';
import Link from 'next/link';
import { IoIosWarning } from "react-icons/io";


interface Project {
  id: string;
  projectName?: string;
}

export default function Page() {
  const [bmcResults] = useState<Project[]>([]);
  const router = useRouter();
  const { data: session } = useSession();

 
  const handleCardClick = (id: string) => {
    router.push(`/main/bmc/${id}`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
     
 
      <div className="relative z-10 max-w-5xl mx-auto px-6 my-32 p-16 bg-gray-50 rounded-2xl border-cyan-500 border-2 shadow-lg shadow-cyan-500/20">
      {/* Header */}
      <div className="mb-8 ">
      
        <h1 className="text-2xl font-extrabold text-gray-700">
          Amana{' '}
          <span className="text-transparent bg-linear-to-r from-blue-500 to-cyan-400 bg-clip-text">Assurance</span>
        </h1>
        <p className="text-grayh-500 text-sm mt-1">
          Bienvenue, <span className="text-gray-500">{session?.user?.name || session?.user?.email}</span>
        </p>
      </div>
      {/* Warning  */}
      <div className='rounded-xl bg-red-400/70 border-2 border-red-500 w-full p-2 mb-2 flex gap-4 items-center'>
      <div className='h-full'>
        <IoIosWarning className='text-red-100 text-xl'/>

      </div>
      <div>
        <p className='text-gray-100'>Vous ne pouvez pas souscrire d'assurance sans fournir vos informations et sans vérifier votre identité. </p>
        <Link href="/main/profile" className='text-sm text-gray-100 font-bold underline'>Vérifiez votre profil</Link>
      </div>
        
      </div>

      {/* New project */}
      <div className="mb-8">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
          Nouveau Assurance
        </h2>
        <div className='flex flex-col md:flex-row gap-3'>
          
          <AddProjectCard
          title="Creer un nouveau Assurance"
          desc="Commencer"
          small="à construire"
          link="/main/newassurance"
          available={true}
        />
        <AddProjectCard
          title="Demande d'assurance"
          desc="Commencer"
          small="à demmande"
          link="/main/demmande"
          available={true}
        />
        </div>
        
      </div>

      {/* Assurance List */}
      <div className='mb-8'>
        <div className="flex items-center gap-3 mb-4">
          <FaLayerGroup className="text-gray-500/25 text-sm" />
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
            Assurance List
          </h2>
          {bmcResults.length > 0 && (
            <span className="text-xs text-gray-500/30 bg-white/10 border border-white/10 rounded-full px-2 py-0.5">
              {bmcResults.length}
            </span>
          )}
        </div>

        {bmcResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {bmcResults.map((project, index) => (
              <ProjectCard
                key={project.id || index}
                title={project.projectName || 'Projet sans titre'}
                desc="Continuer"
                small="le projet"
                link={`/main/bmc/${project.id}`}
                available={true}
                onClick={() => handleCardClick(project.id)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-blue-500/30 bg-white/5 p-10 text-center">
            <FaLayerGroup className="text-gray-500/15 text-3xl mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Aucun Assurance pour l&apos;instant.</p>
            <p className="text-gray-500 text-xs mt-1">Créez votre premier Assurance</p>
          </div>
        )}
      </div>
      {/* Pending Demands */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <FaLayerGroup className="text-gray-500/25 text-sm" />
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
            Demandes en attente
          </h2>
          {bmcResults.length > 0 && (
            <span className="text-xs text-gray-500/30 bg-white/10 border border-white/10 rounded-full px-2 py-0.5">
              {bmcResults.length}
            </span>
          )}
        </div>

        {bmcResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {bmcResults.map((project, index) => (
              <ProjectCard
                key={project.id || index}
                title={project.projectName || 'Projet sans titre'}
                desc="Continuer"
                small="le projet"
                link={`/main/bmc/${project.id}`}
                available={true}
                onClick={() => handleCardClick(project.id)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-blue-500/30 bg-white/5 p-10 text-center">
            <FaLayerGroup className="text-gray-500/15 text-3xl mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Aucune demande en attente pour l&apos;instant.</p>
            <p className="text-gray-500 text-xs mt-1">Créez votre première demande</p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}