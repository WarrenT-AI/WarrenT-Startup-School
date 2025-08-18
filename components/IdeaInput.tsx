import React, { useState } from 'react';
import type { Language } from '../types';
import { t } from '../lib/i18n';
import { LogoIcon } from './IconComponents';

interface IdeaInputProps {
    onStartCourse: (idea: string) => void;
    language: Language;
}

const IdeaInput: React.FC<IdeaInputProps> = ({ onStartCourse, language }) => {
    const [idea, setIdea] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (idea.trim()) {
            onStartCourse(idea.trim());
        }
    };

    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full space-y-8 bg-base-200 p-10 rounded-2xl shadow-xl">
                <div>
                    <LogoIcon className="mx-auto h-16 w-auto text-brand-primary" />
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-base-content">
                        {t('ideaTitle', language)}
                    </h2>
                    <p className="mt-2 text-center text-md text-base-content-secondary">
                        {t('ideaSubtitle', language)}
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="idea-description" className="sr-only">
                                {t('ideaTitle', language)}
                            </label>
                            <textarea
                                id="idea-description"
                                name="idea"
                                rows={4}
                                value={idea}
                                onChange={(e) => setIdea(e.target.value)}
                                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-base-300 bg-base-100 placeholder-base-content-secondary text-base-content focus:outline-none focus:ring-brand-primary focus:border-brand-primary focus:z-10 text-md"
                                placeholder={t('ideaPlaceholder', language)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={!idea.trim()}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-md font-medium rounded-md text-white bg-brand-primary hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:bg-base-300 disabled:cursor-not-allowed"
                        >
                            {t('ideaButton', language)}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default IdeaInput;
