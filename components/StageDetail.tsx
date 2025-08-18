import React, { useState, useEffect } from 'react';
import type { Stage, Language, StructuredContent } from '../types';
import { LoadingSpinner, BookOpenIcon, CaseIcon, LightbulbIcon, DocumentTextIcon, SparklesIcon, CheckCircleIcon, ArrowLeftIcon, ArrowRightIcon } from './IconComponents';
import { t } from '../lib/i18n';

interface StageDetailProps {
  stage: Stage;
  isLoading: boolean;
  onGradeSubmission: (id: number, submission: string) => void;
  isGrading: boolean;
  error: string | null;
  language: Language;
}

const AssignmentBlock: React.FC<{
    stage: Stage;
    onGradeSubmission: (id: number, submission: string) => void;
    isGrading: boolean;
    language: Language;
}> = ({ stage, onGradeSubmission, isGrading, language }) => {
    const [submissionText, setSubmissionText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (submissionText.trim() && !isGrading) {
            onGradeSubmission(stage.id, submissionText);
        }
    };

    if (stage.isCompleted && stage.submission) {
        return (
            <div>
                 <div className="flex items-center mb-6">
                    <CheckCircleIcon className="w-10 h-10 mr-4 text-brand-secondary" />
                    <h3 className="text-3xl font-bold">{t('assignmentComplete', language)}</h3>
                </div>
                <div className="bg-base-300/50 p-6 rounded-xl">
                    <h4 className="font-bold text-lg text-base-content mb-2">{t('yourSubmission', language)}</h4>
                    <p className="text-base-content-secondary whitespace-pre-wrap mb-6">{stage.submission}</p>
                    
                    <h4 className="font-bold text-lg text-brand-secondary mb-2">{t('aiFeedback', language)}</h4>
                    <div className="flex items-center mb-4 bg-brand-secondary/10 border border-brand-secondary/30 rounded-lg p-3 w-fit">
                        <SparklesIcon className="w-6 h-6 mr-3 text-brand-secondary"/>
                        <p className="text-2xl font-bold text-white">
                            {t('score', language)}: <span className="text-brand-secondary">{stage.score} / 100</span>
                        </p>
                    </div>
                    <div 
                        className="prose prose-invert max-w-none prose-p:text-base-content-secondary"
                        dangerouslySetInnerHTML={{ __html: (stage.feedback || '').replace(/\n/g, '<br />') }} 
                    />
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center mb-4">
                <DocumentTextIcon className="w-8 h-8 mr-3 text-brand-primary" />
                <h3 className="text-3xl font-bold">{t('assignment', language)}</h3>
            </div>
            <div 
                className="prose prose-invert max-w-none prose-p:text-base-content-secondary mb-6"
                dangerouslySetInnerHTML={{ __html: (stage.content?.assignment || '').replace(/\n/g, '<br />') }} 
            />
            <form onSubmit={handleSubmit}>
                <textarea
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    placeholder={t('assignmentPlaceholder', language)}
                    className="w-full h-48 p-4 bg-base-300 rounded-lg border-2 border-transparent focus:border-brand-primary focus:ring-0 transition"
                    disabled={isGrading}
                />
                <div className="mt-4 text-center">
                    <button
                        type="submit"
                        disabled={!submissionText.trim() || isGrading}
                        className="bg-brand-secondary hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 disabled:bg-base-300 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center mx-auto"
                    >
                        {isGrading ? (
                            <>
                                <LoadingSpinner className="w-5 h-5 mr-3" />
                                {t('grading', language)}
                            </>
                        ) : (
                           t('submitForGrading', language) 
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

const StructuredContentBlock: React.FC<{
    icon: React.ReactNode;
    content: StructuredContent;
}> = ({ icon, content }) => {
    return (
        <div>
            <div className="flex items-center mb-6">
                <div className="w-10 h-10 mr-4 text-brand-primary">{icon}</div>
                <h3 className="text-3xl font-bold">{content.title}</h3>
            </div>
            <div className="space-y-6">
                {content.sections.map((section, index) => (
                    <div key={index} className="bg-base-300/30 p-4 rounded-lg">
                        <h4 className="text-xl font-semibold text-brand-secondary mb-2">{section.subtitle}</h4>
                        <p className="text-base-content-secondary whitespace-pre-line leading-relaxed">{section.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};


const StageDetail: React.FC<StageDetailProps> = ({ stage, isLoading, onGradeSubmission, isGrading, error, language }) => {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        setCurrentStep(0);
    }, [stage.id]);

    if (isLoading) {
        return (
            <div className="bg-base-200 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[500px]">
                <LoadingSpinner className="w-12 h-12" />
                <p className="mt-4 text-base-content-secondary">{t('loadingContent', language)}</p>
            </div>
        );
    }
    
    if (error && !stage?.content) {
        return (
             <div className="bg-red-900/50 border border-red-500 rounded-2xl p-8 text-center min-h-[500px] flex flex-col justify-center">
                <h2 className="text-2xl font-bold text-red-300">{t('errorContentTitle', language)}</h2>
                <p className="text-red-200 mt-2">{error}</p>
            </div>
        )
    }

    if (!stage || !stage.content) {
        return (
            <div className="bg-base-200 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[500px]">
                <p className="text-lg text-base-content-secondary">{t('selectStagePrompt', language)}</p>
            </div>
        );
    }

    const contentSteps = [
        { key: 'theory', content: stage.content.theory, icon: <BookOpenIcon /> },
        { key: 'caseStudy', content: stage.content.caseStudy, icon: <CaseIcon /> },
        { key: 'practicalExercise', content: stage.content.practicalExercise, icon: <LightbulbIcon /> },
    ];
    
    const activeContent = currentStep < contentSteps.length ? contentSteps[currentStep] : null;

    return (
        <div className="bg-base-200 rounded-2xl p-6 md:p-10">
            <h2 className="text-4xl font-extrabold mb-2 tracking-tight">{stage.title}</h2>
            <p className="text-lg text-base-content-secondary mb-6">{stage.description}</p>
            
            <div className="border-t border-base-300 my-6"></div>

            <div className="min-h-[400px]">
                {activeContent ? (
                    <StructuredContentBlock icon={activeContent.icon} content={activeContent.content} />
                ) : (
                    <AssignmentBlock
                        stage={stage}
                        onGradeSubmission={onGradeSubmission}
                        isGrading={isGrading}
                        language={language}
                    />
                )}
                 {error && isGrading && (
                    <p className="text-red-400 text-center mt-4">{error}</p>
                 )}
            </div>

            <div className="flex justify-between items-center mt-8 border-t border-base-300 pt-6">
                <button
                    onClick={() => setCurrentStep(s => s - 1)}
                    disabled={currentStep === 0 || stage.isCompleted}
                    className="flex items-center px-4 py-2 font-medium text-base-content-secondary bg-base-300 rounded-lg hover:bg-base-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    {t('back', language)}
                </button>

                {currentStep < contentSteps.length && !stage.isCompleted && (
                    <button 
                        onClick={() => setCurrentStep(s => s + 1)} 
                        className="flex items-center px-6 py-2 font-bold text-white bg-brand-primary rounded-lg hover:bg-indigo-500 transition-colors"
                    >
                        <span>
                            {currentStep === contentSteps.length - 1 
                                ? t('goToAssignment', language) 
                                : `${t('continueTo', language)} ${t(contentSteps[currentStep + 1].key as 'caseStudy' | 'practicalExercise', language)}`}
                        </span>
                        <ArrowRightIcon className="w-5 h-5 ml-2" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default StageDetail;