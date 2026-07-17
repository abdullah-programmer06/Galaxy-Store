import { TopUpDetails } from "../components/TopUpDetails";
import { motion } from "motion/react";
import { ShoppingCart, Heart, ShieldCheck, Share2, Zap } from "lucide-react";
import { Product, CartItem } from "../types";
import { useFavorites } from "../hooks/useFavorites";
import { useState, useEffect } from "react";
import { useAdminData } from "../hooks/useAdminData";

interface ProductDetailsProps {
  onProductSelect: (product: Product) => void;
  product: Product;
  onAddToCart: (item: Omit<CartItem, "id">) => void;
  onBuyNow: (item: Omit<CartItem, "id">) => void;
}

export function ProductDetails({
  product,
  onAddToCart,
  onBuyNow,
  onProductSelect,
}: ProductDetailsProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { products } = useAdminData();
  const actualProduct = products.find(
    (p) =>
      p.id === product.id ||
      p.title?.toLowerCase() === product.title?.toLowerCase() ||
      product.title?.toLowerCase().includes(p.title?.toLowerCase()) ||
      p.title?.toLowerCase().includes(product.title?.toLowerCase()),
  );
  const variants = actualProduct?.variants || [];

  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  useEffect(() => {
    if (variants.length > 0) {
      // Find the closest or matching variant by price first
      const exactPriceMatch = variants.find(
        (v) => Math.abs(v.price - product.price) < 0.01,
      );
      if (exactPriceMatch) {
        setSelectedVariant(exactPriceMatch);
      } else {
        // Otherwise, try to find a variant matching the name
        const nameMatch = variants.find(
          (v) =>
            product.title?.toLowerCase().includes(v.name?.toLowerCase()) ||
            v.name?.toLowerCase().includes(product.title?.toLowerCase()),
        );
        setSelectedVariant(nameMatch || variants[0]);
      }
    } else {
      setSelectedVariant(null);
    }
  }, [product.title, product.price, variants.length]);

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentTitle = selectedVariant
    ? `${product.title} - ${selectedVariant.name}`
    : product.title;

  const productImages =
    actualProduct?.images && actualProduct.images.length > 0
      ? actualProduct.images
      : [product.image];
  const [selectedImage, setSelectedImage] = useState<string>(productImages[0]);

  const relatedProducts = [
    {
      title: "Free Fire 1000 Diamonds",
      price: 9.99,
      image:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80",
      description: "Top up your Free Fire account instantly.",
      category: "Top-Up",
    },
    {
      title: "Netflix Premium 1 Month",
      price: 15.99,
      image:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80",
      description: "Enjoy ultra HD Netflix streaming.",
      category: "Subscription",
    },
    {
      title: "Spotify Premium 12 Months",
      price: 29.99,
      image:
        "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80",
      description: "Ad-free music streaming for a year.",
      category: "Streaming",
    },
    {
      title: "Valorant 2050 VP",
      price: 19.99,
      image:
        "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80",
      description: "Unlock premium weapon skins.",
      category: "Games",
    },
  ];

  if (
    actualProduct?.category === "Top-Up" ||
    product.category === "Top-Up" ||
    actualProduct?.folder === "Top-Up"
  ) {
    return (
      <TopUpDetails
        product={product}
        onAddToCart={onAddToCart}
        onBuyNow={onBuyNow}
      />
    );
  }

  return (
    <div className="flex-1 w-full pt-32 pb-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image and Description */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-[300px] md:h-[500px] rounded-xl overflow-hidden bg-[#070721]"
          >
            <img
              src={selectedImage}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {productImages.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${selectedImage === img ? "border-primary" : "border-transparent hover:border-white/20"}`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          <div className="space-y-4">
            <h1 className="text-display-md text-white tracking-tight">
              {product.title}
            </h1>

            <div className="flex flex-wrap gap-2">
              <span className="bg-[#007bff] text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                Streaming
              </span>
              <span className="bg-[#00d26a] text-[#070721] text-[10px] font-bold px-2 py-1 rounded-md uppercase flex items-center gap-1">
                <Zap size={12} /> Direct Link
              </span>
            </div>

            <p className="text-on-surface-variant text-body-md leading-relaxed">
              {product.description}
            </p>

            {/* Tags / Features */}
            <div className="flex gap-8 pt-4">
              <div className="space-y-2">
                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                  Tags
                </span>
                <div className="flex gap-2">
                  <span className="border border-white/20 text-white text-[12px] px-3 py-1 rounded-full">
                    spotify
                  </span>
                  <span className="border border-white/20 text-white text-[12px] px-3 py-1 rounded-full">
                    music
                  </span>
                  <span className="border border-white/20 text-white text-[12px] px-3 py-1 rounded-full">
                    streaming
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                  Features
                </span>
                <div className="flex gap-2">
                  <span className="border border-[#007bff]/30 text-[#007bff] text-[12px] px-3 py-1 rounded-full">
                    Instant Delivery
                  </span>
                  <span className="border border-[#007bff]/30 text-[#007bff] text-[12px] px-3 py-1 rounded-full">
                    Secure Checkout
                  </span>
                  <span className="border border-[#007bff]/30 text-[#007bff] text-[12px] px-3 py-1 rounded-full">
                    Money-Back
                  </span>
                </div>
              </div>
            </div>

            <p className="text-on-surface-variant text-body-md leading-relaxed pt-4">
              {product.description}
            </p>
          </div>
        </div>

        {/* Right Column: Order panel */}
        <div className="space-y-6">
          <div className="w-full h-48 rounded-xl overflow-hidden bg-[#070721]">
            <img
              src={selectedImage}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="bg-[#070721] p-4 rounded-md inline-flex items-center gap-2">
            <span className="text-white text-sm">Standard Edition</span>
          </div>

          {variants.length > 0 ? (
            <div className="space-y-3">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                Select Option
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {variants.map((variant) => (
                  <div
                    key={variant.id}
                    onClick={() =>
                      variant.stock !== "Out of Stock" &&
                      setSelectedVariant(variant)
                    }
                    className={`w-full flex flex-col justify-center items-center p-3 rounded-md transition-all border ${
                      variant.stock === "Out of Stock"
                        ? "opacity-50 cursor-not-allowed bg-[#070721] border-white/5"
                        : selectedVariant?.id === variant.id
                          ? "bg-[#007bff]/20 border-[#007bff] cursor-pointer"
                          : "bg-[#070721] border-white/10 hover:border-white/30 cursor-pointer"
                    }`}
                  >
                    <span className="text-white font-bold text-sm text-center mb-1">
                      {variant.name}
                    </span>
                    <span className="text-primary font-bold text-sm">
                      ৳{variant.price.toFixed(2)}
                    </span>
                    {variant.stock === "Out of Stock" && (
                      <span className="text-red-500 text-xs font-bold mt-1">
                        Out of Stock
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                Select Option
              </span>
              <div className="w-full flex justify-between items-center bg-[#070721] border border-[#007bff] p-4 rounded-md">
                <span className="text-white font-bold text-sm">
                  {product.title}
                </span>
                <span className="text-white font-bold">
                  ৳{currentPrice.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <div className="text-display-sm text-white font-bold">
            ৳{currentPrice.toFixed(2)}
          </div>

          <div className="flex gap-2">
            <button
              className="flex-1 bg-[#007bff] text-white py-3 rounded-md font-bold text-sm hover:bg-[#0056b3] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() =>
                onBuyNow({
                  title: currentTitle,
                  price: currentPrice,
                  image: actualProduct?.image || product?.image,
                })
              }
              disabled={selectedVariant?.stock === "Out of Stock"}
            >
              <Zap size={16} /> Buy Now
            </button>
            <button
              className="p-3 bg-[#28a745] text-white rounded-md hover:bg-[#218838] transition-colors shadow-[0_0_10px_rgba(40,167,69,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              onClick={() =>
                onAddToCart({
                  title: currentTitle,
                  price: currentPrice,
                  image: actualProduct?.image || product?.image,
                })
              }
              disabled={selectedVariant?.stock === "Out of Stock"}
            >
              <ShoppingCart size={20} />
            </button>
          </div>

          <button
            onClick={(e) => toggleFavorite(product.title, e)}
            className={`w-full py-3 bg-[#070721] border border-white/20 rounded-md hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm font-bold ${isFavorite(product.title) ? "text-red-500" : "text-white"}`}
          >
            <Heart
              size={16}
              fill={isFavorite(product.title) ? "currentColor" : "none"}
            />{" "}
            {isFavorite(product.title)
              ? "Remove from Wishlist"
              : "Add to Wishlist"}
          </button>

          <div className="border-t border-b border-white/10 py-4 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-on-surface-variant">Category</span>
              <span className="text-white font-bold">Streaming</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-on-surface-variant">Delivery</span>
              <span className="text-white font-bold">Direct Link</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-on-surface-variant">Stock</span>
              <span className="text-white font-bold">100+ available</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-on-surface-variant">Refund</span>
              <span className="text-white font-bold">Refundable</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <ShieldCheck size={16} className="text-[#00d26a]" />
            <span>Secure payment • Money-back guarantee</span>
          </div>

          <button className="w-full py-3 bg-[#070721] border border-white/20 text-white rounded-md hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm font-bold mt-4">
            <Share2 size={16} /> Share Product
          </button>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold text-white mb-8">Related Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {relatedProducts.map((prod, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col group cursor-pointer"
              onClick={() => {
                window.scrollTo(0, 0);
                onProductSelect({
                  id: prod.title,
                  title: prod.title,
                  description: prod.description,
                  price: prod.price,
                  image: prod.image,
                  category: prod.category,
                });
              }}
            >
              <div className="aspect-square w-full bg-surface-container rounded-2xl relative overflow-hidden mb-3">
                <img
                  src={prod.image}
                  alt={prod.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300 pointer-events-none" />
              </div>
              <div className="flex-1 flex flex-col items-start px-1">
                <span className="font-label-sm text-secondary uppercase tracking-wider mb-1">
                  {prod.category}
                </span>
                <h3 className="font-label-md text-on-surface group-hover:text-primary transition-colors line-clamp-1 mb-2">
                  {prod.title}
                </h3>
                <div className="w-full flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                    <span className="text-on-surface font-body-sm font-bold">
                      ৳{prod.price}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onBuyNow({
                          title: prod.title,
                          price: prod.price,
                          image: prod.image,
                        });
                      }}
                      className="flex-1 bg-[#007bff] text-white py-2 rounded-md font-bold text-[11px] uppercase hover:bg-[#0056b3] transition-colors px-3"
                    >
                      Buy Now
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart({
                          title: prod.title,
                          price: prod.price,
                          image: prod.image,
                        });
                      }}
                      className="px-3 bg-[#28a745] text-white rounded-md hover:bg-[#218838] transition-colors shadow-[0_0_10px_rgba(40,167,69,0.3)]"
                    >
                      <ShoppingCart size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
