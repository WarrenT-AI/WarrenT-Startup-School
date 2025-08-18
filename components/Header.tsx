
import React from 'react';
import { LogoIcon } from './IconComponents';
import type { Language } from '../types';
import { t } from '../lib/i18n';

interface HeaderProps {
    language: Language;
    onLanguageChange: (lang: Language) => void;
}

const LanguageButton: React.FC<{
    lang: Language;
    currentLang: Language;
    onClick: (lang: Language) => void;
    label: string;
}> = ({ lang, currentLang, onClick, label }) => {
    const isActive = lang === currentLang;
    const classes = `
        px-3 py-1 text-sm font-medium rounded-md transition-colors
        ${isActive
            ? 'bg-brand-primary text-white'
            : 'text-base-content-secondary hover:bg-base-200 hover:text-base-content'
        }
    `;
    return (
        <button onClick={() => onClick(lang)} className={classes}>
            {label}
        </button>
    );
};


const Header: React.FC<HeaderProps> = ({ language, onLanguageChange }) => {
  return (
    <header className="py-6 px-4 md:px-8 border-b border-base-300">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
            <LogoIcon className="w-10 h-10 text-brand-primary" />
            <div className="ml-4">
                <h1 className="text-2xl md:text-3xl font-bold text-base-content tracking-tight">
                {t('title', language)}
                </h1>
                <p className="text-sm md:text-base text-base-content-secondary">
                    {t('tagline', language)}
                </p>
            </div>
        </div>
        <div className="flex items-center space-x-2 bg-base-300 p-1 rounded-lg">
            <LanguageButton lang="en" currentLang={language} onClick={onLanguageChange} label="EN" />
            <LanguageButton lang="zh" currentLang={language} onClick={onLanguageChange} label="中文" />
        </div>
      </div>
    </header>
  );
};

export default Header;
