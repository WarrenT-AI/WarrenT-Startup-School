import React, { useState, useEffect, useCallback } from 'react';
import type { Stage, Language } from './types';
import { generateCurriculum, generateStageContent, gradeAssignment, generateBusinessPlan } from './services/geminiService';
import Header from './components/Header';
import StageCard from './components/StageCard';
import StageDetail from './components/StageDetail';
import IdeaInput from './components/IdeaInput';
import BusinessPlanDisplay from './components/BusinessPlanDisplay';
import { LoadingSpinner } from './components/IconComponents';
import { t } from './lib/i18n';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [startupIdea, setStartupIdea] = useState<string>('');
  const [isCourseStarted, setIsCourseStarted] = useState<boolean>(false);
  const [stages, setStages] = useState<Stage[]>([]);
  const [currentStageId, setCurrentStageId] = useState<number | null>(null);
  const [isLoadingCurriculum, setIsLoadingCurriculum] = useState<boolean>(false);
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(false);
  const [isGrading, setIsGrading] = useState<boolean>(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);
  const [businessPlan, setBusinessPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchCurriculum = useCallback(async (idea: string, lang: Language) => {
    try {
      setError(null);
      setIsLoadingCurriculum(true);
      setStages([]);
      setCurrentStageId(null);
      setBusinessPlan(null);
      const curriculum = await generateCurriculum(idea, lang);
      const initialStages: Stage[] = curriculum.map((s, index) => ({
        ...s,
        id: index + 1,
        isLocked: index !== 0,
        isCompleted: false,
      }));
      setStages(initialStages);
      if (initialStages.length > 0) {
        const firstStageId = initialStages[0].id;
        setCurrentStageId(firstStageId);
        fetchStageContent(initialStages[0].title, firstStageId, lang, idea, initialStages);
      }
    } catch (err) {
      setError(t('errorCurriculum', lang));
      console.error(err);
    } finally {
      setIsLoadingCurriculum(false);
    }
  }, []);

  useEffect(() => {
    if (isCourseStarted && startupIdea) {
        fetchCurriculum(startupIdea, language);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, isCourseStarted]);
  
  const fetchStageContent = async (title: string, id: number, lang: Language, idea: string, currentStages: Stage[]) => {
      const existingStage = currentStages.find(s => s.id === id);
      if (existingStage && existingStage.content) {
          return;
      }

      try {
        setError(null);
        setIsLoadingContent(true);
        const content = await generateStageContent(title, idea, lang);
        setStages(prevStages =>
          prevStages.map(s =>
            s.id === id ? { ...s, content } : s
          )
        );
      } catch (err) {
        setError(`Failed to load content for "${title}". Please try again.`);
        console.error(err);
      } finally {
        setIsLoadingContent(false);
      }
  };

  const handleSelectStage = (id: number) => {
    const selectedStage = stages.find(s => s.id === id);
    if (selectedStage && !selectedStage.isLocked) {
      setCurrentStageId(id);
      if (!selectedStage.content) {
        fetchStageContent(selectedStage.title, id, language, startupIdea, stages);
      }
    }
  };
  
  const handleLanguageChange = (lang: Language) => {
      if (lang !== language) {
          setLanguage(lang);
      }
  };

  const handleStartCourse = (idea: string) => {
      setStartupIdea(idea);
      setIsCourseStarted(true);
  };

  const handleGradeSubmission = async (id: number, submission: string) => {
      const stage = stages.find(s => s.id === id);
      if (!stage || !stage.content) return;

      try {
        setError(null);
        setIsGrading(true);
        const result = await gradeAssignment(stage.title, stage.content.assignment, submission, startupIdea, language);
        
        let allStagesCompleted = false;
        setStages(prevStages => {
            const newStages = prevStages.map(s =>
                s.id === id
                ? { ...s, isCompleted: true, submission, score: result.score, feedback: result.feedback }
                : s
            );
            const nextStage = newStages.find(s => s.id === id + 1);
            if (nextStage) {
                nextStage.isLocked = false;
            }
            allStagesCompleted = newStages.every(s => s.isCompleted);
            return newStages;
        });
        
        const nextStageId = id + 1;
        if (nextStageId <= stages.length) {
          handleSelectStage(nextStageId);
        } else {
          setCurrentStageId(null); // Course complete
        }

      } catch (err) {
        setError(`Failed to grade your assignment. Please try again.`);
        console.error(err);
      } finally {
        setIsGrading(false);
      }
  };

  const handleGeneratePlan = async () => {
    setError(null);
    setIsGeneratingPlan(true);
    try {
        const plan = await generateBusinessPlan(startupIdea, stages, language);
        setBusinessPlan(plan);
    } catch (err) {
        setError('Failed to generate your business plan. Please try again.');
        console.error(err);
    } finally {
        setIsGeneratingPlan(false);
    }
  };

  const currentStage = stages.find(s => s.id === currentStageId) || null;

  const renderContent = () => {
    if (!isCourseStarted) {
        return <IdeaInput onStartCourse={handleStartCourse} language={language} />;
    }
    
    if (isLoadingCurriculum) {
      return (
        <div className="flex flex-col items-center justify-center h-96">
          <LoadingSpinner className="w-16 h-16" />
          <p className="mt-4 text-lg text-base-content-secondary">{t('loadingCurriculum', language)}</p>
        </div>
      );
    }
    
    if (error && stages.length === 0) {
      return (
        <div className="text-center bg-red-900/50 border border-red-500 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-red-300">{t('errorTitle', language)}</h2>
          <p className="text-red-200 mt-2">{error}</p>
          <button
              onClick={() => fetchCurriculum(startupIdea, language)}
              className="mt-6 bg-brand-primary hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
              {t('retry', language)}
          </button>
        </div>
      );
    }
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <aside className="md:col-span-1 lg:col-span-1">
            <h2 className="text-2xl font-bold mb-4 px-2">{t('courseOutline', language)}</h2>
            <div className="flex flex-col space-y-3">
                {stages.map(stage => (
                <StageCard
                    key={stage.id}
                    stage={stage}
                    isActive={currentStageId === stage.id}
                    onSelect={handleSelectStage}
                />
                ))}
            </div>
            </aside>
            <section className="md:col-span-2 lg:col-span-3">
            {currentStage ? (
                <StageDetail
                    key={`${currentStage.id}-${language}`} // Add language to key to force re-render
                    stage={currentStage}
                    isLoading={isLoadingContent}
                    onGradeSubmission={handleGradeSubmission}
                    isGrading={isGrading}
                    error={error}
                    language={language}
                />
            ) : stages.length > 0 && currentStageId === null ? (
                businessPlan ? (
                    <BusinessPlanDisplay 
                        planContent={businessPlan} 
                        startupIdea={startupIdea} 
                        language={language} 
                    />
                ) : (
                    <div className="bg-base-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center h-full min-h-[500px]">
                        <h2 className="text-4xl font-bold text-brand-secondary">{t('congratsTitle', language)}</h2>
                        <p className="mt-4 text-xl text-base-content-secondary max-w-2xl">{t('generatePlanTitle', language)}</p>
                        <p className="mt-2 text-base-content-secondary max-w-2xl">{t('generatePlanBody', language)}</p>
                        <button
                            onClick={handleGeneratePlan}
                            disabled={isGeneratingPlan}
                            className="mt-8 bg-brand-secondary hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 disabled:bg-base-300 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center mx-auto"
                        >
                            {isGeneratingPlan ? (
                                <>
                                    <LoadingSpinner className="w-5 h-5 mr-3" />
                                    {t('generatingPlan', language)}
                                </>
                            ) : (
                                t('generatePlanButton', language)
                            )}
                        </button>
                        {error && !isGeneratingPlan && <p className="text-red-400 text-center mt-4">{error}</p>}
                    </div>
                )
            ) : null }
            </section>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-100 font-sans text-base-content">
      <Header language={language} onLanguageChange={handleLanguageChange} />
      <main className="container mx-auto p-4 md:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;