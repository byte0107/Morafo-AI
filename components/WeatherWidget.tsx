
import React, { useEffect, useState } from 'react';
import { getWeatherRisk } from '../services/geminiService';
import { WeatherRisk, Language } from '../types';
import { CloudSun, ThermometerSun, Snowflake, CloudRain, Droplets, AlertTriangle, MapPin, RefreshCw } from 'lucide-react';

interface WeatherWidgetProps {
    language: Language;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ language }) => {
  const [risk, setRisk] = useState<WeatherRisk | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState<string>("Lesotho");

  const t = {
      checking: language === 'st' ? "E hlahloba boemo ba leholimo..." : "Checking weather...",
      title: language === 'st' ? "Kotsi ea Boemo ba Leholimo" : "Weather Risk",
      update: language === 'st' ? "Ntlafatsa" : "Update",
      alert: language === 'st' ? "Hlokomela" : "Alert",
      locating: language === 'st' ? "Ea u batla..." : "Locating you..."
  };

  const fetchWeather = (lat?: number, lng?: number) => {
    setLoading(true);
    getWeatherRisk(lat, lng, language).then(data => {
        setRisk(data);
        if(data.locationName) setLocationName(data.locationName);
        setLoading(false);
    });
  };

  useEffect(() => {
    // Initial load without location
    fetchWeather();
  }, [language]);

  const handleLocationUpdate = () => {
    setLoading(true);
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchWeather(position.coords.latitude, position.coords.longitude);
                setLocationName(t.locating);
            },
            (error) => {
                console.warn("Location denied:", error);
                fetchWeather(); // Fallback to general
                alert(language === 'st' ? "Ha re fumane sebaka. Re sebelisa boemo ba Lesotho kakaretso." : "Could not access location. Using general Lesotho weather.");
            }
        );
    } else {
        fetchWeather();
    }
  };

  const getIcon = () => {
    switch (risk?.type) {
      case 'Mocheso': return <ThermometerSun className="w-8 h-8 text-orange-600" />;
      case 'Serame': return <Snowflake className="w-8 h-8 text-blue-500" />;
      case 'Pula': return <CloudRain className="w-8 h-8 text-blue-700" />;
      case 'Sefako': return <CloudRain className="w-8 h-8 text-slate-600" />; // Fallback icon for hail
      case 'Komello': return <Droplets className="w-8 h-8 text-amber-700" />;
      default: return <CloudSun className="w-8 h-8 text-yellow-500" />;
    }
  };

  const getLabel = () => {
      switch (risk?.type) {
          case 'Mocheso': return language === 'st' ? 'Mocheso' : 'Heat (Mocheso)';
          case 'Serame': return language === 'st' ? 'Serame' : 'Frost (Serame)';
          case 'Pula': return language === 'st' ? 'Pula e Matla' : 'Heavy Rain';
          case 'Sefako': return language === 'st' ? 'Sefako' : 'Hail (Sefako)';
          case 'Komello': return language === 'st' ? 'Komello' : 'Drought (Komello)';
          default: return language === 'st' ? 'Ho Itlwaelehile' : 'Normal';
      }
  }

  const getStyles = () => {
    if (risk?.level === 'Critical') return 'bg-red-100 border-red-300 shadow-red-100';
    if (risk?.level === 'High') return 'bg-orange-50 border-orange-200 shadow-orange-50';
    return 'bg-blue-50 border-blue-100';
  };

  if (loading) return (
      <div className="h-32 bg-gray-100 rounded-2xl animate-pulse border border-gray-200 p-4 flex items-center justify-center">
          <span className="text-gray-400 text-xs flex gap-2"><RefreshCw className="animate-spin w-4 h-4"/> {t.checking}</span>
      </div>
  );

  return (
    <div className={`p-5 rounded-2xl border-2 ${getStyles()} flex flex-col justify-between relative overflow-hidden transition-all duration-500`}>
      {/* Background decorations for critical alerts */}
      {risk?.level === 'Critical' && (
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
      )}

      <div className="flex justify-between items-start mb-3 relative z-10">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-full shadow-sm">
                {getIcon()}
            </div>
            <div>
                <h4 className="font-bold text-gray-900 text-base leading-tight">{t.title}</h4>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                    <MapPin size={10} />
                    <span>{risk?.locationName || locationName}</span>
                </div>
            </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
            <span className={`text-[10px] uppercase font-black px-3 py-1 rounded-full tracking-wider shadow-sm
            ${risk?.level === 'Critical' ? 'bg-red-600 text-white animate-pulse' : 
                risk?.level === 'High' ? 'bg-orange-500 text-white' : 
                'bg-green-200 text-green-800'}`}>
            {risk?.level} RISK
            </span>
            <button 
                onClick={handleLocationUpdate}
                className="text-xs flex items-center gap-1 bg-white/50 hover:bg-white px-2 py-1 rounded-md text-gray-600 transition"
            >
                <MapPin size={10} /> {t.update}
            </button>
        </div>
      </div>

      <div className="relative z-10 bg-white/60 p-3 rounded-xl border border-white/50 backdrop-blur-sm">
        <div className="flex gap-2 items-start">
            <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${risk?.level === 'Critical' ? 'text-red-600' : 'text-amber-500'}`} />
            <div>
                <span className="text-xs font-bold text-gray-700 block mb-1 uppercase tracking-wide opacity-70">
                    {getLabel()} {t.alert}
                </span>
                <p className="text-sm text-gray-800 font-medium leading-snug">
                    {risk?.advice}
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
