
import React, { useEffect, useState } from 'react';
import { getWeatherRisk } from '../services/geminiService';
import { WeatherRisk, Language } from '../types';
import { CloudSun, ThermometerSun, Snowflake, CloudRain, Droplets, AlertTriangle, MapPin, RefreshCw, Zap } from 'lucide-react';

interface WeatherWidgetProps {
    language: Language;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ language }) => {
  const [risk, setRisk] = useState<WeatherRisk | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState<string>("Lesotho");

  const t = {
      checking: language === 'st' ? "E hlahloba boemo ba leholimo..." : "Checking weather...",
      title: language === 'st' ? "Kotsi ea Boemo ba Leholimo" : "Farm Weather Risk",
      update: language === 'st' ? "Ntlafatsa" : "Update",
      alert: language === 'st' ? "Tlhokomeliso" : "Poultry Alert",
      locating: language === 'st' ? "Ea u batla..." : "Locating..."
  };

  const fetchWeather = (lat?: number, lng?: number) => {
    setLoading(true);
    getWeatherRisk(lat, lng, language).then(data => {
        setRisk(data);
        if(data.locationName) setLocationName(data.locationName);
        setLoading(false);
    });
  };

  useEffect(() => { fetchWeather(); }, [language]);

  const handleLocationUpdate = () => {
    setLoading(true);
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => fetchWeather(position.coords.latitude, position.coords.longitude),
            () => fetchWeather()
        );
    } else { fetchWeather(); }
  };

  const getIcon = () => {
    switch (risk?.type) {
      case 'Mocheso': return <ThermometerSun className="w-10 h-10 text-orange-500" />;
      case 'Serame': return <Snowflake className="w-10 h-10 text-blue-400" />;
      case 'Pula': return <CloudRain className="w-10 h-10 text-blue-600" />;
      case 'Sefako': return <Zap className="w-10 h-10 text-gray-600" />;
      case 'Komello': return <Droplets className="w-10 h-10 text-amber-600" />;
      default: return <CloudSun className="w-10 h-10 text-yellow-500" />;
    }
  };

  const getLabel = () => {
      switch (risk?.type) {
          case 'Mocheso': return language === 'st' ? 'Mocheso' : 'Heat Wave';
          case 'Serame': return language === 'st' ? 'Serame' : 'Severe Frost';
          case 'Pula': return language === 'st' ? 'Pula e Matla' : 'Heavy Rain';
          case 'Sefako': return language === 'st' ? 'Sefako' : 'Hail Storm';
          case 'Komello': return language === 'st' ? 'Komello' : 'Drought';
          default: return language === 'st' ? 'Ho Itlwaelehile' : 'Normal Conditions';
      }
  }

  const getBgColor = () => {
    if (risk?.level === 'Critical') return 'from-red-600 to-red-700';
    if (risk?.level === 'High') return 'from-orange-500 to-orange-600';
    return 'from-blue-600 to-blue-700';
  };

  if (loading) return (
      <div className="h-36 bg-gray-100 rounded-3xl animate-pulse border border-gray-200 flex flex-col items-center justify-center">
          <RefreshCw className="animate-spin w-6 h-6 text-gray-300 mb-2" />
          <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">{t.checking}</span>
      </div>
  );

  return (
    <div className={`p-6 rounded-3xl bg-gradient-to-br ${getBgColor()} text-white relative overflow-hidden shadow-xl shadow-blue-900/10`}>
      {/* Visual Accents */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute top-0 left-0 p-4 opacity-30">
        <MapPin size={60} strokeWidth={1} />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-5">
            <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl shadow-inner">
                {getIcon()}
            </div>
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black tracking-widest bg-white/30 px-2 py-0.5 rounded uppercase">{risk?.level} RISK</span>
                    <h4 className="font-bold text-lg">{t.title}</h4>
                </div>
                <div className="flex items-center gap-1.5 text-blue-100 font-medium">
                    <MapPin size={14} />
                    <span className="text-sm">{risk?.locationName || locationName}</span>
                </div>
            </div>
        </div>
        
        <div className="flex-1 max-w-md bg-black/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
            <div className="flex gap-3">
                <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${risk?.level === 'Critical' ? 'text-yellow-300' : 'text-blue-200'}`} />
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/70 block mb-1">
                        {getLabel()} {t.alert}
                    </span>
                    <p className="text-sm font-medium leading-relaxed italic">
                        "{risk?.advice}"
                    </p>
                </div>
            </div>
        </div>

        <button 
            onClick={handleLocationUpdate}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-all active:scale-90"
            title={t.update}
        >
            <RefreshCw size={20} />
        </button>
      </div>
    </div>
  );
};

export default WeatherWidget;
