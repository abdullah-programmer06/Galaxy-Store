import {
  ShoppingCart,
  User,
  X,
  Box,
  Trash2,
  Menu,
  Search,
  Settings,
  LogOut,
  LogIn,
  ArrowLeft,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Route, CartItem, Product } from "../types";
import { auth, onAuthStateChanged, signOut } from "../firebase";

interface NavigationProps {
  canGoBack?: boolean;
  onBack?: () => void;
  currentRoute: Route;
  onNavigate: (route: Route) => void;
  cartItems: CartItem[];
  onRemoveFromCart: (id: string) => void;
  onProductSelect?: (product: Product) => void;
}

import { useAdminData } from "../hooks/useAdminData";

export function Navigation({
  currentRoute,
  onNavigate,
  cartItems,
  onRemoveFromCart,
  onProductSelect,
  canGoBack,
  onBack,
}: NavigationProps) {
  const { products, settings } = useAdminData();
  const allProducts: Product[] = products.map((p) => ({
    id: p.id,
    title: p.title,
    price: p.basePrice || 0,
    image:
      p.image ||
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80",
    description: p.description || "Digital product",
    category: p.category,
  }));

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      onNavigate("home");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  const navLinks: { label: string; route: Route }[] = [
    { label: "Home", route: "home" },
    { label: "Games", route: "games" },
    { label: "Gift Cards & Software", route: "software" },
    { label: "Support", route: "support" },
    { label: "Order History", route: "order-history" },
  ];

  return (
    <>
      <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-surface/60 backdrop-blur-xl">
        <div className="flex justify-between items-center h-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          {/* Brand */}
          <div className="flex items-center gap-2">
            {canGoBack && onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-white/5 rounded-none text-on-surface-variant transition-colors mr-2"
              >
                <ArrowLeft size={24} />
              </button>
            )}
            <button
              onClick={() => onNavigate("home")}
              className="font-display-lg text-[24px] md:text-display-lg-mobile text-white font-bold text-glow tracking-tighter italic whitespace-nowrap"
            >
              Galaxy Store
            </button>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex relative flex-1 max-w-sm mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="w-full bg-surface-container-high border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary transition-colors"
              />
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
              />
            </div>

            {/* Auto-suggest dropdown */}
            <AnimatePresence>
              {isSearchFocused && searchQuery.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-surface-container border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 flex flex-col"
                >
                  {allProducts
                    .filter((p) =>
                      p.title
                        ?.toLowerCase()
                        .includes(searchQuery?.toLowerCase()),
                    )
                    .slice(0, 5)
                    .map((product) => (
                      <div
                        key={product.id}
                        onClick={() => {
                          setSearchQuery("");
                          setIsSearchFocused(false);
                          if (onProductSelect) {
                            onProductSelect(product);
                          }
                        }}
                        className="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 last:border-0"
                      >
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div className="flex-1 overflow-hidden">
                          <div className="text-sm text-white font-bold truncate">
                            {product.title}
                          </div>
                          <div className="text-xs text-primary truncate">
                            {product.category}
                          </div>
                        </div>
                        <div className="text-sm text-white font-bold">
                          ৳{product.price}
                        </div>
                      </div>
                    ))}
                  {allProducts.filter((p) =>
                    p.title?.toLowerCase().includes(searchQuery?.toLowerCase()),
                  ).length === 0 && (
                    <div className="p-4 text-sm text-on-surface-variant text-center">
                      No products found.
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex gap-6 items-center">
            {navLinks.map((link) => (
              <button
                key={link.route}
                onClick={() => onNavigate(link.route)}
                className={`font-body-md text-body-md transition-all duration-300 px-3 py-1 rounded active:scale-95 ${
                  currentRoute === link.route
                    ? "text-primary border-b-2 border-primary-container pb-1 bg-white/5"
                    : "text-on-surface-variant hover:text-primary hover:bg-white/5"
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Trailing Icons */}
          <div className="flex items-center gap-4 text-primary">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative hover:bg-white/5 p-2 rounded-none transition-all duration-300 active:scale-95"
            >
              <ShoppingCart size={24} />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-primary-container text-on-primary-container rounded-none text-[10px] font-bold flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => onNavigate("profile")}
                  className="hover:bg-white/5 p-2 rounded-none transition-all duration-300 active:scale-95 text-on-surface-variant hover:text-primary"
                  title="Profile"
                >
                  <User size={24} />
                </button>
                <button
                  onClick={handleSignOut}
                  className="hover:bg-red-500/10 p-2 rounded-none transition-all duration-300 active:scale-95 text-on-surface-variant hover:text-red-500"
                  title="Log Out"
                >
                  <LogOut size={24} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate("signin")}
                className="hidden sm:block hover:bg-white/5 p-2 rounded-none transition-all duration-300 active:scale-95 text-on-surface-variant hover:text-primary"
                title="Sign In"
              >
                <User size={24} />
              </button>
            )}
            {(user?.email?.toLowerCase() === "abubokkorbaqi@gmail.com" ||
              settings?.staff?.some(
                (s) => s.email?.toLowerCase() === user?.email?.toLowerCase(),
              )) && (
              <button
                onClick={() => onNavigate("admin")}
                className="hidden sm:block hover:bg-white/5 p-2 rounded-none transition-all duration-300 active:scale-95 text-on-surface-variant hover:text-primary"
                title="Admin Dashboard"
              >
                <Settings size={24} />
              </button>
            )}
            <button
              className="lg:hidden hover:bg-white/5 p-2 rounded-none transition-all duration-300 active:scale-95 text-on-surface-variant hover:text-primary"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-surface-container border-b border-white/10 overflow-hidden"
            >
              <div className="px-4 pt-4 md:hidden">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-surface-container-high border border-white/10 rounded-md py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                  />
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                  />
                </div>
                {searchQuery.length > 0 && (
                  <div className="mt-2 flex flex-col bg-surface-container-high rounded-md border border-white/5 overflow-hidden">
                    {allProducts
                      .filter((p) =>
                        p.title
                          ?.toLowerCase()
                          .includes(searchQuery?.toLowerCase()),
                      )
                      .slice(0, 4)
                      .map((product) => (
                        <div
                          key={product.id}
                          onClick={() => {
                            setSearchQuery("");
                            setIsMobileMenuOpen(false);
                            if (onProductSelect) {
                              onProductSelect(product);
                            }
                          }}
                          className="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 last:border-0"
                        >
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div className="flex-1 overflow-hidden">
                            <div className="text-sm text-white font-bold truncate">
                              {product.title}
                            </div>
                            <div className="text-xs text-primary truncate">
                              {product.category}
                            </div>
                          </div>
                          <div className="text-sm text-white font-bold">
                            ৳{product.price}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col p-4 gap-2">
                {navLinks.map((link) => (
                  <button
                    key={link.route}
                    onClick={() => {
                      onNavigate(link.route);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`text-left font-headline-md text-headline-md p-2 rounded ${
                      currentRoute === link.route
                        ? "text-primary bg-white/5"
                        : "text-on-surface-variant"
                    }`}
                  >
                    {link.label}
                  </button>
                ))}

                {(user?.email?.toLowerCase() === "abubokkorbaqi@gmail.com" ||
                  settings?.staff?.some(
                    (s) =>
                      s.email?.toLowerCase() === user?.email?.toLowerCase(),
                  )) && (
                  <>
                    {/* Admin Dashboard for Mobile */}
                    <button
                      onClick={() => {
                        onNavigate("admin");
                        setIsMobileMenuOpen(false);
                      }}
                      className={`text-left font-headline-md text-headline-md p-2 rounded flex items-center gap-2 border-t border-white/10 mt-2 pt-4 ${
                        currentRoute === "admin"
                          ? "text-primary bg-white/5"
                          : "text-on-surface-variant hover:text-primary"
                      }`}
                    >
                      <Settings
                        size={20}
                        className="text-primary animate-pulse"
                      />
                      <span>Admin Dashboard</span>
                    </button>
                  </>
                )}

                {user ? (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        onNavigate("profile");
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-left font-headline-md text-headline-md p-2 rounded flex items-center gap-2 text-primary hover:bg-white/5"
                    >
                      <User size={20} />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-left font-headline-md text-headline-md p-2 rounded flex items-center gap-2 text-red-500 hover:bg-white/5"
                    >
                      <LogOut size={20} />
                      <span>Log Out</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      onNavigate("signin");
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left font-headline-md text-headline-md p-2 rounded flex items-center gap-2 text-primary hover:bg-white/5"
                  >
                    <User size={20} />
                    <span>Sign In</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-[#0a0616]/80 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full sm:w-96 glass-panel z-[70] flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.5)] bg-surface"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="font-headline-md text-headline-md text-primary flex items-center gap-2">
                  <ShoppingCart /> Cart
                </h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-none hover:bg-white/5"
                >
                  <X />
                </button>
              </div>

              <div className="flex-grow p-6 overflow-y-auto flex flex-col gap-4">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-on-surface-variant opacity-50">
                    <ShoppingCart size={48} className="mb-4 opacity-50" />
                    <p className="font-body-md text-body-md">
                      Your arsenal is empty.
                    </p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex items-center gap-4 p-3 rounded-none bg-surface-container-high border border-white/5 relative group"
                    >
                      <div className="w-12 h-12 bg-surface-container rounded flex items-center justify-center flex-shrink-0 text-primary-container">
                        <Box />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-label-sm text-label-sm text-on-surface line-clamp-1">
                          {item.title}
                        </h4>
                        <span className="font-body-md text-body-md text-primary">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                      <button
                        onClick={() => onRemoveFromCart(item.id)}
                        className="text-on-surface-variant hover:text-error transition-colors p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>

              <div className="p-6 border-t border-white/10 bg-surface-container-lowest/50">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-body-lg text-body-lg text-on-surface">
                    Total
                  </span>
                  <span className="font-headline-md text-headline-md text-primary">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <motion.button
                  disabled={cartItems.length === 0}
                  onClick={() => {
                    onNavigate("checkout");
                    setIsCartOpen(false);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="w-full bg-gradient-to-r from-primary-fixed-dim to-secondary-container text-on-primary-fixed font-headline-md text-body-lg px-6 py-4 rounded-none shadow-[0_0_15px_var(--color-primary)] hover:shadow-[0_0_25px_var(--color-primary)] transition-shadow duration-300 disabled:opacity-50 disabled:pointer-events-none"
                >
                  Secure Checkout
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
