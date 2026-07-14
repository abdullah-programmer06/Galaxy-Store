import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAdminData } from '../hooks/useAdminData';
import { Order } from '../types';
import { Search, ShoppingBag, CheckCircle2, Clock, XCircle, Mail, Hash, Calendar, CreditCard, ArrowRight, Package } from 'lucide-react';
import { auth, onAuthStateChanged } from '../firebase';

export function OrderHistory() {
  const { orders } = useAdminData();
  const [user, setUser] = useState<any>(null);
  const [filter, setFilter] = useState<'All' | 'Completed' | 'Pending' | 'Cancelled'>('All');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Filter orders by logged-in user email, or show all if not logged in
  const userOrders = user 
    ? orders.filter((order: Order) => order.email?.toLowerCase().trim() === user.email?.toLowerCase().trim())
    : orders;

  const totalOrdersCount = userOrders.length;
  const completedOrders = userOrders.filter(o => o.status === 'Completed');
  const pendingOrders = userOrders.filter(o => o.status === 'Pending');
  const cancelledOrders = userOrders.filter(o => o.status === 'Cancelled');

  const displayedOrders = filter === 'All' 
    ? userOrders 
    : userOrders.filter(o => o.status === filter);

  return (
    <div className="pt-24 pb-12 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto min-h-[80vh]">
      {/* Page Header */}
      <div className="mb-8 text-center max-w-xl mx-auto">
        <h1 className="font-display-md text-on-surface tracking-tight mb-2 text-glow">
          Order History & Tracking
        </h1>
        <p className="font-body-lg text-on-surface-variant">
          View all your orders, tracking details, and order completion statuses.
        </p>
      </div>

      <div className="space-y-8">
        {userOrders.length > 0 ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Order Statistics Badge Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button 
                onClick={() => setFilter('All')}
                className={`p-4 rounded-lg text-center transition-colors border ${filter === 'All' ? 'bg-surface-container border-white/20' : 'bg-surface-container/40 border-white/5 hover:bg-surface-container'}`}
              >
                <div className={`text-xs uppercase font-semibold tracking-wider mb-1 ${filter === 'All' ? 'text-white' : 'text-on-surface-variant'}`}>Total Orders</div>
                <div className="text-3xl font-extrabold text-white font-mono">{totalOrdersCount}</div>
              </button>
              <button 
                onClick={() => setFilter('Completed')}
                className={`p-4 rounded-lg text-center transition-colors border ${filter === 'Completed' ? 'bg-green-500/20 border-green-500/40' : 'bg-green-500/10 border-green-500/20 hover:bg-green-500/20'}`}
              >
                <div className="text-green-400 text-xs uppercase font-semibold tracking-wider mb-1">Completed</div>
                <div className="text-3xl font-extrabold text-green-400 font-mono">{completedOrders.length}</div>
              </button>
              <button 
                onClick={() => setFilter('Pending')}
                className={`p-4 rounded-lg text-center transition-colors border ${filter === 'Pending' ? 'bg-yellow-500/20 border-yellow-500/40' : 'bg-yellow-500/10 border-yellow-500/20 hover:bg-yellow-500/20'}`}
              >
                <div className="text-yellow-400 text-xs uppercase font-semibold tracking-wider mb-1">Pending</div>
                <div className="text-3xl font-extrabold text-yellow-400 font-mono">{pendingOrders.length}</div>
              </button>
              <button 
                onClick={() => setFilter('Cancelled')}
                className={`p-4 rounded-lg text-center transition-colors border ${filter === 'Cancelled' ? 'bg-red-500/20 border-red-500/40' : 'bg-red-500/10 border-red-500/20 hover:bg-red-500/20'}`}
              >
                <div className="text-red-400 text-xs uppercase font-semibold tracking-wider mb-1">Cancelled</div>
                <div className="text-3xl font-extrabold text-red-400 font-mono">{cancelledOrders.length}</div>
              </button>
            </div>

            {/* Order List Header */}
            <div className="flex justify-between items-center border-b border-white/10 pb-2 mt-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShoppingBag size={18} className="text-primary" />
                {filter === 'All' ? 'All' : filter} Orders {user ? `for ${user.email}` : ''}
              </h3>
            </div>

              {/* Order List */}
              <div className="space-y-4">
                {displayedOrders.map((order: Order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel border border-white/10 p-5 md:p-6 rounded-lg hover:border-white/20 transition-all space-y-4"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                      {/* Left: ID & Date */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5">
                          <span className="bg-white/5 border border-white/10 text-white font-mono font-bold px-2.5 py-1 text-sm rounded">
                            {order.id}
                          </span>
                          <span className="text-on-surface-variant text-xs flex items-center gap-1">
                            <Calendar size={13} /> {order.date}
                          </span>
                        </div>
                        <div className="text-xs text-on-surface-variant flex items-center gap-1.5">
                          <span>Payment Method:</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            order.paymentMethod === 'bKash' ? 'bg-[#e2136e]/20 text-[#e2136e]' :
                            order.paymentMethod === 'Nagad' ? 'bg-[#f7941d]/20 text-[#f7941d]' :
                            'bg-blue-500/20 text-blue-500'
                          }`}>
                            {order.paymentMethod || 'Card'}
                          </span>
                        </div>
                      </div>

                      {/* Right: Status & Total Amount */}
                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-2 w-full md:w-auto">
                        <span className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1.5 ${
                          order.status === 'Completed' ? 'bg-green-500/20 text-green-500 border border-green-500/30' :
                          order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' :
                          'bg-red-500/20 text-red-500 border border-red-500/30'
                        }`}>
                          {order.status === 'Completed' && <CheckCircle2 size={13} />}
                          {order.status === 'Pending' && <Clock size={13} />}
                          {order.status === 'Cancelled' && <XCircle size={13} />}
                          {order.status === 'Completed' ? 'Completed / Delivery Success' : order.status}
                        </span>

                        <div className="text-lg font-black text-primary font-mono mt-0 md:mt-1">
                          ৳{order.amount.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Ordered Items List */}
                    <div className="bg-white/5 border border-white/5 p-4 rounded-md space-y-3">
                      <div className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider mb-2">Ordered Items:</div>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center text-sm gap-3">
                            <div className="flex items-center gap-3 overflow-hidden">
                              {item.image ? (
                                <img src={item.image} alt={item.title} className="w-10 h-10 object-cover rounded" />
                              ) : (
                                <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center">
                                  <Package size={20} className="text-on-surface-variant" />
                                </div>
                              )}
                              <span className="text-white font-medium flex items-center gap-1.5 truncate">
                                {item.title}
                              </span>
                            </div>
                            <span className="text-on-surface-variant font-mono whitespace-nowrap">৳{item.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
          <div className="max-w-md mx-auto text-center py-12 glass-panel p-8 rounded-lg border border-white/5">
            <XCircle size={48} className="mx-auto text-red-400 mb-4 opacity-75" />
            <h3 className="font-display-sm text-on-surface mb-2">No Orders Found</h3>
            <p className="font-body-md text-on-surface-variant">
              You haven't placed any orders yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
