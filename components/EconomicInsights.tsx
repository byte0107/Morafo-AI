
import React, { useEffect, useState } from 'react';
import { getCulturalEconomicInsights } from '../services/geminiService';
import { BookOpen, TrendingUp, Loader2, Feather, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Language } from '../types';

interface EconomicInsightsProps {
    language: Language;
}

const EconomicInsights: React.FC<EconomicInsightsProps> = ({ language }) => {
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState(true);

    const t = {
        title: language === 'st' ? "Tsebo ea Moruo le Setso" : "Cultural & Economic Insights",
        subtitle: language === 'st' ? "Kopanyo ea moruo oa sejoale-joale le litloaelo tsa Basotho." : "Blending modern poultry economics with traditional Basotho practices.",
        analyzing: language === 'st' ? "E hlahloba mekhoa ea 'maraka..." : "Analyzing local market trends...",
        didYouKnow: language === 'st' ? "Na u ne u tseba?" : "Did you know?",
        fact: language === 'st' 
            ? "Tlhokahalo ea 'Khoho ea Sesotho' e phahama haholo ka Tšitoe le Paseka. Ho rera potoloho ea hau ho qeta likhoeling tsena ho ka eketsa phaello ea hau habeli."
            : "The demand for \"Khoho ea Sesotho\" (Free range) peaks during December and Easter. Planning your production cycle to finish in these months can double your profits compared to selling in ordinary months."
    };

    const loadContent = () => {
        setLoading(true);
        // Reset content to ensure we don't show old data while loading
        setContent(''); 
        
        getCulturalEconomicInsights(language).then(data => {
            setContent(data);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        loadContent();
    }, [language]);

    return (
        <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 bg-indigo-50 border-b border-indigo-100 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
                        <BookOpen className="w-6 h-6" />
                        {t.title}
                    </h2>
                    <p className="text-sm text-indigo-700 mt-1">
                        {t.subtitle}
                    </p>
                </div>
                <button 
                    onClick={loadContent} 
                    className="p-2 bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200 transition"
                    disabled={loading}
                >
                    <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 relative">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                        <Loader2 className="w-8 h-8 animate-spin mb-2 text-indigo-600" />
                        <p>{t.analyzing}</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="prose prose-indigo max-w-none text-gray-800">
                            {/* Decorative Icon only visible on desktop to save space on mobile */}
                            <div className="hidden md:block float-right bg-indigo-50 p-4 rounded-full ml-6 mb-4 text-indigo-500">
                                <Feather size={32} />
                            </div>
                            
                            <ReactMarkdown>{content}</ReactMarkdown>
                        </div>

                        <div className="mt-8 p-5 bg-yellow-50 rounded-xl border border-yellow-200">
                            <h4 className="font-bold text-yellow-800 flex items-center gap-2 mb-2">
                                <TrendingUp size={18} />
                                {t.didYouKnow}
                            </h4>
                            <p className="text-sm text-yellow-900 leading-relaxed">
                                {t.fact}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EconomicInsights;
