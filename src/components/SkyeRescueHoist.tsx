import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Star } from 'lucide-react';

interface SkyeRescueHoistProps {
  truckX: number; // Helicopter horizontal percentage
  targetX: number; // Target fire horizontal percentage
  targetY: number; // Target fire vertical percentage
  targetType?: string;
  isActive: boolean;
}

export default function SkyeRescueHoist({
  truckX,
  targetX,
  targetY,
  targetType = 'trapped_high',
  isActive,
}: SkyeRescueHoistProps) {
  const [progress, setProgress] = useState(0); // 0 to 100
  const [isDescending, setIsDescending] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [passengerEmoji, setPassengerEmoji] = useState('👧');

  // Helicopter Winch base point (bottom is 12%, height of helicopter center is around 81% from top)
  const winchX = truckX;
  const winchY = 81;

  // Choose passenger emoji based on target type
  useEffect(() => {
    if (isActive) {
      if (targetType.includes('kitten') || targetType.includes('tree')) {
        const emojis = ['🐱', '🐿️', '🦉'];
        setPassengerEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
      } else if (targetType.includes('balloon')) {
        const emojis = ['👧', '🎈', '👶'];
        setPassengerEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
      } else {
        const emojis = ['👦', '👧', '🐶', '🐰'];
        setPassengerEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
      }
    }
  }, [targetType, isActive]);

  // Handle local simulation timer for hoist sliding
  useEffect(() => {
    if (!isActive) {
      setProgress(0);
      setIsDescending(true);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (isDescending) {
          const next = prev + 3; // speed of descent
          if (next >= 100) {
            setIsDescending(false);
            return 100;
          }
          return next;
        } else {
          const next = prev - 3; // speed of ascent
          if (next <= 0) {
            setIsDescending(true);
            // Safe rescue celebrated at the helicopter door!
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 800);
            return 0;
          }
          return next;
        }
      });
    }, 45); // ~22fps smooth updates

    return () => clearInterval(interval);
  }, [isActive, isDescending]);

  if (!isActive) return null;

  // Interpolated basket coordinate positions (percentage)
  const basketX = winchX + (targetX - winchX) * (progress / 100);
  const basketY = winchY + (targetY - winchY) * (progress / 100);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-25 overflow-hidden">
      {/* 1. Rescue Cable Line Layer */}
      <svg className="absolute inset-0 w-full h-full" style={{ transform: 'translate3d(0,0,0)' }}>
        <defs>
          <linearGradient id="hoist-cable-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="50%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#fbcfe8" />
          </linearGradient>
          <filter id="cable-glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Outer glowing aesthetic pink guideline */}
        <line
          x1={`${winchX}%`}
          y1={`${winchY}%`}
          x2={`${targetX}%`}
          y2={`${targetY}%`}
          stroke="#f472b6"
          strokeWidth="3.5"
          strokeOpacity="0.4"
          filter="url(#cable-glow)"
        />

        {/* Inner solid steel core line */}
        <line
          x1={`${winchX}%`}
          y1={`${winchY}%`}
          x2={`${targetX}%`}
          y2={`${targetY}%`}
          stroke="url(#hoist-cable-grad)"
          strokeWidth="1.5"
          strokeDasharray="4,2"
        />

        {/* Winch Wheel Pulley mounted under the helicopter */}
        <g transform={`translate(${winchX * 0.01 * 100}%, ${winchY * 0.01 * 100}%)`}>
          <circle cx="0" cy="0" r="5" fill="#475569" stroke="#db2777" strokeWidth="1" />
          {/* Spinning pulley indicator */}
          <line
            x1="-4"
            y1="0"
            x2="4"
            y2="0"
            stroke="#ffffff"
            strokeWidth="1.2"
            className="animate-spin"
            style={{ transformOrigin: '0px 0px', animationDuration: '0.5s' }}
          />
        </g>
      </svg>

      {/* 2. Sliding Rescue Winch Basket & Harness */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center"
        style={{ left: `${basketX}%`, top: `${basketY}%` }}
      >
        {/* Dynamic Sparkles / Hearts emitting from basket while moving */}
        <div className="absolute -top-6 flex gap-1">
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.6 }}
          >
            <Heart size={10} className="fill-pink-400 text-pink-500" />
          </motion.div>
          <motion.div
            animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.8, 0] }}
            transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
          >
            <Sparkles size={8} className="text-yellow-400 fill-yellow-300" />
          </motion.div>
        </div>

        {/* Tension/suspension cables holding the basket */}
        <svg width="24" height="14" className="overflow-visible mb-[-1px]">
          <line x1="12" y1="0" x2="2" y2="14" stroke="#db2777" strokeWidth="1.2" />
          <line x1="12" y1="0" x2="22" y2="14" stroke="#db2777" strokeWidth="1.2" />
          <circle cx="12" cy="0" r="1.8" fill="#ec4899" />
        </svg>

        {/* Main Winch Basket Graphic */}
        <div className="relative w-11 h-6 sm:w-14 sm:h-8 rounded-b-xl border-t-2 border-b-2 border-x-2 border-pink-500 bg-gradient-to-b from-pink-100 to-pink-300 flex items-center justify-center shadow-md">
          {/* Rescue Badge emblem printed on basket */}
          <div className="absolute inset-0 flex items-center justify-center opacity-15">
            <Heart size={16} className="text-pink-600 fill-pink-500" />
          </div>

          {/* Rescued Citizen in the Basket */}
          <AnimatePresence>
            {!isDescending && (
              <motion.div
                initial={{ y: 8, scale: 0.2, opacity: 0 }}
                animate={{ y: -3, scale: 1.1, opacity: 1 }}
                exit={{ y: 8, scale: 0.2, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 180, damping: 10 }}
                className="absolute text-sm sm:text-base select-none filter drop-shadow z-10 flex flex-col items-center"
              >
                <span>{passengerEmoji}</span>
                {/* Cheering hand action */}
                <motion.span
                  animate={{ y: [0, -2, 0], rotate: [-10, 10, -10] }}
                  transition={{ repeat: Infinity, duration: 0.4 }}
                  className="text-[8px] font-black text-pink-600 leading-none -mt-1 bg-white px-1 rounded-full border border-pink-300 scale-90"
                >
                  たすけて！
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Outer basket frame details */}
          <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-pink-400" />
          <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-pink-400" />
        </div>
      </div>

      {/* 3. Celebration Safe Rescue Flash Effect at the Helicopter Door */}
      <AnimatePresence>
        {showCelebration && (
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
            style={{ left: `${winchX}%`, top: `${winchY}%` }}
          >
            {/* Glowing wave rings */}
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: [0.6, 2.5], opacity: [1, 0] }}
              transition={{ duration: 0.7 }}
              className="absolute w-24 h-24 rounded-full border-4 border-pink-400 bg-pink-300/35"
            />
            {/* Exploding star sparkles */}
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i * 2 * Math.PI) / 8;
              const radius = 24 + Math.random() * 20;
              const tx = Math.cos(angle) * radius;
              const ty = Math.sin(angle) * radius;

              return (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, scale: 0.5, opacity: 1 }}
                  animate={{ x: tx, y: ty, scale: 0, opacity: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="absolute"
                >
                  <Star size={12} className="text-yellow-300 fill-yellow-300" />
                </motion.div>
              );
            })}

            {/* Nice text message */}
            <motion.div
              initial={{ y: 0, scale: 0.7, opacity: 1 }}
              animate={{ y: -30, scale: 1.1, opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute text-center"
            >
              <span className="bg-pink-500 text-white font-sans font-black text-[10px] sm:text-xs px-2.5 py-1 rounded-full border border-white shadow-lg whitespace-nowrap">
                きゅうじょ かんりょう！🚁✨
              </span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
