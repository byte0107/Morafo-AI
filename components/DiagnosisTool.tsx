
import React, { useState, useRef } from 'react';
import { analyzeHealthImage } from '../services/geminiService';
import { Camera, Upload, Loader2, AlertCircle, CheckCircle, Info, Bird, Rabbit, Store, MapPin, ExternalLink, X, Stethoscope } from 'lucide-react';
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
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = {
      title: language === 'st' ? "Tlhahlobo ea Likhoho & Mebutla" : "Poultry & Rabbit Diagnosis",
      subtitle: language === 'st' ? "Kenya setšoantšo sa phoofolo e kulang. MorafoAI e tla fana ka kalafo le moo u ka rekang litlhare." : "Upload a photo of your sick animal. MorafoAI will identify the disease and tell you where to buy medicine.",
      selectType: language === 'st' ? "Khetha Mofuta oa Phoofolo" : "Select Animal Type",
      clickToUpload: language === 'st' ? "Tobetsa ho kenya foto" : "Click to upload photo",
      describe: language === 'st' ? "Hlalosa Matšoao" : "Describe Symptoms",
      diagnose: language === 'st' ? "Hlahloba & Batla Litlhare" : "Diagnose & Find Treatment",
      diagnosing: language === 'st' ? "Ea Hlahloba..." : "Diagnosing...",
      clear: language === 'st' ? "Hlakola" : "Clear",
      info: language === 'st' ? "MorafoAI e u thusa ho fumana litlhare litsing tsa Agrivet le li-Pharmacy tsa Lesotho." : "MorafoAI helps you source vaccines and meds from local Agrivet shops and Pharmacies.",
      resultTitle: language === 'st' ? "Sephetho sa Tlhahlobo" : "Diagnosis Result",
      sourcingTitle: language === 'st' ? "Recommended Local Suppliers" : "Recommended Local Suppliers",
      sourcingDesc: language === 'st' ? "Etela litsi tsena tsa Agrivet bakeng sa litlhare tse netefalitsoeng." : "Visit these trusted Agrivet clinics for verified medications and vaccines.",
      disclaimer: language === 'st' ? "Kamehla bona ngaka ea liphoofolo haeba lefu le le kotsi." : "Note: This is an AI guide. Always consult a vet for high mortality cases."
  };

  const localSuppliers = [
      { name: "Maseru Agrivet Clinic", loc: "Old Industrial, Maseru", service: "Vaccines & Surgery" },
      { name: "Leribe Co-op", loc: "Hlotse Main", service: "Bulk Meds & Feed" },
      { name: "Mafeteng Animal Health", loc: "Bus Stop Area", service: "General Poultry Support" }
  ];

  const animalTypes = language === 'st' 
    ? ['Likhoho tsa Broiler', 'Likhoho tsa Mahe', 'Khoho ea Sesotho', 'Mmutla']
    : ['Broiler Chicken', 'Layer Chicken', 'Free-range (Sesotho)', 'Rabbit'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDiagnose = async () => {
    if (!image) return;
    setLoading(true);
    setResult('');
    try {
      const diagnosis = await analyzeHealthImage(image, notes, animalType, language);
      setResult(diagnosis);
    } catch (error) {
      setResult("Error analyzing image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 bg-red-600 text-white shadow-md">
        <h2 className="text-2xl font-black flex items-center gap-3 uppercase tracking-tight">
          <Stethoscope className="w-8 h-8" />
          {t.title}
        </h2>
        <p className="text-red-100 mt-2 font-medium opacity-90 leading-tight">{t.subtitle}</p>
      </div>

      <div className="p-6 overflow-y-auto space-y-6 scrollbar-hide">
        {/* Animal Selection */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{t.selectType}</label>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
               {animalTypes.map(type => (
                   <button 
                     key={type}
                     onClick={() => setAnimalType(type)}
                     className={`p-3 rounded-2xl border-2 text-sm font-bold flex flex-col items-center justify-center gap-2 transition-all duration-200
                        ${animalType === type ? 'bg-red-50 text-red-700 border-red-500 shadow-md ring-2 ring-red-100' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'}
                     `}
                   >
                       {(type.includes('Mmutla') || type.includes('Rabbit')) ? <Rabbit size={20} /> : <Bird size={20} />}
                       <span className="text-center leading-tight">{type}</span>
                   </button>
               ))}
           </div>
        </div>

        {/* Upload Box */}
        <div 
          className="border-2 border-dashed border-slate-300 rounded-[32px] p-8 text-center hover:bg-white hover:border-red-400 transition-all cursor-pointer bg-slate-100/30 group"
          onClick={() => fileInputRef.current?.click()}
        >
          {image ? (
            <div className="relative inline-block">
              <img src={image} alt="Preview" className="max-h-72 rounded-3xl shadow-2xl border-4 border-white" />
              <button onClick={(e) => { e.stopPropagation(); setImage(null); setResult(''); }} className="absolute -top-4 -right-4 bg-red-600 text-white p-2.5 rounded-full shadow-2xl hover:bg-red-700 hover:scale-110 transition active:scale-95">
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 text-slate-400 py-12">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                <Upload className="w-10 h-10 text-red-500" />
              </div>
              <div>
                <p className="font-black text-slate-700 text-lg">{t.clickToUpload}</p>
                <p className="text-xs mt-1 font-medium">Clear photos of eyes, droppings, or legs work best.</p>
              </div>
            </div>
          )}
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>

        {/* Notes */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{t.describe}</label>
          <textarea
            className="w-full p-4 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-red-50 focus:border-red-500 bg-slate-50 text-slate-800 font-bold placeholder:text-slate-300 transition-all outline-none"
            rows={3}
            placeholder="Tell us more: e.g. Diarrhea, sneezing, or low appetite..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handleDiagnose}
          disabled={!image || loading}
          className={`w-full py-6 rounded-3xl font-black text-white flex items-center justify-center gap-3 transition-all shadow-2xl text-xl uppercase tracking-widest
            ${!image || loading ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-red-600 hover:bg-red-700 hover:-translate-y-1 active:translate-y-0'}
          `}
        >
          {loading ? <><Loader2 className="w-7 h-7 animate-spin" /> {t.diagnosing}</> : <><CheckCircle className="w-7 h-7" /> {t.diagnose}</>}
        </button>

        {!result && !loading && (
            <div className="flex gap-4 p-6 bg-blue-600 rounded-3xl text-white shadow-lg shadow-blue-200">
                <div className="p-3 bg-white/20 rounded-2xl shadow-inner shrink-0 self-start">
                    <Info className="w-6 h-6" />
                </div>
                <div>
                    <h4 className="font-black mb-1">{language === 'st' ? "Tsebo ea Bohlokoa" : "How it Works"}</h4>
                    <p className="text-sm font-medium text-blue-50 leading-relaxed">{t.info}</p>
                </div>
            </div>
        )}

        {result && (
          <div className="mt-4 space-y-6">
            {/* AI Result Card */}
            <div className="p-8 bg-white rounded-[40px] border border-slate-200 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-red-50 rounded-full -mr-24 -mt-24 opacity-60"></div>
                <h3 className="font-black text-3xl text-slate-900 mb-8 flex items-center gap-4 pb-6 border-b border-slate-100">
                  <AlertCircle className="w-10 h-10 text-red-500" />
                  {t.resultTitle}
                </h3>
                <div className="prose prose-slate md:prose-lg max-w-none text-slate-700 font-medium leading-relaxed prose-headings:font-black prose-headings:text-slate-900 prose-strong:text-red-600">
                  <ReactMarkdown>{result}</ReactMarkdown>
                </div>
            </div>

            {/* Local Suppliers & General Recommendation Box Combined */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Sourcing List Card */}
                <div className="p-8 bg-green-600 rounded-[40px] text-white shadow-xl shadow-green-200 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
                    <h4 className="font-black text-2xl mb-2 flex items-center gap-3">
                        <Store className="w-8 h-8" />
                        {t.sourcingTitle}
                    </h4>
                    <p className="text-green-100 text-sm mb-6 font-medium leading-relaxed">{t.sourcingDesc}</p>
                    <div className="space-y-4">
                        {localSuppliers.map((s, i) => (
                            <div key={i} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center justify-between hover:bg-white/20 transition-colors">
                                <div>
                                    <div className="font-black text-base">{s.name}</div>
                                    <div className="text-xs text-green-200 flex items-center gap-1 mt-1 font-bold"><MapPin size={12} strokeWidth={3} /> {s.loc}</div>
                                </div>
                                <div className="text-[10px] bg-green-500 px-3 py-1 rounded-full font-black uppercase tracking-wider shadow-sm">{s.service}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sourcing Text Card */}
                <div className="p-8 bg-slate-900 rounded-[40px] text-white shadow-xl shadow-slate-200 flex flex-col justify-between border-b-8 border-red-600">
                    <div>
                        <div className="p-4 bg-white/10 rounded-2xl w-fit mb-6">
                            <Info className="w-8 h-8 text-blue-400" />
                        </div>
                        <h4 className="font-black text-2xl mb-3">
                            {language === 'st' ? "Keletso ea Bohlokoa" : "Where to start?"}
                        </h4>
                        <p className="text-slate-400 font-bold text-base leading-relaxed mb-6 italic">
                            "{t.info}"
                        </p>
                    </div>
                    <button className="w-full py-4 bg-white/10 hover:bg-white text-slate-400 hover:text-slate-900 rounded-2xl font-black flex items-center justify-center gap-3 transition-all border border-white/10">
                        <ExternalLink size={20} />
                        {language === 'st' ? "Sheba Pholiso ea Tlhaho" : "Visit Agrivet Portal"}
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

export default DiagnosisTool;
