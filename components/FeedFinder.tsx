
import React, { useState } from 'react';
import { FeedSupplier, Language } from '../types';
import { MapPin, Phone, Navigation, Search } from 'lucide-react';

// Mock Data for Lesotho Feed Suppliers
const FEED_SUPPLIERS: FeedSupplier[] = [
    { id: '1', name: 'Maseru Mills', district: 'Maseru', location: 'Industrial Area, near Station', brands: ['Epol', 'Nutri-Feeds'], phone: '+266 2231 1234' },
    { id: '2', name: 'Lesotho Farm Feeds (Yates)', district: 'Maseru', location: 'Main North 1, Motimposo', brands: ['Meadow', 'Nova'], phone: '+266 2232 5678' },
    { id: '3', name: 'Agrifoods Maseru', district: 'Maseru', location: 'Lakeside Area', brands: ['Agrifoods', 'Top Lay'], phone: '+266 2233 4455' },
    { id: '4', name: 'Leribe Agrivet', district: 'Leribe', location: 'Hlotse Main Street', brands: ['Epol', 'Meadow'], phone: '+266 2240 1122' },
    { id: '5', name: 'Maputsoe Mills', district: 'Leribe', location: 'Maputsoe Industrial', brands: ['Nutri-Feeds'], phone: '+266 2243 3344' },
    { id: '6', name: 'Mafeteng Farm Supplies', district: 'Mafeteng', location: 'Next to Bus Stop', brands: ['Agrifoods'], phone: '+266 2270 5566' },
    { id: '7', name: 'Teyateyaneng Feeds', district: 'Berea', location: 'TY Town Centre', brands: ['Nova', 'Epol'], phone: '+266 2250 8899' },
    { id: '8', name: 'Mohales Hoek Co-op', district: 'Mohale\'s Hoek', location: 'Main Road South', brands: ['Meadow'], phone: '+266 2278 1100' },
    { id: '9', name: 'Quthing General Dealer', district: 'Quthing', location: 'Upper Moyeni', brands: ['Epol', 'Generic'], phone: '+266 2275 2233' },
    { id: '10', name: 'Botha-Bothe Agric', district: 'Butha-Buthe', location: 'Market Area', brands: ['Nutri-Feeds', 'Agrifoods'], phone: '+266 2246 1144' },
];

const DISTRICTS = [
  "Maseru", "Berea", "Leribe", "Butha-Buthe", "Mokhotlong", 
  "Thaba-Tseka", "Qacha's Nek", "Quthing", "Mohale's Hoek", "Mafeteng"
];

interface FeedFinderProps {
    language: Language;
}

const FeedFinder: React.FC<FeedFinderProps> = ({ language }) => {
    const [selectedDistrict, setSelectedDistrict] = useState<string>('Maseru');

    const filteredSuppliers = FEED_SUPPLIERS.filter(s => s.district === selectedDistrict);

    const t = {
        title: language === 'st' ? "Batla Lijo tsa Likhoho" : "Find Poultry Feed (Batla Lijo)",
        subtitle: language === 'st' ? "Fumana mabenkele a lijo tsa likhoho a haufi le uena." : "Locate the nearest farm feed shops for Broiler, Layer, and Rabbit pellets.",
        selectDistrict: language === 'st' ? "Khetha Setereke sa Hau" : "Select Your District",
        noSuppliers: language === 'st' ? "Ha ho bafani ba ngolisitsoeng" : "No verified suppliers listed in",
        tryNeighbor: language === 'st' ? "Leka setereke se haufi." : "Try searching in a neighboring district.",
        call: language === 'st' ? "Letsa" : "Call Shop",
        directions: language === 'st' ? "Tsela" : "Directions"
    };

    return (
        <div className="flex flex-col h-full space-y-4">
            <div className="bg-amber-500 p-6 rounded-xl shadow-sm text-white">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Search className="w-6 h-6" />
                    {t.title}
                </h2>
                <p className="text-amber-100 mt-2">
                    {t.subtitle}
                </p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <label className="block text-sm font-bold text-gray-700 mb-2">{t.selectDistrict}</label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {DISTRICTS.map(d => (
                        <button
                            key={d}
                            onClick={() => setSelectedDistrict(d)}
                            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all
                                ${selectedDistrict === d ? 'bg-amber-500 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                            `}
                        >
                            {d}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pb-20">
                {filteredSuppliers.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                        <MapPin size={48} className="mx-auto mb-2 opacity-20" />
                        <p>{t.noSuppliers} {selectedDistrict}.</p>
                        <p className="text-xs">{t.tryNeighbor}</p>
                    </div>
                ) : (
                    filteredSuppliers.map(supplier => (
                        <div key={supplier.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">{supplier.name}</h3>
                                    <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                                        <MapPin size={14} />
                                        {supplier.location}
                                    </div>
                                </div>
                                <div className="bg-amber-50 text-amber-800 px-3 py-1 rounded-lg text-xs font-bold">
                                    {supplier.district}
                                </div>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {supplier.brands.map(brand => (
                                    <span key={brand} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200">
                                        {brand}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
                                <a href={`tel:${supplier.phone}`} className="flex-1 py-2 bg-green-600 text-white rounded-lg flex items-center justify-center gap-2 text-sm font-bold hover:bg-green-700 transition">
                                    <Phone size={16} />
                                    {t.call}
                                </a>
                                <button className="flex-1 py-2 bg-blue-50 text-blue-700 rounded-lg flex items-center justify-center gap-2 text-sm font-bold hover:bg-blue-100 transition">
                                    <Navigation size={16} />
                                    {t.directions}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default FeedFinder;
