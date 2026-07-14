import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad2, Tv, Key, MessageSquare, Zap, ShoppingCart, ArrowRight , Heart } from 'lucide-react';
import { CartItem, Product, Route } from '../types';
import { useFavorites } from '../hooks/useFavorites';
import { useAdminData } from '../hooks/useAdminData';

const featuredGames = [
  {
    title: "Assassin's Creed Black Flag Resynced",
    tagline: "NOW AVAILABLE",
    description: "Sail the Caribbean as Edward Kenway during the Golden Age of Piracy in this enhanced remake with stunning visuals, upgraded gameplay, & new content.",
    price: 43.99,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80"
  },
  {
    title: "007 First Light",
    tagline: "PRE-ORDER NOW",
    description: "Step into the shoes of the legendary spy in this origin story. Master stealth, gadgets, and close-quarters combat.",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80"
  },
  {
    title: "Warframe",
    tagline: "FREE TO PLAY",
    description: "Awaken as an unstoppable warrior and battle alongside your friends in this story-driven free-to-play online action game.",
    price: 0.00,
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80"
  },
  {
    title: "gen ATLAS",
    tagline: "EARLY ACCESS",
    description: "Explore a massive procedurally generated universe, build your ship, and uncover the mysteries of the ancient ATLAS network.",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80"
  },
  {
    title: "Disney Dreamlight Valley",
    tagline: "NEW ADVENTURE PACK",
    description: "Explore the Honeyglow Woods and reconnect with Disney's Winnie the Pooh, Eeyore and Piglet in a brand-new Adventure Pack!",
    price: 9.55,
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80"
  },
  {
    title: "Cyber Neon",
    tagline: "FEATURED",
    description: "A cyberpunk open world action-adventure game where you play as a mercenary outlaw.",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&q=80"
  },
  {
    title: "Racing Apex",
    tagline: "TOURNAMENT LIVE",
    description: "Experience the ultimate racing simulator with cutting-edge graphics and real-world physics.",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&q=80"
  },
  {
    title: "Starlink Battle",
    tagline: "SEASON 3",
    description: "Command your fleet in epic space battles and conquer the galaxy in this strategy MMO.",
    price: 14.99,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD03cQm4kutIraeYUABlTlQJrLve82UlwfvTVwc-No8haGopNZjDjo316XVtQjOqF0-O6BeeWNiLBb69_LrDAHytUD9im6wcasDpqHyJX1UoEXsQ4vMUosKBTgh3dDDjEK06f8e-QY05HwvM9McvZj57hglxCMepXDaTfQMXWwDRzFMkvfYbxOm-awxFKJlr1X4UV1wSMRk-5p2C9nStasozy1L0n0uQJD8sFOeEuewW4d80EYMTv5k"
  },
  {
    title: "Mystic Legends",
    tagline: "FANTASY RPG",
    description: "Embark on an epic quest in a high-fantasy world filled with magic, monsters, and ancient lore.",
    price: 19.99,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCM6Gw5_ZzEgFHiIthxvy0bY9HCDX5o6KfQ5ckWj_eGPHldceIfwbYGMQNxN6nW_uHQxBoh2kw_JeQls10h-_g8xm3OfQXokjzLAgfiVnINW_Hrx_VC227fD0AbaEaLDhKoY9yAnGCUsufyomQppMxaYXe5M8UoYJLAjJjN3Vf9Y31M_1p6M8hDJzScw3W8Q3noYzD3gdJWwvC9uc7ohXkZatQcRxNwmplFYLaV9n_vITofW66_hVXk"
  },
  {
    title: "Zombie Siege",
    tagline: "HORROR SURVIVAL",
    description: "Survive the undead apocalypse. Build your base, gather resources, and fight for your life.",
    price: 9.99,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAqHUmq9UBTVcBPexE2bmaBcOtQVSCsfhTw2sTUaKBPSRt2diWZJ2TrEBe7lBWz244U86M32oK7cOr2Ol-5zDG3rJrL6a1mAOs2itfeSkJU19JSrsGFcdi-8tLl75HekltVgbtYusJm76M6wUFTYac5C3AwS5Moxs_nqpWIVN7hQmsFXORdNulYMoCCKdSrn3wyC0kLAn_PDF8jBEbcUPytYE0_hTJMTWW3kdkorEsQGjGbqxL6gglP"
  }
];

function FeaturedSection({ featuredGames: gamesList, onProductSelect, onAddToCart, onBuyNow }: { featuredGames: any[], onProductSelect: (product: Product) => void, onAddToCart: (item: Omit<CartItem, 'id'>) => void, onBuyNow: (item: Omit<CartItem, 'id'>) => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!gamesList || gamesList.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % gamesList.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [gamesList]);

  const currentGame = gamesList && gamesList[currentIndex] ? gamesList[currentIndex] : null;

  if (!currentGame) return null;

  return (
    <div className="w-full flex flex-col md:flex-row gap-4 h-auto md:h-[500px]">
      {/* Main Banner (2/3 width) */}
      <div className="md:w-2/3 h-[400px] md:h-full relative overflow-hidden tech-clip shadow-lg border border-primary/20 group cursor-pointer bg-surface">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={currentIndex}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30, duration: 0.5 }}
            className="absolute inset-0"
          >
            <img src={currentGame.image} alt={currentGame.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 p-8 flex flex-col justify-end text-left z-10 pointer-events-none">
          <span className="font-label-sm text-primary uppercase tracking-widest mb-2">{currentGame.tagline}</span>
          <h2 className="font-display-md md:font-display-lg text-on-surface mb-3 leading-tight max-w-md">{currentGame.title}</h2>
          <p className="font-body-md text-on-surface-variant max-w-md mb-6">{currentGame.description}</p>
          <div className="flex items-center gap-4 pointer-events-auto">
            <span className="font-headline-md text-on-surface mr-2">{currentGame.price === 0 ? "Free" : `$${currentGame.price}`}</span>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#007bff] text-white font-label-md px-8 py-3 rounded-md hover:bg-[#0056b3] transition-colors shadow-[0_0_15px_rgba(0,123,255,0.5)]"
              onClick={() => onBuyNow({ title: currentGame.title, price: currentGame.price, image: currentGame.image })}
            >
              Buy Now
            </motion.button>
            <button onClick={() => onAddToCart({ title: currentGame.title, price: currentGame.price, image: currentGame.image })} className="w-12 h-12 bg-surface-container/50 tech-clip-btn border border-white/10 flex items-center justify-center text-primary hover:bg-white/10 transition-colors backdrop-blur-md">
              <Zap size={18} />
            </button>
            <button onClick={() => onAddToCart({ title: currentGame.title, price: currentGame.price, image: currentGame.image })} className="w-12 h-12 bg-surface-container/50 tech-clip-btn border border-white/10 flex items-center justify-center text-primary hover:bg-white/10 transition-colors backdrop-blur-md">
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Right List (1/3 width) */}
      <div className="md:w-1/3 flex flex-col gap-2 h-[400px] md:h-full overflow-y-auto hide-scrollbar pr-1">
        {gamesList.map((game, i) => (
          <div 
            key={i} 
            onClick={() => setCurrentIndex(i)}
            className={`flex items-center gap-4 p-3 tech-clip cursor-pointer transition-colors group ${
              currentIndex === i ? 'bg-primary/10 border-l-2 border-primary' : 'bg-surface-container/30 hover:bg-surface-container/80'
            }`}
          >
            <img src={game.image} className="w-16 h-20 object-cover shadow-sm tech-clip" alt={game.title} />
            <div className="flex-1 flex flex-col items-start text-left">
              <h3 className={`font-label-md line-clamp-1 mb-1 transition-colors ${currentIndex === i ? 'text-primary' : 'text-on-surface-variant group-hover:text-on-surface'}`}>
                {game.title}
              </h3>
              <div className="w-full flex items-center justify-between">
                <p className="font-body-sm text-secondary">
                  {game.price === 0 ? 'Free' : `$${game.price}`}
                </p>
                <button className="text-[10px] uppercase font-bold tracking-wider bg-white/10 hover:bg-primary hover:text-on-primary text-on-surface px-2 py-1 rounded tech-clip-btn transition-colors">
                  Buy
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function syncSize() {
      const w = canvas?.clientWidth || 1280;
      const h = canvas?.clientHeight || 720;
      if (canvas && (canvas.width !== w || canvas.height !== h)) {
        canvas.width = w;
        canvas.height = h;
      }
    }
    
    const observer = new ResizeObserver(syncSize);
    observer.observe(canvas);
    syncSize();

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    if (!gl) return;
    
    const vs = `attribute vec2 a_position;
    varying vec2 v_texCoord;
    void main() {
      v_texCoord = a_position * 0.5 + 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }`;
    
    const fs = `precision highp float;
    varying vec2 v_texCoord;
    uniform float u_time;
    uniform vec2 u_resolution;

    void main() {
        vec2 uv = v_texCoord;
        
        // Distort UVs for fluid motion
        float wave1 = sin(uv.x * 3.0 + u_time * 0.5) * 0.1;
        float wave2 = cos(uv.y * 2.0 + u_time * 0.3) * 0.1;
        vec2 distortedUv = uv + vec2(wave1, wave2);
        
        // Create soft nebular clouds
        float noise = sin(distortedUv.x * 5.0) * cos(distortedUv.y * 5.0);
        noise += 0.5 * sin(distortedUv.x * 10.0 + u_time * 0.8);
        
        // Define Cyberpunk Palette
        vec3 deepSpace = vec3(0.035, 0.035, 0.043); // #09090b approx
        vec3 neonBlue = vec3(0.0, 0.94, 1.0);     // #00ffcc
        vec3 neonPurple = vec3(1.0, 0.0, 0.33);   // #ff0055
        
        // Mix colors based on noise and coordinates
        vec3 color = mix(deepSpace, neonBlue, clamp(noise * 0.3, 0.0, 1.0));
        color = mix(color, neonPurple, clamp(sin(u_time * 0.2 + distortedUv.x * 2.0) * 0.2, 0.0, 1.0));
        
        // Vignette
        float vignette = 1.0 - smoothstep(0.4, 1.2, length(uv - 0.5));
        color *= vignette;
        
        gl_FragColor = vec4(color, 1.0);
    }`;

    function cs(type: number, src: string) {
      const s = gl!.createShader(type);
      if (!s) return null;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return s;
    }
    
    const prog = gl.createProgram();
    if(!prog) return;
    const vShader = cs(gl.VERTEX_SHADER, vs);
    const fShader = cs(gl.FRAGMENT_SHADER, fs);
    if(vShader && fShader) {
      gl.attachShader(prog, vShader);
      gl.attachShader(prog, fShader);
      gl.linkProgram(prog);
      gl.useProgram(prog);
    }
    
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    
    const uTime = gl.getUniformLocation(prog, 'u_time');
    
    let animationFrameId: number;
    function render(t: number) {
      if(gl && prog && canvas) {
        gl.viewport(0, 0, canvas.width, canvas.height);
        if (uTime) gl.uniform1f(uTime, t * 0.001);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      animationFrameId = requestAnimationFrame(render);
    }
    render(0);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 w-full h-full block">
        <canvas ref={canvasRef} className="block w-full h-full" />
      </div>
      
    </div>
  );
}


interface HomeProps {
  onProductSelect: (product: Product) => void;
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
  onBuyNow: (item: Omit<CartItem, 'id'>) => void;
  onNavigate: (route: Route) => void;
}

export function Home({ onAddToCart, onBuyNow, onNavigate, onProductSelect }: HomeProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { settings, homeSections, products } = useAdminData();

  const currentFeaturedGames = settings?.featuredGames && settings.featuredGames.length > 0 ? settings.featuredGames : featuredGames;

  const handleCategoryClick = (title: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (title === "Game Top-Ups") {
      const el = document.getElementById('top-up-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        onNavigate('games');
      }
    } else if (title === "Streaming") {
      const netflix = products.find(p => p.id === 'netflix' || p.title?.toLowerCase().includes('netflix'));
      if (netflix) {
        onProductSelect({
          id: netflix.id,
          title: netflix.title,
          description: netflix.description || 'Premium entertainment access.',
          price: netflix.basePrice || 0,
          image: netflix.image,
          category: netflix.category
        });
      } else {
        const el = document.getElementById('section-subscriptions');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          onNavigate('software');
        }
      }
    } else if (title === "Software Keys") {
      onNavigate('software');
    } else if (title === "Discord Services") {
      const discord = products.find(p => p.id === 'discord-nitro' || p.title?.toLowerCase().includes('discord'));
      if (discord) {
        onProductSelect({
          id: discord.id,
          title: discord.title,
          description: discord.description || 'Nitro and server boosts.',
          price: discord.basePrice || 0,
          image: discord.image,
          category: discord.category
        });
      } else {
        onNavigate('software');
      }
    }
  };

  return (
    <div className="flex-grow flex flex-col pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden px-margin-mobile md:px-margin-desktop py-24">
        <ShaderBackground />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full max-w-7xl mx-auto"
        >
          <FeaturedSection featuredGames={currentFeaturedGames} onProductSelect={onProductSelect} onAddToCart={onAddToCart} onBuyNow={onBuyNow} />
        </motion.div>
      </section>

      {/* Top-Up Section - Placed at the very top of content sections */}
      {(() => {
        const topUpProducts = products.filter(p => (p.folder || p.category) === 'Top-Up');
        if (topUpProducts.length === 0) return null;
        
        // Sorting requested order: Normal Diamond Top Up (uid-topup), Weekly & Monthly (weekly-monthly), Weekly Lite (weekly-lite), Level Up Pass (level-up-pass)
        const topUpOrder = ['uid-topup', 'weekly-monthly', 'weekly-lite', 'level-up-pass'];
        const sortedTopUp = [...topUpProducts].sort((a, b) => {
          const indexA = topUpOrder.indexOf(a.id);
          const indexB = topUpOrder.indexOf(b.id);
          if (indexA !== -1 && indexB !== -1) return indexA - indexB;
          if (indexA !== -1) return -1;
          if (indexB !== -1) return 1;
          return 0;
        });

        return (
          <section id="top-up-section" className="py-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
            <h2 className="font-headline-md text-primary text-glow mb-10 text-center">Top-Up</h2>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {sortedTopUp.map((item, i) => (
                <motion.div 
                  key={item.id || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  onClick={() => {
                    if (['uid-topup', 'weekly-monthly', 'weekly-lite', 'level-up-pass'].includes(item.id)) {
                      onNavigate(item.id as any);
                    } else {
                      onProductSelect({
                        id: item.id,
                        title: item.title,
                        description: item.description || `Purchase ${item.title} securely with instant delivery.`,
                        price: item.basePrice || 0,
                        image: item.image,
                        category: item.category || 'Top-Up'
                      });
                    }
                  }} 
                  className="flex flex-col items-center gap-4 cursor-pointer group"
                >
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden relative tech-clip shadow-[0_0_20px_rgba(0,240,255,0.15)] group-hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all duration-300 border border-primary/30 group-hover:border-primary">
                    <div className="absolute inset-0 bg-primary/10 mix-blend-multiply z-10 group-hover:bg-transparent transition-colors" />
                    <img 
                      src={item.image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80"} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  <h3 className="font-label-md text-on-surface group-hover:text-primary transition-colors text-center max-w-[160px]">{item.title}</h3>
                </motion.div>
              ))}
            </div>
          </section>
        );
      })()}

      {/* Categories */}
      <section className="py-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-headline-md text-primary text-glow">Ecosystem</h2>
          <button 
            onClick={() => onNavigate('games')}
            className="text-secondary hover:text-primary transition-colors text-sm font-label-sm uppercase flex items-center gap-1"
          >
            View All <ArrowRight size={16} />
          </button>
        </div>
        
        <div className="flex overflow-x-auto gap-6 pb-6 hide-scrollbar snap-x snap-mandatory">
          {[
            { icon: Gamepad2, title: "Game Top-Ups", desc: "Instant delivery for major titles.", color: "primary-container", shadow: "#00ffcc60" },
            { icon: Tv, title: "Streaming", desc: "Premium entertainment access.", color: "secondary", shadow: "#ff005560" },
            { icon: Key, title: "Software Keys", desc: "OS and productivity licenses.", color: "primary-container", shadow: "#00ffcc60" },
            { icon: MessageSquare, title: "Discord Services", desc: "Nitro and server boosts.", color: "secondary", shadow: "#ff005560" },
          ].map((cat, i) => (
            <motion.a
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ 
                delay: i * 0.1,
                scale: { type: "spring", stiffness: 400, damping: 25, delay: 0 },
                y: { type: "spring", stiffness: 400, damping: 25, delay: 0 }
              }}
              href="#"
              onClick={(e) => handleCategoryClick(cat.title, e)}
              className={`min-w-[280px] snap-start glass-panel tech-clip p-6 group hover:bg-white/5 transition-colors duration-300 hover:shadow-[0_0_30px_-5px_${cat.shadow}]`}
            >
              <div className={`w-12 h-12 tech-clip bg-${cat.color}/20 flex items-center justify-center text-${cat.color} mb-4 group-hover:scale-110 transition-transform`}>
                <cat.icon />
              </div>
              <h3 className="font-headline-md text-body-lg text-on-surface mb-2">{cat.title}</h3>
              <p className="text-sm text-on-surface-variant">{cat.desc}</p>
            </motion.a>
          ))}
        </div>
      </section>


      {/* Free Fire Topup Section */}
      
      

      {/* Dynamic Product Sections (from Admin Products) */}
      {Array.from(new Set(products.map(p => p.folder || p.category)))
        .filter(sectionTitle => (sectionTitle as string) !== 'Top-Up')
        .map((sectionTitle, idx) => {
        const titleStr = sectionTitle as string;
        const sectionProducts = products.filter(p => (p.folder || p.category) === titleStr);
        if (sectionProducts.length === 0) return null;
        
        return (
          <section id={`section-${(titleStr || '').toLowerCase().replace(/\s+/g, '-')}`} key={titleStr || idx} className="py-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
            <h2 className="font-headline-md text-primary text-glow mb-10 text-center">{titleStr}</h2>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {sectionProducts.map((item, i) => (
                <motion.div 
                  key={item.id || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  onClick={() => {
                    if (['uid-topup', 'weekly-monthly', 'weekly-lite', 'level-up-pass'].includes(item.id)) {
                      onNavigate(item.id as any);
                    } else {
                      onProductSelect({
                        id: item.id,
                        title: item.title,
                        description: item.description || `Purchase ${item.title} securely with instant delivery.`,
                        price: item.basePrice || 0,
                        image: item.image,
                        category: item.category || sectionTitle
                      });
                    }
                  }} 
                  className="flex flex-col items-center gap-4 cursor-pointer group"
                >
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden relative tech-clip shadow-[0_0_20px_rgba(0,240,255,0.15)] group-hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all duration-300 border border-primary/30 group-hover:border-primary">
                    <div className="absolute inset-0 bg-primary/10 mix-blend-multiply z-10 group-hover:bg-transparent transition-colors" />
                    <img 
                      src={item.image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80"} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  <h3 className="font-label-md text-on-surface group-hover:text-primary transition-colors text-center max-w-[160px]">{item.title}</h3>
                </motion.div>
              ))}
            </div>
          </section>
        );
      })}

      {/* Featured Products */}
      
      {homeSections.map((section, idx) => (
        <section key={section.id || idx} className={`${idx === 0 ? "py-16" : "pb-16"} px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full flex-grow`}>
          <h2 className="font-headline-md text-primary text-glow mb-10">{section.title}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {section.products.map((prod, i) => (
              <motion.div 
                key={prod.id || i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col group cursor-pointer"
                onClick={() => onProductSelect({ id: prod.title, title: prod.title, description: prod.description || (prod.title + ' details.'), price: prod.price, image: prod.image, category: section.title })}
              >
                <div className="aspect-square w-full bg-surface-container rounded-2xl relative overflow-hidden mb-3">
                  <img src={prod.image} alt={prod.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div 
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 text-white/70 hover:bg-black/80 hover:text-secondary transition-colors z-10"
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(prod.title, e); }}
                  >
                    <Heart size={16} fill={isFavorite(prod.title) ? "currentColor" : "none"} className={isFavorite(prod.title) ? "text-red-500" : ""} />
                  </div>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300 pointer-events-none" />
                </div>
                
                <div className="flex flex-col flex-grow px-1">
                  <span className="text-[10px] uppercase text-on-surface-variant font-bold tracking-wider mb-1">{prod.type}</span>
                  <h3 className="font-body-sm font-bold text-on-surface mb-2 line-clamp-2 leading-snug group-hover:text-primary transition-colors">{prod.title}</h3>
                  <div className="mt-auto flex items-center gap-2 mb-3">
                    {prod.discount && <span className="bg-[#007bff] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">{prod.discount}</span>}
                    {prod.originalPrice && <span className="text-on-surface-variant text-[11px] line-through font-medium">৳{prod.originalPrice}</span>}
                    <span className="text-on-surface font-body-sm font-bold">৳{prod.price}</span>
                  </div>
                  <div className="flex gap-2">
                    {(() => {
                      const mainProd = products.find(p => p.title === prod.title);
                      const isOutOfStock = mainProd && mainProd.variants && mainProd.variants.length > 0 && !mainProd.variants.some(v => v.stock === 'In Stock');
                      if (isOutOfStock) {
                        return (
                           <div className="w-full text-center py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-md font-bold text-[11px] uppercase">
                              Out of Stock
                           </div>
                        );
                      }
                      return (
                        <>
                          <button 
                            onClick={(e) => { e.stopPropagation(); onBuyNow({ title: prod.title, price: prod.price, image: prod.image }); }}
                            className="flex-grow bg-[#007bff] text-white font-label-md py-2 rounded-md hover:bg-[#0056b3] transition-colors shadow-[0_0_10px_rgba(0,123,255,0.3)] text-sm"
                          >
                            BUY NOW
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); onAddToCart({ title: prod.title, price: prod.price, image: prod.image }); }}
                            className="w-10 bg-surface-container border border-white/10 flex items-center justify-center text-primary hover:bg-white/10 rounded-md transition-colors"
                          >
                            <ShoppingCart size={16} />
                          </button>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      ))}


      {/* Social Media Service Section */}
      <section className="py-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
        <h2 className="font-headline-md text-primary text-glow mb-10 text-center">Social Media Service</h2>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {[
            { title: "Facebook Page Like/Followers", image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80" },
            { title: "Facebook React Post/Photos", image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80" },
            { title: "Facebook ID Followers", image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80" },
            { title: "TikTok Account Followers", image: "https://images.unsplash.com/photo-1611605698335-8b1569810432?auto=format&fit=crop&q=80" },
            { title: "TikTok Video Views", image: "https://images.unsplash.com/photo-1611605698335-8b1569810432?auto=format&fit=crop&q=80" },
            { title: "TikTok Video Likes", image: "https://images.unsplash.com/photo-1611605698335-8b1569810432?auto=format&fit=crop&q=80" },
            { title: "YouTube Subscribe", image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&q=80" },
            { title: "YouTube Video Views", image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&q=80" },
            { title: "YouTube Video Likes", image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&q=80" }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="flex flex-col items-center gap-4 cursor-pointer group"
            >
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden relative tech-clip shadow-[0_0_20px_rgba(0,240,255,0.15)] group-hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all duration-300 border border-primary/30 group-hover:border-primary">
                <div className="absolute top-2 right-2 bg-black/80 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow-sm z-20">Ads</div>
                <div className="absolute inset-0 bg-primary/10 mix-blend-multiply z-10 group-hover:bg-transparent transition-colors" />
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="font-label-md text-on-surface group-hover:text-primary transition-colors text-center max-w-[160px]">{item.title}</h3>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

