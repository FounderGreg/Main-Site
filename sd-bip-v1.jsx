import React, { useState, useEffect } from 'react';
import { ChevronRight, RefreshCw, BarChart3, ShieldCheck, Mail, User, Building, Send, Lock, Phone } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * SECURITY NOTE FOR DEPLOYMENT:
 * To keep this page "Hidden" from competitors and search engines:
 * 1. Add <meta name="robots" content="noindex, nofollow"> to your HTML <head>.
 * 2. Do NOT link to this page in your Website Header or Footer.
 * 3. Only point your Business Card QR Code to this specific URL.
 */

const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'prospairity-consulting';

const App = () => {
  const [step, setStep] = useState(0);
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    industry: '',
    employees: '',
    exports: false,
    trainingNeeded: false,
    investingInTech: false,
    userName: '',
    userEmail: '',
    userPhone: '',
    companyName: ''
  });

  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (err) {
        console.error("Auth failed", err);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const industries = [
    { id: 'manufacturing', label: 'Manufacturing / R&D', icon: '⚙️' },
    { id: 'professional', label: 'Professional / Technical', icon: '💼' },
    { id: 'medical', label: 'Medical / Wellness', icon: '🏥' },
    { id: 'hospitality', label: 'Hospitality / Restaurant', icon: '🍽️' },
    { id: 'retail', label: 'Retail / Product', icon: '🛍️' },
    { id: 'other', label: 'Other Service', icon: '✨' }
  ];

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const nextStep = () => setStep(step + 1);
  const restart = () => {
    setStep(0);
    setIsSubmitted(false);
    setFormData({ industry: '', employees: '', exports: false, trainingNeeded: false, investingInTech: false, userName: '', userEmail: '', userPhone: '', companyName: '' });
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'leads'), {
        ...formData,
        timestamp: serverTimestamp(),
        userId: user.uid,
        source: 'Ghost Diagnostic Page'
      });
      setIsSubmitted(true);
      setIsSubmitting(false);
    } catch (err) {
      console.error("Error saving lead", err);
      setIsSubmitting(false);
    }
  };

  const calculateEligibility = () => {
    const results = [];
    const empCount = parseInt(formData.employees) || 0;

    if (empCount <= 24 && (formData.industry === 'manufacturing' || formData.industry === 'professional' || formData.exports)) {
      results.push({
        name: "SD Business Incentive (BIP)",
        value: "Up to $100,000",
        confidence: "High",
        reason: "Matches 'Base Sector' profile for San Diego County."
      });
    }

    if (formData.trainingNeeded && empCount >= 10) {
      results.push({
        name: "ETP Training Grants",
        value: "$25k - $50k+",
        confidence: "High",
        reason: "Upskilling potential for teams adopting AI logic."
      });
    }

    if (formData.industry === 'manufacturing' || formData.investingInTech) {
      results.push({
        name: "CA Sales Tax Exemption",
        value: "~4.12% Savings",
        confidence: "High",
        reason: "Direct reduction on R&D software/hardware."
      });
    }

    return results;
  };

  const eligibleIncentives = calculateEligibility();

  return (
    <div className="min-h-screen bg-[#073042] text-white font-sans p-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden text-slate-900 border border-white/10 relative">
        
        {/* Stealth Mode Indicator */}
        <div className="absolute top-4 right-6 opacity-10">
          <Lock size={12} />
        </div>

        {/* ProspAIrity Header */}
        <div className="bg-[#073042] p-8 text-center border-b-4 border-[#FF9A55]">
          <h1 className="text-white text-2xl font-bold tracking-tighter italic">
            Prosp<span className="text-[#FF9A55]">AI</span>rity <span className="font-light not-italic text-white/80">Diagnostic</span>
          </h1>
          <p className="text-[#FF9A55] text-[9px] uppercase tracking-[0.3em] font-black mt-2">Experience + Intelligence = Growth</p>
        </div>

        <div className="p-8">
          {step === 0 && (
            <div className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="bg-orange-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 rotate-3 shadow-sm border border-orange-100">
                <BarChart3 className="text-[#FF9A55] w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-[#073042] tracking-tight leading-tight">Secure Your 2026<br/>San Diego Capital</h2>
              <p className="text-slate-500 leading-relaxed text-sm font-medium px-4">
                Private assessment for SD-based firms looking to subsidize their operational transformation.
              </p>
              <button 
                onClick={nextStep}
                className="w-full bg-[#073042] hover:bg-[#0C3D52] text-white font-black py-5 rounded-2xl transition-all shadow-xl uppercase tracking-widest text-xs active:scale-95"
              >
                Begin Secure Assessment
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
              <h2 className="font-black text-[#073042] text-lg mb-4 uppercase tracking-tight">1. Sector Selection</h2>
              <div className="grid grid-cols-2 gap-3">
                {industries.map((ind) => (
                  <button
                    key={ind.id}
                    onClick={() => { handleInputChange('industry', ind.id); nextStep(); }}
                    className="p-4 border-2 border-slate-100 rounded-2xl hover:border-[#FF9A55] hover:bg-orange-50 text-left text-xs font-bold transition-all group"
                  >
                    <span className="text-2xl block mb-2">{ind.icon}</span>
                    <span className="group-hover:text-[#073042]">{ind.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
              <h2 className="font-black text-[#073042] text-lg mb-4 uppercase tracking-tight">2. Workforce Size</h2>
              {['1-10', '11-24', '25-100', '100+'].map((range) => (
                <button
                  key={range}
                  onClick={() => { handleInputChange('employees', range.split('-')[0]); nextStep(); }}
                  className="w-full p-5 border-2 border-slate-100 rounded-2xl text-left font-black text-slate-700 hover:border-[#FF9A55] hover:bg-orange-50 transition-all flex justify-between items-center group"
                >
                  {range} Employees <ChevronRight className="text-slate-300 group-hover:text-[#FF9A55]" />
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
              <h2 className="font-black text-[#073042] text-lg mb-4 uppercase tracking-tight">3. Strategic Profile</h2>
              <div className="space-y-3">
                {[
                  ['exports', 'Sell services outside SD County.'],
                  ['investingInTech', 'Tech investment planned 2026.'],
                  ['trainingNeeded', 'Upskilling required for new tools.']
                ].map(([key, text]) => (
                  <label key={key} className="flex items-center p-5 border-2 border-slate-100 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors">
                    <input 
                      type="checkbox" 
                      className="w-6 h-6 rounded-lg border-slate-300 text-[#FF9A55] focus:ring-[#FF9A55] mr-4"
                      checked={formData[key]}
                      onChange={(e) => handleInputChange(key, e.target.checked)}
                    />
                    <span className="text-xs text-slate-700 font-bold uppercase tracking-tight">{text}</span>
                  </label>
                ))}
              </div>
              <button onClick={nextStep} className="w-full bg-[#073042] text-white py-5 rounded-2xl font-black mt-6 shadow-xl uppercase tracking-widest text-xs">Analyze Eligibility</button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5 animate-in fade-in duration-500 pb-4">
              <div className="flex items-center justify-between border-b-2 border-slate-50 pb-3">
                <h2 className="text-xl font-black text-[#073042]">Advisory View</h2>
                <div className="bg-[#FF9A55]/10 text-[#FF9A55] px-3 py-1 rounded-full text-[9px] font-black flex items-center gap-1">
                  <ShieldCheck size={14} /> AUTHORIZED
                </div>
              </div>

              <div className="space-y-3">
                {eligibleIncentives.map((item, idx) => (
                  <div key={idx} className="p-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] relative shadow-sm">
                    <span className="absolute top-3 right-3 text-[7px] px-2 py-1 rounded-full font-black uppercase text-white bg-green-500">
                      High Prob.
                    </span>
                    <h4 className="font-bold text-[#073042] text-[10px] uppercase tracking-widest mb-1">{item.name}</h4>
                    <div className="text-2xl font-black text-slate-900 leading-none">{item.value}</div>
                    <p className="text-[9px] text-slate-500 mt-2 font-medium">{item.reason}</p>
                  </div>
                ))}
              </div>

              {!isSubmitted ? (
                <form onSubmit={handleLeadSubmit} className="mt-8 bg-[#073042] p-8 rounded-[2.5rem] space-y-3 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                  <div className="text-center mb-4 relative z-10">
                    <h3 className="font-black text-[#FF9A55] text-sm uppercase tracking-widest">Unlock Roadmap</h3>
                    <p className="text-[10px] text-white/60 font-medium leading-tight">We will review your assessment and provide a custom implementation strategy within 48 hours.</p>
                  </div>
                  
                  <div className="relative z-10 space-y-2.5">
                    <div className="relative">
                      <User className="absolute left-4 top-4 text-white/30 w-4 h-4" />
                      <input 
                        required
                        placeholder="Full Name"
                        className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/10 rounded-xl text-xs text-white placeholder-white/40 focus:ring-2 focus:ring-[#FF9A55] outline-none transition-all"
                        value={formData.userName}
                        onChange={(e) => handleInputChange('userName', e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <Building className="absolute left-4 top-4 text-white/30 w-4 h-4" />
                      <input 
                        required
                        placeholder="Company Name"
                        className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/10 rounded-xl text-xs text-white placeholder-white/40 focus:ring-2 focus:ring-[#FF9A55] outline-none transition-all"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-4 text-white/30 w-4 h-4" />
                      <input 
                        required
                        type="email"
                        placeholder="Work Email"
                        className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/10 rounded-xl text-xs text-white placeholder-white/40 focus:ring-2 focus:ring-[#FF9A55] outline-none transition-all"
                        value={formData.userEmail}
                        onChange={(e) => handleInputChange('userEmail', e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-4 top-4 text-white/30 w-4 h-4" />
                      <input 
                        required
                        type="tel"
                        placeholder="Phone Number"
                        className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/10 rounded-xl text-xs text-white placeholder-white/40 focus:ring-2 focus:ring-[#FF9A55] outline-none transition-all"
                        value={formData.userPhone}
                        onChange={(e) => handleInputChange('userPhone', e.target.value)}
                      />
                    </div>

                    <button 
                      disabled={isSubmitting}
                      className="w-full bg-[#FF9A55] text-[#073042] py-5 mt-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-lg hover:brightness-110 flex items-center justify-center gap-3 transition-all active:scale-95"
                    >
                      {isSubmitting ? <RefreshCw className="animate-spin" /> : <Send size={18} />}
                      {isSubmitting ? 'SECURE SAVING...' : 'SEND FULL STRATEGY'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-8 bg-green-50 p-10 rounded-[2.5rem] text-center space-y-4 border-2 border-green-100 animate-in zoom-in-95">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto text-white shadow-xl mb-2">
                    <ShieldCheck size={32} />
                  </div>
                  <h3 className="font-black text-green-900 text-lg">Lead Confirmed</h3>
                  <p className="text-xs text-green-800 font-semibold leading-relaxed">
                    We will contact you within 24 hours to review your 2026 Incentives Roadmap. In the meantime, your Complimentary "Full Strategy Report" will be sent to the email you provided.
                  </p>
                  <button onClick={restart} className="text-[10px] font-black text-green-600 uppercase tracking-widest pt-4 hover:text-green-700 transition-colors">New Assessment</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default App;