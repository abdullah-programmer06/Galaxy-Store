import React from 'react';
import { motion } from 'motion/react';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="relative w-full flex flex-col items-center pt-8 pb-4 select-none">
      {/* 3D Floating Heart with bounce animation */}
      <motion.div
        animate={{
          y: [0, -6, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 z-20 cursor-pointer filter drop-shadow-[0_4px_6px_rgba(239,68,68,0.2)]"
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Main 3D Heart */}
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="url(#heartGrad)"
          />
          {/* Highlights */}
          <path
            d="M12 19.5l-1.1-1C6.2 14 3.5 11.2 3.5 8c0-2 1.5-3.5 3.5-3.5 1.4 0 2.7.7 3.5 1.8L12 8l1.5-1.7c.8-1.1 2.1-1.8 3.5-1.8 2 0 3.5 1.5 3.5 3.5 0 3.2-2.7 6-7.4 10.5l-1.1 1z"
            fill="url(#heartInnerGrad)"
            opacity="0.85"
          />
          {/* Cute Bubble Highlight */}
          <ellipse cx="7.5" cy="6.5" rx="2.5" ry="1.5" fill="#FFAEC9" opacity="0.9" transform="rotate(-15, 7.5, 6.5)" />
          
          <defs>
            <linearGradient id="heartGrad" x1="12" y1="3" x2="12" y2="21.35" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF7B90" />
              <stop offset="60%" stopColor="#F43F5E" />
              <stop offset="100%" stopColor="#C01C3F" />
            </linearGradient>
            <linearGradient id="heartInnerGrad" x1="12" y1="4.5" x2="12" y2="19.5" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFAEC9" />
              <stop offset="40%" stopColor="#FF7B90" />
              <stop offset="100%" stopColor="#F43F5E" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Playful Yellow Sparkles/Rays */}
      <div className="absolute top-6 left-10 md:left-14 text-[#FFD166] opacity-90 animate-pulse">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
        </svg>
      </div>
      <div className="absolute top-8 right-10 md:right-14 text-[#FFD166] opacity-90 animate-pulse delay-500">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
        </svg>
      </div>

      {/* Header Text Group */}
      <div className="text-center mb-0 mt-2">
        <h2 className="text-3xl md:text-4xl font-display font-black text-white tracking-wider mb-2 uppercase drop-shadow-[0_0_15px_rgba(162,136,227,0.6)]">
          {title}
        </h2>
        <p className="text-[#A99EB1] text-sm md:text-base font-semibold tracking-wide">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
