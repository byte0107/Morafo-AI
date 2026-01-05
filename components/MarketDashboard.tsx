
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getMarketInsights, getFakeMarketListings } from '../services/geminiService';
import { MarketItem, MarketListing, FarmerProfile, Language } from '../types';
import { TrendingUp, TrendingDown, Minus, RefreshCw, Store, MapPin, Clock, Plus, ShieldCheck, X, BadgeCheck, AlertTriangle, ChevronRight, LayoutGrid } from 'lucide-react';

const DISTRICTS = ["Maseru", "Berea", "Leribe", "Butha-Buthe", "Mokhotlong", "Thaba-Tseka", "Qacha's Nek", "Quthing", "Mohale's Hoek", "Mafeteng"];
const PRODUCTION_TYPES = ["Poultry (Likhoho)", "Rabbits (Mebutla)", "Farming Equipment"];

interface MarketDashboardProps {
    language: Language;
}

const MarketDashboard: React.FC<MarketDashboardProps> = ({ language }) => {
  const [activeTab, setActiveTab] = useState<'prices' | 'marketplace'>('prices');
  const [data, setData] = useState<MarketItem[]>([]);
  const [listings, setListings] = useState<MarketListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showListingModal, setShowListingModal] = useState(false);

  const [regForm, setRegForm] = useState({ name: '', farmName: '', district: 'Maseru', village: '', nationalID: '', phone: '+266 ', productionType: 'Poultry (Likhoho)' });
  const [listForm, setListForm] = useState({ item: '', price: '', type: 'selling', location: '' });

  const t = {
      headerTitle: language === 'st' ? "Boemo ba Maraka" : "Market Intelligence",
      headerSub: language === 'st' ? "Litheko & Maraka oa Lihoai" : "Real-time Prices & Farmer Marketplace",
      tabPrices: language === 'st' ? "Litheko" : "Prices (Litheko)",
      tabMarket: language === 'st' ? "Maraka" : "Market (Maraka)",
      registerBtn: language === 'st' ? "Ingolise joalo ka Mohoai" : "Register as Farmer",
      scopeWarning: language === 'st' ? "Kenya feela likhoho, mebutla, kapa lisebelisoa tsa polasi." : "ONLY list poultry, rabbits, or farming equipment.",
      verifyTitle: language === 'st' ? "Lekhotla la Lihoai" : "Farmer Accreditation",
      verifyDesc: language === 'st' ? "Ho rekisa, o tlameha ho ba mohoai ea ngolisitsoeng." : "Provide your details to list products. This ensures a safe marketplace for all Basotho farmers.",
      submitReg: language === 'st' ? "Fana ka Lintlha" : "Complete Registration",
      selling: language === 'st' ? "Ea Rekisoa" : "Selling",
      buying: language === 'st' ? "Ea Batloa" : "Buying",
      loading: language === 'st' ? "Ea jara..." : "Syncing Market Data..."
  };

  const fetchData = async () => {
    setLoading(true);
    try {
        const [prices, marketListings] = await Promise.all([getMarketInsights(), getFakeMarketListings()]);
        setData(prices);
        setListings(prev => {
            const userListings = prev.filter(l => l.isUserListing);
            return [...userListings, ...marketListings];
        });
    } catch(e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleRegister = (e: React.FormEvent) => {
      e.preventDefault();
      if(regForm.name && regForm.phone.length > 8 && regForm.nationalID.length > 5) {
          setFarmerProfile({ ...regForm, isVerified: true });
          setShowRegisterModal(false);
      }
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

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t.headerTitle}</h2>
            <p className="text-sm font-bold text-slate-400">{t.headerSub}</p>
          </div>
          <button onClick={fetchData} className="p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition shadow-inner">
            <RefreshCw className={`w-6 h-6 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        <div className="flex p-2 bg-slate-100 rounded-3xl">
            <button onClick={() => setActiveTab('prices')} className={`flex-1 py-4 text-xs font-black rounded-2xl transition-all uppercase tracking-widest ${activeTab === 'prices' ? 'bg-white text-green-700 shadow-xl' : 'text-slate-500'}`}>{t.tabPrices}</button>
            <button onClick={() => setActiveTab('marketplace')} className={`flex-1 py-4 text-xs font-black rounded-2xl transition-all uppercase tracking-widest ${activeTab === 'marketplace' ? 'bg-white text-blue-700 shadow-xl' : 'text-slate-500'}`}>{t.tabMarket}</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-32 scrollbar-hide">
        {activeTab === 'prices' ? (
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7 bg-white p-8 rounded-[40px] shadow-sm border border-slate-200 min-h-[450px]">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-black text-xl text-slate-900 flex items-center gap-3"><LayoutGrid size={22} className="text-green-600" /> {language === 'st' ? "Litheko tsa Lesotho" : "Lesotho Price Index"}</h3>
                            <p className="text-xs font-bold text-slate-400 mt-1">Comparing current regional averages</p>
                        </div>
                        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">LIVE DATA</div>
                    </div>
                    {/* Recharts container with explicit height to fix warning */}
                    <div style={{ width: '100%', height: 350 }}>
                        {loading ? (
                            <div className="w-full h-full flex items-center justify-center text-slate-300 font-black animate-pulse uppercase tracking-[0.2em]">{t.loading}</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data} margin={{top: 10, right: 10, left: -20, bottom: 50}}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" tick={{fontSize: 9, fontWeight: 900, fill: '#64748b'}} height={60} interval={0} angle={-25} textAnchor="end" stroke="#e2e8f0" />
                                    <YAxis tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} stroke="#e2e8f0" />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '20px', fontWeight: 900 }}
                                        cursor={{ fill: '#f8fafc', radius: 8 }}
                                        formatter={(v: number) => [`M ${v.toFixed(2)}`, 'Price']}
                                    />
                                    <Bar dataKey="price" radius={[8, 8, 0, 0]} barSize={40}>
                                        {data.map((e, i) => <Cell key={i} fill={e.trend === 'up' ? '#ef4444' : e.trend === 'down' ? '#22c55e' : '#64748b'} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-5 space-y-4">
                    <div className="flex items-center justify-between px-2 mb-2">
                        <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-[0.3em]">Market Sentiment</h3>
                        <TrendingUp size={14} className="text-slate-300" />
                    </div>
                    {data.map((item, idx) => (
                        <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-md flex items-center justify-between group hover:border-green-400 transition-all cursor-default relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-12 h-12 bg-slate-50 rounded-bl-3xl -mr-6 -mt-6 group-hover:bg-green-50 transition-colors"></div>
                            <div className="flex items-center gap-5 relative z-10">
                                <div className={`p-4 rounded-[20px] shadow-inner ${item.trend === 'up' ? 'bg-red-50 text-red-600' : item.trend === 'down' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-600'}`}>
                                    {item.trend === 'up' ? <TrendingUp size={24} /> : item.trend === 'down' ? <TrendingDown size={24} /> : <Minus size={24} />}
                                </div>
                                <div>
                                    <div className="font-black text-slate-900 text-base leading-tight">{item.name}</div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-1">{item.unit}</div>
                                </div>
                            </div>
                            <div className="text-right relative z-10">
                                <div className="text-2xl font-black text-slate-900 tracking-tighter">M {item.price.toFixed(2)}</div>
                                <div className={`text-[10px] font-black uppercase tracking-widest mt-1 ${item.trend === 'up' ? 'text-red-500' : item.trend === 'down' ? 'text-green-500' : 'text-slate-400'}`}>
                                    {item.prediction}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ) : (
            <div className="space-y-6">
                <div className="bg-blue-600 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden flex flex-col sm:flex-row gap-8 justify-between items-center group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-700"></div>
                    <div className="flex gap-6 relative z-10">
                        <div className="p-5 bg-white/20 backdrop-blur-xl rounded-[28px] shadow-2xl">
                            <Store className="w-10 h-10" />
                        </div>
                        <div>
                            <h4 className="font-black text-3xl tracking-tight">{language === 'st' ? "Maraka oa Sechaba" : "Community Market"}</h4>
                            <p className="text-lg text-blue-100 font-medium mt-1">The secure portal for Lesotho poultry producers.</p>
                        </div>
                    </div>
                    {!farmerProfile ? (
                        <button onClick={() => setShowRegisterModal(true)} className="bg-white text-blue-700 px-8 py-4 rounded-2xl text-base font-black shadow-2xl hover:bg-blue-50 hover:-translate-y-1 transition-all active:translate-y-0 relative z-10">{t.registerBtn}</button>
                    ) : (
                        <button onClick={() => setShowListingModal(true)} className="bg-green-500 text-white px-8 py-4 rounded-2xl text-base font-black shadow-2xl hover:bg-green-600 hover:-translate-y-1 transition-all active:translate-y-0 flex items-center gap-3 relative z-10"><Plus size={24} /> Post Ad</button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.map((item, idx) => (
                        <div key={idx} className={`bg-white p-8 rounded-[40px] border-2 relative shadow-sm hover:shadow-2xl transition-all group ${item.isUserListing ? 'border-blue-500 ring-8 ring-blue-50' : 'border-slate-50 hover:border-slate-200'}`}>
                            <div className="flex justify-between items-start mb-6">
                                <span className={`font-black px-4 py-1.5 rounded-xl text-[10px] uppercase tracking-widest ${item.type === 'selling' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{item.type === 'selling' ? t.selling : t.buying}</span>
                                <div className="text-[10px] font-black text-slate-400 flex items-center gap-1.5 uppercase tracking-widest"><Clock size={12} /> {item.time}</div>
                            </div>
                            <h4 className="font-black text-slate-900 text-xl mb-2 group-hover:text-blue-600 transition-colors leading-tight">{item.item}</h4>
                            <div className="text-3xl font-black text-green-600 mb-8">{item.price}</div>
                            
                            <div className="flex items-center justify-between border-t border-slate-50 pt-6 mt-auto">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-black text-sm shadow-inner">
                                        {item.seller.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="text-sm font-black text-slate-800 flex items-center gap-1.5">{item.seller} {item.isVerified && <BadgeCheck size={16} className="text-blue-500" />}</div>
                                        <div className="text-xs text-slate-400 font-bold flex items-center gap-1 mt-0.5"><MapPin size={12} /> {item.location}</div>
                                    </div>
                                </div>
                                <button className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-90">
                                    <ChevronRight size={22} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>

      {showRegisterModal && (
          <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-xl flex items-center justify-center p-4">
              <div className="bg-white rounded-[48px] w-full max-w-md p-10 shadow-2xl border border-white/20 animate-in fade-in zoom-in duration-300">
                  <div className="flex justify-between items-center mb-8">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 rounded-2xl">
                            <ShieldCheck className="text-green-600 w-8 h-8" />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">{t.verifyTitle}</h3>
                      </div>
                      <button onClick={() => setShowRegisterModal(false)} className="p-3 bg-slate-100 rounded-2xl hover:bg-slate-200 transition active:scale-90"><X size={24} className="text-slate-600" /></button>
                  </div>
                  <p className="text-sm font-bold text-slate-700 mb-10 leading-relaxed bg-slate-50 p-6 rounded-3xl border border-slate-100 italic">"{t.verifyDesc}"</p>
                  <form onSubmit={handleRegister} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2 block">Accredited Name</label>
                        <input required className="w-full p-5 bg-slate-50 rounded-3xl border-2 border-slate-200 text-slate-900 font-black placeholder:text-slate-300 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-50 outline-none transition-all text-lg" placeholder="Full name..." value={regForm.name} onChange={e => setRegForm({...regForm, name: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2 block">National ID (KYC)</label>
                        <input required className="w-full p-5 bg-slate-50 rounded-3xl border-2 border-slate-200 text-slate-900 font-black placeholder:text-slate-300 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-50 outline-none transition-all text-lg" placeholder="ID Number..." value={regForm.nationalID} onChange={e => setRegForm({...regForm, nationalID: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2 block">Farm / Entity Name</label>
                        <input required className="w-full p-5 bg-slate-50 rounded-3xl border-2 border-slate-200 text-slate-900 font-black placeholder:text-slate-300 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-50 outline-none transition-all text-lg" placeholder="e.g. Ha-Mokhethi Poultry" value={regForm.farmName} onChange={e => setRegForm({...regForm, farmName: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2 block">District</label>
                           <select className="w-full p-5 bg-slate-50 rounded-3xl border-2 border-slate-200 text-slate-900 font-black focus:border-green-500 focus:bg-white outline-none transition-all text-lg appearance-none" value={regForm.district} onChange={e => setRegForm({...regForm, district: e.target.value})}>
                              {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2 block">Contact (+266)</label>
                           <input required className="w-full p-5 bg-slate-50 rounded-3xl border-2 border-slate-200 text-slate-900 font-black placeholder:text-slate-300 focus:border-green-500 focus:bg-white outline-none transition-all text-lg" placeholder="5XXXXXXX" value={regForm.phone} onChange={e => setRegForm({...regForm, phone: e.target.value})} />
                        </div>
                      </div>
                      <button type="submit" className="w-full py-6 bg-green-600 text-white rounded-[32px] font-black shadow-2xl shadow-green-200 hover:bg-green-700 hover:-translate-y-1 transition-all active:translate-y-0 uppercase tracking-[0.2em] text-lg mt-6">{t.submitReg}</button>
                  </form>
              </div>
          </div>
      )}

      {showListingModal && (
          <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-xl flex items-center justify-center p-4">
              <div className="bg-white rounded-[48px] w-full max-w-md p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
                  <div className="flex justify-between items-center mb-8">
                      <h3 className="text-3xl font-black text-slate-900">Add Listing</h3>
                      <button onClick={() => setShowListingModal(false)} className="p-3 bg-slate-100 rounded-2xl hover:bg-slate-200 transition active:scale-90"><X size={24} className="text-slate-600" /></button>
                  </div>
                  <div className="mb-8 p-6 bg-amber-50 rounded-3xl flex gap-4 border-2 border-amber-100 shadow-inner">
                      <AlertTriangle className="text-amber-600 shrink-0" size={24} />
                      <p className="text-xs text-amber-900 font-black leading-relaxed uppercase tracking-wider">{t.scopeWarning}</p>
                  </div>
                  <form onSubmit={handleAddListing} className="space-y-6">
                      <div className="flex bg-slate-100 p-2 rounded-3xl">
                          <button type="button" onClick={() => setListForm({...listForm, type: 'selling'})} className={`flex-1 py-4 text-xs font-black rounded-2xl transition-all uppercase tracking-widest ${listForm.type === 'selling' ? 'bg-white shadow-xl text-green-700' : 'text-slate-500'}`}>Selling</button>
                          <button type="button" onClick={() => setListForm({...listForm, type: 'buying'})} className={`flex-1 py-4 text-xs font-black rounded-2xl transition-all uppercase tracking-widest ${listForm.type === 'buying' ? 'bg-white shadow-xl text-orange-700' : 'text-slate-500'}`}>Buying</button>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2 block">Item</label>
                        <input required className="w-full p-5 bg-slate-50 rounded-3xl border-2 border-slate-200 text-slate-900 font-black placeholder:text-slate-300 focus:border-blue-500 focus:bg-white outline-none transition-all text-lg" placeholder="What are you selling/buying?" value={listForm.item} onChange={e => setListForm({...listForm, item: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2 block">Price (M)</label>
                          <input required type="number" className="w-full p-5 bg-slate-50 rounded-3xl border-2 border-slate-200 text-slate-900 font-black placeholder:text-slate-300 focus:border-blue-500 focus:bg-white outline-none transition-all text-lg" placeholder="0.00" value={listForm.price} onChange={e => setListForm({...listForm, price: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2 block">Village</label>
                           <input required className="w-full p-5 bg-slate-50 rounded-3xl border-2 border-slate-200 text-slate-900 font-black placeholder:text-slate-300 focus:border-blue-500 focus:bg-white outline-none transition-all text-lg" placeholder="Location" value={listForm.location} onChange={e => setListForm({...listForm, location: e.target.value})} />
                        </div>
                      </div>
                      <button type="submit" className="w-full py-6 bg-blue-600 text-white rounded-[32px] font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all uppercase tracking-[0.2em] text-lg mt-6">Publish Ad</button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default MarketDashboard;
