/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Route, CartItem, Product } from './types';
import { ProductDetails } from './screens/ProductDetails';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { Home } from './screens/Home';
import { Games } from './screens/Games';
import { Software } from './screens/Software';
import { Support } from './screens/Support';
import { Checkout } from './screens/Checkout';
import { UIDTopUp } from './screens/UIDTopUp';
import { WeeklyMonthly } from './screens/WeeklyMonthly';
import { WeeklyLite } from './screens/WeeklyLite';
import { LevelUpPass } from './screens/LevelUpPass';
import { AdminDashboard } from './screens/AdminDashboard';
import { OrderHistory } from './screens/OrderHistory';
import { SignIn } from './screens/SignIn';
import { SignUp } from './screens/SignUp';
import { Profile } from './screens/Profile';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<Route>('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentRoute, selectedProduct?.id]);

  
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setCurrentRoute('product');
  };

  const handleAddToCart = (item: Omit<CartItem, 'id'>) => {
    setCartItems(prev => [...prev, { ...item, id: Math.random().toString(36).substr(2, 9) }]);
  };

  const handleBuyNow = (item: Omit<CartItem, 'id'>) => {
    setCartItems(prev => [...prev, { ...item, id: Math.random().toString(36).substr(2, 9) }]);
    setCurrentRoute('checkout');
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  return (
    <>
      <Navigation onProductSelect={handleProductSelect} 
        currentRoute={currentRoute} 
        onNavigate={setCurrentRoute} 
        cartItems={cartItems}
        onRemoveFromCart={handleRemoveFromCart}
      />
      
      <AnimatePresence mode="wait">
        <motion.main
          key={currentRoute}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex-grow flex flex-col"
        >
          {currentRoute === 'home' && <Home onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} onNavigate={setCurrentRoute} onProductSelect={handleProductSelect} />}
          {currentRoute === 'games' && <Games onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} onProductSelect={handleProductSelect} />}
          {currentRoute === 'software' && <Software onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} onProductSelect={handleProductSelect} />}
          {currentRoute === 'support' && <Support />}
          {currentRoute === 'checkout' && <Checkout cartItems={cartItems} onClearCart={handleClearCart} />}
          {currentRoute === 'uid-topup' && <UIDTopUp onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />}
          {currentRoute === 'weekly-monthly' && <WeeklyMonthly onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />}
          {currentRoute === 'weekly-lite' && <WeeklyLite onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />}
          {currentRoute === 'level-up-pass' && <LevelUpPass onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />}
          {currentRoute === 'product' && selectedProduct && <ProductDetails product={selectedProduct} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} onProductSelect={handleProductSelect} />}
          {currentRoute === 'admin' && <AdminDashboard />}
          {currentRoute === 'order-history' && <OrderHistory />}
          {currentRoute === 'signin' && <SignIn onNavigate={setCurrentRoute} />}
          {currentRoute === 'signup' && <SignUp onNavigate={setCurrentRoute} />}
          {currentRoute === 'profile' && <Profile />}
        </motion.main>
      </AnimatePresence>

      <Footer onNavigate={setCurrentRoute} />
    </>
  );
}
