"use client";
import dynamic from 'next/dynamic';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, SparklesIcon, PlayIcon, ClipboardDocumentListIcon, FolderOpenIcon } from '@heroicons/react/24/outline';

// Dynamically import the PDF viewer to avoid SSR issues
const BMCPdfViewer = dynamic(() => import('./BMCPdfView'), {
  ssr: false,
});

import { extractBMCJson } from '@/app/utils/utils';
import { Question } from './Question';
import { AISummary, BmcQuestion, FormErrors, ProjectDetails } from '@/app/types/types';
import { useSession } from 'next-auth/react';

type ActiveSection = 'project' | 'questions' | 'ai';

export default function BMCGenerator() {
  // State Management
  const [activeSection, setActiveSection] = useState<ActiveSection>('project');
  const [projectDetails, setProjectDetails] = useState<ProjectDetails>({ 
    name: '', 
    description: '', 
    secteur: '' 
  });
  const [currentFieldIndex, setCurrentFieldIndex] = useState<number>(0);
  const [responses, setResponses] = useState<Record<string, string | string[]>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [errors, setErrors] = useState<FormErrors>({});
  const [aiSummary, setAISummary] = useState<AISummary | null>(null);
  const [isAIGenerating, setIsAIGenerating] = useState<boolean>(false);
  const [aiError, setAIError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const pdfRef = useRef<HTMLDivElement>(null);
  const [bmcQuestions, setBmcQuestions] = useState<BmcQuestion[]>([]);
  const { data: session } = useSession();

  // BMC Fields Configuration with Colors
  const bmcFields = useMemo(() => [
    {
      name: 'Segments Clients',
      colors: {
        gradient: 'from-sky-500 to-cyan-500',
        badge: 'bg-sky-500/10 border-sky-500/20 text-sky-300',
        tab: 'bg-sky-500/15 border-sky-500/30 text-sky-200',
        dot: 'bg-sky-400',
        ring: 'focus:ring-sky-500/20',
        focusBorder: 'focus:border-sky-500',
        leftBorder: 'border-l-sky-400',
        shadow: 'shadow-sky-500/20'
      }
    },
    {
      name: 'Proposition de valeur',
      colors: {
        gradient: 'from-emerald-500 to-teal-500',
        badge: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
        tab: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200',
        dot: 'bg-emerald-400',
        ring: 'focus:ring-emerald-500/20',
        focusBorder: 'focus:border-emerald-500',
        leftBorder: 'border-l-emerald-400',
        shadow: 'shadow-emerald-500/20'
      }
    },
    {
      name: 'Canaux',
      colors: {
        gradient: 'from-amber-500 to-orange-500',
        badge: 'bg-amber-500/10 border-amber-500/20 text-amber-300',
        tab: 'bg-amber-500/15 border-amber-500/30 text-amber-200',
        dot: 'bg-amber-400',
        ring: 'focus:ring-amber-500/20',
        focusBorder: 'focus:border-amber-500',
        leftBorder: 'border-l-amber-400',
        shadow: 'shadow-amber-500/20'
      }
    },
    {
      name: 'Relation Clients',
      colors: {
        gradient: 'from-violet-500 to-purple-500',
        badge: 'bg-violet-500/10 border-violet-500/20 text-violet-300',
        tab: 'bg-violet-500/15 border-violet-500/30 text-violet-200',
        dot: 'bg-violet-400',
        ring: 'focus:ring-violet-500/20',
        focusBorder: 'focus:border-violet-500',
        leftBorder: 'border-l-violet-400',
        shadow: 'shadow-violet-500/20'
      }
    },
    {
      name: 'Sources de Revenus',
      colors: {
        gradient: 'from-lime-500 to-green-500',
        badge: 'bg-lime-500/10 border-lime-500/20 text-lime-300',
        tab: 'bg-lime-500/15 border-lime-500/30 text-lime-200',
        dot: 'bg-lime-400',
        ring: 'focus:ring-lime-500/20',
        focusBorder: 'focus:border-lime-500',
        leftBorder: 'border-l-lime-400',
        shadow: 'shadow-lime-500/20'
      }
    },
    {
      name: 'Ressources Clés',
      colors: {
        gradient: 'from-rose-500 to-red-500',
        badge: 'bg-rose-500/10 border-rose-500/20 text-rose-300',
        tab: 'bg-rose-500/15 border-rose-500/30 text-rose-200',
        dot: 'bg-rose-400',
        ring: 'focus:ring-rose-500/20',
        focusBorder: 'focus:border-rose-500',
        leftBorder: 'border-l-rose-400',
        shadow: 'shadow-rose-500/20'
      }
    },
    {
      name: 'Activités Clés',
      colors: {
        gradient: 'from-indigo-500 to-blue-500',
        badge: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300',
        tab: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-200',
        dot: 'bg-indigo-400',
        ring: 'focus:ring-indigo-500/20',
        focusBorder: 'focus:border-indigo-500',
        leftBorder: 'border-l-indigo-400',
        shadow: 'shadow-indigo-500/20'
      }
    },
    {
      name: 'Partenaires Clés',
      colors: {
        gradient: 'from-teal-500 to-cyan-500',
        badge: 'bg-teal-500/10 border-teal-500/20 text-teal-300',
        tab: 'bg-teal-500/15 border-teal-500/30 text-teal-200',
        dot: 'bg-teal-400',
        ring: 'focus:ring-teal-500/20',
        focusBorder: 'focus:border-teal-500',
        leftBorder: 'border-l-teal-400',
        shadow: 'shadow-teal-500/20'
      }
    },
    {
      name: 'Structure de Coûts',
      colors: {
        gradient: 'from-orange-500 to-amber-500',
        badge: 'bg-orange-500/10 border-orange-500/20 text-orange-300',
        tab: 'bg-orange-500/15 border-orange-500/30 text-orange-200',
        dot: 'bg-orange-400',
        ring: 'focus:ring-orange-500/20',
        focusBorder: 'focus:border-orange-500',
        leftBorder: 'border-l-orange-400',
        shadow: 'shadow-orange-500/20'
      }
    }
  ], []);

  // Get current field colors
  const currentFieldColors = bmcFields[currentFieldIndex]?.colors || bmcFields[0].colors;

  // Section Navigation Configuration
  const sectionConfig = {
    project: {
      title: 'Décrire le projet',
      icon: <FolderOpenIcon className="w-5 h-5" />,
      description: 'Commencez par décrire votre projet'
    },
    questions: {
      title: 'Répondre aux questions',
      icon: <ClipboardDocumentListIcon className="w-5 h-5" />,
      description: 'Répondez aux questions pour chaque section'
    },
    ai: {
      title: 'Générer le BMC',
      icon: <SparklesIcon className="w-5 h-5" />,
      description: 'Générez votre Business Model Canvas'
    }
  };

  // Computed Values
  const currentFieldQuestions = useMemo(() => {
    return bmcQuestions
      .filter((q) => {
        const matchesCategory = q.category === bmcFields[currentFieldIndex]?.name;
        const hasValidId = q.id && q.id !== 'undefined';
        return matchesCategory && hasValidId;
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [bmcQuestions, currentFieldIndex, bmcFields]);

  const currentQuestion = currentFieldQuestions[currentQuestionIndex];

  const isLastQuestionInField = currentQuestionIndex === currentFieldQuestions.length - 1;
  const isLastField = currentFieldIndex === bmcFields.length - 1;
  // Load Questions on Mount
  useEffect(() => {
    async function fetchQuestions() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/bmc', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`HTTP ${response.status}: ${JSON.stringify(errorData)}`);
        }
        
        const data = await response.json();
        const questions = Array.isArray(data) ? data : [];
        setBmcQuestions(questions);

        // Initialize responses with default values
        const initialResponses: Record<string, string | string[]> = {};
        questions.forEach((q) => {
          if (q.id && q.id !== 'undefined') {
            initialResponses[q.id] = q.type === 'checkbox' ? [] : '';
          }
        });
        setResponses(initialResponses);
      } catch (error) {
        console.error('Fetch error:', error);
        setErrors({ general: 'Échec du chargement des questions' });
        setBmcQuestions([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchQuestions();
  }, []);
  
// Validation Functions
const validateProject = (): FormErrors => {
  const newErrors: FormErrors = {};
  if (!projectDetails.name.trim()) {
    newErrors.name = 'Le nom du projet est requis';
  }
  if (!projectDetails.description.trim()) {
    newErrors.description = 'La description est requise';
  }
  if (!projectDetails.secteur.trim()) {
    newErrors.secteur = 'Le secteur dactivité est requis';
  }
  return newErrors;
};

const validateCurrentQuestion = (): FormErrors => {
  const newErrors: FormErrors = {};
  if (currentQuestion?.required) {
    const response = responses[currentQuestion.id];
    if (!response || (Array.isArray(response) && response.length === 0)) {
      newErrors[currentQuestion.id] = 'Ce champ est requis';
    }
  }
  return newErrors;
};

// Event Handlers
const handleSaveProject = async () => {
  const validationErrors = validateProject();
  setErrors(validationErrors);
  
  if (Object.keys(validationErrors).length > 0) return;

  try {
    setActiveSection('questions');
    setErrors({});
  } catch {
    setErrors({ general: 'Échec de lenregistrement du projet' });
  }
};

const handleResponseChange = (questionId: string, value: string | string[]) => {
  if (!questionId || questionId === 'undefined') {
    console.error('Invalid questionId in handleResponseChange:', questionId);
    return;
  }
  
  setResponses((prev) => ({ ...prev, [questionId]: value }));
  setErrors((prev) => ({ ...prev, [questionId]: '' }));
};
  const handleNextQuestion = () => {
    const validationErrors = validateCurrentQuestion();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) return;

    if (currentQuestionIndex < currentFieldQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentFieldIndex < bmcFields.length - 1) {
      setCurrentFieldIndex(currentFieldIndex + 1);
      setCurrentQuestionIndex(0);
    } else {
      setActiveSection('ai');
    }
    setErrors({});
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentFieldIndex > 0) {
      const prevFieldIndex = currentFieldIndex - 1;
      const prevFieldQuestions = bmcQuestions
        .filter((q) => q.category === bmcFields[prevFieldIndex]?.name && q.id && q.id !== 'undefined')
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      setCurrentFieldIndex(prevFieldIndex);
      setCurrentQuestionIndex(Math.max(0, prevFieldQuestions.length - 1));
    }
  };

  const handleFieldChange = (fieldIndex: number) => {
    setCurrentFieldIndex(fieldIndex);
    setCurrentQuestionIndex(0);
    setErrors({});
  };

  const handleGenerateAISummary = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validResponses = Object.entries(responses)
      .filter(([questionId, response]) => {
        return questionId && 
               questionId !== 'undefined' && 
               response && 
               (Array.isArray(response) ? response.length > 0 : response.toString().trim() !== '');
      });

    if (validResponses.length === 0) {
      setAIError('Veuillez répondre à au moins une question valide avant de générer le résumé.');
      return;
    }

    setIsAIGenerating(true);
    setAIError('');

    const answers = validResponses
      .map(([questionId, response]) => {
        const question = bmcQuestions.find((q) => q.id === questionId);
        const responseText = Array.isArray(response) ? response.join(', ') : response;
        return question ? `${question.questionText}: ${responseText}` : '';
      })
      .filter(Boolean)
      .join('\n');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: projectDetails.name,
          projectDescription: projectDetails.description,
          projectSecteur: projectDetails.secteur,
          answers,
        }),
      });

      if (!response.ok) {
        throw new Error(`Échec de la requête API avec le statut ${response.status}`);
      }

      const data = await response.json();
      const summary: AISummary = {
        project: { organized: data.summary || '', suggestions: data.suggestions || [] },
        fields: data.fields || {},
      };
      setAISummary(summary);
    } catch (error) {
      console.error('Erreur lors de la génération du résumé AI:', error);
      setAIError('Échec de la génération du résumé AI. Veuillez réessayer.');
    } finally {
      setIsAIGenerating(false);
    }
  };

  // Progress calculation
  const getProgress = () => {

    const totalQuestions = bmcQuestions.filter(q => q.id && q.id !== 'undefined').length;
    const answeredQuestions = Object.entries(responses).filter(([questionId, response]) => {
      return questionId && 
             questionId !== 'undefined' && 
             response && 
             (Array.isArray(response) ? response.length > 0 : response.toString().trim() !== '');
    }).length;
    
    return totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;
  };

  if (isLoading) {
    return (
      <div className="min-h-[520px] flex items-center justify-center bg-transparent">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500/50">Chargement des questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-blue-300 bg-blue-600/10 border border-blue-600/20 px-3 py-1.5 rounded-full mb-4">
            <SparklesIcon className="w-4 h-4" />
            Assistant BMC
          </div>
          <h1 className="text-4xl font-bold text-gray-500 mb-3 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
            Créateur de BMC
          </h1>
          <p className="text-gray-500/45 max-w-2xl mx-auto text-sm sm:text-base">
            Construisez votre Business Model Canvas avec une expérience guidée, claire et moderne.
          </p>

        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="bg-white/10 rounded-full h-3 shadow-inner overflow-hidden border border-white/10">
            <div 
              className={`bg-gradient-to-r ${activeSection === 'questions' ? currentFieldColors.gradient : 'from-indigo-500 to-purple-500'} h-3 rounded-full transition-all duration-500 ease-out`}
              style={{ width: `${getProgress()}%` }}
            />
          </div>
          <div className="text-center mt-2">
            <span className="text-sm text-gray-500/45">Progression: {getProgress()}%</span>
            {activeSection === 'questions' && (
              <span className="ml-2 text-sm font-medium text-gray-500/70">
                • {bmcFields[currentFieldIndex]?.name}
              </span>
            )}
          </div>
        </div>

        {/* Section Navigation */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {Object.entries(sectionConfig).map(([section, config]) => (
              <button
                key={section}
                onClick={() => setActiveSection(section as ActiveSection)}
                className={`group relative flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 min-w-[200px] ${
                  activeSection === section
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-gray-500 shadow-lg shadow-blue-600/20 border border-white/10'
                    : 'bg-white/5 text-gray-500/70 border border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <span className="text-2xl">{config.icon}</span>
                <div className="text-left">
                  <div className="font-semibold">{config.title}</div>
                  <div className={`text-xs ${activeSection === section ? 'text-gray-500/80' : 'text-gray-500/35'}`}>
                    {config.description}
                  </div>
                </div>
                {activeSection === section && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 opacity-15 animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">

          {/* Project Details Section */}
          {activeSection === 'project' && (
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/10 p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-500 mb-2">Décrivez votre projet</h2>
                <p className="text-gray-500/45">Commencez par nous parler de votre projet d&apos;entreprise</p>
              </div>
              
              {errors.general && (
                <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                  <p className="text-rose-300 font-medium">{errors.general}</p>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-500/75 mb-2">
                    Nom du projet *
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={projectDetails.name}
                    onChange={(e) => setProjectDetails({ ...projectDetails, name: e.target.value })}
                    placeholder="Entrez le nom de votre projet"
                    className={`w-full px-4 py-3 rounded-xl border bg-white/5 text-gray-500 placeholder:text-gray-500/25 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-600/15 ${
                      errors.name 
                        ? 'border-rose-500/40 focus:border-rose-500' 
                        : 'border-white/10 focus:border-blue-600'
                    }`}
                  />
                  {errors.name && <p className="text-rose-300 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="secteur" className="block text-sm font-semibold text-gray-500/75 mb-2">
                    Secteur d&apos;activité *
                  </label>
                  <input
                    id="secteur"
                    type="text"
                    value={projectDetails.secteur}
                    onChange={(e) => setProjectDetails({ ...projectDetails, secteur: e.target.value })}
                    placeholder="Ex: E-commerce, Santé, Éducation..."
                    className={`w-full px-4 py-3 rounded-xl border bg-white/5 text-gray-500 placeholder:text-gray-500/25 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-600/15 ${
                      errors.secteur 
                        ? 'border-rose-500/40 focus:border-rose-500' 
                        : 'border-white/10 focus:border-blue-600'
                    }`}
                  />
                  {errors.secteur && <p className="text-rose-300 text-sm mt-1">{errors.secteur}</p>}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-500/75 mb-2">
                    Description du projet *
                  </label>
                  <textarea
                    id="description"
                    value={projectDetails.description}
                    onChange={(e) => setProjectDetails({ ...projectDetails, description: e.target.value })}
                    placeholder="Décrivez votre projet, ses objectifs et sa valeur ajoutée..."
                    rows={4}
                    className={`w-full px-4 py-3 rounded-xl border bg-white/5 text-gray-500 placeholder:text-gray-500/25 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-600/15 resize-none ${
                      errors.description 
                        ? 'border-rose-500/40 focus:border-rose-500' 
                        : 'border-white/10 focus:border-blue-600'
                    }`}
                  />
                  {errors.description && <p className="text-rose-300 text-sm mt-1">{errors.description}</p>}
                </div>

                <button
                  type="button"
                  onClick={handleSaveProject}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-gray-500 px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/25 transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <PlayIcon className="w-5 h-5" />
                  Commencer le questionnaire
                </button>
              </div>
            </div>
          )}

          {/* Questions Section */}
          {activeSection === 'questions' && (
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/10 overflow-hidden">
              {/* Field Navigation */}
              <div className="p-6 border-b border-white/10 bg-white/5">
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${currentFieldColors.gradient} shadow-lg ${currentFieldColors.shadow}`}></div>
                    <h2 className="text-xl font-bold text-gray-500">
                      {bmcFields[currentFieldIndex]?.name}
                    </h2>
                  </div>
                  <p className="text-gray-500/45 text-sm">
                    Question {currentQuestionIndex + 1} sur {currentFieldQuestions.length}
                  </p>
                  
                  {/* Section Progress Indicators */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {bmcFields.map((field, index) => {
                      const fieldQuestions = bmcQuestions.filter(q => q.category === field.name && q.id && q.id !== 'undefined');
                      const answeredInField = fieldQuestions.filter(q => {
                        const response = responses[q.id];
                        return response && (Array.isArray(response) ? response.length > 0 : response.toString().trim() !== '');
                      }).length;
                      const progressInField = fieldQuestions.length > 0 ? (answeredInField / fieldQuestions.length) * 100 : 0;
                      
                      return (
                        <div key={field.name} className="relative group">
                          <div 
                            className="w-8 h-2 rounded-full bg-white/10 border border-white/10 overflow-hidden cursor-pointer transition-all duration-200 hover:scale-110"
                            onClick={() => handleFieldChange(index)}
                          >
                            <div 
                              className={`h-full bg-gradient-to-r ${field.colors.gradient} transition-all duration-300`}
                              style={{ width: `${progressInField}%` }}
                            />
                          </div>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-[#0f1020] border border-white/10 text-gray-500 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {field.name} - {Math.round(progressInField)}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Desktop Field Navigation */}
                <div className="hidden lg:flex flex-wrap gap-2 justify-center">
                  {bmcFields.map((field, index) => (
                    <button
                      key={field.name}
                      onClick={() => handleFieldChange(index)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        currentFieldIndex === index
                          ? `bg-gradient-to-r ${field.colors.gradient} text-gray-500 shadow-lg ${field.colors.shadow}`
                          : 'text-gray-500/55 hover:text-gray-500 bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {field.name}
                    </button>
                  ))}
                </div>

                {/* Mobile Field Navigation */}
                <select
                  className={`lg:hidden w-full p-3 bg-[#0f1020] text-gray-500 rounded-xl border border-white/10 focus:outline-none focus:ring-4 ${currentFieldColors.ring} ${currentFieldColors.focusBorder}`}
                  value={currentFieldIndex}
                  onChange={(e) => handleFieldChange(parseInt(e.target.value))}
                >
                  {bmcFields.map((field, index) => (
                    <option key={field.name} value={index}>
                      {field.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Question Content */}
              <div className="p-8">
                {errors.general && (
                  <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                    <p className="text-rose-300 font-medium">{errors.general}</p>
                  </div>
                )}

                {currentQuestion ? (
                  <div className="space-y-6">
                    <div className={`border-l-4 ${currentFieldColors.leftBorder} pl-4`}>
                      <Question
                        id={currentQuestion.id}
                        text={currentQuestion.questionText}
                        type={currentQuestion.type || 'text'}
                        options={(currentQuestion.optionsList ?? [])
                          .map(option => typeof option === 'string' ? option : '')
                          .filter(option => !!option.trim())}
                        required={currentQuestion.required || false}
                        value={responses[currentQuestion.id] ?? (currentQuestion.type === 'checkbox' ? [] : '')}
                        onChange={(value) => handleResponseChange(currentQuestion.id, value)}
                      />
                    </div>
                    {errors[currentQuestion.id] && (
                      <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                        <p className="text-rose-300 text-sm">{errors[currentQuestion.id]}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-gray-500/35">
                      Aucune question disponible pour cette catégorie.
                    </p>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
                  <button
                    type="button"
                    onClick={handlePreviousQuestion}
                    disabled={currentFieldIndex === 0 && currentQuestionIndex === 0}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                      currentFieldIndex === 0 && currentQuestionIndex === 0
                        ? 'opacity-50 cursor-not-allowed bg-white/5 text-gray-500/25 border border-white/10'
                        : 'bg-white/5 text-gray-500/70 border border-white/10 hover:bg-white/10 transform hover:scale-105'
                    }`}
                  >
                    <ChevronLeftIcon className="w-5 h-5" />
                    Précédente
                  </button>

                  <div className="text-center text-sm text-gray-500/35">
                    {currentFieldIndex + 1} / {bmcFields.length} sections
                  </div>

                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r ${currentFieldColors.gradient} text-gray-500 transition-all duration-200 transform hover:scale-105 shadow-lg ${currentFieldColors.shadow}`}
                  >
                    {isLastQuestionInField && isLastField ? 'Générer le BMC' : 'Suivante'}
                    {isLastQuestionInField && isLastField ? (
                      <SparklesIcon className="w-5 h-5" />
                    ) : (
                      <ChevronRightIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* AI Generation Section */}
          {activeSection === 'ai' && (
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/10 p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-500 mb-2">Générer votre BMC</h2>
                <p className="text-gray-500/45">
                  Créez votre Business Model Canvas basé sur vos réponses
                </p>
              </div>

              <form onSubmit={handleGenerateAISummary} className="space-y-6">
                <button
                  type="submit"
                  disabled={isAIGenerating || Object.keys(responses).length === 0}
                  className={`w-full flex items-center justify-center gap-3 py-4 px-8 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] ${
                    isAIGenerating || Object.keys(responses).length === 0
                      ? 'opacity-50 cursor-not-allowed bg-white/5 text-gray-500/30 border border-white/10'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-gray-500 shadow-lg hover:shadow-emerald-500/25'
                  }`}
                >
                  {isAIGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-6 h-6" />
                      Générer votre BMC
                    </>
                  )}
                </button>

                {aiError && (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                    <p className="text-rose-300 font-medium">{aiError}</p>
                  </div>
                )}

                {aiSummary && (
                  <div className="mt-8 p-6 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <h3 className="text-lg font-semibold text-gray-500 mb-4 flex items-center gap-2">
                      <SparklesIcon className="w-6 h-6 text-emerald-300" />
                      {projectDetails.name} - BMC généré avec succès!
                    </h3>
                    {(() => {
                      const bmcData = extractBMCJson(aiSummary);
                      return bmcData ? (
                        <BMCPdfViewer
                          data={{
                            CustomerSegments: bmcData.CustomerSegments || [],
                            ValuePropositions: bmcData.ValuePropositions || [],
                            Channels: bmcData.Channels || [],
                            CustomerRelationships: bmcData.CustomerRelationships || [],
                            RevenueStreams: bmcData.RevenueStreams || [],
                            KeyResources: bmcData.KeyResources || [],
                            KeyActivities: bmcData.KeyActivities || [],
                            KeyPartners: bmcData.KeyPartners || [],
                            CostStructure: bmcData.CostStructure || [],
                            projectName: projectDetails.name || 'Projet sans nom',
                          }}
                          userId={session?.user?.id || ''} 
                          projectName={projectDetails.name || 'Projet sans nom'}
                        />
                      ) : (
                        <p className="text-gray-500/45">Aucun BMC généré. Veuillez réessayer.</p>
                      );
                    })()}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setActiveSection('questions')}
                  className="w-full py-3 px-6 rounded-xl bg-white/5 border border-white/10 text-gray-500/70 font-semibold hover:bg-white/10 transition-all duration-200"
                >
                  Retourner aux questions
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Hidden PDF Component */}
        <div ref={pdfRef} className="hidden" />
      </div>
    </div>
  );
}