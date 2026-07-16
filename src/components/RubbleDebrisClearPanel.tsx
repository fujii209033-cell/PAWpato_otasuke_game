import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, Trash2, CheckCircle2, RotateCcw, HelpCircle, ArrowRight, X } from 'lucide-react';
import { Fire } from '../types';

interface MiniGameBackgroundProps {
  type: string;
}

function MiniGameBackground({ type }: MiniGameBackgroundProps) {
  // Determine scene based on target type
  let skyBg = "from-sky-300 via-cyan-100 to-sky-100";
  let landElement = null;
  let extraIllustrations = null;
  
  if (type === 'house' || type === 'shop' || type === 'car' || type === 'trash' || type === 'lost_keys' || type === 'blocked_tunnel') {
    // 🏘️ Town Street Scene
    skyBg = "from-sky-400 to-indigo-100";
    landElement = (
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-400 to-slate-300 flex flex-col justify-end">
        {/* Street lanes lines */}
        <div className="w-full h-1 border-t border-dashed border-white/50 mb-2.5" />
        <div className="w-full h-1 border-t border-dashed border-white/50" />
      </div>
    );
    extraIllustrations = (
      <>
        {/* Silhouettes of town buildings */}
        <div className="absolute bottom-1/2 left-4 w-12 h-16 bg-indigo-200/50 rounded-t-lg border-t border-x border-indigo-300/30 z-0" />
        <div className="absolute bottom-1/2 left-20 w-16 h-24 bg-purple-200/40 rounded-t-lg border-t border-x border-purple-300/20 z-0" />
        <div className="absolute bottom-1/2 right-6 w-14 h-20 bg-blue-200/40 rounded-t-lg border-t border-x border-blue-300/20 z-0" />
        {/* Clouds */}
        <motion.div 
          animate={{ x: [-40, 480], opacity: [0, 0.9, 0.9, 0] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="absolute top-2 left-0 text-lg pointer-events-none z-0"
        >
          ☁️
        </motion.div>
        <motion.div 
          animate={{ x: [480, -40], opacity: [0, 0.8, 0.8, 0] }}
          transition={{ repeat: Infinity, duration: 32, ease: "linear" }}
          className="absolute top-6 right-0 text-md pointer-events-none z-0"
        >
          ☁️
        </motion.div>
        {/* Sun */}
        <div className="absolute top-2 left-6 text-xl animate-spin z-0" style={{ animationDuration: '60s' }}>☀️</div>
      </>
    );
  } else if (type === 'tree' || type === 'lost_kitten' || type === 'injured_boy' || type === 'lost_girl' || type === 'puppy_tree' || type === 'collapsed_tree' || type === 'tree_rescue' || type === 'heavy_rock' || type === 'debris') {
    // 🌳 Forest Park Scene
    skyBg = "from-teal-300 via-sky-100 to-emerald-50";
    landElement = (
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-emerald-600 to-emerald-500 rounded-t-[80px] -mx-6 scale-x-110 z-0" />
    );
    extraIllustrations = (
      <>
        {/* Cute trees in background */}
        <div className="absolute bottom-[40%] left-6 text-2xl select-none z-0">🌲</div>
        <div className="absolute bottom-[38%] left-14 text-xl select-none opacity-80 z-0">🌳</div>
        <div className="absolute bottom-[42%] right-10 text-3xl select-none z-0">🌲</div>
        <div className="absolute bottom-[36%] right-3 text-xl select-none opacity-90 z-0">🌳</div>
        {/* Cute mountains further back */}
        <div className="absolute bottom-1/2 left-1/3 text-3xl opacity-40 select-none z-0">⛰️</div>
        <div className="absolute bottom-1/2 right-1/3 text-4xl opacity-30 select-none z-0">⛰️</div>
        {/* Cute flowers & birds */}
        <div className="absolute bottom-3 left-10 text-xs select-none z-10">🌸</div>
        <div className="absolute bottom-5 right-16 text-xs select-none animate-bounce z-10">🌷</div>
        {/* Sun */}
        <div className="absolute top-3 right-10 text-xl animate-pulse z-0">☀️</div>
      </>
    );
  } else {
    // 🏔️ High Altitude Cliff / Air Sky Scene
    skyBg = "from-sky-400 via-cyan-200 to-amber-100";
    landElement = (
      <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-amber-800 to-amber-700 flex justify-between px-4 z-0">
        <div className="w-12 h-full bg-amber-900 rounded-t-lg -mt-3 shadow z-0" />
        <div className="w-16 h-full bg-amber-900 rounded-t-lg -mt-5 shadow z-0" />
      </div>
    );
    extraIllustrations = (
      <>
        {/* High clouds */}
        <motion.div 
          animate={{ x: [-40, 480], y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
          className="absolute top-2 left-0 text-xl opacity-75 z-0"
        >
          ☁️
        </motion.div>
        <motion.div 
          animate={{ x: [480, -40], y: [0, 3, 0] }}
          transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
          className="absolute top-6 right-0 text-2xl opacity-60 z-0"
        >
          ☁️
        </motion.div>
        {/* Birds or balloon */}
        <motion.div 
          animate={{ y: [0, -6, 0], rotate: [-2, 2, -2] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute top-8 left-[30%] text-lg z-0"
        >
          🎈
        </motion.div>
        <motion.div 
          animate={{ x: [-10, 480] }}
          transition={{ repeat: Infinity, duration: 15 }}
          className="absolute top-4 right-20 text-xs opacity-80 z-0 pointer-events-none"
        >
          🦅
        </motion.div>
      </>
    );
  }

  return (
    <div className={`absolute inset-0 bg-gradient-to-b ${skyBg} overflow-hidden pointer-events-none select-none z-0`}>
      <div className="absolute inset-0 bg-white/10 mix-blend-overlay" />
      {extraIllustrations}
      {landElement}
    </div>
  );
}

interface RubbleDebrisClearPanelProps {
  target: Fire;
  soundEnabled: boolean;
  onComplete: () => void;
  onClose: () => void;
}

interface DebrisPiece {
  id: string;
  type: 'rock' | 'brick' | 'log' | 'girder';
  name: string;
  startX: number; // percentage width
  startY: number; // percentage height
  cleared: boolean;
  angle: number;
  scale: number;
}

export default function RubbleDebrisClearPanel({ target, soundEnabled, onComplete, onClose }: RubbleDebrisClearPanelProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playgroundRef = useRef<HTMLDivElement | null>(null);
  const [pieces, setPieces] = useState<DebrisPiece[]>([]);
  const [successCount, setSuccessCount] = useState(0);
  const [showVictory, setShowVictory] = useState(false);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [dustParticles, setDustParticles] = useState<{
    id: string;
    x: number;
    y: number;
    size: number;
    driftX: number;
    driftY: number;
    color: string;
  }[]>([]);

  // Trigger screen shake on victory stamp landing
  useEffect(() => {
    if (showVictory) {
      setIsShaking(true);
      const timer = setTimeout(() => {
        setIsShaking(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [showVictory]);

  // Generate dust particle puff on active drag
  const handleDrag = (event: any, info: any, id: string) => {
    if (Math.random() < 0.45) {
      const rect = playgroundRef.current?.getBoundingClientRect();
      if (rect) {
        const x = info.point.x - rect.left;
        const y = info.point.y - rect.top;
        
        // Clay, mud, dust and rubble tones
        const colors = [
          'rgba(180, 83, 9, 0.4)',   // amber-700 soil
          'rgba(120, 53, 4, 0.45)',  // yellow-900 clay
          'rgba(161, 98, 7, 0.35)',  // yellow-700 earth
          'rgba(115, 115, 115, 0.3)'  // slate stone dust
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        const newParticle = {
          id: `dust-${Date.now()}-${Math.random()}`,
          x,
          y,
          size: 14 + Math.random() * 22,
          driftX: (Math.random() - 0.5) * 50,
          driftY: -20 - Math.random() * 35,
          color: randomColor
        };
        
        setDustParticles((prev) => [...prev.slice(-25), newParticle]);
      }
    }
  };

  // Initialize debris pieces depending on target type and difficulty
  useEffect(() => {
    // Generate 4 pieces of debris to clear
    const types: ('rock' | 'brick' | 'log' | 'girder')[] = ['rock', 'brick', 'log', 'girder'];
    const names = {
      rock: 'ごつごつした大きな岩 (Heavy Rock)',
      brick: 'われたレンガの山 (Broken Bricks)',
      log: 'たおれた太い丸太 (Heavy Log)',
      girder: 'こわれた鉄骨 (Steel Beam)'
    };

    // Scatter them on the left half of the road (X: 12% to 48%, Y: 25% to 75%)
    const items: DebrisPiece[] = Array.from({ length: 4 }).map((_, i) => {
      const type = types[i % types.length];
      const startX = 12 + i * 9 + Math.random() * 4;
      const startY = 25 + i * 13 + Math.random() * 5;
      const angle = (Math.random() - 0.5) * 40; // slant angle
      const scale = 0.95 + Math.random() * 0.2;

      return {
        id: `debris-pc-${i}-${Date.now()}`,
        type,
        name: names[type],
        startX,
        startY,
        cleared: false,
        angle,
        scale
      };
    });

    setPieces(items);
    setSuccessCount(0);
    setShowVictory(false);
    playEngineRev();
  }, [target]);

  // Web Audio Synthesizer for debris collision & shovel action
  const playClangSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      
      // Low impact noise
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(140, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.3);
      
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(320, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.3 * 0.6, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      
      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.35);
      osc2.stop(ctx.currentTime + 0.35);
    } catch (e) {}
  };

  const playEngineRev = () => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(90, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(170, ctx.currentTime + 0.12);
      osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.28);
      
      gainNode.gain.setValueAtTime(0.2 * 0.6, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.28);
    } catch (e) {}
  };

  const playYaySound = () => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 cheer
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        
        gainNode.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
        gainNode.gain.linearRampToValueAtTime(0.15 * 0.6, ctx.currentTime + idx * 0.08 + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.25);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.25);
      });
    } catch (e) {}
  };

  const playStampSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      
      const osc = ctx.createOscillator();
      const noise = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(15, ctx.currentTime + 0.4);
      
      noise.type = 'sawtooth';
      noise.frequency.setValueAtTime(75, ctx.currentTime);
      noise.frequency.exponentialRampToValueAtTime(8, ctx.currentTime + 0.25);
      
      gainNode.gain.setValueAtTime(0.35, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      
      osc.connect(gainNode);
      noise.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start();
      noise.start();
      osc.stop(ctx.currentTime + 0.4);
      noise.stop(ctx.currentTime + 0.4);
    } catch (e) {}
  };

  // Drag End Collision Handler
  const handleDragEnd = (event: any, info: any, id: string) => {
    setActiveDragId(null);
    const truckElement = document.getElementById('rubble-dump-truck');
    const itemElement = document.getElementById(`drag-item-${id}`);

    if (truckElement && itemElement) {
      const truckRect = truckElement.getBoundingClientRect();
      const itemRect = itemElement.getBoundingClientRect();

      const itemCenterX = itemRect.left + itemRect.width / 2;
      const itemCenterY = itemRect.top + itemRect.height / 2;

      // Check if dropped inside truck bounding box
      const isInside = 
        itemCenterX >= truckRect.left &&
        itemCenterX <= truckRect.right &&
        itemCenterY >= truckRect.top &&
        itemCenterY <= truckRect.bottom;

      if (isInside) {
        // Clear piece!
        playClangSound();
        setPieces((prev) => 
          prev.map((p) => p.id === id ? { ...p, cleared: true } : p)
        );
        
        setSuccessCount((prev) => {
          const nextCount = prev + 1;
          if (nextCount >= 4) {
            // Cleared all!
            setTimeout(() => {
              playYaySound();
              playStampSound();
              setShowVictory(true);
            }, 500);
          }
          return nextCount;
        });
      } else {
        // Friction slide-back noise
        playEngineRev();
      }
    }
  };

  const handleDragStart = (id: string) => {
    setActiveDragId(id);
    playEngineRev();
  };

  // Graphic components for debris
  const renderDebrisGraphics = (type: 'rock' | 'brick' | 'log' | 'girder', isCleared: boolean) => {
    const opacity = isCleared ? 'opacity-35 scale-75' : '';
    switch (type) {
      case 'rock':
        return (
          <svg viewBox="0 0 60 60" className={`w-14 h-14 md:w-16 md:h-16 ${opacity}`}>
            {/* Rocky texture */}
            <path d="M 10 32 L 20 12 Q 35 8, 48 18 L 52 38 L 40 52 L 18 48 Z" fill="#78716c" stroke="#44403c" strokeWidth="3.5" strokeLinejoin="round" />
            <polygon points="15,30 25,18 35,28" fill="#a8a29e" />
            <polygon points="32,45 45,35 40,48" fill="#57534e" />
            {/* Cute eyes for children engagement */}
            {!isCleared && (
              <g transform="translate(26, 28)">
                <circle cx="-6" cy="0" r="3.5" fill="#ffffff" stroke="#1e293b" strokeWidth="1" />
                <circle cx="6" cy="0" r="3.5" fill="#ffffff" stroke="#1e293b" strokeWidth="1" />
                <circle cx="-5" cy="0" r="1.5" fill="#1e293b" />
                <circle cx="5" cy="0" r="1.5" fill="#1e293b" />
                <path d="M -2 5 Q 0 7 2 5" fill="none" stroke="#1e293b" strokeWidth="1.2" strokeLinecap="round" />
              </g>
            )}
          </svg>
        );
      case 'brick':
        return (
          <svg viewBox="0 0 60 60" className={`w-14 h-14 md:w-16 md:h-16 ${opacity}`}>
            {/* Stacked bricks */}
            <rect x="8" y="32" width="26" height="15" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="2.5" rx="1" />
            <rect x="22" y="16" width="28" height="16" fill="#c2410c" stroke="#7c2d12" strokeWidth="2.5" rx="1" />
            <line x1="8" y1="40" x2="34" y2="40" stroke="#7f1d1d" strokeWidth="1.5" />
            <line x1="22" y1="24" x2="50" y2="24" stroke="#7c2d12" strokeWidth="1.5" />
            {/* Cracked effect lines */}
            <line x1="12" y1="20" x2="18" y2="28" stroke="#451a03" strokeWidth="2" />
            <line x1="42" y1="36" x2="48" y2="44" stroke="#451a03" strokeWidth="2" />
            {!isCleared && (
              <g transform="translate(32, 26)">
                <ellipse cx="-5" cy="-2" rx="3" ry="3.5" fill="#ffffff" stroke="#1e293b" strokeWidth="1" />
                <ellipse cx="5" cy="-2" rx="3" ry="3.5" fill="#ffffff" stroke="#1e293b" strokeWidth="1" />
                <circle cx="-4" cy="-2" r="1.2" fill="#1e293b" />
                <circle cx="6" cy="-2" r="1.2" fill="#1e293b" />
                <path d="M -3 3 Q 0 1 3 3" fill="none" stroke="#1e293b" strokeWidth="1" />
              </g>
            )}
          </svg>
        );
      case 'log':
        return (
          <svg viewBox="0 0 60 60" className={`w-14 h-14 md:w-16 md:h-16 ${opacity}`}>
            {/* Cylindrical wood logs */}
            <g transform="rotate(12 30 30)">
              <rect x="8" y="22" width="44" height="18" fill="#78350f" stroke="#451a03" strokeWidth="3" rx="3" />
              <ellipse cx="52" cy="31" rx="4" ry="9" fill="#fef08a" stroke="#451a03" strokeWidth="2.5" />
              <ellipse cx="52" cy="31" rx="2" ry="5.5" fill="none" stroke="#78350f" strokeWidth="1" />
            </g>
            {!isCleared && (
              <g transform="translate(25, 26)">
                <circle cx="-4.5" cy="2" r="3.2" fill="#ffffff" stroke="#1e293b" strokeWidth="1" />
                <circle cx="4.5" cy="2" r="3.2" fill="#ffffff" stroke="#1e293b" strokeWidth="1" />
                <circle cx="-4.5" cy="2" r="1.5" fill="#1e293b" />
                <circle cx="4.5" cy="2" r="1.5" fill="#1e293b" />
              </g>
            )}
          </svg>
        );
      case 'girder':
        return (
          <svg viewBox="0 0 60 60" className={`w-14 h-14 md:w-16 md:h-16 ${opacity}`}>
            {/* Rusty metallic structural steel beam */}
            <g transform="rotate(-15 30 30)">
              <rect x="6" y="24" width="48" height="14" fill="#9a3412" stroke="#431407" strokeWidth="3" rx="1.5" />
              <line x1="12" y1="24" x2="18" y2="38" stroke="#431407" strokeWidth="2.5" />
              <line x1="24" y1="24" x2="30" y2="38" stroke="#431407" strokeWidth="2.5" />
              <line x1="36" y1="24" x2="42" y2="38" stroke="#431407" strokeWidth="2.5" />
              <line x1="48" y1="24" x2="52" y2="34" stroke="#431407" strokeWidth="2.5" />
            </g>
            {!isCleared && (
              <g transform="translate(30, 28)">
                <circle cx="-5" cy="1" r="3" fill="#ffffff" stroke="#1e293b" strokeWidth="1" />
                <circle cx="5" cy="1" r="3" fill="#ffffff" stroke="#1e293b" strokeWidth="1" />
                <circle cx="-4" cy="1" r="1.2" fill="#1e293b" />
                <circle cx="6" cy="1" r="1.2" fill="#1e293b" />
              </g>
            )}
          </svg>
        );
    }
  };

  return (
    <div 
      id="rubble-challenge-overlay"
      className="fixed inset-0 bg-slate-900/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 z-[100] font-sans text-white select-none animate-fade-in"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={isShaking ? {
          scale: 1,
          opacity: 1,
          x: [-12, 12, -9, 9, -5, 5, -2, 2, 0],
          y: [-6, 6, -4, 4, -2, 2, 0]
        } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.55, ease: "easeInOut" }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-xl bg-gradient-to-b from-amber-50 to-orange-100 rounded-3xl border-6 border-amber-400 shadow-2xl text-slate-800 flex flex-col overflow-hidden max-h-[94vh] h-auto"
      >
        {/* Warning hazard yellow striped borders */}
        <div 
          className="h-3 w-full flex-shrink-0 flex" 
          style={{
            background: 'repeating-linear-gradient(45deg, #facc15, #facc15 12px, #1e293b 12px, #1e293b 24px)'
          }}
        />

        {/* Header bar */}
        <div className="bg-amber-400 p-2.5 sm:p-4 text-center border-b-3 border-amber-500 shadow-md flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2.5 text-slate-900">
            <span className="text-xl sm:text-2xl animate-bounce">🚧</span>
            <div className="text-left">
              <h3 className="text-sm sm:text-lg font-black leading-tight tracking-tight text-slate-900">
                ラブルの じゅうき おかたづけ チャレンジ！
              </h3>
              <p className="text-[10px] sm:text-xs font-bold text-amber-900 leading-none">
                {target.name}を どかそう！
              </p>
            </div>
          </div>
          
          <button
            id="rubble-challenge-close-btn"
            onClick={onClose}
            className="bg-white/90 hover:bg-white text-red-600 rounded-full p-1 border-2 border-amber-500 hover:scale-105 active:scale-95 shadow cursor-pointer transition-all duration-150 flex items-center justify-center"
          >
            <X size={16} className="sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Playfield body */}
        <div 
          ref={containerRef}
          className="relative flex-grow flex flex-col justify-between p-2.5 sm:p-5 min-h-0 sm:min-h-[250px]"
        >
          {/* Instructions banner */}
          <div className="bg-amber-200/90 border border-amber-300 p-1.5 sm:p-2.5 rounded-xl shadow-xs text-center flex items-center justify-center gap-1.5 sm:gap-2 mb-2">
            <HelpCircle size={15} className="text-amber-800 animate-pulse shrink-0" />
            <p className="text-[10px] sm:text-xs font-extrabold text-slate-800 tracking-wide">
              {activeDragId ? (
                <span className="text-orange-600 animate-pulse">そのままみぎのダンプカーまではこんで、はなそう！🚚💨</span>
              ) : (
                <span>ガレキを タップ＆ドラッグ して、みぎのダンプカーにいれてね！👈</span>
              )}
            </p>
          </div>

          {/* Core drag playground row */}
          <div 
            ref={playgroundRef}
            className="flex-grow relative flex items-stretch rounded-2xl border-2 border-dashed border-sky-300 overflow-hidden min-h-[160px] sm:min-h-[200px]"
          >
            {/* Dynamic cartoon background illustration */}
            <MiniGameBackground type={target.type} />
            {/* Soil / Mud / Stone Dust particles generated dynamically during digging */}
            {dustParticles.map((dp) => (
              <motion.div
                key={dp.id}
                initial={{ x: dp.x, y: dp.y, scale: 0.2, opacity: 0.8 }}
                animate={{ 
                  x: dp.x + dp.driftX, 
                  y: dp.y + dp.driftY, 
                  scale: 2.2, 
                  opacity: 0,
                  rotate: [0, 45, 90]
                }}
                transition={{ duration: 0.75, ease: "easeOut" }}
                onAnimationComplete={() => {
                  setDustParticles((prev) => prev.filter((p) => p.id !== dp.id));
                }}
                className="absolute pointer-events-none rounded-full filter blur-[3px] z-30"
                style={{
                  width: dp.size,
                  height: dp.size,
                  marginLeft: -dp.size / 2,
                  marginTop: -dp.size / 2,
                  backgroundColor: dp.color,
                }}
              />
            ))}

            {/* Ground road lane indicator */}
            <div className="absolute bottom-4 inset-x-0 h-10 bg-slate-300/40 border-y border-slate-300/60 pointer-events-none" />

            {/* Scattered debris pieces */}
            {pieces.map((p) => {
              if (p.cleared) return null;
              const isActive = activeDragId === p.id;
              return (
                <motion.div
                  key={p.id}
                  id={`drag-item-${p.id}`}
                  drag
                  dragConstraints={playgroundRef}
                  dragElastic={0.15}
                  onDragStart={() => handleDragStart(p.id)}
                  onDrag={(e, info) => handleDrag(e, info, p.id)}
                  onDragEnd={(e, info) => handleDragEnd(e, info, p.id)}
                  style={{
                    left: `${p.startX}%`,
                    top: `${p.startY}%`,
                    zIndex: isActive ? 50 : 20,
                    touchAction: 'none'
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing pointer-events-auto flex flex-col items-center justify-center"
                >
                  {/* Visual shovel attachment above or around the rock when being actively dragged */}
                  {isActive && (
                    <motion.div
                      initial={{ y: -45, scale: 0.8, opacity: 0 }}
                      animate={{ y: -30, scale: 1.05, opacity: 1 }}
                      className="absolute flex flex-col items-center pointer-events-none z-30"
                    >
                      {/* Shovel hook line */}
                      <div className="w-1.5 h-12 bg-amber-400 border-x border-amber-600" />
                      {/* Shovel scoop/grabber bucket icon */}
                      <div className="bg-amber-400 p-1 rounded-lg border-2 border-slate-800 shadow-md flex items-center justify-center w-9 h-7 -mt-1.5">
                        <svg viewBox="0 0 40 40" className="w-6 h-6">
                          <path d="M 5 25 Q 20 40 35 25 Q 35 10 20 10 Q 5 10 5 25 Z" fill="#eab308" stroke="#1e293b" strokeWidth="2" />
                          <circle cx="20" cy="18" r="3" fill="#475569" />
                          <path d="M 12 25 L 16 32 M 28 25 L 24 32" stroke="#1e293b" strokeWidth="2" />
                        </svg>
                      </div>
                      <span className="text-[8px] bg-red-600 text-white font-black px-1.5 rounded-md border border-white -mt-1 scale-90 whitespace-nowrap">がっちりキャッチ！</span>
                    </motion.div>
                  )}

                  <motion.div
                    animate={{
                      scale: isActive ? p.scale * 1.15 : p.scale,
                      rotate: isActive ? p.angle + 8 : p.angle,
                      boxShadow: isActive ? '0px 12px 20px rgba(0,0,0,0.25)' : '0px 4px 6px rgba(0,0,0,0.1)'
                    }}
                    className="p-1.5 rounded-full transition-shadow duration-100"
                  >
                    {renderDebrisGraphics(p.type, false)}
                  </motion.div>
                </motion.div>
              );
            })}

            {/* RIGHT SIDE: Rubble's Dump Truck / Collector hopper */}
            <div 
              id="rubble-dump-truck"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-[35%] sm:w-[32%] h-[75%] max-h-[170px] bg-amber-100/80 rounded-2xl border-4 border-dashed border-amber-400/80 flex flex-col items-center justify-center p-2.5 shadow-inner transition-colors duration-150"
              style={{
                backgroundColor: activeDragId ? '#fef3c7' : undefined
              }}
            >
              {/* Cute Dump Truck body SVG */}
              <div className="relative w-full flex-grow flex flex-col items-center justify-center">
                <svg viewBox="0 0 100 80" className="w-20 h-16 sm:w-28 sm:h-22 drop-shadow-md">
                  {/* Background wheels */}
                  <circle cx="35" cy="65" r="9" fill="#1e293b" stroke="#ffffff" strokeWidth="1" />
                  <circle cx="35" cy="65" r="3" fill="#94a3b8" />
                  <circle cx="75" cy="65" r="9" fill="#1e293b" stroke="#ffffff" strokeWidth="1" />
                  <circle cx="75" cy="65" r="3" fill="#94a3b8" />
                  
                  {/* Truck bed / Dump hopper */}
                  <rect x="15" y="15" width="55" height="35" fill="#facc15" stroke="#a16207" strokeWidth="2.5" rx="3" />
                  {/* Warning stripe on hopper side */}
                  <g transform="translate(18, 22)">
                    <rect x="0" y="0" width="48" height="8" fill="#1e293b" rx="1" />
                    <line x1="4" y1="0" x2="10" y2="8" stroke="#facc15" strokeWidth="3" />
                    <line x1="16" y1="0" x2="22" y2="8" stroke="#facc15" strokeWidth="3" />
                    <line x1="28" y1="0" x2="34" y2="8" stroke="#facc15" strokeWidth="3" />
                    <line x1="40" y1="0" x2="46" y2="8" stroke="#facc15" strokeWidth="3" />
                  </g>
                  
                  {/* Truck cab (front) */}
                  <path d="M 70 20 L 88 20 C 92 20, 94 25, 94 30 L 94 50 L 70 50 Z" fill="#eab308" stroke="#a16207" strokeWidth="2.5" />
                  <rect x="74" y="24" width="12" height="12" fill="#bae6fd" stroke="#a16207" strokeWidth="1.5" rx="1" />
                  
                  {/* Mudguards */}
                  <path d="M 24 50 A 11 11 0 0 1 46 50 Z" fill="#475569" />
                  <path d="M 64 50 A 11 11 0 0 1 86 50 Z" fill="#475569" />
                </svg>

                {/* Inner cleared debris preview list showing loaded debris items */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none scale-75">
                  {pieces.filter(p => p.cleared).map((p, idx) => (
                    <motion.div
                      key={`cleared-mini-${p.id}`}
                      initial={{ scale: 0, y: -20 }}
                      animate={{ scale: 0.8, y: 0 }}
                      style={{ rotate: idx * 15 - 15 }}
                    >
                      {renderDebrisGraphics(p.type, true)}
                    </motion.div>
                  ))}
                </div>

                {/* Sparkling indicators */}
                {successCount > 0 && (
                  <div className="absolute -top-3 -right-2 text-yellow-400">
                    <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                      <Sparkles className="w-5 h-5 fill-yellow-400" />
                    </motion.div>
                  </div>
                )}
              </div>

              {/* Collector text label */}
              <div className="mt-1 text-center shrink-0">
                <span className="text-[10px] sm:text-xs font-black bg-slate-800 text-white px-2.5 py-0.5 rounded-full border border-slate-700 block whitespace-nowrap">
                  ダンプカー (Dump Truck)
                </span>
                <span className="text-[8px] sm:text-[10px] font-bold text-slate-500 mt-0.5 block">
                  ココにいれてね！
                </span>
              </div>
            </div>
          </div>

          {/* Progress gauge & helper visual */}
          <div className="mt-3.5 flex items-center justify-between gap-3 font-sans shrink-0">
            {/* Loaded status bar */}
            <div className="flex-grow flex flex-col gap-1">
              <div className="flex justify-between text-xs font-extrabold text-slate-700 px-0.5">
                <span>おかたづけの しんちょく (Progress):</span>
                <span className="text-amber-600 font-black">{successCount} / 4こクリア</span>
              </div>
              <div className="h-4 bg-slate-200 rounded-full overflow-hidden border border-slate-300 p-0.5 shadow-inner">
                <div
                  style={{ width: `${(successCount / 4) * 100}%` }}
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-300 shadow flex items-center justify-end px-2"
                >
                  {successCount > 0 && (
                    <span className="text-[8px] font-black text-white">{Math.round((successCount / 4) * 100)}%</span>
                  )}
                </div>
              </div>
            </div>

            {/* Target information badge */}
            <div className="bg-slate-800 text-white px-3 py-1.5 rounded-xl border border-slate-700 shadow-sm flex flex-col items-center justify-center shrink-0 max-w-[130px]">
              <span className="text-[8px] font-bold text-slate-400 leading-none">ガレキのかたづけ</span>
              <span className="text-xs font-black text-amber-300 leading-tight truncate w-full text-center">{target.name.split(' (')[0]}</span>
            </div>
          </div>
        </div>

        {/* Warning hazard yellow striped borders bottom */}
        <div 
          className="h-3 w-full flex mt-auto" 
          style={{
            background: 'repeating-linear-gradient(45deg, #facc15, #facc15 12px, #1e293b 12px, #1e293b 24px)'
          }}
        />

        {/* Success / cleared pop-up modal overlay inside the component */}
        <AnimatePresence>
          {showVictory && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-emerald-600/95 flex flex-col items-center justify-center p-4 z-55 text-white text-center"
            >
              <motion.div
                initial={{ scale: 0.8, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                className="max-w-xs flex flex-col items-center"
              >
                {/* Custom Paw Patrol Rescue Badge Stamp */}
                <div className="relative mb-6 flex items-center justify-center">
                  {/* Expanding impact wave ring behind stamp */}
                  <motion.div
                    initial={{ scale: 0.3, opacity: 1 }}
                    animate={{ scale: 2.8, opacity: 0 }}
                    transition={{ duration: 0.65, delay: 0.1, ease: "easeOut" }}
                    className="absolute w-32 h-32 rounded-full border-8 border-yellow-300 pointer-events-none"
                  />

                  {/* Stamp Graphic */}
                  <motion.div
                    initial={{ scale: 5, rotate: -60, opacity: 0 }}
                    animate={{ scale: 1, rotate: -6, opacity: 1 }}
                    transition={{ 
                      type: "spring", 
                      damping: 10, 
                      stiffness: 150, 
                      delay: 0.05 
                    }}
                    className="relative bg-gradient-to-br from-red-600 to-red-700 text-white rounded-full p-4 border-6 border-yellow-400 shadow-[0px_10px_25px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center w-36 h-36 border-double"
                    style={{
                      backgroundImage: 'radial-gradient(circle, #dc2626 60%, #b91c1c 100%)'
                    }}
                  >
                    {/* Inner dotted border for vintage ink stamp feel */}
                    <div className="absolute inset-1.5 rounded-full border-2 border-dashed border-yellow-300/60 pointer-events-none" />

                    {/* Paw print in the center */}
                    <svg viewBox="0 0 100 100" className="w-16 h-16 text-yellow-300 fill-yellow-300 drop-shadow-md">
                      {/* Big pad */}
                      <ellipse cx="50" cy="62" rx="19" ry="15" />
                      {/* 4 toe pads */}
                      <circle cx="25" cy="41" r="7.5" />
                      <circle cx="41" cy="25" r="8.5" />
                      <circle cx="59" cy="25" r="8.5" />
                      <circle cx="75" cy="41" r="7.5" />
                    </svg>

                    {/* Sparkling indicator overlay */}
                    <div className="absolute top-2 right-3 text-white drop-shadow animate-ping">
                      <Sparkles size={16} className="fill-white" />
                    </div>
                    
                    {/* Retro Stamp Text banner */}
                    <div className="absolute -bottom-1.5 bg-yellow-400 text-slate-900 font-extrabold text-xs sm:text-sm px-4 py-1 rounded-lg border-2 border-slate-950 shadow-md whitespace-nowrap tracking-wider rotate-[6deg] scale-105">
                      ★ 任務完了 ★
                    </div>
                  </motion.div>
                </div>

                <h4 className="text-xl sm:text-2xl font-black mb-1 font-sans text-yellow-200 tracking-wider">
                  かんぺき！レスキューせいこう！
                </h4>
                <p className="text-xs font-bold text-white mb-5 leading-normal">
                  ラブルのパワーショベルで、どうろをふさいでいたガレキをぜんぶ かたづけたよ！
                </p>

                <motion.button
                  id="rubble-panel-victory-continue-btn"
                  onClick={onComplete}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 border-b-4 border-yellow-600 font-sans font-black text-sm px-6 py-2.5 rounded-full shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles size={15} />
                  <span>つぎへ すすむ！</span>
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
