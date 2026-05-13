import React from 'react';

const LanguageSelector = ({ languages, activeVideo, activeLang, setActiveLang }) => {
    // Language code to display name mapping
    const displayNames = {
        'en': 'EN', 'hi': 'HIN', 'te': 'TEL', 'bn': 'BEN',
        'mr': 'MAR', 'ta': 'TAM', 'ur': 'URD', 'gu': 'GUJ',
        'kn': 'KAN', 'ml': 'MAL', 'or': 'ODI', 'pa': 'PUN',
        'as': 'ASS', 'mai': 'MAI', 'sat': 'SAN', 'ks': 'KAS',
        'ne': 'NEP', 'sd': 'SIN', 'kok': 'KOK', 'doi': 'DOG',
        'mni': 'MAN', 'brx': 'BOD', 'sa': 'SAN', 'es': 'ES', 'fr': 'FR'
    };

    return (
        <div className="flex flex-wrap gap-1 max-w-[200px] justify-end">
            {languages
                .filter(l => activeVideo?.transcripts?.some(t => t.language === l.code))
                .map(lang => (
                    <button
                        key={lang.code}
                        onClick={() => setActiveLang(lang.code)}
                        className={`
                            px-2 py-1 rounded-lg flex items-center justify-center text-xs font-bold transition-all border
                            ${activeLang === lang.code
                                ? 'bg-cyber-cyan/10 border-cyber-cyan/40 text-cyber-cyan shadow-cyber-glow'
                                : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20'
                            }
                        `}
                        title={lang.name}
                    >
                        {displayNames[lang.code] || lang.code.toUpperCase()}
                    </button>
                ))
            }
        </div>
    );
};

export default LanguageSelector;

