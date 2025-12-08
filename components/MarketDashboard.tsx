
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getMarketInsights, getFakeMarketListings } from '../services/geminiService';
import { MarketItem, MarketListing, FarmerProfile, Language } from '../types';
import { TrendingUp, TrendingDown, Minus, RefreshCw, Store, MapPin, Clock, Plus, ShieldCheck, UserCheck, X, BadgeCheck } from 'lucide-react';

const DISTRICTS = [
  "Maseru", "Berea", "Leribe", "Butha-Buthe", "Mokhotlong", 
  "Thaba-Tseka", "Qacha's Nek", "Quthing", "Mohale's Hoek", "Mafeteng"
];

const PRODUCTION_TYPES = [
    "Livestock (Liphoofolo)",
    "Crops (Lijalo)",
    "Vegetables (Meroho)",
    "Mixed Farming",
    "Supplier (Shop / Feeds)",
    "Equipment & Services"
];

interface MarketDashboardProps {
    language: Language;
}

const MarketDashboard: React.FC<MarketDashboardProps> = ({ language }) => {
  const [activeTab, setActiveTab] = useState<'prices' | 'marketplace'>('prices');
  const [data, setData] = useState<MarketItem[]>([]);
  const [listings, setListings] = useState<MarketListing[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Registration State
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showListingModal, setShowListingModal] = useState(false);

  // Form States
  const [regForm, setRegForm] = useState({ 
      name: '', 
      farmName: '', 
      district: 'Maseru', 
      village: '',
      nationalID: '',
      phone: '+266 ',
      productionType: 'Livestock (Liphoofolo)'
  });
  
  const [listForm, setListForm] = useState({ 
      item: '', 
      price: '', 
      type: 'selling',
      location: ''
  });

  const t = {
      headerTitle: language === 'st' ? "Boemo ba Maraka Lesotho" : "Lesotho Market Intelligence",
      headerSub: language === 'st' ? "Litheko & Maraka oa Lihoai" : "Real-time Prices & Local Marketplace",
      tabPrices: language === 'st' ? "Litheko Marakeng" : "Market Prices (Litheko)",
      tabMarket: language === 'st' ? "Maraka oa Lihoai" : "Farmers Market (Maraka)",
      chartTitle: language === 'st' ? "Papiso ea Litheko (LSL)" : "Price Comparison (LSL)",
      listTitle: language === 'st' ? "Lethathamo la Lihlahisoa" : "Commodity List",
      loading: language === 'st' ? "Ea jara..." : "Loading...",
      communityHeader: language === 'st' ? "Maraka oa Sechaba" : "Community Marketplace (Maraka oa Lihoai)",
      communitySub: language === 'st' ? "Reka kapa u rekise lihlahisoa le lihoai tse ling." : "Connect directly with other farmers and suppliers. Buy seeds, sell livestock, or find feed.",
      registerBtn: language === 'st' ? "Ingolise ho Rekisa" : "Register to Sell",
      addListingBtn: language === 'st' ? "Kenya Thekiso" : "Add Listing",
      verified: language === 'st' ? "Netefalitsoeng" : "Verified",
      selling: language === 'st' ? "Ea Rekisoa" : "Selling",
      buying: language === 'st' ? "Ea Batloa" : "Buying",
      you: language === 'st' ? "Uena" : "You",
      contact: language === 'st' ? "Ikopanye le" : "Contact",
      
      // Modals
      verifyTitle: language === 'st' ? "Netefatsa joalo ka Mohoai" : "Verify as Farmer / Supplier",
      verifyDesc: language === 'st' ? "Ho rekisa, o tlameha ho ba mohoai oa Lesotho." : "To list products, you must be a verifiable producer or supplier located in Lesotho.",
      labelName: language === 'st' ? "Lebitso Feletseng" : "Full Name (Lebitso)",
      labelID: language === 'st' ? "Nomoro ea ID / Passport" : "National ID / Passport No.",
      labelFarm: language === 'st' ? "Lebitso la Polasi / Lebenkele" : "Farm / Shop Name (Required)",
      labelDistrict: language === 'st' ? "Setereke" : "District",
      labelVillage: language === 'st' ? "Motse / Sebaka" : "Village / Area",
      labelActivity: language === 'st' ? "Mofuta oa Temo" : "Primary Activity",
      labelPhone: language === 'st' ? "Nomoro ea Mohala" : "Phone Number (+266)",
      submitReg: language === 'st' ? "Ingolise & Netefatsa" : "Register & Verify",
      
      addListTitle: language === 'st' ? "Kenya Thekiso e Ncha" : "Add New Listing",
      labelItem: language === 'st' ? "Lebitso la Sehlahisoa" : "Item Name",
      labelPrice: language === 'st' ? "Theko (Maloti)" : "Price (Maloti)",
      labelLocation: language === 'st' ? "Sebaka se tobileng" : "Specific Location",
      postBtn: language === 'st' ? "Phatlalatsa" : "Post Listing"
  };

  const fetchData = async () => {
    setLoading(true);
    try {
        const [prices, marketListings] = await Promise.all([
            getMarketInsights(),
            getFakeMarketListings()
        ]);
        setData(prices);
        // Preserve user listings if they exist when refreshing
        setListings(prev => {
            const userListings = prev.filter(l => l.isUserListing);
            return [...userListings, ...marketListings];
        });
    } catch(e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRegister = (e: React.FormEvent) => {
      e.preventDefault();
      // Enhanced verification check
      if(regForm.name && regForm.phone.length > 8 && regForm.nationalID.length > 5 && regForm.village && regForm.farmName) {
          setFarmerProfile({
              ...regForm,
              isVerified: true
          });
          setShowRegisterModal(false);
      } else {
          alert(language === 'st' ? "Ke kopa u tlatse lintlha tsohle." : "Please fill in all required fields (including Shop/Farm Name) to verify your account.");
      }
  };

  const openListingModal = () => {
      // Pre-fill location with farmer's village/district
      if (farmerProfile) {
          setListForm(prev => ({
              ...prev,
              location: `${farmerProfile.village}, ${farmerProfile.district}`
          }));
      }
      setShowListingModal(true);
  };

  const handleAddListing = (e: React.FormEvent) => {
      e.preventDefault();
      if(!farmerProfile) return;

      const newListing: MarketListing = {
          id: Date.now().toString(),
          item: listForm.item,
          price: `M ${listForm.price}`,
          location: listForm.location || farmerProfile.district,
          seller: farmerProfile.farmName || farmerProfile.name,
          type: listForm.type as 'selling' | 'buying',
          time: 'Just now',
          isUserListing: true,
          isVerified: true,
          contact: farmerProfile.phone
      };

      setListings(prev => [newListing, ...prev]);
      setShowListingModal(false);
      setListForm({ item: '', price: '', type: 'selling', location: '' });
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-green-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="flex flex-col h-full space-y-4 relative">
      {/* Header & Tabs */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{t.headerTitle}</h2>
            <p className="text-sm text-gray-500">{t.headerSub}</p>
          </div>
          <button 
            onClick={fetchData} 
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
            disabled={loading}
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        <div className="flex p-1 bg-gray-100 rounded-lg">
            <button 
                onClick={() => setActiveTab('prices')}
                className={`flex-1 py-2 text-sm font-bold rounded-md flex items-center justify-center gap-2 transition-all
                    ${activeTab === 'prices' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <TrendingUp size={16} />
                {t.tabPrices}
            </button>
            <button 
                onClick={() => setActiveTab('marketplace')}
                className={`flex-1 py-2 text-sm font-bold rounded-md flex items-center justify-center gap-2 transition-all
                    ${activeTab === 'marketplace' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <Store size={16} />
                {t.tabMarket}
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        {activeTab === 'prices' ? (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[300px] flex flex-col">
                <h3 className="font-semibold text-gray-800 mb-4">{t.chartTitle}</h3>
                <div className="flex-grow">
                    {loading ? (
                        <div className="h-full flex items-center justify-center text-gray-400">{t.loading}</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" tick={{fontSize: 10}} interval={0} angle={-15} textAnchor="end" height={60}/>
                            <YAxis />
                            <Tooltip 
                                formatter={(value: number) => [`M ${value}`, 'Price']}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                            />
                            <Bar dataKey="price" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.trend === 'up' ? '#f87171' : entry.trend === 'down' ? '#4ade80' : '#94a3b8'} />
                            ))}
                            </Bar>
                        </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
                </div>

                {/* Detailed List Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-4">{t.listTitle}</h3>
                <div className="space-y-3">
                    {loading ? (
                        [1,2,3,4,5].map(i => <div key={i} className="h-16 bg-gray-50 animate-pulse rounded-lg"></div>)
                    ) : (
                        data.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition-colors border border-gray-100">
                                <div>
                                    <div className="font-bold text-gray-800 text-sm md:text-base">{item.name}</div>
                                    <div className="text-xs text-gray-500">{item.unit}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-gray-900 text-lg">M {item.price}</div>
                                    <div className="flex items-center justify-end gap-1 text-xs text-gray-500">
                                        {getTrendIcon(item.trend)}
                                        <span>{item.prediction}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                </div>
            </div>
        ) : (
            <div className="space-y-4">
                {/* Marketplace Header / Controls */}
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div className="flex gap-3 items-start">
                        <Store className="text-blue-600 mt-1 flex-shrink-0" />
                        <div>
                            <h4 className="font-bold text-blue-900 text-sm">{t.communityHeader}</h4>
                            <p className="text-xs text-blue-800">
                                {t.communitySub}
                            </p>
                        </div>
                    </div>
                    
                    {!farmerProfile ? (
                        <button 
                            onClick={() => setShowRegisterModal(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm hover:bg-blue-700 transition flex items-center gap-2 whitespace-nowrap w-full sm:w-auto justify-center"
                        >
                            <ShieldCheck size={14} />
                            {t.registerBtn}
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <span className="hidden sm:inline-flex text-xs font-bold text-blue-800 bg-blue-100 px-2 py-1 rounded-md items-center gap-1">
                                <BadgeCheck size={12} className="text-blue-600" />
                                {t.verified}
                            </span>
                            <button 
                                onClick={openListingModal}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm hover:bg-green-700 transition flex items-center gap-2 whitespace-nowrap w-full sm:w-auto justify-center"
                            >
                                <Plus size={14} />
                                {t.addListingBtn}
                            </button>
                        </div>
                    )}
                </div>
                
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1,2,3,4,5,6].map(i => <div key={i} className="h-32 bg-white rounded-xl border border-gray-100 animate-pulse"></div>)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {listings.map((item, idx) => (
                            <div key={idx} className={`bg-white p-5 rounded-xl border transition shadow-sm relative overflow-hidden group hover:shadow-md
                                ${item.isUserListing ? 'border-blue-200 bg-blue-50/10' : 'border-gray-200'}`}>
                                <div className={`absolute top-0 left-0 w-1 h-full ${item.type === 'selling' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                                
                                <div className="flex justify-between items-start mb-2 pl-2">
                                    <div className="flex gap-2">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide
                                            ${item.type === 'selling' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                            {item.type === 'selling' ? t.selling : t.buying}
                                        </span>
                                        {item.isUserListing && (
                                            <span className="text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide bg-blue-100 text-blue-700 flex items-center gap-1">
                                                <UserCheck size={10} /> {t.you}
                                            </span>
                                        )}
                                    </div>
                                    <span className="flex items-center gap-1 text-xs text-gray-400">
                                        <Clock size={12} /> {item.time}
                                    </span>
                                </div>
                                <h4 className="font-bold text-gray-800 text-lg pl-2 mb-1">{item.item}</h4>
                                <div className="pl-2 text-gray-600 font-medium mb-3">{item.price}</div>
                                
                                <div className="pl-2 flex justify-between items-center border-t border-gray-50 pt-3">
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <MapPin size={12} />
                                        {item.location}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs font-bold text-gray-700">
                                        {item.seller}
                                        {item.isVerified && (
                                            <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-50" aria-label="Verified Farmer" />
                                        )}
                                    </div>
                                </div>
                                <button className="mt-3 w-full py-2 bg-gray-50 hover:bg-green-600 hover:text-white rounded-lg text-xs font-bold transition text-gray-600">
                                    {t.contact} {item.seller}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}
      </div>

      {/* Register Modal */}
      {showRegisterModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 overflow-y-auto max-h-[90vh]">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                          <ShieldCheck className="text-green-600" />
                          {t.verifyTitle}
                      </h3>
                      <button onClick={() => setShowRegisterModal(false)} className="text-gray-400 hover:text-gray-600">
                          <X size={20} />
                      </button>
                  </div>
                  <p className="text-sm text-gray-500 mb-6">
                      {t.verifyDesc}
                  </p>
                  
                  <form onSubmit={handleRegister} className="space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">{t.labelName}</label>
                          <input required className="w-full p-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none placeholder-gray-400" 
                                 placeholder="e.g. Ntate Thabo" 
                                 value={regForm.name}
                                 onChange={e => setRegForm({...regForm, name: e.target.value})}/>
                      </div>
                      
                      <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">{t.labelID}</label>
                          <input required className="w-full p-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none placeholder-gray-400" 
                                 placeholder="e.g. 05XXXXXXX"
                                 value={regForm.nationalID}
                                 onChange={e => setRegForm({...regForm, nationalID: e.target.value})} />
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">{t.labelFarm}</label>
                          <input required className="w-full p-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none placeholder-gray-400" 
                                 placeholder="e.g. Thabo Piggery OR Maseru Feeds"
                                 value={regForm.farmName}
                                 onChange={e => setRegForm({...regForm, farmName: e.target.value})} />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">{t.labelDistrict}</label>
                            <select className="w-full p-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                                    value={regForm.district}
                                    onChange={e => setRegForm({...regForm, district: e.target.value})}>
                                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">{t.labelVillage}</label>
                            <input required className="w-full p-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none placeholder-gray-400" 
                                   placeholder="e.g. Ha Thetsane"
                                   value={regForm.village}
                                   onChange={e => setRegForm({...regForm, village: e.target.value})} />
                          </div>
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">{t.labelActivity}</label>
                          <select className="w-full p-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                                  value={regForm.productionType}
                                  onChange={e => setRegForm({...regForm, productionType: e.target.value})}>
                              {PRODUCTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">{t.labelPhone}</label>
                          <input required className="w-full p-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none placeholder-gray-400" 
                                 placeholder="+266 5XXX XXXX"
                                 value={regForm.phone}
                                 onChange={e => setRegForm({...regForm, phone: e.target.value})} />
                      </div>

                      <div className="pt-2">
                          <button type="submit" className="w-full py-3 bg-green-600 text-white rounded-xl font-bold shadow-md hover:bg-green-700 transition">
                              {t.submitReg}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* Add Listing Modal */}
      {showListingModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{t.addListTitle}</h3>
                      <button onClick={() => setShowListingModal(false)} className="text-gray-400 hover:text-gray-600">
                          <X size={20} />
                      </button>
                  </div>
                  
                  <form onSubmit={handleAddListing} className="space-y-4">
                      <div className="flex bg-gray-100 p-1 rounded-lg">
                          <button type="button" onClick={() => setListForm({...listForm, type: 'selling'})}
                            className={`flex-1 py-2 text-xs font-bold rounded-md ${listForm.type === 'selling' ? 'bg-white shadow text-green-700' : 'text-gray-500'}`}>
                            {t.selling}
                          </button>
                          <button type="button" onClick={() => setListForm({...listForm, type: 'buying'})}
                            className={`flex-1 py-2 text-xs font-bold rounded-md ${listForm.type === 'buying' ? 'bg-white shadow text-orange-700' : 'text-gray-500'}`}>
                            {t.buying}
                          </button>
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">{t.labelItem}</label>
                          <input required className="w-full p-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none placeholder-gray-400" 
                                 placeholder="e.g. 50 Brown Sussex Chicks"
                                 value={listForm.item}
                                 onChange={e => setListForm({...listForm, item: e.target.value})} />
                      </div>
                      
                      <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">{t.labelPrice}</label>
                          <input required type="number" className="w-full p-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none placeholder-gray-400" 
                                 placeholder="e.g. 2500"
                                 value={listForm.price}
                                 onChange={e => setListForm({...listForm, price: e.target.value})} />
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">{t.labelLocation}</label>
                          <input required className="w-full p-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none placeholder-gray-400" 
                                 placeholder="e.g. Maseru, Ha Thetsane"
                                 value={listForm.location}
                                 onChange={e => setListForm({...listForm, location: e.target.value})} />
                      </div>

                      <div className="pt-2">
                          <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-md hover:bg-blue-700 transition">
                              {t.postBtn}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}

    </div>
  );
};

export default MarketDashboard;
