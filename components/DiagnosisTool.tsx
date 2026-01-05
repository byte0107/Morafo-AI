
import React, { useState, useRef } from 'react';
import { analyzeHealthImage } from '../services/geminiService';
import { Upload, Loader2, AlertCircle, CheckCircle, Info, Bird, Rabbit, Store, MapPin, ExternalLink, X, Stethoscope, RefreshCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Language } from '../types';

interface DiagnosisToolProps {
    language: Language;
}

const DiagnosisTool: React.FC<DiagnosisToolProps> = ({ language }) => {
  const [image, setImage] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [animalType, setAnimalType] = useState('Broiler Chicken');
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = {
      title: language === 'st' ? "Tlhahlobo ea Likhoho & Mebutla" : "Poultry & Rabbit Diagnosis",
      subtitle: language === 'st' ? "Kenya setšoantšo sa phoofolo e kulang bakeng sa tlhahlobo." : "Upload a photo of your sick animal for an AI observation.",
      selectType: language === 'st' ? "Khetha Mofuta oa Phoofolo" : "Select Animal Type",
      clickToUpload: language === 'st' ? "Tobetsa ho kenya foto" : "Click to upload photo",
      describe: language === 'st' ? "Hlalosa Matšoao" : "Describe Symptoms",
      diagnose: language === 'st' ? "Hlahloba & Batla Litlhare" : "Diagnose & Find Treatment",
      diagnosing: language === 'st' ? "Ea Hlahloba..." : "Diagnosing...",
      resultTitle: language === 'st' ? "Sephetho sa Tlhahlobo" : "AI Observation Result",
      sourcingTitle: "Recommended Local Suppliers",
      sourcingDesc: language === 'st' ? "Etela litsi tsena bakeng sa litlhare tse netefalitsoeng." : "Visit these trusted Agrivet clinics for medication.",
      disclaimer: language === 'st' ? "Kamehla bona ngaka ea liphoofolo." : "Note: This is an AI guide. Always consult a vet for high mortality cases.",
      errorTitle: language === 'st' ? "Phoso ea Tlhahlobo" : "Analysis Blocked/Error",
      errorDesc: language === 'st' ? "MorafoAI ha e khone ho hlahloba setšoantšo sena. Leka setšoantšo se hlakileng haholoanyane." : "MorafoAI was unable to process this image. This usually happens due to low photo quality or strict AI safety filters.",
      fallbackAdvice: language === 'st' ? "Mehato ea pele ea pholiso:" : "General First-Aid Steps:"
  };

  const localSuppliers = [
      { name: "Maseru Agrivet Clinic", loc: "Old Industrial, Maseru", service: "Vaccines & Surgery" },
      { name: "Leribe Co-op", loc: "Hlotse Main", service: "Bulk Meds & Feed" },
      { name: "Mafeteng Animal Health", loc: "Bus Stop Area", service: "General Poultry Support" }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult('');
        setError(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiagnose = async () => {
    if (!image) return;
    setLoading(true);
    setResult('');
    setError(false);
    try {
      const diagnosis = await analyzeHealthImage(image, notes, animalType, language);
      setResult(diagnosis);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const animalTypes = language === 'st' 
    ? ['Likhoho tsa Broiler', 'Likhoho tsa Mahe', 'Khoho ea Sesotho', 'Mmutla']
    : ['Broiler Chicken', 'Layer Chicken', 'Free-range (Sesotho)', 'Rabbit'];

  return (
    <div className="flex flex-col h-full bg-slate-50 rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 bg-red-600 text-white shadow-md">
        <h2 className="text-2xl font-black flex items-center gap-3 uppercase tracking-tight">
          <Stethoscope className="w-8 h-8" />
          {t.title}
        </h2>
        <p className="text-red-100 mt-2 font-medium opacity-90">{t.subtitle}</p>
      </div>

      <div className="p-6 overflow-y-auto space-y-6 scrollbar-hide">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{t.selectType}</label>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
               {animalTypes.map(type => (
                   <button 
                     key={type}
                     onClick={() => setAnimalType(type)}
                     className={`p-3 rounded-2xl border-2 text-sm font-bold flex flex-col items-center justify-center gap-2 transition-all
                        ${animalType === type ? 'bg-red-50 text-red-700 border-red-500 shadow-md' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'}
                     `}
                   >
                       {(type.includes('Mmutla') || type.includes('Rabbit')) ? <Rabbit size={20} /> : <Bird size={20} />}
                       <span className="text-center leading-tight">{type}</span>
                   </button>
               ))}
           </div>
        </div>

        <div 
          className="border-2 border-dashed border-slate-300 rounded-[32px] p-8 text-center hover:bg-white hover:border-red-400 transition-all cursor-pointer bg-slate-100/30 group"
          onClick={() => fileInputRef.current?.click()}
        >
          {image ? (
            <div className="relative inline-block">
              <img src={image} alt="Preview" className="max-h-72 rounded-3xl shadow-2xl border-4 border-white" />
              <button onClick={(e) => { e.stopPropagation(); setImage(null); setResult(''); setError(false); }} className="absolute -top-4 -right-4 bg-red-600 text-white p-2.5 rounded-full shadow-2xl hover:bg-red-700 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 text-slate-400 py-12">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <Upload className="w-10 h-10 text-red-500" />
              </div>
              <div>
                <p className="font-black text-slate-700 text-lg">{t.clickToUpload}</p>
                <p className="text-xs mt-1 font-medium">Use a clear photo of the sick part (e.g. eye, legs, stool).</p>
              </div>
            </div>
          )}
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{t.describe}</label>
          <textarea
            className="w-full p-4 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-red-50 focus:border-red-500 bg-slate-50 text-slate-800 font-bold placeholder:text-slate-300 outline-none transition-all"
            rows={3}
            placeholder="e.g. Not eating, white diarrhea, swollen head..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <button
          onClick={handleDiagnose}
          disabled={!image || loading}
          className={`w-full py-6 rounded-3xl font-black text-white flex items-center justify-center gap-3 transition-all shadow-2xl text-xl uppercase tracking-widest
            ${!image || loading ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-red-600 hover:bg-red-700 hover:-translate-y-1 active:translate-y-0'}
          `}
        >
          {loading ? <><Loader2 className="w-7 h-7 animate-spin" /> {t.diagnosing}</> : <><CheckCircle className="w-7 h-7" /> {t.diagnose}</>}
        </button>

        {error && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-8 bg-amber-50 rounded-[40px] border-2 border-amber-200 shadow-xl relative overflow-hidden">
                    <div className="flex gap-4 items-start relative z-10">
                        <AlertCircle className="w-10 h-10 text-amber-600 shrink-0" />
                        <div>
                            <h3 className="font-black text-2xl text-amber-900 mb-2">{t.errorTitle}</h3>
                            <p className="text-amber-800 font-medium leading-relaxed mb-6">{t.errorDesc}</p>
                            
                            <div className="bg-white/60 p-6 rounded-3xl border border-amber-200">
                                <h4 className="font-black text-amber-900 flex items-center gap-2 mb-3">
                                    <Info size={18} /> {t.fallbackAdvice}
                                </h4>
                                <ul className="text-sm text-amber-800 space-y-2 font-bold list-disc pl-4">
                                    <li>{language === 'st' ? "Arola phoofolo e kulang hang-hang." : "Isolate the sick animal immediately."}</li>
                                    <li>{language === 'st' ? "Kenya Lekhala kapa Moringa metsing a tsona." : "Add Aloe (Lekhala) or Moringa to their drinking water."}</li>
                                    <li>{language === 'st' ? "Hloekisa ntlo ea likhoho ka sesepa le metsi." : "Sanitize the chicken coop thoroughly."}</li>
                                    <li>{language === 'st' ? "Bona ngaka ea liphoofolo litsing tsa Agrivet." : "Consult a vet at the nearest Agrivet center."}</li>
                                </ul>
                            </div>
                            
                            <button onClick={handleDiagnose} className="mt-6 flex items-center gap-2 text-amber-900 font-black uppercase text-xs tracking-widest hover:underline">
                                <RefreshCcw size={14} /> Try again with different photo
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Always show sourcing below if error occurs to help anyway */}
                <div className="p-8 bg-slate-900 rounded-[40px] text-white shadow-xl">
                    <h4 className="font-black text-2xl mb-4 flex items-center gap-3">
                        <Store className="w-8 h-8 text-blue-400" />
                        Recommended Suppliers
                    </h4>
                    <div className="space-y-4">
                        {localSuppliers.map((s, i) => (
                            <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                                <div>
                                    <div className="font-black">{s.name}</div>
                                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-1"><MapPin size={12} /> {s.loc}</div>
                                </div>
                                <div className="text-[10px] bg-blue-600 px-3 py-1 rounded-full font-black uppercase tracking-wider">{s.service}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {result && (
          <div className="mt-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-8 bg-white rounded-[40px] border border-slate-200 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-red-50 rounded-full -mr-24 -mt-24 opacity-60"></div>
                <h3 className="font-black text-3xl text-slate-900 mb-8 flex items-center gap-4 pb-6 border-b border-slate-100">
                  <AlertCircle className="w-10 h-10 text-red-500" />
                  {t.resultTitle}
                </h3>
                <div className="prose prose-slate md:prose-lg max-w-none text-slate-700 font-medium leading-relaxed prose-headings:font-black prose-headings:text-slate-900">
                  <ReactMarkdown>{result}</ReactMarkdown>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-8 bg-green-600 rounded-[40px] text-white shadow-xl">
                    <h4 className="font-black text-2xl mb-2 flex items-center gap-3">
                        <Store className="w-8 h-8" />
                        Suppliers
                    </h4>
                    <p className="text-green-100 text-sm mb-6 font-medium">{t.sourcingDesc}</p>
                    <div className="space-y-4">
                        {localSuppliers.map((s, i) => (
                            <div key={i} className="bg-white/10 p-4 rounded-2xl border border-white/20 flex items-center justify-between">
                                <div>
                                    <div className="font-black">{s.name}</div>
                                    <div className="text-xs text-green-200 flex items-center gap-1 mt-1"><MapPin size={12} /> {s.loc}</div>
                                </div>
                                <div className="text-[10px] bg-green-500 px-3 py-1 rounded-full font-black uppercase tracking-wider">{s.service}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-8 bg-slate-900 rounded-[40px] text-white shadow-xl flex flex-col justify-between border-b-8 border-red-600">
                    <div>
                        <Info className="w-8 h-8 text-blue-400 mb-6" />
                        <h4 className="font-black text-2xl mb-3">Advice</h4>
                        <p className="text-slate-400 font-bold text-base italic leading-relaxed">
                            "MorafoAI helps you source vaccines and meds from local Agrivet shops and Pharmacies."
                        </p>
                    </div>
                    <button className="w-full py-4 mt-8 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black flex items-center justify-center gap-3 transition-all border border-white/10">
                        <ExternalLink size={20} />
                        Agrivet Portal
                    </button>
                </div>
            </div>

            <p className="text-center text-[10px] text-slate-400 font-black uppercase tracking-[0.4em] pb-8 pt-4">{t.disclaimer}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Internal icon fix
const BirdIcon = ({ size }: { size: number }) => <Bird size={size} />;

export default DiagnosisTool;
