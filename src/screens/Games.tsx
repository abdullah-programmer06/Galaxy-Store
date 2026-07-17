import { motion } from "motion/react";
import {
  Search,
  ListFilter,
  Flame,
  ChevronDown,
  Heart,
  ShoppingCart,
} from "lucide-react";
import { CartItem, Product } from "../types";
import { useFavorites } from "../hooks/useFavorites";
import { useAdminData } from "../hooks/useAdminData";

interface GamesProps {
  onProductSelect: (product: Product) => void;
  onAddToCart: (item: Omit<CartItem, "id">) => void;
  onBuyNow: (item: Omit<CartItem, "id">) => void;
}

export function Games({ onAddToCart, onBuyNow, onProductSelect }: GamesProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { products } = useAdminData();

  const allGames = products
    .filter((p) => p.category === "Games")
    .map((p) => ({
      id: p.id,
      title: p.title,
      desc:
        p.description || `Purchase ${p.title} securely with instant delivery.`,
      price: p.basePrice || 0,
      platform: p.folder || "PC",
      image:
        p.image ||
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80",
      stock:
        p.variants && p.variants.length > 0
          ? p.variants.some((v) => v.stock === "In Stock")
            ? "In Stock"
            : "Out of Stock"
          : "In Stock",
    }));

  return (
    <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 relative pt-28">
      {/* Atmospheric Background */}

      {/* Featured Hero */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[400px]">
          {/* Main Featured */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="md:col-span-2 glass-panel tech-clip overflow-hidden relative group cursor-pointer neon-glow transition-shadow duration-300"
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-80 transition-opacity duration-300"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD03cQm4kutIraeYUABlTlQJrLve82UlwfvTVwc-No8haGopNZjDjo316XVtQjOqF0-O6BeeWNiLBb69_LrDAHytUD9im6wcasDpqHyJX1UoEXsQ4vMUosKBTgh3dDDjEK06f8e-QY05HwvM9McvZj57hglxCMepXDaTfQMXWwDRzFMkvfYbxOm-awxFKJlr1X4UV1wSMRk-5p2C9nStasozy1L0n0uQJD8sFOeEuewW4d80EYMTv5k')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <span className="bg-primary-container/20 text-primary-container px-3 py-1 rounded-none text-label-sm font-label-sm border border-primary-container/30 backdrop-blur-md mb-4 inline-block">
                TRENDING
              </span>
              <h2 className="font-display-lg text-primary mb-2 text-shadow-lg">
                Cyber Strike 2077
              </h2>
              <p className="font-body-lg text-on-surface-variant max-w-lg mb-6">
                Experience the ultimate next-gen shooter. Top up your Arsenal
                Credits now with exclusive bonuses.
              </p>
              <button
                onClick={() =>
                  onAddToCart({
                    title: "Cyber Strike 2077 Credits",
                    price: 49.99,
                    image:
                      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80",
                  })
                }
                className="bg-gradient-to-r from-primary-fixed-dim to-secondary-container text-white px-8 py-3 rounded-none font-headline-md font-bold hover:shadow-[0_0_20px_var(--color-primary)] transition-shadow duration-300 transform active:scale-95"
              >
                Top Up Now
              </button>
            </div>
          </motion.div>

          {/* Secondary Features */}
          <div className="flex flex-col gap-6">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="flex-1 glass-panel tech-clip overflow-hidden relative group cursor-pointer neon-glow transition-shadow duration-300 min-h-[180px]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center opacity-50 group-hover:opacity-70 transition-opacity duration-300"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCM6Gw5_ZzEgFHiIthxvy0bY9HCDX5o6KfQ5ckWj_eGPHldceIfwbYGMQNxN6nW_uHQxBoh2kw_JeQls10h-_g8xm3OfQXokjzLAgfiVnINW_Hrx_VC227fD0AbaEaLDhKoY9yAnGCUsufyomQppMxaYXe5M8UoYJLAjJjN3Vf9Y31M_1p6M8hDJzScw3W8Q3noYzD3gdJWwvC9uc7ohXkZatQcRxNwmplFYLaV9n_vITofW66_hVXk')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="font-headline-md text-white mb-1">
                  Aetheria: Legends
                </h3>
                <p className="font-body-md text-secondary">
                  Crystal Packs - 20% Off
                </p>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="flex-1 glass-panel tech-clip overflow-hidden relative group cursor-pointer neon-glow transition-shadow duration-300 min-h-[180px]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center opacity-50 group-hover:opacity-70 transition-opacity duration-300"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAqHUmq9UBTVcBPexE2bmaBcOtQVSCsfhTw2sTUaKBPSRt2diWZJ2TrEBe7lBWz244U86M32oK7cOr2Ol-5zDG3rJrL6a1mAOs2itfeSkJU19JSrsGFcdi-8tLl75HekltVgbtYusJm76M6wUFTYac5C3AwS5Moxs_nqpWIVN7hQmsFXORdNulYMoCCKdSrn3wyC0kLAn_PDF8jBEbcUPytYE0_hTJMTWW3kdkorEsQGjGbqxL6gglP')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="font-headline-md text-white mb-1">
                  Velocity Drift
                </h3>
                <p className="font-body-md text-primary">Season Pass Bundle</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="glass-panel p-6 tech-clip sticky top-28">
            <div className="flex items-center gap-2 mb-6 text-primary">
              <ListFilter size={24} />
              <h3 className="font-headline-md">Filters</h3>
            </div>

            <div className="mb-6 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                size={18}
              />
              <input
                type="text"
                placeholder="Search games..."
                className="w-full bg-black/40 border border-white/10 rounded-none py-2 pl-10 pr-4 text-on-surface focus:outline-none focus:border-primary-container focus:shadow-[0_0_10px_#00ffcc60] transition-all font-body-md placeholder-on-surface-variant"
              />
            </div>

            <div className="mb-6">
              <h4 className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-3">
                Platform
              </h4>
              <div className="flex flex-col gap-2">
                {["Mobile", "PC", "Console"].map((plat) => (
                  <label
                    key={plat}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      defaultChecked={plat === "PC"}
                      className="bg-black/40 border-white/20 text-primary-container rounded focus:ring-0 focus:ring-offset-0"
                    />
                    <span
                      className={`font-body-md transition-colors ${plat === "PC" ? "text-primary" : "text-on-surface group-hover:text-primary"}`}
                    >
                      {plat}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-3">
                Genre
              </h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-primary-container/10 border border-primary-container/30 text-primary rounded-none font-label-sm cursor-pointer hover:bg-primary-container/20 transition-colors">
                  Action
                </span>
                {["RPG", "Shooter", "MOBA"].map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-white/5 border border-white/10 text-on-surface rounded-none font-label-sm cursor-pointer hover:bg-white/10 hover:text-primary transition-colors"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Game Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-headline-md text-white">All Games</h2>
            <div className="flex items-center gap-2 text-on-surface-variant font-body-md cursor-pointer hover:text-primary transition-colors">
              Sort by: <span className="text-white">Popularity</span>
              <ChevronDown size={18} />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {allGames.map((game, i) => {
              // Derive discount and original price for demo
              const discount = "-15%";
              const originalPrice = (game.price * 1.15).toFixed(2);

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col group cursor-pointer"
                  onClick={() => {
                    const dbProd = products.find(
                      (p) =>
                        p.title?.toLowerCase() === game.title?.toLowerCase(),
                    );
                    onProductSelect({
                      id: dbProd?.id || game.title,
                      title: game.title,
                      description: game.desc,
                      price: game.price,
                      image: game.image,
                      category: "Games",
                    });
                  }}
                >
                  <div className="aspect-square w-full bg-surface-container rounded-2xl relative overflow-hidden mb-3">
                    <img
                      src={game.image}
                      alt={game.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 text-white/70 hover:bg-black/80 hover:text-secondary transition-colors z-10"
                      onClick={(e) => toggleFavorite(game.title, e)}
                    >
                      <Heart
                        size={16}
                        fill={isFavorite(game.title) ? "currentColor" : "none"}
                        className={isFavorite(game.title) ? "text-red-500" : ""}
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300 pointer-events-none" />
                  </div>

                  <div className="flex flex-col flex-grow px-1">
                    <span className="text-[10px] uppercase text-on-surface-variant font-bold tracking-wider mb-1">
                      Base Game
                    </span>
                    <h3 className="font-body-sm font-bold text-on-surface mb-2 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                      {game.title}
                    </h3>
                    <div className="mt-auto flex items-center gap-2 mb-3">
                      <span className="bg-[#007bff] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                        {discount}
                      </span>
                      <span className="text-on-surface-variant text-[11px] line-through font-medium">
                        ৳{originalPrice}
                      </span>
                      <span className="text-on-surface font-body-sm font-bold">
                        ৳{game.price}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {game.stock === "Out of Stock" ? (
                        <div className="w-full text-center py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-md font-bold text-[11px] uppercase">
                          Out of Stock
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onBuyNow({
                                title: game.title,
                                price: game.price,
                                image: game.image,
                              });
                            }}
                            className="flex-1 bg-[#007bff] text-white py-2 rounded-md font-bold text-[11px] uppercase hover:bg-[#0056b3] transition-colors"
                          >
                            Buy Now
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddToCart({
                                title: game.title,
                                price: game.price,
                                image: game.image,
                              });
                            }}
                            className="px-3 bg-[#28a745] text-white rounded-md hover:bg-[#218838] transition-colors shadow-[0_0_10px_rgba(40,167,69,0.3)]"
                          >
                            <ShoppingCart size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
