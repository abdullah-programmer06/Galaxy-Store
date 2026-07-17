import { motion } from "motion/react";
import { Search, ListFilter, ShoppingCart, Heart } from "lucide-react";
import { CartItem, Product } from "../types";
import { useFavorites } from "../hooks/useFavorites";
import { useAdminData } from "../hooks/useAdminData";

interface SoftwareProps {
  onProductSelect: (product: Product) => void;
  onAddToCart: (item: Omit<CartItem, "id">) => void;
  onBuyNow: (item: Omit<CartItem, "id">) => void;
}

export function Software({
  onAddToCart,
  onBuyNow,
  onProductSelect,
}: SoftwareProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { products } = useAdminData();

  const softwareProducts = products.filter((p) => p.category === "Software");
  const featuredProduct =
    softwareProducts.find((p) => p.id === "windows-11-pro") ||
    softwareProducts[0];

  const items = softwareProducts
    .filter((p) => p.id !== featuredProduct?.id)
    .map((p) => ({
      id: p.id,
      type: p.folder || "Software",
      title: p.title,
      desc: p.description || "Instant digital delivery",
      price: p.basePrice || 0,
      image:
        p.image ||
        "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80",
      stock:
        p.variants && p.variants.length > 0
          ? p.variants.some((v) => v.stock === "In Stock")
            ? "In Stock"
            : "Out of Stock"
          : "In Stock",
    }));

  return (
    <div className="flex-grow pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full relative z-10 flex flex-col gap-12">
      {/* Atmospheric Background Glow */}

      {/* Header Section */}
      <section className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8 relative z-10">
        <div className="flex flex-col gap-2">
          <h1 className="font-display-lg text-primary tracking-tight">
            Software Arsenal
          </h1>
          <p className="font-body-lg text-on-surface-variant max-w-2xl">
            Equip your rig with essential OS keys, creative suites, and
            instant-delivery gift cards for all major platforms.
          </p>
        </div>

        <div className="flex gap-4">
          <button className="glass-panel px-6 py-2 rounded-none font-label-sm text-primary flex items-center gap-2 hover:bg-primary/10">
            <ListFilter size={18} /> Filters
          </button>
          <div className="bg-black/40 border border-white/10 rounded-none p-1 flex">
            <button className="px-6 py-2 rounded-none bg-primary/20 text-primary font-label-sm">
              All
            </button>
            <button className="px-6 py-2 rounded-none text-on-surface-variant hover:text-primary font-label-sm">
              Software
            </button>
          </div>
        </div>
      </section>

      {/* Bento Grid Content */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter relative z-10">
        {/* Featured Item */}
        {featuredProduct && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="glass-panel tech-clip col-span-1 md:col-span-8 overflow-hidden relative group cursor-pointer flex flex-col md:flex-row min-h-[300px] transition-shadow duration-300 hover:shadow-[0_10px_30px_-10px_#00ffcc60] hover:border-primary/30"
            onClick={() => {
              onProductSelect({
                id: featuredProduct.id,
                title: featuredProduct.title,
                description:
                  featuredProduct.description || "Instant digital delivery",
                price: featuredProduct.basePrice,
                image:
                  featuredProduct.image ||
                  "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80",
                category: "Software",
              });
            }}
          >
            <div className="w-full md:w-1/2 h-48 md:h-auto relative">
              <img
                src={
                  featuredProduct.image ||
                  "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80"
                }
                alt={featuredProduct.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#16161a] via-[#16161a]/80 to-transparent" />
            </div>
            <div className="w-full md:w-1/2 p-8 flex flex-col justify-center relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-none bg-primary/20 text-primary font-label-sm border border-primary/30">
                  {featuredProduct.folder || "Operating System"}
                </span>
                <span className="px-3 py-1 rounded-none bg-surface-container-high text-on-surface-variant font-label-sm border border-white/5">
                  -15%
                </span>
              </div>
              <h2 className="font-headline-md text-primary mb-2">
                {featuredProduct.title}
              </h2>
              <p className="font-body-md text-on-surface-variant mb-6 line-clamp-2">
                {featuredProduct.description ||
                  "Upgrade your battlestation with the latest software."}
              </p>
              <div className="flex items-end justify-between mt-auto">
                <div>
                  <p className="text-on-surface-variant line-through text-sm">
                    ৳{(featuredProduct.basePrice * 1.15).toFixed(2)}
                  </p>
                  <p className="font-headline-md text-secondary">
                    ৳{featuredProduct.basePrice.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart({
                      title: featuredProduct.title,
                      price: featuredProduct.basePrice,
                      image: featuredProduct.image,
                    });
                  }}
                  className="bg-gradient-to-r from-[#00dbe7] to-[#b600f8] text-on-primary font-label-sm px-6 py-3 rounded-none shadow-[0_0_20px_#00ffcc60] hover:shadow-[0_0_30px_#00ffcc60] transition-all flex items-center gap-2"
                >
                  <ShoppingCart size={20} /> Add
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Standard Items */}
        {items.map((item, i) => {
          const discount = "-10%";
          const originalPrice = (item.price * 1.1).toFixed(2);

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`flex flex-col group cursor-pointer col-span-1 sm:col-span-1 lg:col-span-2`}
              onClick={() => {
                const dbProd = products.find(
                  (p) => p.title?.toLowerCase() === item.title?.toLowerCase(),
                );
                onProductSelect({
                  id: dbProd?.id || item.title,
                  title: item.title,
                  description: item.desc,
                  price: item.price,
                  image: item.image,
                  category: "Software",
                });
              }}
            >
              <div className="aspect-square w-full bg-surface-container rounded-2xl relative overflow-hidden mb-3">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 text-white/70 hover:bg-black/80 hover:text-secondary transition-colors z-10"
                  onClick={(e) => toggleFavorite(item.title, e)}
                >
                  <Heart
                    size={16}
                    fill={isFavorite(item.title) ? "currentColor" : "none"}
                    className={isFavorite(item.title) ? "text-red-500" : ""}
                  />
                </div>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300 pointer-events-none" />
              </div>

              <div className="flex flex-col flex-grow px-1">
                <span className="text-[10px] uppercase text-on-surface-variant font-bold tracking-wider mb-1">
                  {item.type}
                </span>
                <h3 className="font-body-sm font-bold text-on-surface mb-2 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <div className="mt-auto flex items-center gap-2 mb-3">
                  <span className="bg-[#007bff] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                    {discount}
                  </span>
                  <span className="text-on-surface-variant text-[11px] line-through font-medium">
                    ৳{originalPrice}
                  </span>
                  <span className="text-on-surface font-body-sm font-bold">
                    ৳{item.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex gap-2">
                  {item.stock === "Out of Stock" ? (
                    <div className="w-full text-center py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-md font-bold text-[11px] uppercase">
                      Out of Stock
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onBuyNow({
                            title: item.title,
                            price: item.price,
                            image: item.image,
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
                            title: item.title,
                            price: item.price,
                            image: item.image,
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
      </section>
    </div>
  );
}
