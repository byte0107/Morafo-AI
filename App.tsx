
import React, { useState } from 'react';
import { ViewState, Language } from './types';
import ChatInterface from './components/ChatInterface';
import DiagnosisTool from './components/DiagnosisTool';
import MarketDashboard from './components/MarketDashboard';
import WeatherWidget from './components/WeatherWidget';
import FeedFinder from './components/FeedFinder';
import EconomicInsights from './components/EconomicInsights';
import Logo from './components/Logo';
import { LayoutDashboard, MessageCircle, Stethoscope, LineChart, Menu, X, Leaf, Sprout, Search, BookOpen, Globe } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('en');

  // Translations for Home/Nav
  const t = {
      greeting: language === 'st' ? "Khotso! Ke 'na MorafoAI" : "Khotso! I am MorafoAI",
      intro: language === 'st' 
        ? "Mothusi oa hau oa temo ea likhoho le mebutla. Fumana keletso ea litsebi ka Likhoho tsa Broiler, tsa Mahe, le tsa Sesotho."
        : "Your dedicated poultry & rabbit farming assistant. Get expert advice on Broilers, Layers, and Free-range chickens in Lesotho.",
      askBtn: language === 'st' ? "Botsa ka Likhoho" : "Ask about Chickens",
      navDash: language === 'st' ? "Lekhotla (Dashboard)" : "Dashboard",
      navChat: language === 'st' ? "Moqoqo (Chat)" : "Chat (Moqoqo)",
      navDoc: language === 'st' ? "Ngaka ea Likhoho" : "Poultry Doctor",
      navMarket: language === 'st' ? "Maraka" : "Marketplace",
      navFeed: language === 'st' ? "Batla Lijo" : "Find Feed (Lijo)",
      navInsight: language === 'st' ? "Tsebo ea Moruo" : "Cultural Insights",
      cardDocTitle: language === 'st' ? "Ngaka ea Likhoho" : "Poultry Doctor",
      cardDocDesc: language === 'st' ? "Hlahloba mafu a kang Newcastle le Coccidiosis." : "Diagnose Newcastle, Coccidiosis, and other diseases.",
      cardFeedTitle: language === 'st' ? "Batla Lijo" : "Find Feed (Lijo)",
      cardFeedDesc: language === 'st' ? "Fumana mabenkele a lijo tsa likhoho seterekeng sa hau." : "Locate the nearest poultry feed suppliers in your district.",
      cardMarketTitle: language === 'st' ? "Maraka oa Likhoho" : "Chicken Market",
      cardMarketDesc: language === 'st' ? "Rekisa likhoho kapa u hlahlobe litheko tsa mahe." : "Sell your broilers or check egg prices.",
      cardInsightTitle: language === 'st' ? "Tsebo ea Moruo" : "Cultural Insights",
      cardInsightDesc: language === 'st' ? "Tlhahlobo ea moruo le mekhoa ea temo ea Basotho." : "Economic analysis & Basotho farming practices.",
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.CHAT:
        return <ChatInterface language={language} />;
      case ViewState.DIAGNOSIS:
        return <DiagnosisTool language={language} />;
      case ViewState.MARKET:
        return <MarketDashboard language={language} />;
      case ViewState.FEED:
        return <FeedFinder language={language} />;
      case ViewState.INSIGHTS:
        return <EconomicInsights language={language} />;
      case ViewState.HOME:
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-24">
            {/* Welcome Banner */}
            <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-green-800 to-green-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-white/20 px-2 py-1 rounded text-xs font-semibold">Poultry Edition</span>
                        <h1 className="text-2xl md:text-3xl font-bold">{t.greeting}</h1>
                    </div>
                    <p className="text-green-50 text-base md:text-lg max-w-lg leading-relaxed mb-4">
                        {t.intro}
                    </p>
                    <button 
                        onClick={() => setCurrentView(ViewState.CHAT)}
                        className="bg-white text-green-800 px-6 py-3 rounded-lg font-bold text-sm hover:bg-green-50 transition shadow-md flex items-center gap-2"
                    >
                        <MessageCircle size={18} />
                        {t.askBtn}
                    </button>
                </div>
                <Leaf className="absolute -bottom-6 -right-6 w-40 h-40 text-white opacity-10 rotate-12" />
                <Sprout className="absolute top-4 right-10 w-12 h-12 text-white opacity-10" />
            </div>

            {/* Quick Actions */}
            <div 
                onClick={() => setCurrentView(ViewState.DIAGNOSIS)}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition cursor-pointer flex flex-col items-center text-center gap-3 group relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full block animate-pulse"></span>
                </div>
                <div className="p-4 bg-red-50 text-red-600 rounded-full group-hover:bg-red-100 transition scale-110">
                    <Stethoscope size={32} />
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 text-lg">{t.cardDocTitle}</h3>
                    <p className="text-sm text-gray-500 mt-1">{t.cardDocDesc}</p>
                </div>
            </div>

            <div 
                onClick={() => setCurrentView(ViewState.FEED)}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition cursor-pointer flex flex-col items-center text-center gap-3 group"
            >
                <div className="p-4 bg-amber-50 text-amber-600 rounded-full group-hover:bg-amber-100 transition scale-110">
                    <Search size={32} />
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 text-lg">{t.cardFeedTitle}</h3>
                    <p className="text-sm text-gray-500 mt-1">{t.cardFeedDesc}</p>
                </div>
            </div>

            <div 
                onClick={() => setCurrentView(ViewState.MARKET)}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition cursor-pointer flex flex-col items-center text-center gap-3 group"
            >
                <div className="p-4 bg-blue-50 text-blue-600 rounded-full group-hover:bg-blue-100 transition scale-110">
                    <LineChart size={32} />
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 text-lg">{t.cardMarketTitle}</h3>
                    <p className="text-sm text-gray-500 mt-1">{t.cardMarketDesc}</p>
                </div>
            </div>

            <div 
                onClick={() => setCurrentView(ViewState.INSIGHTS)}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition cursor-pointer flex flex-col items-center text-center gap-3 group"
            >
                <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full group-hover:bg-indigo-100 transition scale-110">
                    <BookOpen size={32} />
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 text-lg">{t.cardInsightTitle}</h3>
                    <p className="text-sm text-gray-500 mt-1">{t.cardInsightDesc}</p>
                </div>
            </div>

            {/* Weather Widget */}
            <div className="md:col-span-2">
                 <WeatherWidget language={language} />
            </div>
            
             <div className="md:col-span-2 text-center py-6 border-t border-gray-100 mt-4">
                <p className="text-xs text-gray-500 font-bold">Powered by T&R Web Solutions</p>
             </div>
          </div>
        );
    }
  };

  const NavItem = ({ view, icon: Icon, label }: { view: ViewState; icon: any; label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setMobileMenuOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium mb-1
        ${currentView === view 
          ? 'bg-green-600 text-white shadow-md' 
          : 'text-gray-600 hover:bg-gray-100'}`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  const LanguageSwitcher = () => (
      <div className="flex bg-gray-100 p-1 rounded-lg">
          <button 
             onClick={() => setLanguage('en')} 
             className={`flex-1 px-3 py-1 text-xs font-bold rounded-md transition ${language === 'en' ? 'bg-white shadow text-green-700' : 'text-gray-500'}`}
          >
              EN
          </button>
          <button 
             onClick={() => setLanguage('st')} 
             className={`flex-1 px-3 py-1 text-xs font-bold rounded-md transition ${language === 'st' ? 'bg-white shadow text-green-700' : 'text-gray-500'}`}
          >
              ST
          </button>
      </div>
  );

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-slate-50 overflow-hidden font-sans">
      {/* Mobile Header */}
      <div className="md:hidden flex-none h-16 bg-white shadow-sm z-30 flex items-center justify-between px-4 border-b border-gray-100">
        <div className="flex items-center gap-2" onClick={() => setCurrentView(ViewState.HOME)}>
            <Logo size="sm" />
            <span className="font-bold text-lg text-gray-800 tracking-tight">MorafoAI</span>
        </div>
        <div className="flex items-center gap-3">
             <LanguageSwitcher />
             <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-600 active:bg-gray-100 rounded-lg">
                {mobileMenuOpen ? <X /> : <Menu />}
             </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Navigation */}
        <div className={`fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 shadow-xl md:shadow-none
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            
            <div className="h-20 flex items-center px-6 border-b border-gray-100 gap-3 justify-between">
               <div className="flex items-center gap-3">
                    <Logo size="md" />
                    <div>
                        <h1 className="font-bold text-xl text-gray-900 tracking-tight leading-none">MorafoAI</h1>
                        <span className="text-xs text-green-600 font-medium tracking-wide">Poultry Assistant</span>
                    </div>
               </div>
            </div>

            <div className="px-6 py-4">
               <LanguageSwitcher />
            </div>

            <nav className="px-4 overflow-y-auto max-h-[calc(100vh-180px)]">
            <NavItem view={ViewState.HOME} icon={LayoutDashboard} label={t.navDash} />
            <NavItem view={ViewState.CHAT} icon={MessageCircle} label={t.navChat} />
            <NavItem view={ViewState.DIAGNOSIS} icon={Stethoscope} label={t.navDoc} />
            <NavItem view={ViewState.MARKET} icon={LineChart} label={t.navMarket} />
            <NavItem view={ViewState.FEED} icon={Search} label={t.navFeed} />
            <NavItem view={ViewState.INSIGHTS} icon={BookOpen} label={t.navInsight} />
            </nav>

            <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 bg-gray-50/50">
                <div className="text-center">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Morafo Poultry Co.</p>
                    <p className="text-xs text-gray-600 font-bold">Advanced Livestock & Organic Farming Assistant</p>
                </div>
            </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 h-full relative overflow-y-auto w-full scrollbar-hide">
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full min-h-full">
                {renderContent()}
            </div>
        </main>
      </div>
      
      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div 
            className="fixed inset-0 bg-black/30 z-30 md:hidden backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
