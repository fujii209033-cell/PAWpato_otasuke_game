import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { CharacterId } from '../types';

export type CitizenType = 'boy' | 'girl' | 'cat' | 'mayor';

interface CitizenProps {
  id: string;
  type: CitizenType;
  x: number; // base x percentage (0-100)
  y: number; // base y percentage (0-100)
  isPanic: boolean; // True if nearby fire is burning
  isCleared: boolean; // True if game is cleared
  characterId?: CharacterId;
}

export const Citizen: React.FC<CitizenProps> = ({ id, type, x, y, isPanic, isCleared, characterId = 'marshall' }) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const wasPanicRef = useRef(false);

  // Keep track of panic state to detect transition from panic -> safe
  useEffect(() => {
    if (isPanic) {
      wasPanicRef.current = true;
    }
  }, [isPanic]);

  // Random micro-movement when panicked or idle
  useEffect(() => {
    let interval: any;
    let transitionTimer: any;

    if (isCleared) {
      setBubbleText('ありがとう！');
      return;
    }

    const isChase = characterId === 'chase';

    const panicPhrases = isChase 
      ? ['だれか たすけて〜！💦', 'まいごになっちゃった！😭', 'こねこちゃんを たすけて〜！🐾', 'チェイス〜！おたすけ〜！🌟', 'どうしよう〜！😭', 'カギが なくなっちゃった！🔑', 'たすけて チェイス〜！🚔']
      : ['たすけて〜！💦', 'あついよ〜！🔥', 'ふえええん！😭', '火事だ〜！🚨', 'マーシャル〜！🐾'];

    if (isPanic) {
      // Periodic panic screams
      setBubbleText(panicPhrases[Math.floor(Math.random() * panicPhrases.length)]);

      interval = setInterval(() => {
        // Run back and forth
        setOffset({
          x: (Math.random() - 0.5) * 16,
          y: (Math.random() - 0.5) * 4,
        });
        if (Math.random() > 0.6) {
          setBubbleText(panicPhrases[Math.floor(Math.random() * panicPhrases.length)]);
        }
      }, 500);
    } else {
      // Calm/Happy state
      setOffset({ x: 0, y: 0 });
      
      if (wasPanicRef.current) {
        // Just transitioned from panic to safe! Celebrate immediately!
        wasPanicRef.current = false;
        const celebratePhrases = isChase
          ? ['やったー！おたすけ してくれた！✨', 'チェイス、ありがとう！💖', 'さすがチェイス！🐾', 'もう さびしくないよ！🌻', 'あんぜんになって うれしい！✨']
          : ['やったー！消してくれた！✨', 'ひが消えたよ！ありがとう！💖', 'マーシャルさすが！🐾', 'もうあつくないよ！🌻'];
        setBubbleText(celebratePhrases[Math.floor(Math.random() * celebratePhrases.length)]);
        transitionTimer = setTimeout(() => setBubbleText(null), 2500);
      } else {
        setBubbleText(null);
      }

      interval = setInterval(() => {
        if (Math.random() > 0.85) {
          const happyPhrases = isChase
            ? ['ありがとう！💖', 'さすがチェイス！🐾', 'もう だいじょうぶ！🍀', 'うれしいな！⭐']
            : ['ありがとう！💖', 'さすがマーシャル！🐾', 'あんぜんだね！🍀', 'うれしいな！⭐'];
          setBubbleText(happyPhrases[Math.floor(Math.random() * happyPhrases.length)]);
          setTimeout(() => setBubbleText(null), 1800);
        }
      }, 4000);
    }

    return () => {
      clearInterval(interval);
      if (transitionTimer) clearTimeout(transitionTimer);
    };
  }, [isPanic, isCleared]);

  // Determine rendering based on character type
  const renderCharacterSVG = () => {
    switch (type) {
      case 'boy': // Ryder/Kent style cute kid
        return (
          <svg viewBox="0 0 40 50" className="w-10 h-12 drop-shadow-md">
            {/* Red jacket / blue jeans */}
            <rect x="14" y="28" width="12" height="12" fill="#ef4444" rx="2" />
            <rect x="15" y="40" width="4" height="8" fill="#1d4ed8" />
            <rect x="21" y="40" width="4" height="8" fill="#1d4ed8" />
            {/* Shoes */}
            <rect x="13" y="47" width="6" height="3" fill="#1e293b" rx="1" />
            <rect x="21" y="47" width="6" height="3" fill="#1e293b" rx="1" />
            {/* Arms */}
            <motion.rect 
              x="8" y="28" width="5" height="10" fill="#fbcfe8" rx="1.5"
              style={{ originX: '11px', originY: '29px' }}
              animate={isPanic ? { rotate: [0, -140, 0] } : { rotate: 0 }}
              transition={{ repeat: Infinity, duration: 0.3 }}
            />
            <motion.rect 
              x="27" y="28" width="5" height="10" fill="#fbcfe8" rx="1.5"
              style={{ originX: '29px', originY: '29px' }}
              animate={isPanic ? { rotate: [0, 140, 0] } : { rotate: 0 }}
              transition={{ repeat: Infinity, duration: 0.3, delay: 0.15 }}
            />
            {/* Head */}
            <circle cx="20" cy="18" r="8" fill="#fbcfe8" />
            {/* Cute spiky brown hair */}
            <path d="M 11 15 C 11 10, 15 8, 20 8 C 25 8, 29 10, 29 15 L 29 12 C 26 10, 23 9, 20 10 C 17 9, 14 10, 11 12 Z" fill="#78350f" />
            <path d="M 14 10 L 16 6 L 19 9 L 21 5 L 24 9 L 26 6 L 28 11 Z" fill="#78350f" />
            {/* Eyes */}
            {isPanic ? (
              <>
                <text x="14" y="20" fontSize="7" fontWeight="bold" fill="#1e293b">＞</text>
                <text x="21" y="20" fontSize="7" fontWeight="bold" fill="#1e293b">＜</text>
              </>
            ) : (
              <>
                <circle cx="16" cy="18" r="1.5" fill="#1e293b" />
                <circle cx="24" cy="18" r="1.5" fill="#1e293b" />
                <circle cx="15.5" cy="17.5" r="0.5" fill="#ffffff" />
                <circle cx="23.5" cy="17.5" r="0.5" fill="#ffffff" />
              </>
            )}
            {/* Mouth */}
            {isPanic ? (
              <ellipse cx="20" cy="22" rx="3" ry="2" fill="#991b1b" />
            ) : (
              <path d="M 17 21 Q 20 24 23 21" fill="none" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
            )}
          </svg>
        );

      case 'girl': // Girl in pink outfit with pigtails
        return (
          <svg viewBox="0 0 40 50" className="w-10 h-12 drop-shadow-md">
            {/* Pink Dress */}
            <path d="M 13 28 L 27 28 L 31 41 L 9 41 Z" fill="#f472b6" />
            {/* Legs */}
            <rect x="15" y="41" width="3" height="7" fill="#fbcfe8" />
            <rect x="22" y="41" width="3" height="7" fill="#fbcfe8" />
            <rect x="13" y="47" width="5" height="3" fill="#ec4899" rx="1" />
            <rect x="22" y="47" width="5" height="3" fill="#ec4899" rx="1" />
            {/* Flailing Arms */}
            <motion.rect 
              x="8" y="28" width="4" height="9" fill="#fbcfe8" rx="1"
              style={{ originX: '10px', originY: '29px' }}
              animate={isPanic ? { rotate: [0, -150, 0] } : { rotate: 0 }}
              transition={{ repeat: Infinity, duration: 0.28 }}
            />
            <motion.rect 
              x="28" y="28" width="4" height="9" fill="#fbcfe8" rx="1"
              style={{ originX: '29px', originY: '29px' }}
              animate={isPanic ? { rotate: [0, 150, 0] } : { rotate: 0 }}
              transition={{ repeat: Infinity, duration: 0.28, delay: 0.1 }}
            />
            {/* Head */}
            <circle cx="20" cy="18" r="8" fill="#fbcfe8" />
            {/* Pigtails */}
            <motion.circle 
              cx="9" cy="16" r="4.5" fill="#f59e0b" 
              animate={isPanic ? { y: [16, 13, 16] } : {}}
              transition={{ repeat: Infinity, duration: 0.3 }}
            />
            <motion.circle 
              cx="31" cy="16" r="4.5" fill="#f59e0b" 
              animate={isPanic ? { y: [16, 13, 16] } : {}}
              transition={{ repeat: Infinity, duration: 0.3, delay: 0.15 }}
            />
            {/* Hair base */}
            <path d="M 12 16 C 12 11, 16 9, 20 9 C 24 9, 28 11, 28 16 Z" fill="#f59e0b" />
            {/* Face */}
            {isPanic ? (
              <>
                <text x="14" y="20" fontSize="8" fill="#991b1b" fontWeight="bold">T</text>
                <text x="21" y="20" fontSize="8" fill="#991b1b" fontWeight="bold">T</text>
              </>
            ) : (
              <>
                <circle cx="16" cy="18" r="1.2" fill="#1e293b" />
                <circle cx="24" cy="18" r="1.2" fill="#1e293b" />
                <path d="M 18 21 Q 20 23 22 21" fill="none" stroke="#1e293b" strokeWidth="1.2" strokeLinecap="round" />
              </>
            )}
          </svg>
        );

      case 'cat': // Cute fluffy orange cat (like Cali!)
        return (
          <svg viewBox="0 0 40 40" className="w-9 h-9 drop-shadow-sm">
            {/* Tail */}
            <motion.path 
              d="M 10 28 Q 6 22 8 16" fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round" 
              animate={isPanic ? { rotate: [-15, 15, -15] } : { rotate: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 0.4 }}
              style={{ originX: '10px', originY: '28px' }}
            />
            {/* Body */}
            <ellipse cx="20" cy="26" rx="10" ry="8" fill="#f97316" />
            <ellipse cx="20" cy="26" rx="8" ry="6.5" fill="#fed7aa" />
            {/* Legs */}
            <rect x="14" y="32" width="3" height="6" fill="#f97316" rx="1.5" />
            <rect x="23" y="32" width="3" height="6" fill="#f97316" rx="1.5" />
            {/* Head */}
            <motion.g
              animate={isPanic ? { y: [-1, 1, -1] } : {}}
              transition={{ repeat: Infinity, duration: 0.25 }}
            >
              <circle cx="20" cy="16" r="7.5" fill="#f97316" />
              {/* Ears */}
              <polygon points="13,11 11,4 17,9" fill="#f97316" />
              <polygon points="27,11 29,4 23,9" fill="#f97316" />
              <polygon points="14,10 12,6 16,9" fill="#ffedd5" />
              <polygon points="26,10 28,6 24,9" fill="#ffedd5" />
              {/* White muzzle */}
              <circle cx="18.5" cy="18" r="2.5" fill="#ffedd5" />
              <circle cx="21.5" cy="18" r="2.5" fill="#ffedd5" />
              {/* Eyes */}
              {isPanic ? (
                <>
                  <text x="14" y="16" fontSize="6" fontWeight="bold" fill="#1e293b">＞</text>
                  <text x="21" y="16" fontSize="6" fontWeight="bold" fill="#1e293b">＜</text>
                </>
              ) : (
                <>
                  <ellipse cx="16" cy="15" rx="1.2" ry="1.8" fill="#1e293b" />
                  <ellipse cx="24" cy="15" rx="1.2" ry="1.8" fill="#1e293b" />
                  <circle cx="15.5" cy="14.5" r="0.5" fill="#ffffff" />
                  <circle cx="23.5" cy="14.5" r="0.5" fill="#ffffff" />
                </>
              )}
              {/* Little pink nose & whiskers */}
              <polygon points="19,17 21,17 20,18" fill="#fda4af" />
              <line x1="14" y1="18" x2="11" y2="17" stroke="#cbd5e1" strokeWidth="0.8" />
              <line x1="14" y1="19" x2="11" y2="19.5" stroke="#cbd5e1" strokeWidth="0.8" />
              <line x1="26" y1="18" x2="29" y2="17" stroke="#cbd5e1" strokeWidth="0.8" />
              <line x1="26" y1="19" x2="29" y2="19.5" stroke="#cbd5e1" strokeWidth="0.8" />
            </motion.g>
          </svg>
        );

      case 'mayor': // Mayor Goodway style elegant character
        return (
          <svg viewBox="0 0 40 50" className="w-10 h-12 drop-shadow-md">
            {/* Elegant purple dress */}
            <path d="M 12 26 L 28 26 L 32 41 L 8 41 Z" fill="#a855f7" />
            <rect x="15" y="41" width="3" height="7" fill="#fed7aa" />
            <rect x="22" y="41" width="3" height="7" fill="#fed7aa" />
            <rect x="13" y="47" width="5" height="3" fill="#701a75" rx="1" />
            <rect x="22" y="47" width="5" height="3" fill="#701a75" rx="1" />
            {/* Flashing golden necklace */}
            <circle cx="20" cy="27" r="1.5" fill="#facc15" />
            <circle cx="17" cy="27.5" r="1" fill="#facc15" />
            <circle cx="23" cy="27.5" r="1" fill="#facc15" />
            {/* Flailing Arms */}
            <motion.rect 
              x="8" y="26" width="4" height="10" fill="#fed7aa" rx="1"
              style={{ originX: '10px', originY: '27px' }}
              animate={isPanic ? { rotate: [0, -145, 0] } : { rotate: 0 }}
              transition={{ repeat: Infinity, duration: 0.3 }}
            />
            <motion.rect 
              x="28" y="26" width="4" height="10" fill="#fed7aa" rx="1"
              style={{ originX: '29px', originY: '27px' }}
              animate={isPanic ? { rotate: [0, 145, 0] } : { rotate: 0 }}
              transition={{ repeat: Infinity, duration: 0.3, delay: 0.08 }}
            />
            {/* Head */}
            <circle cx="20" cy="17" r="7.5" fill="#fed7aa" />
            {/* Golden Pearl Earrings & Hair */}
            <circle cx="12" cy="18" r="1.5" fill="#facc15" />
            <circle cx="28" cy="18" r="1.5" fill="#facc15" />
            <path d="M 12 16 C 12 10, 16 8, 20 8 C 24 8, 28 10, 28 16 L 28 13 C 25 10, 22 10, 20 11 C 18 10, 15 10, 12 13 Z" fill="#451a03" />
            {/* Face expression */}
            {isPanic ? (
              <>
                <text x="14" y="19" fontSize="6" fill="#701a75" fontWeight="bold">Ｑ</text>
                <text x="21" y="19" fontSize="6" fill="#701a75" fontWeight="bold">Ｑ</text>
                <ellipse cx="20" cy="21.5" rx="2.5" ry="1.5" fill="#ef4444" />
              </>
            ) : (
              <>
                <circle cx="16" cy="17" r="1" fill="#1e293b" />
                <circle cx="24" cy="17" r="1" fill="#1e293b" />
                <path d="M 17 20 Q 20 22 23 20" fill="none" stroke="#1e293b" strokeWidth="1.2" strokeLinecap="round" />
              </>
            )}
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -100%)',
      }}
      animate={
        isCleared
          ? { y: [0, -12, 0], scale: [1, 1.1, 1] }
          : isPanic
          ? {
              x: offset.x,
              y: offset.y - (Math.random() * 2), // Shaking jitter
            }
          : { y: 0 }
      }
      transition={
        isCleared
          ? { repeat: Infinity, duration: 0.6, ease: 'easeInOut' }
          : { type: 'spring', stiffness: 120 }
      }
      className="z-10 pointer-events-none select-none flex flex-col items-center"
    >
      {/* Speech Bubble / Emotional reactions for kids - rendered BELOW the character to avoid overlapping fire HP bars */}
      {bubbleText && (
        <motion.div
          initial={{ opacity: 0, scale: 0.4, y: -5 }}
          animate={{ opacity: 1, scale: 1, y: 2 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className={`absolute top-[105%] px-2 py-1 text-[9px] md:text-[10px] font-bold rounded-lg border shadow-md whitespace-nowrap flex items-center gap-0.5 z-20 ${
            isPanic
              ? 'bg-rose-50 border-rose-300 text-rose-600 animate-bounce'
              : 'bg-emerald-50 border-emerald-300 text-emerald-600'
          }`}
          style={{ left: '50%', transform: 'translateX(-50%)' }}
        >
          {bubbleText}
        </motion.div>
      )}

      {/* Main SVG Graphic */}
      {renderCharacterSVG()}
    </motion.div>
  );
};
