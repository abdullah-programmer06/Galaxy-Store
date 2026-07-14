import { motion } from 'motion/react';
import { CreditCard, ShieldCheck, CheckCircle2, Phone, Mail, User, Wallet, Copy } from 'lucide-react';
import { CartItem } from '../types';
import React, { useState, useEffect } from 'react';
import { useAdminData } from '../hooks/useAdminData';
import { auth, onAuthStateChanged } from '../firebase';

interface CheckoutProps {
  cartItems: CartItem[];
  onClearCart: () => void;
}

export function Checkout({ cartItems, onClearCart }: CheckoutProps) {
  const { addOrder, settings } = useAdminData();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bKash');
  const [transactionId, setTransactionId] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.displayName) setName(user.displayName);
        if (user.email) setEmail(user.email);
      }
    });
    return () => unsubscribe();
  }, []);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const deliveryCharge = settings?.deliveryCharge || 0;
  const finalTotal = cartTotal + deliveryCharge;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      
      const orderDetails = {
        user: name || 'Anonymous User',
        email: email || 'no-email@example.com',
        phone: phone || undefined,
        items: cartItems,
        amount: finalTotal,
        paymentMethod: paymentMethod,
        senderNumber: paymentMethod ? senderNumber : undefined,
        transactionId: paymentMethod ? transactionId : undefined
      };

      addOrder(orderDetails);
      setIsSuccess(true);
      onClearCart();
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="pt-24 pb-12 px-margin-mobile md:px-margin-desktop max-w-container-md mx-auto min-h-[70vh] flex flex-col justify-center items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="glass-panel p-12 tech-clip flex flex-col items-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-primary-container/20 rounded-none flex items-center justify-center text-primary mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="font-display-sm text-on-surface mb-2">Order Placed Successfully!</h2>
          <p className="font-body-md text-on-surface-variant mb-8">
            Thank you for your order. We are verifying your payment. Your digital code or top-up will be delivered shortly.
          </p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={() => window.location.reload()}
            className="w-full bg-primary-fixed-dim text-on-primary-fixed font-label-lg px-6 py-3 rounded-none shadow-[0_0_15px_var(--color-primary)] hover:shadow-[0_0_25px_#00ffcc60] transition-shadow duration-300"
          >
            Continue Browsing
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <div className="mb-8">
        <h1 className="font-display-md text-on-surface tracking-tight mb-2">Checkout</h1>
        <p className="font-body-lg text-on-surface-variant">Complete your purchase securely.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Payment Form */}
        <div className="md:col-span-7 lg:col-span-8">
          <div className="glass-panel tech-clip p-6 md:p-8">
            <form onSubmit={handleCheckout} className="space-y-6">
              {/* Customer Information */}
              <div>
                <h2 className="font-headline-md text-on-surface mb-4 flex items-center gap-2">
                  <User className="text-primary" size={20} /> Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-sm text-on-surface-variant mb-1">Your Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter full name" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-surface-container-high border border-white/10 rounded-none px-4 py-3 text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-label-sm text-on-surface-variant mb-1">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="yourname@example.com" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-surface-container-high border border-white/10 rounded-none px-4 py-3 text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block font-label-sm text-on-surface-variant mb-1">Phone Number (For verification)</label>
                  <input 
                    type="tel" 
                    placeholder="e.g. 017XXXXXXXX" 
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-surface-container-high border border-white/10 rounded-none px-4 py-3 text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="border-t border-white/10 pt-6">
                <h2 className="font-headline-md text-on-surface mb-4 flex items-center gap-2">
                  <Wallet className="text-primary" size={20} /> Choose Payment Method
                </h2>
                
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {settings?.paymentMethods.map(method => (
                    <button
                      key={method.method}
                      type="button"
                      onClick={() => setPaymentMethod(method.method)}
                      className={`p-4 border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                        paymentMethod === method.method
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-white/10 bg-surface-container hover:bg-white/5 text-on-surface-variant'
                      }`}
                    >
                      {method.logo ? (
                        <img src={method.logo} alt={method.method} className="h-8 object-contain" />
                      ) : (
                        <span className="font-bold text-lg">{method.method}</span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Conditional Fields */}
                {paymentMethod && (
                  <div className="bg-surface-container/50 border border-white/5 p-4 md:p-6 mb-6">
                    {(() => {
                      const activeMethod = settings?.paymentMethods.find(m => m.method === paymentMethod);
                      if (!activeMethod) return null;
                      
                      const actionText = 
                        activeMethod.type === 'Personal' ? '"Send Money"' : 
                        activeMethod.type === 'Agent' ? '"Cash Out"' : 
                        '"Payment"';
                      
                      return (
                        <>
                          <p className="text-sm text-on-surface mb-3">
                            Please send the total amount <span className="text-primary font-bold">৳{finalTotal.toFixed(2)}</span> as <span className="font-semibold font-bold text-primary">{actionText}</span> to our {activeMethod?.type?.toLowerCase()} number:
                          </p>
                          <div className="bg-surface-container-high p-3 flex justify-between items-center border border-white/10 mb-4 font-mono text-lg text-white font-bold group relative">
                            <span className="flex items-center gap-3">
                              {activeMethod.number}
                              <button 
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(activeMethod.number);
                                  setCopied(true);
                                  setTimeout(() => setCopied(false), 2000);
                                }}
                                className="text-on-surface-variant hover:text-primary transition-colors"
                                title="Copy number"
                              >
                                {copied ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
                              </button>
                            </span>
                            <span className="text-xs text-primary bg-primary/10 px-2 py-1 font-sans rounded uppercase">{activeMethod.type}</span>
                          </div>
                        </>
                      );
                    })()}
                    <div className="mb-4">
                      <label className="block font-label-sm text-on-surface-variant mb-1">আপনার পেমেন্টের নাম্বারটি এড করুন (যেটা দিয়ে আপনি পেমেন্ট করেছেন)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 017XXXXXXXX" 
                        required
                        value={senderNumber}
                        onChange={(e) => setSenderNumber(e.target.value)}
                        className="w-full bg-surface-container-high border border-white/10 rounded-none px-4 py-3 text-on-surface focus:outline-none focus:border-primary/50 transition-colors font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-label-sm text-on-surface-variant mb-1">Enter Transaction ID (TrxID)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 8N79OBX9N" 
                        required
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="w-full bg-surface-container-high border border-white/10 rounded-none px-4 py-3 text-on-surface focus:outline-none focus:border-primary/50 transition-colors font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              <motion.button 
                disabled={isProcessing || cartItems.length === 0}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                type="submit"
                className="w-full bg-gradient-to-r from-primary-fixed-dim to-secondary-container text-on-primary-fixed font-headline-md text-body-lg px-6 py-4 rounded-none shadow-[0_0_15px_var(--color-primary)] hover:shadow-[0_0_25px_var(--color-primary)] transition-shadow duration-300 disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center gap-2 mt-8"
              >
                {isProcessing ? 'Processing Order...' : `Complete Order - ৳${(cartTotal * 1.08).toFixed(2)}`}
              </motion.button>
              
              <p className="flex items-center justify-center gap-2 font-label-sm text-on-surface-variant text-center opacity-70">
                <ShieldCheck size={16} /> Secure Payment Processing
              </p>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-5 lg:col-span-4">
          <div className="glass-panel tech-clip p-6 md:p-8 sticky top-28">
            <h2 className="font-headline-md text-on-surface mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-surface-container/50 p-3 rounded-none border border-white/5">
                  <span className="font-label-sm text-on-surface line-clamp-1 flex-grow pr-4">{item.title}</span>
                  <span className="font-body-md text-primary flex-shrink-0">৳{item.price.toFixed(2)}</span>
                </div>
              ))}
              {cartItems.length === 0 && (
                <p className="text-on-surface-variant font-body-md text-center py-4">Your cart is empty.</p>
              )}
            </div>

            <div className="border-t border-white/10 pt-4 space-y-3">
              <div className="flex justify-between font-body-md text-on-surface-variant">
                <span>Subtotal</span>
                <span>৳{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-body-md text-on-surface-variant">
                <span>Delivery Charge</span>
                <span>৳{deliveryCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-headline-md text-on-surface pt-2">
                <span>Total</span>
                <span className="text-primary font-bold">৳{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
