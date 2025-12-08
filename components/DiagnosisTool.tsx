
import React, { useState, useRef } from 'react';
import { analyzeHealthImage } from '../services/geminiService';
import { Camera, Upload, Loader2, AlertCircle, CheckCircle, Info, Bird, Rabbit } from 'lucide-react';
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
      subtitle: language === 'st' ? "Kenya setšoantšo sa phoofolo e kulang. MorafoAI e tla hlahloba boloetse." : "Upload a photo of your sick bird or rabbit. MorafoAI will identify the disease.",
      selectType: language === 'st' ? "Khetha Mofuta oa Phoofolo" : "Select Animal Type",
      clickToUpload: language === 'st' ? "Tobetsa ho kenya foto" : "Click to upload photo",
      describe: language === 'st' ? "Hlalosa Matšoao" : "Describe Symptoms",
      optional: language === 'st' ? "(Ha e tlame)" : "(Optional)",
      placeholder: language === 'st' ? "Mohlala: Khoho e'a khohlela, e na le letšollo le lesoeu..." : "E.g., The chicken is coughing, white diarrhea, swollen eyes...",
      diagnose: language === 'st' ? "Hlahloba" : "Diagnose",
      diagnosing: language === 'st' ? "Ea Hlahloba..." : "Diagnosing...",
      clear: language === 'st' ? "Hlakola" : "Clear",
      info: language === 'st' ? "MorafoAI e sebetsana le Likhoho le Mebutla. Re fana ka litlhare tsa sekhooa le tsa setso." : "MorafoAI specializes in Poultry & Rabbits. We provide both pharmaceutical medication and local organic remedies.",
      resultTitle: language === 'st' ? "Sephetho sa Tlhahlobo" : "Diagnosis Result",
      disclaimer: language === 'st' ? "Kamehla bona ngaka ea liphoofolo haeba lefu le le kotsi." : "Always consult a vet if mortality is high."
  };

  const animalTypes = language === 'st' 
    ? ['Likhoho tsa Broiler', 'Likhoho tsa Mahe', 'Khoho ea Sesotho', 'Mmutla']
    : ['Broiler Chicken', 'Layer Chicken', 'Free-range (Sesotho)', 'Rabbit'];

  // Helper to map UI animal selection back to API standard
  const getApiAnimalType = (selected: string) => {
      if (selected.includes('Broiler')) return 'Broiler Chicken';
      if (selected.includes('Mahe') || selected.includes('Layer')) return 'Layer Chicken';
      if (selected.includes('Sesotho')) return 'Free-range Chicken';
      if (selected.includes('Mmutla') || selected.includes('Rabbit')) return 'Rabbit';
      return selected;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiagnose = async () => {
    if (!image) return;
    setLoading(true);
    setResult('');
    try {
      const diagnosis = await analyzeHealthImage(image, notes, getApiAnimalType(animalType), language);
      setResult(diagnosis);
    } catch (error) {
      setResult(language === 'st' ? "Phoso e hlahile ha ho hlahlojoa. Ke kopa u leke hape." : "Error analyzing the image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 bg-red-50 border-b border-red-100">
        <h2 className="text-xl font-bold text-red-900 flex items-center gap-2">
          <Camera className="w-6 h-6" />
          {t.title}
        </h2>
        <p className="text-sm text-red-700 mt-1">
          {t.subtitle}
        </p>
      </div>

      <div className="p-6 overflow-y-auto space-y-6">
        {/* Animal Type Selection */}
        <div>
           <label className="block text-sm font-bold text-gray-700 mb-2">{t.selectType}</label>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
               {animalTypes.map(type => (
                   <button 
                     key={type}
                     onClick={() => setAnimalType(type)}
                     className={`p-3 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 transition
                        ${animalType === type ? 'bg-red-600 text-white border-red-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}
                     `}
                   >
                       {(type.includes('Mmutla') || type.includes('Rabbit')) ? <Rabbit size={16} /> : <Bird size={16} />}
                       {type}
                   </button>
               ))}
           </div>
        </div>

        {/* Image Upload Area */}
        <div 
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer bg-gray-50/50"
          onClick={() => fileInputRef.current?.click()}
        >
          {image ? (
            <div className="relative">
              <img src={image} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-md" />
              <button 
                onClick={(e) => { e.stopPropagation(); setImage(null); setResult(''); }}
                className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
              >
                {t.clear}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-gray-500 py-6">
              <div className="p-4 bg-white rounded-full shadow-sm">
                <Upload className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="font-bold text-gray-700">{t.clickToUpload}</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG</p>
              </div>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        {/* Notes Input */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            {t.describe} <span className="text-gray-400 font-normal">{t.optional}</span>
          </label>
          <textarea
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none bg-gray-50"
            rows={3}
            placeholder={t.placeholder}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handleDiagnose}
          disabled={!image || loading}
          className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-md text-lg
            ${!image || loading ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'bg-green-600 hover:bg-green-700 hover:scale-[1.02]'}
          `}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t.diagnosing}
            </>
          ) : (
            <>
              <CheckCircle className="w-6 h-6" />
              {t.diagnose}
            </>
          )}
        </button>

        {/* Info Box */}
        {!result && !loading && (
            <div className="flex gap-3 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-100">
                <Info className="w-5 h-5 flex-shrink-0" />
                <p>{t.info}</p>
            </div>
        )}

        {/* Result Area */}
        {result && (
          <div className="mt-2 p-6 bg-white rounded-xl border border-gray-200 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b border-gray-100">
              <AlertCircle className="w-6 h-6 text-amber-500" />
              {t.resultTitle}
            </h3>
            <div className="prose prose-sm prose-green max-w-none text-gray-700">
               <ReactMarkdown>{result}</ReactMarkdown>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                 <p className="text-xs text-gray-400 italic">{t.disclaimer}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosisTool;
