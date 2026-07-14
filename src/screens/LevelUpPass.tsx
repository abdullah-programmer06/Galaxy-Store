import { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, CheckCircle2, ChevronRight, Info, Loader2, AlertCircle, User } from 'lucide-react';
import { CartItem } from '../types';

interface LevelUpPassProps {
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
  onBuyNow: (item: Omit<CartItem, 'id'>) => void;
}



import { useAdminData } from '../hooks/useAdminData';

export function LevelUpPass({ onAddToCart, onBuyNow }: LevelUpPassProps) {
  const { getProductVariants, products } = useAdminData();
  const actualProduct = products.find(p => p.id === 'level-up-pass');
  const packages = getProductVariants('level-up-pass');

  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [playerId, setPlayerId] = useState("");
  const [checkingName, setCheckingName] = useState(false);
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  const checkPlayerName = async () => {
    if (!playerId.trim()) {
      setNameError("দয়া করে প্লেয়ার আইডি দিন");
      setPlayerName(null);
      return;
    }
    setCheckingName(true);
    setNameError(null);
    setPlayerName(null);
    try {
      const response = await fetch(`/api/player-name?uid=${encodeURIComponent(playerId.trim())}`);
      const data = await response.json();
      if (data && data.error === false && data.data && data.data.username) {
        setPlayerName(data.data.username);
      } else {
        setNameError(data.msg === "id_not_found" ? "প্লেয়ার আইডি পাওয়া যায়নি" : "আইডি চেক করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
      }
    } catch (err) {
      setNameError("সার্ভার কানেকশন সমস্যা, আবার চেষ্টা করুন।");
    } finally {
      setCheckingName(false);
    }
  };

  const handleBuy = () => {
    if (selectedPackage && playerId) {
      const pkg = packages.find((p: any) => p.id === selectedPackage);
      if (pkg) {
        onBuyNow({ title: `Free Fire ${pkg.name} (UID: ${playerId})`, price: pkg.price, image: actualProduct?.image });
      }
    }
  };

  return (
    <div className="w-full min-h-screen pt-24 pb-12 px-margin-mobile md:px-margin-desktop">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel tech-clip p-4 md:p-6 mb-6 flex items-center gap-4 border border-white/10"
        >
          <img src="https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80" alt="Level Up Pass" className="w-16 h-16 rounded-none object-cover filter sepia-[0.3] hue-rotate-[-30deg] saturate-[1.5]" />
          <div>
            <h1 className="font-headline-md text-on-surface">Lavel Up Pass {'{'} BD {'}'}</h1>
            <p className="font-body-sm text-on-surface-variant">Game / Top up</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Packages */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="glass-panel tech-clip border border-white/10 p-6">
              <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                <div className="w-8 h-8 rounded-none bg-primary/20 flex items-center justify-center text-primary font-bold">1</div>
                <h2 className="font-headline-sm text-on-surface">Select Recharge</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                {packages.map((pkg: any) => (
                  <button
                    key={pkg.id}
                    onClick={() => pkg.stock !== 'Out of Stock' && setSelectedPackage(pkg.id)}
                    className={`relative p-3 md:p-4 rounded-none border transition-all duration-300 flex flex-col items-center justify-center gap-1 ${
                      pkg.stock === 'Out of Stock'
                        ? 'opacity-50 cursor-not-allowed bg-surface border-white/5'
                        : selectedPackage === pkg.id 
                        ? 'bg-primary/20 border-primary shadow-[0_0_15px_var(--color-primary)] cursor-pointer' 
                        : 'bg-surface-container/50 border-white/10 hover:border-primary/50 hover:bg-surface-container cursor-pointer'
                    }`}
                  >
                    <span className="font-label-md text-on-surface text-center">
                      {pkg.name}
                    </span>
                    <span className="font-body-sm text-primary font-bold mt-1">BDT {pkg.price}</span>
                    {pkg.stock === 'Out of Stock' && <span className="absolute top-1 right-1 text-[9px] text-red-500 font-bold uppercase">Out of Stock</span>}
                  </button>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-white/5">
                <a href="#" className="text-secondary hover:text-primary transition-colors font-label-sm flex items-center gap-1">
                  কিভাবে অর্ডার করবেন? <ChevronRight size={16} />
                </a>
              </div>
            </div>
          </motion.div>
          
          {/* Right Column - User Info & Payment */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Account Info */}
            <div className="glass-panel tech-clip border border-white/10 p-6">
              <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                <div className="w-8 h-8 rounded-none bg-primary/20 flex items-center justify-center text-primary font-bold">2</div>
                <h2 className="font-headline-sm text-on-surface">Account Info</h2>
              </div>
              
              <div className="space-y-4">
                <label className="block font-label-sm text-on-surface-variant">এখানে আপনার গেমের আইডি কোড লিখুন</label>
                <input 
                  type="text" 
                  value={playerId}
                  onChange={(e) => {
                    setPlayerId(e.target.value);
                    setPlayerName(null);
                    setNameError(null);
                  }}
                  placeholder="Player ID"
                  className="w-full bg-surface-container border border-white/10 rounded-none p-3 text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_0_10px_var(--color-primary)] transition-all"
                />
                <button 
                  onClick={checkPlayerName}
                  disabled={checkingName}
                  className="w-full bg-secondary/20 border border-secondary text-secondary font-label-md py-3 rounded-none hover:bg-secondary hover:text-on-secondary transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {checkingName ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      চেক করা হচ্ছে...
                    </>
                  ) : (
                    "আপনার গেম আইডির নাম চেক করুন"
                  )}
                </button>

                {playerName && (
                  <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-none flex items-center gap-2 text-green-400">
                    <User size={16} />
                    <span className="font-semibold font-mono text-sm">গেম আইডির নাম: {playerName}</span>
                  </div>
                )}

                {nameError && (
                  <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-none flex items-center gap-2 text-red-400">
                    <AlertCircle size={16} />
                    <span className="text-sm font-medium">{nameError}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Payment Options */}
            <div className="glass-panel tech-clip border border-white/10 p-6">
              <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                <div className="w-8 h-8 rounded-none bg-primary/20 flex items-center justify-center text-primary font-bold">3</div>
                <h2 className="font-headline-sm text-on-surface">Select one option</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-primary/10 border-2 border-primary rounded-none p-4 flex flex-col items-center gap-2 relative">
                  <div className="absolute top-0 left-0 bg-primary text-on-primary w-6 h-6 rounded-none rounded-none flex items-center justify-center">
                    <CheckCircle2 size={14} />
                  </div>
                  <div className="w-16 h-10 bg-white/10 rounded flex items-center justify-center text-xl">💳</div>
                  <span className="font-label-sm text-on-surface text-center">Wallet Pay</span>
                </div>
                <div className="bg-surface-container/50 border border-white/10 rounded-none p-4 flex flex-col items-center gap-2 opacity-50 cursor-not-allowed">
                  <div className="w-16 h-10 flex items-center justify-center gap-1">
                    <div className="w-5 h-5 bg-pink-500 rounded-none" />
                    <div className="w-5 h-5 bg-orange-500 rounded" />
                    <div className="w-5 h-5 bg-purple-500 rounded-none" />
                  </div>
                  <span className="font-label-sm text-on-surface text-center">Instant Pay</span>
                </div>
              </div>
              
              <div className="space-y-2 mb-6 text-sm">
                <p className="text-on-surface-variant flex items-center gap-2">
                  <Info size={14} /> প্রোডাক্টটি কিনতে আপনার প্রয়োজন <span className="text-primary font-bold">{selectedPackage ? packages.find((p: any) => p.id === selectedPackage)?.price : 0}</span> টাকা।
                </p>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={handleBuy}
                  disabled={!selectedPackage || !playerId}
                  className="flex-1 bg-primary text-on-primary font-label-md py-4 tech-clip-btn hover:bg-primary-fixed-dim transition-all shadow-[0_0_15px_var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  Buy Now
                </button>
                <button 
                  onClick={() => {
                    if (selectedPackage && playerId) {
                      const pkg = packages.find((p: any) => p.id === selectedPackage);
                      if (pkg) {
                        onAddToCart({ title: `Free Fire ${pkg.name} (UID: ${playerId})`, price: pkg.price, image: actualProduct?.image });
                      }
                    }
                  }}
                  disabled={!selectedPackage || !playerId}
                  className="px-6 bg-[#28a745]/20 border border-[#28a745] flex items-center justify-center text-[#28a745] hover:bg-[#28a745]/30 rounded-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart size={20} />
                </button>
              </div>
            </div>
          </motion.div>
          
        </div>
        
        {/* Rules & Conditions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 glass-panel tech-clip border border-white/10 p-6 md:p-8"
        >
          <h2 className="font-headline-md text-on-surface mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
            <Info className="text-primary" /> Rules & Conditions
          </h2>
          
          <div className="space-y-4 text-on-surface-variant font-body-sm leading-relaxed">
            <p className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-primary mt-1 flex-shrink-0" />
              যারা আগে ৩০ লেভেল পর্যন্ত ৮০০ ডায়মন্ড এর Level Up Pass নিয়েছেন, তারা আর নিতে পারবেন না।
            </p>
            <p className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-primary mt-1 flex-shrink-0" />
              একটা আইডিতে একবারই নিতে পারবেন, একবার নেওয়া হলে, ভবিষ্যতে সেই একই আইডিতে আর নিতে পারবেন না।
            </p>
            <p className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-primary mt-1 flex-shrink-0" />
              নতুন Level Up Pass প্রত্যেক লেভেলের (LV 6, 10, 15, 20, 25, 30) জন্য আলাদা করে অর্ডার করতে হবে। আগের মত একটা অর্ডার করে, সবগুলো লেভেলের জন্য ডায়মন্ড পাবেন না।
            </p>
            <p className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-primary mt-1 flex-shrink-0" />
              আপনার আইডির লেভেল বেশি হলে কম লেভেল এর জন্য অর্ডার করা যাবে যদি আগে সেটা না নেয়া হয়ে থাকে। কিন্তু, আইডির লেভেল কম হলে বেশি লেভেল এর জন্য আগে থেকেই অর্ডার করতে পারবেন না। লেভেল বাড়লে সেটা অর্ডার করতে পারবেন। উদাহরণঃ যদি আইডি লেভেল 9 থাকে, তাহলে 6 লেভেলের লেভেলে আপ পাস না নিয়ে থাকলে সেটা অর্ডার করতে পারেন, কিন্তু 10 লেভেলের জন্য অর্ডার করা যাবে না। 10 Level এ যাওয়ার পরেই সেটা অর্ডার করা যাবে।
            </p>
            
            <div className="mt-8 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="font-label-md text-on-surface mb-4">Level Rewards</p>
                  <ul className="space-y-2">
                    <li className="flex justify-between border-b border-white/5 pb-2"><span>Level 6</span> <span className="text-primary">120 Diamond</span></li>
                    <li className="flex justify-between border-b border-white/5 pb-2"><span>Level 10</span> <span className="text-primary">200 Diamond</span></li>
                    <li className="flex justify-between border-b border-white/5 pb-2"><span>Level 15</span> <span className="text-primary">200 Diamond</span></li>
                    <li className="flex justify-between border-b border-white/5 pb-2"><span>Level 20</span> <span className="text-primary">200 Diamond</span></li>
                    <li className="flex justify-between border-b border-white/5 pb-2"><span>Level 25</span> <span className="text-primary">200 Diamond</span></li>
                    <li className="flex justify-between border-b border-white/5 pb-2"><span>Level 30</span> <span className="text-primary">350 Diamond</span></li>
                    <li className="flex justify-between pt-2 font-bold text-on-surface"><span>Total:</span> <span className="text-secondary">1270 Diamond</span></li>
                  </ul>
                </div>
                
                <div>
                  <p className="font-label-md text-on-surface mb-4">Instruction</p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 size={16} className="text-secondary mt-1 flex-shrink-0" />
                      শুধুমাত্র Bangladesh সার্ভারের Player ID/UID দিয়ে Top Up করা যাবে। অন্য সার্ভারের Player ID/UID হলে অর্ডার করবেন না।
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 size={16} className="text-secondary mt-1 flex-shrink-0" />
                      Player ID Code/UID ভুল দিয়ে Diamond না পেলে কর্তৃপক্ষ দায়ী নয়।
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 size={16} className="text-secondary mt-1 flex-shrink-0" />
                      সাধারণত ৩০ সেকেন্ড থেকে ২ মিনিটের ভিতরে Order Complete করা হয়।
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 size={16} className="text-secondary mt-1 flex-shrink-0" />
                      ২-৫ মিনিটের মধ্যে ডেলিভারি না পেলে লাইভ চ্যাটে যোগাযোগ করুন।
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
      </div>
    </div>
  );
}
