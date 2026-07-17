import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { Order, CartItem } from "../types";

const cleanObject = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj
      .map((v) => (v && typeof v === "object" ? cleanObject(v) : v))
      .filter((v) => v !== undefined);
  } else if (obj !== null && typeof obj === "object") {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key as keyof typeof acc] =
          value !== null && typeof value === "object"
            ? cleanObject(value)
            : value;
      }
      return acc;
    }, {} as any);
  }
  return obj;
};

export interface PaymentMethodConfig {
  method: string;
  number: string;
  type: "Personal" | "Agent" | "Merchant";
  logo?: string;
}

export interface StaffMember {
  email: string;
  role: "Admin" | "Moderator";
}

export interface FeaturedGame {
  title: string;
  tagline: string;
  description: string;
  price: number;
  image: string;
}

export interface ContactInfo {
  whatsapp?: string;
  discord?: string;
  email?: string;
}

export interface SiteSettings {
  staff: StaffMember[];
  paymentMethods: PaymentMethodConfig[];
  deliveryCharge: number;
  featuredGames?: FeaturedGame[];
  contactInfo?: ContactInfo;
}

export const defaultSettings: SiteSettings = {
  staff: [{ email: "nahidamin555@gmail.com", role: "Admin" }],
  contactInfo: {
    whatsapp: "https://wa.me/1234567890",
    discord: "https://discord.gg/example",
    email: "mailto:support@example.com",
  },
  paymentMethods: [
    { method: "bKash", number: "01700000000", type: "Personal", logo: "" },
    { method: "Nagad", number: "01700000000", type: "Personal", logo: "" },
    { method: "Rocket", number: "01700000000", type: "Personal", logo: "" },
  ],
  deliveryCharge: 0,
  featuredGames: [
    {
      title: "Assassin's Creed Black Flag Resynced",
      tagline: "NOW AVAILABLE",
      description:
        "Sail the Caribbean as Edward Kenway during the Golden Age of Piracy in this enhanced remake with stunning visuals, upgraded gameplay, & new content.",
      price: 43.99,
      image:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80",
    },
    {
      title: "007 First Light",
      tagline: "PRE-ORDER NOW",
      description:
        "Step into the shoes of the legendary spy in this origin story. Master stealth, gadgets, and close-quarters combat.",
      price: 59.99,
      image:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80",
    },
    {
      title: "Warframe",
      tagline: "FREE TO PLAY",
      description:
        "Awaken as an unstoppable warrior and battle alongside your friends in this story-driven free-to-play online action game.",
      price: 0.0,
      image:
        "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80",
    },
    {
      title: "gen ATLAS",
      tagline: "EARLY ACCESS",
      description:
        "Explore a massive procedurally generated universe, build your ship, and uncover the mysteries of the ancient ATLAS network.",
      price: 24.99,
      image:
        "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80",
    },
    {
      title: "Disney Dreamlight Valley",
      tagline: "NEW ADVENTURE PACK",
      description:
        "Explore the Honeyglow Woods and reconnect with Disney's Winnie the Pooh, Eeyore and Piglet in a brand-new Adventure Pack!",
      price: 9.55,
      image:
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80",
    },
    {
      title: "Cyber Neon",
      tagline: "FEATURED",
      description:
        "A cyberpunk open world action-adventure game where you play as a mercenary outlaw.",
      price: 29.99,
      image:
        "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&q=80",
    },
    {
      title: "Racing Apex",
      tagline: "TOURNAMENT LIVE",
      description:
        "Experience the ultimate racing simulator with cutting-edge graphics and real-world physics.",
      price: 39.99,
      image:
        "https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&q=80",
    },
    {
      title: "Starlink Battle",
      tagline: "SEASON 3",
      description:
        "Command your fleet in epic space battles and conquer the galaxy in this strategy MMO.",
      price: 14.99,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD03cQm4kutIraeYUABlTlQJrLve82UlwfvTVwc-No8haGopNZjDjo316XVtQjOqF0-O6BeeWNiLBb69_LrDAHytUD9im6wcasDpqHyJX1UoEXsQ4vMUosKBTgh3dDDjEK06f8e-QY05HwvM9McvZj57hglxCMepXDaTfQMXWwDRzFMkvfYbxOm-awxFKJlr1X4UV1wSMRk-5p2C9nStasozy1L0n0uQJD8sFOeEuewW4d80EYMTv5k",
    },
    {
      title: "Mystic Legends",
      tagline: "FANTASY RPG",
      description:
        "Embark on an epic quest in a high-fantasy world filled with magic, monsters, and ancient lore.",
      price: 19.99,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCM6Gw5_ZzEgFHiIthxvy0bY9HCDX5o6KfQ5ckWj_eGPHldceIfwbYGMQNxN6nW_uHQxBoh2kw_JeQls10h-_g8xm3OfQXokjzLAgfiVnINW_Hrx_VC227fD0AbaEaLDhKoY9yAnGCUsufyomQppMxaYXe5M8UoYJLAjJjN3Vf9Y31M_1p6M8hDJzScw3W8Q3noYzD3gdJWwvC9uc7ohXkZatQcRxNwmplFYLaV9n_vITofW66_hVXk",
    },
    {
      title: "Zombie Siege",
      tagline: "HORROR SURVIVAL",
      description:
        "Survive the undead apocalypse. Build your base, gather resources, and fight for your life.",
      price: 9.99,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAqHUmq9UBTVcBPexE2bmaBcOtQVSCsfhTw2sTUaKBPSRt2diWZJ2TrEBe7lBWz244U86M32oK7cOr2Ol-5zDG3rJrL6a1mAOs2itfeSkJU19JSrsGFcdi-8tLl75HekltVgbtYusJm76M6wUFTYac5C3AwS5Moxs_nqpWIVN7hQmsFXORdNulYMoCCKdSrn3wyC0kLAn_PDF8jBEbcUPytYE0_hTJMTWW3kdkorEsQGjGbqxL6gglP",
    },
  ],
};

export interface PackageVariant {
  id: string;
  name: string;
  price: number;
  stock: string;
}

export interface AdminProduct {
  id: string;
  title: string;
  category: string;
  basePrice: number;
  variants: PackageVariant[];
  folder?: string;
  image?: string;
  images?: string[];
  description?: string;
}

const defaultProducts: AdminProduct[] = [
  {
    id: "uid-topup",
    title: "Normal Diamond Top Up",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80",
    category: "Top-Up",
    basePrice: 20,
    variants: [
      { id: "1", name: "Weekly", price: 158, stock: "In Stock" },
      { id: "2", name: "Monthly", price: 790, stock: "In Stock" },
      { id: "3", name: "25 Diamond", price: 20, stock: "In Stock" },
      { id: "4", name: "50 Diamond", price: 36, stock: "In Stock" },
      { id: "5", name: "100 Diamond", price: 71, stock: "In Stock" },
      { id: "6", name: "115 Diamond", price: 79, stock: "In Stock" },
      { id: "7", name: "240 Diamond", price: 158, stock: "In Stock" },
      { id: "8", name: "355 Diamond", price: 239, stock: "In Stock" },
      { id: "9", name: "505 Diamond", price: 336, stock: "In Stock" },
      { id: "10", name: "610 Diamond", price: 401, stock: "In Stock" },
      { id: "11", name: "850 Diamond", price: 559, stock: "In Stock" },
      { id: "12", name: "1090 Diamond", price: 717, stock: "In Stock" },
      { id: "13", name: "1240 Diamond", price: 800, stock: "In Stock" },
      { id: "14", name: "1850 Diamond", price: 1200, stock: "In Stock" },
      { id: "15", name: "2530 Diamond", price: 1605, stock: "In Stock" },
      { id: "16", name: "5060 Diamond", price: 3210, stock: "In Stock" },
    ],
  },
  {
    id: "weekly-monthly",
    title: "Weekly & Monthly",
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80",
    category: "Top-Up",
    basePrice: 158,
    variants: [
      { id: "1", name: "Weekly", price: 158, stock: "In Stock" },
      { id: "2", name: "Monthly", price: 790, stock: "In Stock" },
    ],
  },
  {
    id: "weekly-lite",
    title: "Weekly Lite",
    image:
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80",
    category: "Top-Up",
    basePrice: 79,
    variants: [{ id: "1", name: "Weekly Lite", price: 79, stock: "In Stock" }],
  },
  {
    id: "level-up-pass",
    title: "Level Up Pass",
    image:
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80",
    category: "Top-Up",
    basePrice: 158,
    variants: [
      { id: "1", name: "Level Up Pass", price: 158, stock: "In Stock" },
    ],
  },
  {
    id: "gta-v",
    title: "Grand Theft Auto V",
    image:
      "https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&q=80",
    category: "Games",
    basePrice: 29.99,
    variants: [
      { id: "v1", name: "Standard Edition", price: 29.99, stock: "In Stock" },
      { id: "v2", name: "Premium Edition", price: 39.99, stock: "In Stock" },
      {
        id: "v3",
        name: "Online Starter Pack",
        price: 14.99,
        stock: "In Stock",
      },
    ],
  },
  {
    id: "valor-protocol",
    title: "Valor Protocol",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCj94WKFbKay6kHvr0ZSQE3BnetqLicU8AIapsHVwTCi0pcloDDCHFKBfRhlML-BEXXjanetBKmfVSL6Eq0QBJ48fahE7KFuprtGlq2tTm_AK7FXNiLZst_hAiGzyB-2Afb6ldDZ1zNzrS92b65Trcb4iNSWy3lcSlHfFmiBJE1XfnPCzpvW7edLH5ADpRMarS9lT_paPyACpgyanPQBiB0ALEYpJskPlgm6UkvnWttkoO3uGHAXsL_",
    category: "Games",
    folder: "PC",
    basePrice: 19.99,
    description: "Top up VP Points for seasonal cosmetics and battle passes.",
    variants: [{ id: "vp1", name: "1000 VP", price: 19.99, stock: "In Stock" }],
  },
  {
    id: "unknown-battlegrounds",
    title: "Unknown Battlegrounds",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCcxc28KfLd2WS5Az_pcOk2HdSHqJiy_6p_N094T2oyBO7ybB8FWs7pnE7mH3qox9O7Tu36O0gXfDZYplqVOsKw-p0ltypkHPLdHrIKDxQeEBin8lze02JphkXSwmLrx7OtgAb7R4aepG93MMEcY-rWIom2_1oXR2J2VQRrlyj0eWOF9lgs95x2jXmB4o_pKmLsk34j1emSDs821axbIaZU51g51NiR-9Y80Ry5L7NvewYLXV218VOM",
    category: "Games",
    folder: "Mobile",
    basePrice: 9.99,
    description:
      "Instant delivery for UC cash. Enhance your loadout instantly.",
    variants: [{ id: "ub1", name: "600 UC", price: 9.99, stock: "In Stock" }],
  },
  {
    id: "genshin-chronicles",
    title: "Genshin Chronicles",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBIsXraf3nWomM4Xfj6sg_tkWcYzlC0uzWqRNJkZrhlSPVytmXFNmDZS6TqzAA_xD5p-YhN-mIDreTfv2O_gDI5l9xaq6_X07td7KUUOcHsRXOfSJI0iF4MZ8uVAY7ZTZOtSeD0MmdJDLObGpm3JGGkJxAM2KcxZOO4003VyO1s6E8s_uj_Jg0fHpoYgp0v-3aEtFU_n-fJKcv6-VOllQ1BprMAH4scA_AU1KCW4DxtHQs49d4SAhFI",
    category: "Games",
    folder: "Multi",
    basePrice: 29.99,
    description: "Purchase Genesis Diamonds safely and securely.",
    variants: [
      {
        id: "gc1",
        name: "1980 Genesis Crystals",
        price: 29.99,
        stock: "In Stock",
      },
    ],
  },
  {
    id: "discord-nitro",
    title: "Discord Nitro",
    category: "Software",
    basePrice: 9.99,
    variants: [
      { id: "v1", name: "1 Month", price: 9.99, stock: "In Stock" },
      { id: "v2", name: "3 Months", price: 26.99, stock: "In Stock" },
      { id: "v3", name: "1 Year", price: 99.99, stock: "In Stock" },
    ],
  },
  {
    id: "windows-11-pro",
    title: "Windows 11 Pro - Global Key",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDXF0xPmTeW1vKZZq_zBkMAxquaCSzk4vokOFtllvAddQvOr8hVsE0-RIRVZGK6B8nxsNqYmjNnyKUbSO_G49Uu9q1kcMuaZQEveUE8sage961beZxSRgA08eNpMhpCtPZ48vpzFwZTCaOR0tEyNrHmb0voalQ22kpYku9boWuEof0o33LzWBQ_UhK2oPL3veX7yxkyGxxbJ7XpsBs5pBmKa_lFHx_x0IExGfgfdX4biTQ1SQVDEjU9",
    category: "Software",
    folder: "Operating System",
    basePrice: 169.99,
    description:
      "Upgrade your battlestation with the latest features, enhanced security, and directx 12 ultimate support for maximum gaming performance.",
    variants: [
      { id: "w1", name: "Global Retail Key", price: 169.99, stock: "In Stock" },
    ],
  },
  {
    id: "adobe-creative-cloud",
    title: "Adobe Creative Cloud",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAOcqq96XgOv0mtCRobPrHXi7iDZ5vspVDWKn08TgYnSff_xL_VPopk8ZQUObGchzYrcnsu9HIDzhIBLpH-72Po0xrBF4mvnrL2lupCAMtDN6QnYOgbDPc2l6iZ1kGxTdNzQhKqb_HEJWaZE3oFO2QfSfksn6d_yHh0S7BFkzs9bXwvwQrypcL8RwwzUHFdECymac1EbXi9k11omjXa_BoYswHkRlqnXIYhNEZBMHYln49ffhyjeN1C",
    category: "Software",
    folder: "Creative Suite",
    basePrice: 599.99,
    description: "1-Year Subscription to all Creative Cloud apps.",
    variants: [
      {
        id: "a1",
        name: "1 Year Subscription",
        price: 599.99,
        stock: "In Stock",
      },
    ],
  },
  {
    id: "office-2021-professional",
    title: "Office 2021 Professional",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBs5TmA6bz0eFFMfS5SVgOd_Vm00byGz65WtNh3eaMq1DF_LUSRDGAo_FlYpePKezf_cYSEmhwMg5oLPFxetKcVt5QG-nu6TbZcNM8LxwOCYwZJXBQWpHGvkck7oUJQpI0uUIaqp6CGm1Fc-iVq4WAgO96nN_nFoJHpaD281J5J3mVR3clIqolkoTrK2YMAoHp50JPrvvGAEFXK-hzPusUAZCVDdZcRFQnfcCZysVd-HNHaUPh1_faC",
    category: "Software",
    folder: "Productivity",
    basePrice: 39.99,
    description: "Lifetime Bind Key for Office 2021 Professional Plus.",
    variants: [
      { id: "o1", name: "Lifetime Key", price: 39.99, stock: "In Stock" },
    ],
  },
  {
    id: "steam-wallet-50",
    title: "Steam Wallet Code - $50",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDqFi-i02I_hb-toDlPREgE4EJ8HECUucJDuvMvxS2TQ4pXE627gmfGVj1CHsQO13I-CQVVWAKz3bDUnJipwSUmG7CKRZUeCnoj0_CA9_FXstHvpoNS2d0R3229DtbXNRpsnQNJPbvjjCtpVYLkaZpC57zLZU54Z4USBRe_hdzYMDBAfMGbiOpaquVnR2fycxgkRYylF2sEjAKwWrmH9iervg4aVg8yztQK_oW7FmK5HIe7x_e2BpNd",
    category: "Software",
    folder: "Gift Card",
    basePrice: 50.0,
    description: "Instant digital delivery of Steam Wallet Code.",
    variants: [{ id: "s1", name: "$50 Code", price: 50.0, stock: "In Stock" }],
  },
  {
    id: "xbox-game-pass-ultimate",
    title: "Xbox Game Pass Ultimate",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBwOwm7ueQHJv8U7MOs_feWXI5rgNXFqcWfuVKzuiI4WB3CWDdP_qnvzdKXM61at6691bEO4UBXEjVZ6Q67PjqomGa8OBR-YEZPGvad3r7m-JZP-pThqK7_pAbs629z-BSJoGxOXaNTdcuQmBuqKbsE0wYNj7UapjW1LpkM5iOsR7DZzjZYlzuq5bsYH7JO13j5BfeNFiQ83cJvnOHskrsHp1dq2132T2CiRlEdaPR5OmSH6Cf_xNqY",
    category: "Software",
    folder: "Gift Card",
    basePrice: 44.99,
    description: "3-Month Membership subscription code.",
    variants: [
      { id: "x1", name: "3-Month Membership", price: 44.99, stock: "In Stock" },
    ],
  },
  {
    id: "apple-gift-card-100",
    title: "Apple Gift Card - $100",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAEBILcwyid15s-v8-WXDt9Sjm6fxVfJ2iy3xrCYnsZy17bGEJWKlMVF68PXOfSVxjbiDv4jX3D0TVgwZQWSdYRJMkATv72eESIOFzejACDbTkew3bZwsx40rvJKKbFQ7eJNa0mXz1IFdzCVCF000d8eSZHDXcVvrAxsaBj5ZfCaM_1pS-ISnuTg3jjoI9lNSP2IOhOYOPSriqZ3arr_Ln3-zuVSjxUjP37-OuSR-TxViprvHFoIKzX",
    category: "Software",
    folder: "Gift Card",
    basePrice: 100.0,
    description: "App Store, iTunes & More gift card code.",
    variants: [
      { id: "ap1", name: "$100 Code", price: 100.0, stock: "In Stock" },
    ],
  },
  {
    id: "netflix",
    title: "Netflix Premium",
    category: "Subscriptions",
    basePrice: 15.99,
    variants: [
      { id: "v1", name: "1 Screen (1 Month)", price: 4.99, stock: "In Stock" },
      {
        id: "v2",
        name: "4 Screens (1 Month)",
        price: 15.99,
        stock: "In Stock",
      },
    ],
  },
];

export interface HomeSectionProduct {
  id: string;
  title: string;
  type: string;
  originalPrice?: number;
  discount?: string;
  price: number;
  image: string;
  description?: string;
}

export interface HomeSection {
  id: string;
  title: string;
  products: HomeSectionProduct[];
}

const defaultHomeSections: HomeSection[] = [
  {
    id: "trending-arsenal",
    title: "Trending Arsenal",
    products: [
      {
        id: "1",
        title: "Free Fire 1000 Diamonds",
        type: "Top-Up",
        originalPrice: 19.99,
        discount: "-50%",
        price: 9.99,
        image:
          "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80",
      },
      {
        id: "2",
        title: "Netflix Premium 1 Month",
        type: "Subscription",
        originalPrice: 20.99,
        discount: "-25%",
        price: 15.99,
        image:
          "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80",
      },
      {
        id: "3",
        title: "Valorant 2000 Points",
        type: "Game Currency",
        originalPrice: 24.99,
        discount: "-20%",
        price: 19.99,
        image:
          "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80",
      },
      {
        id: "4",
        title: "Windows 11 Pro Key",
        type: "Software",
        originalPrice: 199.99,
        discount: "-85%",
        price: 29.99,
        image:
          "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80",
      },
    ],
  },
];

const defaultOrders: Order[] = [
  {
    id: "ORD-001",
    user: "Alex H.",
    email: "alex@example.com",
    items: [{ id: "1", title: "Valorant 2050 VP", price: 19.99 }],
    amount: 19.99,
    date: "2026-07-11",
    status: "Completed",
    paymentMethod: "bKash",
  },
  {
    id: "ORD-002",
    user: "Sarah M.",
    email: "sarah@example.com",
    items: [{ id: "2", title: "Netflix Premium", price: 15.99 }],
    amount: 15.99,
    date: "2026-07-12",
    status: "Pending",
    paymentMethod: "Nagad",
  },
  {
    id: "ORD-003",
    user: "John D.",
    email: "john@example.com",
    items: [{ id: "3", title: "Free Fire 1000 Diamonds", price: 9.99 }],
    amount: 9.99,
    date: "2026-07-10",
    status: "Completed",
    paymentMethod: "Rocket",
  },
  {
    id: "ORD-004",
    user: "Mike T.",
    email: "mike@example.com",
    items: [{ id: "4", title: "Spotify Premium", price: 29.99 }],
    amount: 29.99,
    date: "2026-07-10",
    status: "Cancelled",
    paymentMethod: "Visa Card",
  },
];

export function useAdminData() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [homeSections, setHomeSections] = useState<HomeSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Settings
    const unsubSettings = onSnapshot(
      doc(db, "config", "settings"),
      (docSnap) => {
        if (docSnap.exists()) {
          setSettings(docSnap.data() as SiteSettings);
        } else {
          if (auth.currentUser?.email === "nahidamin555@gmail.com") {
            setDoc(
              doc(db, "config", "settings"),
              cleanObject(defaultSettings),
            ).catch((e) => console.error("setDoc config error", e));
          }
        }
      },
      (err) => {
        console.error(err);
        setError(err.message);
      },
    );

    // Orders
    const unsubOrders = onSnapshot(
      collection(db, "orders"),
      (snapshot) => {
        const ords: Order[] = [];
        snapshot.forEach((d) => ords.push(d.data() as Order));
        setOrders(
          ords.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          ),
        );
      },
      (error) => {
        console.error("Orders permissions error:", error);
      },
    );

    // Products
    const unsubProducts = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        const prods: AdminProduct[] = [];
        snapshot.forEach((d) => prods.push(d.data() as AdminProduct));
        if (prods.length === 0) {
          if (auth.currentUser?.email === "nahidamin555@gmail.com") {
            defaultProducts.forEach((p) =>
              setDoc(doc(db, "products", p.id), cleanObject(p)).catch(
                console.error,
              ),
            );
          }
        } else {
          // Restore essential top-ups if missing
          if (auth.currentUser?.email === "nahidamin555@gmail.com") {
            const essentialIds = [
              "uid-topup",
              "weekly-monthly",
              "weekly-lite",
              "level-up-pass",
            ];
            essentialIds.forEach((eid) => {
              if (!prods.find((p) => p.id === eid)) {
                const dp = defaultProducts.find((p) => p.id === eid);
                if (dp)
                  setDoc(doc(db, "products", dp.id), cleanObject(dp)).catch(
                    console.error,
                  );
              }
            });
          }
          setProducts(prods);
        }
      },
      (error) => {
        console.error("Products permissions error:", error);
      },
    );

    // Home Sections
    const unsubHome = onSnapshot(
      collection(db, "home_sections"),
      (snapshot) => {
        const sections: HomeSection[] = [];
        snapshot.forEach((d) => sections.push(d.data() as HomeSection));
        if (sections.length === 0) {
          if (auth.currentUser?.email === "nahidamin555@gmail.com") {
            defaultHomeSections.forEach((s) =>
              setDoc(doc(db, "home_sections", s.id), cleanObject(s)).catch(
                console.error,
              ),
            );
          }
        } else {
          setHomeSections(sections);
        }
      },
      (error) => {
        console.error("Home sections permissions error:", error);
      },
    );

    setLoading(false);

    return () => {
      unsubSettings();
      unsubOrders();
      unsubProducts();
      unsubHome();
    };
  }, []);

  const updateSettings = async (updates: Partial<SiteSettings>) => {
    await setDoc(
      doc(db, "config", "settings"),
      cleanObject({ ...settings, ...updates }),
      { merge: true },
    );
  };

  const addOrder = async (orderData: any) => {
    const id = "ORD-" + Math.floor(100 + Math.random() * 900);
    const newOrder: Order = {
      ...orderData,
      id,
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
    };
    await setDoc(doc(db, "orders", id), cleanObject(newOrder));
  };

  const updateOrderStatus = async (
    orderId: string,
    status: "Pending" | "Completed" | "Cancelled",
  ) => {
    await updateDoc(doc(db, "orders", orderId), cleanObject({ status }));
  };

  const clearOrders = async () => {
    const snapshot = await getDocs(collection(db, "orders"));
    snapshot.forEach(async (d) => {
      await deleteDoc(doc(db, "orders", d.id));
    });
  };

  const addProduct = async (
    newProduct: Omit<AdminProduct, "id" | "variants">,
  ) => {
    const id = newProduct.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const product: AdminProduct = { ...newProduct, id, variants: [] };
    await setDoc(doc(db, "products", id), cleanObject(product));
  };

  const updateProduct = async (
    productId: string,
    updates: Partial<AdminProduct>,
  ) => {
    await updateDoc(doc(db, "products", productId), cleanObject(updates));
  };

  const removeProduct = async (productId: string) => {
    await deleteDoc(doc(db, "products", productId));
  };

  const removeProductCategory = async (categoryOrFolder: string) => {
    const snapshot = await getDocs(collection(db, "products"));
    snapshot.forEach(async (d) => {
      const data = d.data() as AdminProduct;
      if (
        data.category === categoryOrFolder ||
        data.folder === categoryOrFolder
      ) {
        await deleteDoc(doc(db, "products", d.id));
      }
    });
  };

  const updateProductVariants = async (
    productId: string,
    variants: PackageVariant[],
  ) => {
    await updateDoc(doc(db, "products", productId), cleanObject({ variants }));
  };

  const getProductVariants = (productId: string) => {
    return products.find((p) => p.id === productId)?.variants || [];
  };

  const addHomeSection = async (title: string) => {
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await setDoc(
      doc(db, "home_sections", id),
      cleanObject({ id, title, products: [] }),
    );
  };

  const removeHomeSection = async (id: string) => {
    await deleteDoc(doc(db, "home_sections", id));
  };

  const updateHomeSection = async (
    id: string,
    updates: Partial<HomeSection>,
  ) => {
    await updateDoc(doc(db, "home_sections", id), cleanObject(updates));
  };

  const addProductToSection = async (
    sectionId: string,
    product: Omit<HomeSectionProduct, "id">,
  ) => {
    const section = homeSections.find((s) => s.id === sectionId);
    if (section) {
      const newProduct = {
        ...product,
        id: Math.random().toString(36).substr(2, 9),
      };
      await updateDoc(
        doc(db, "home_sections", sectionId),
        cleanObject({
          products: [...section.products, newProduct],
        }),
      );
    }
  };

  const removeProductFromSection = async (
    sectionId: string,
    productId: string,
  ) => {
    const section = homeSections.find((s) => s.id === sectionId);
    if (section) {
      await updateDoc(
        doc(db, "home_sections", sectionId),
        cleanObject({
          products: section.products.filter((p) => p.id !== productId),
        }),
      );
    }
  };

  return {
    settings,
    updateSettings,
    products,
    updateProductVariants,
    getProductVariants,
    addProduct,
    updateProduct,
    removeProduct,
    removeProductCategory,
    homeSections,
    addHomeSection,
    removeHomeSection,
    updateHomeSection,
    addProductToSection,
    removeProductFromSection,
    orders,
    addOrder,
    updateOrderStatus,
    clearOrders,
    loading,
    error,
  };
}
