import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { DownloadIcon } from './IconComponents';
import { t } from '../lib/i18n';
import type { Language } from '../types';

interface BusinessPlanDisplayProps {
    planContent: string;
    startupIdea: string;
    language: Language;
}

const BusinessPlanDisplay: React.FC<BusinessPlanDisplayProps> = ({ planContent, startupIdea, language }) => {
    const [htmlContent, setHtmlContent] = useState('');

    useEffect(() => {
        if (planContent) {
            // marked.parse returns a promise which we resolve to set the HTML content
            marked.parse(planContent).then(html => {
                setHtmlContent(html);
            });
        }
    }, [planContent]);

    const handleDownload = () => {
        const blob = new Blob([planContent], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const filename = `${startupIdea.toLowerCase().replace(/\s+/g, '-')}-business-plan.md`;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="bg-base-200 rounded-2xl p-6 md:p-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-4xl font-extrabold tracking-tight">{t('planTitle', language)}</h2>
                <button
                    onClick={handleDownload}
                    className="flex items-center px-4 py-2 font-bold text-white bg-brand-secondary rounded-lg hover:bg-emerald-500 transition-colors w-full sm:w-auto justify-center"
                >
                    <DownloadIcon className="w-5 h-5 mr-2" />
                    {t('downloadPlan', language)}
                </button>
            </div>
            <div className="border-t border-base-300 my-4"></div>
            <div 
                className="prose prose-invert max-w-none prose-p:text-base-content-secondary prose-headings:text-base-content prose-h2:text-brand-primary prose-h3:text-brand-secondary prose-strong:text-base-content"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
        </div>
    );
};

export default BusinessPlanDisplay;