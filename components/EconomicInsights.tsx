
import React, { useEffect, useState } from 'react';
import { getCulturalEconomicInsights } from '../services/geminiService';
import { BookOpen, TrendingUp, Loader2, Feather, RefreshCw, Quote, History, Lightbulb, ArrowRight, Bookmark } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Language } from '../types';

interface EconomicInsightsProps {
    language: Language;
}

const EconomicInsights: React.FC<EconomicInsightsProps> = ({ language }) => {
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState(true);

    const t = {
        title: language === 'st' ? "Tsebo ea Moruo le Setso" : "Insights & Heritage",
        subtitle: language === 'st' ? "Kopanyo ea moruo oa sejoale-joale le litloaelo tsa Basotho." : "Analyzing the intersection of modern poultry economics and Basotho heritage.",
        analyzing: language === 'st' ? "E hlahloba mekhoa ea 'maraka..." : "Consulting market records...",
        didYouKnow: language === 'st' ? "Na u ne u tseba?" : "Market Wisdom",
        fact: language === 'st' 
            ? "Tlhokahalo ea 'Khoho ea Sesotho' e phahama haholo ka Tšitoe le Paseka. Ho rera potoloho ea hau ho qeta likhoeling tsena ho ka eketsa phaello ea hau habeli."
            : "The demand for \"Khoho ea Sesotho\" peaks during December (Christmas) and Easter. Small-scale farmers who align their slaughter cycle with these holidays often see 40% higher profit margins.",
        tradition: language === 'st' ? "Meetlo" : "Traditional Wisdom",
        modernity: language === 'st' ? "Tsoelo-pele" : "Modern Market"
    };

    const loadContent = () => {
        setLoading(true);
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
        <div className="flex flex-col h-full bg-slate-50 rounded-[40px] shadow-sm border border-slate-200 overflow-hidden">
            {/* Editorial Header */}
            <div className="p-10 bg-indigo-950 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <Feather size={200} className="rotate-12" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-1.5 w-12 bg-indigo-500 rounded-full"></div>
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-indigo-400">Farmer Heritage Journal</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none mb-4">
                            {t.title}
                        </h2>
                        <p className="text-indigo-300 mt-2 font-bold text-base md:text-lg leading-relaxed opacity-80">
                            {t.subtitle}
                        </p>
                    </div>
                    <button 
                        onClick={loadContent} 
                        className="p-5 bg-white/10 text-white rounded-3xl hover:bg-white/20 transition backdrop-blur-xl border border-white/10 shadow-2xl active:scale-95 group"
                        disabled={loading}
                    >
                        <RefreshCw size={28} className={loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-12 scrollbar-hide">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-96 text-slate-400">
                        <div className="relative mb-8">
                            <div className="w-24 h-24 border-[6px] border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                            <BookOpen className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600 w-8 h-8" />
                        </div>
                        <p className="font-black uppercase tracking-[0.3em] text-sm animate-pulse">{t.analyzing}</p>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto space-y-16">
                        {/* Summary Highlights */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl flex gap-6 items-start hover:border-indigo-200 transition-colors">
                                <div className="p-4 bg-indigo-50 text-indigo-600 rounded-[24px] shadow-inner">
                                    <History size={32} />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 text-xl mb-2">{t.tradition}</h4>
                                    <p className="text-sm text-slate-500 font-bold leading-relaxed">Honoring the organic foundations of Lesotho farming legacy.</p>
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl flex gap-6 items-start hover:border-green-200 transition-colors">
                                <div className="p-4 bg-green-50 text-green-600 rounded-[24px] shadow-inner">
                                    <TrendingUp size={32} />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 text-xl mb-2">{t.modernity}</h4>
                                    <p className="text-sm text-slate-500 font-bold leading-relaxed">Embracing precision markets and data-driven poultry growth.</p>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Body */}
                        <article className="relative bg-white p-8 md:p-16 rounded-[48px] shadow-2xl border border-slate-50 overflow-hidden">
                            <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600"></div>
                            <div className="prose prose-indigo md:prose-xl max-w-none text-slate-700 font-bold leading-[1.8] prose-headings:font-black prose-headings:text-slate-900 prose-headings:uppercase prose-headings:tracking-tighter prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50/50 prose-blockquote:rounded-[32px] prose-blockquote:p-8 prose-blockquote:not-italic prose-blockquote:text-indigo-950 prose-img:rounded-3xl">
                                <ReactMarkdown 
                                    components={{
                                        h1: ({children}) => <h1 className="text-4xl border-b-8 border-indigo-100 pb-4 mb-8">{children}</h1>,
                                        h2: ({children}) => <h2 className="text-2xl mt-12 mb-6 flex items-center gap-3"><Bookmark className="text-indigo-500" size={24} /> {children}</h2>,
                                        p: ({children}) => <p className="mb-8">{children}</p>,
                                        blockquote: ({children}) => (
                                            <div className="bg-indigo-50/30 p-10 rounded-[40px] my-10 relative italic border-l-[12px] border-indigo-500 text-indigo-900 font-black text-2xl leading-snug">
                                                <Quote className="absolute -top-4 -right-4 text-indigo-200 w-20 h-20 opacity-30" />
                                                {children}
                                            </div>
                                        )
                                    }}
                                >
                                    {content}
                                </ReactMarkdown>
                            </div>
                        </article>

                        {/* Market Wisdom Callout */}
                        <div className="bg-gradient-to-br from-amber-400 to-orange-600 p-10 rounded-[56px] text-white shadow-2xl shadow-amber-200 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-700"></div>
                            <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                                <div className="p-6 bg-white/20 backdrop-blur-2xl rounded-[32px] shadow-2xl shrink-0 group-hover:rotate-12 transition-transform duration-500">
                                    <Lightbulb size={56} className="text-yellow-100" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="h-1 w-8 bg-white/50 rounded-full"></div>
                                        <h4 className="text-sm font-black uppercase tracking-[0.4em] text-white/80">
                                            {t.didYouKnow}
                                        </h4>
                                    </div>
                                    <p className="text-2xl md:text-3xl font-black text-white leading-tight tracking-tight">
                                        "{t.fact}"
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="py-12 border-t border-slate-100 text-center flex flex-col items-center gap-4">
                            <Feather className="text-slate-200 w-12 h-12" />
                            <p className="text-[12px] font-black text-slate-300 uppercase tracking-[0.6em]">MorafoAI Heritage Archive</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EconomicInsights;
