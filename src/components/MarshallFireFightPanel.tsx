import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Droplet, Flame } from 'lucide-react';
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

interface MarshallFireFightPanelProps {
  target: Fire;
  soundEnabled: boolean;
  onComplete: () => void;
  onClose: () => void;
}

interface MiniFire {
  id: string;
  x: number; // percentage horizontal
  y: number; // percentage vertical
  hp: number;
  maxHp: number;
  scale: number;
  extinguished: boolean;
  angle: number;
}

export default function MarshallFireFightPanel({ target, soundEnabled, onComplete, onClose }: MarshallFireFightPanelProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playgroundRef = useRef<HTMLDivElement | null>(null);
  const [miniFires, setMiniFires] = useState<MiniFire[]>([]);
  const [successCount, setSuccessCount] = useState(0);
  const [showVictory, setShowVictory] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [waterSplashParticles, setWaterSplashParticles] = useState<{
    id: string;
    x: number;
    y: number;
    size: number;
    driftX: number;
    driftY: number;
    color: string;
  }[]>([]);

  // Trigger screen shake on victory
  useEffect(() => {
    if (showVictory) {
      setIsShaking(true);
      const timer = setTimeout(() => {
        setIsShaking(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [showVictory]);

  // Sound Synthesizers using Web Audio API
  const playSizzleSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      
      // Sizzle / steam noise
      const bufferSize = ctx.sampleRate * 0.2; // 0.2 seconds
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1200, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime + 0.15);
      
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.15 * 0.6, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      
      noise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      noise.start();
      noise.stop(ctx.currentTime + 0.2);
    } catch (e) {}
  };

  const playSplashSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(350, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.15);
      
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(600, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.2 * 0.6, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      
      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.18);
      osc2.stop(ctx.currentTime + 0.18);
    } catch (e) {}
  };

  const playYaySound = () => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C4, E4, G4, C5, E5, G5, C6 cheer
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);
        
        gainNode.gain.setValueAtTime(0, ctx.currentTime + idx * 0.07);
        gainNode.gain.linearRampToValueAtTime(0.12 * 0.6, ctx.currentTime + idx * 0.07 + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.07 + 0.3);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + idx * 0.07 + 0.3);
      });
    } catch (e) {}
  };

  // Initialize fires
  useEffect(() => {
    // Generate 4 mini fire spots
    const items: MiniFire[] = [
      { id: 'mf-1', x: 22, y: 35, hp: 3, maxHp: 3, scale: 1.1, extinguished: false, angle: -10 },
      { id: 'mf-2', x: 40, y: 55, hp: 3, maxHp: 3, scale: 0.95, extinguished: false, angle: 8 },
      { id: 'mf-3', x: 58, y: 30, hp: 3, maxHp: 3, scale: 1.2, extinguished: false, angle: -5 },
      { id: 'mf-4', x: 75, y: 50, hp: 3, maxHp: 3, scale: 1.05, extinguished: false, angle: 12 },
    ];
    setMiniFires(items);
    setSuccessCount(0);
    setShowVictory(false);
  }, [target]);

  // Fire tap handler
  const handleFireTap = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    // Spawn water splash particles from the tap location
    const rect = playgroundRef.current?.getBoundingClientRect();
    if (rect) {
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const colors = [
        'rgba(56, 189, 248, 0.65)',  // sky-400
        'rgba(14, 165, 233, 0.7)',   // sky-500
        'rgba(3, 105, 161, 0.55)',   // sky-700
        'rgba(224, 242, 254, 0.8)',  // sky-100
      ];

      const newParticles = Array.from({ length: 6 }).map((_, i) => ({
        id: `splash-${Date.now()}-${i}-${Math.random()}`,
        x: clickX,
        y: clickY,
        size: 10 + Math.random() * 16,
        driftX: (Math.random() - 0.5) * 120,
        driftY: (Math.random() - 0.7) * 90 - 30,
        color: colors[Math.floor(Math.random() * colors.length)]
      }));

      setWaterSplashParticles((prev) => [...prev.slice(-30), ...newParticles]);
    }

    playSplashSound();

    setMiniFires((prev) => {
      let isAllCleared = true;
      const updated = prev.map((f) => {
        if (f.id === id && !f.extinguished) {
          const nextHp = Math.max(0, f.hp - 1);
          const isExt = nextHp <= 0;
          if (isExt) {
            playSizzleSound();
          }
          return { ...f, hp: nextHp, extinguished: isExt };
        }
        return f;
      });

      const clearedCount = updated.filter((f) => f.extinguished).length;
      setSuccessCount(clearedCount);

      if (clearedCount === updated.length) {
        setTimeout(() => {
          playYaySound();
          setShowVictory(true);
        }, 400);
      }

      return updated;
    });
  };

  return (
    <div 
      id="marshall-challenge-overlay"
      className="fixed inset-0 bg-slate-900/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 z-[100] font-sans text-white select-none animate-fade-in"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={isShaking ? {
          scale: [1, 1.02, 0.98, 1.01, 0.99, 1],
          x: [0, 4, -4, 3, -3, 0],
          y: [0, -3, 3, -2, 2, 0]
        } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.55, ease: "easeInOut" }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-xl bg-gradient-to-b from-red-50 to-orange-100 rounded-3xl border-6 border-red-500 shadow-2xl text-slate-800 flex flex-col overflow-hidden max-h-[94vh] h-auto"
      >
        {/* Red / Yellow hazard styled striped borders */}
        <div 
          className="h-3 w-full flex-shrink-0 flex" 
          style={{
            background: 'repeating-linear-gradient(45deg, #ef4444, #ef4444 12px, #facc15 12px, #facc15 24px)'
          }}
        />

        {/* Header bar */}
        <div className="bg-red-500 p-2.5 sm:p-4 text-center border-b-3 border-red-600 shadow-md flex items-center justify-between flex-shrink-0 text-white">
          <div className="flex items-center gap-1.5 sm:gap-2.5 text-white">
            <span className="text-xl sm:text-2xl animate-bounce">🚒</span>
            <div className="text-left">
              <h3 className="font-sans font-black text-sm sm:text-lg tracking-wide leading-tight">
                マーシャルの しょうぼう放水ゲーム！
              </h3>
              <p className="text-[10px] sm:text-xs font-bold text-red-100 leading-none mt-0.5">
                あかい火をタップして おみずをかけよう！
              </p>
            </div>
          </div>

          <button 
            id="marshall-panel-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-full bg-red-600 hover:bg-red-700 text-red-100 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Playfield body */}
        <div 
          ref={containerRef}
          className="relative flex-grow flex flex-col justify-between p-2.5 sm:p-5 min-h-0 sm:min-h-[250px]"
        >
          {/* Instructions banner */}
          <div className="bg-red-100 border border-red-200 p-1.5 sm:p-2.5 rounded-xl shadow-xs text-center flex items-center justify-center gap-1.5 sm:gap-2 mb-2">
            <Droplet size={16} className="text-sky-500 animate-pulse fill-sky-200" />
            <span className="text-xs sm:text-sm font-black text-red-800">
              すべてのあかい火をタップして、おみずで消火（しょうか）してね！💦
            </span>
          </div>

          {/* Core tap playground row */}
          <div 
            ref={playgroundRef}
            className="flex-grow relative flex items-stretch rounded-2xl border-2 border-dashed border-red-300 overflow-hidden min-h-[160px] sm:min-h-[200px]"
          >
            {/* Dynamic cartoon background illustration */}
            <MiniGameBackground type={target.type} />
            {/* Water splash particles */}
            {waterSplashParticles.map((wp) => (
              <motion.div
                key={wp.id}
                initial={{ x: wp.x, y: wp.y, scale: 0.8, opacity: 1 }}
                animate={{
                  x: wp.x + wp.driftX,
                  y: wp.y + wp.driftY,
                  scale: 0,
                  opacity: 0
                }}
                transition={{ duration: 0.65, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  width: `${wp.size}px`,
                  height: `${wp.size}px`,
                  borderRadius: '50%',
                  background: wp.color,
                  pointerEvents: 'none',
                  zIndex: 45
                }}
              />
            ))}

            {/* Simulated target outline graphic */}
            <div className="absolute inset-x-0 bottom-0 top-1/3 bg-gradient-to-b from-transparent to-red-50/70 pointer-events-none flex flex-col justify-end p-4">
              <div className="text-center font-bold text-slate-400 text-[10px] uppercase tracking-wider mb-1">
                🚒 しょうかエリア (Firefighting Zone) 🚒
              </div>
            </div>

            {/* Mini fire items */}
            {miniFires.map((f) => {
              if (f.extinguished) {
                // Render a cute happy smoking puff
                return (
                  <motion.div
                    key={f.id}
                    initial={{ scale: 0.5, opacity: 1 }}
                    animate={{ scale: 1.2, opacity: 0, y: -25 }}
                    transition={{ duration: 1 }}
                    style={{
                      left: `${f.x}%`,
                      top: `${f.y}%`
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center flex flex-col items-center"
                  >
                    <span className="text-xl">💨</span>
                    <span className="text-[8px] bg-sky-100 text-sky-700 px-1 rounded-md border border-sky-300 -mt-2">消えた！</span>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={f.id}
                  style={{
                    left: `${f.x}%`,
                    top: `${f.y}%`,
                    transform: `translate(-50%, -50%) scale(${f.scale})`,
                    zIndex: 30
                  }}
                  className="absolute cursor-pointer flex flex-col items-center p-2 rounded-full hover:bg-red-500/10 transition-colors"
                  onClick={(e) => handleFireTap(f.id, e)}
                  whileHover={{ scale: f.scale * 1.12 }}
                  whileTap={{ scale: f.scale * 0.9 }}
                >
                  {/* Floating visual indicators */}
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 1.2, delay: Math.random() }}
                    className="flex flex-col items-center"
                  >
                    {/* Fire Emoji / SVG Graphic */}
                    <div className="relative">
                      {/* Fire Sprite */}
                      <Flame className="w-10 h-10 sm:w-14 sm:h-14 text-orange-500 fill-red-500 drop-shadow-md animate-pulse" />
                      
                      {/* Angry character eyes */}
                      <div className="absolute inset-0 top-1/3 flex items-center justify-center gap-1.5 pointer-events-none">
                        <span className="text-[8px] sm:text-[10px] font-black text-yellow-300 drop-shadow">😠</span>
                      </div>
                    </div>

                    {/* Miniature HP Indicator Bar */}
                    <div className="w-10 bg-slate-300 rounded-full h-1.5 mt-1 overflow-hidden border border-slate-400 p-[1px]">
                      <div 
                        className="bg-red-500 h-full rounded-full transition-all duration-200"
                        style={{ width: `${(f.hp / f.maxHp) * 100}%` }}
                      />
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Progress bar details */}
          <div className="mt-3.5 flex items-center justify-between gap-3 font-sans shrink-0">
            <div className="flex-grow flex flex-col gap-1">
              <div className="flex justify-between text-xs font-extrabold text-slate-700 px-0.5">
                <span>しょうかの しんちょく (Progress):</span>
                <span className="text-red-500 font-black">{successCount} / 4こ消火</span>
              </div>
              <div className="h-4 bg-slate-200 rounded-full overflow-hidden border border-slate-300 p-0.5 shadow-inner">
                <div
                  style={{ width: `${(successCount / 4) * 100}%` }}
                  className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-300 shadow flex items-center justify-end px-2"
                >
                  {successCount > 0 && (
                    <span className="text-[8px] font-black text-white">{Math.round((successCount / 4) * 100)}%</span>
                  )}
                </div>
              </div>
            </div>

            {/* Target Information */}
            <div className="bg-slate-800 text-white px-3 py-1.5 rounded-xl border border-slate-700 shadow-sm flex flex-col items-center justify-center shrink-0 max-w-[130px]">
              <span className="text-[8px] font-bold text-red-300 leading-none">消火ミッション</span>
              <span className="text-xs font-black text-red-200 leading-tight truncate w-full text-center mt-0.5">{target.name.split(' (')[0]}</span>
            </div>
          </div>
        </div>

        {/* Stripes Bottom */}
        <div 
          className="h-3 w-full flex mt-auto" 
          style={{
            background: 'repeating-linear-gradient(45deg, #ef4444, #ef4444 12px, #facc15 12px, #facc15 24px)'
          }}
        />

        {/* Victory Success stamp animation modal */}
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
                    <div className="absolute inset-1.5 rounded-full border-2 border-dashed border-yellow-300/60 pointer-events-none" />

                    {/* Paw print in the center */}
                    <svg viewBox="0 0 100 100" className="w-16 h-16 text-yellow-300 fill-yellow-300 drop-shadow-md">
                      <ellipse cx="50" cy="62" rx="19" ry="15" />
                      <circle cx="25" cy="41" r="7.5" />
                      <circle cx="41" cy="25" r="8.5" />
                      <circle cx="59" cy="25" r="8.5" />
                      <circle cx="75" cy="41" r="7.5" />
                    </svg>

                    <div className="absolute top-2 right-3 text-white drop-shadow animate-ping">
                      <Sparkles size={16} className="fill-white" />
                    </div>
                    
                    <div className="absolute -bottom-1.5 bg-yellow-400 text-slate-900 font-extrabold text-xs sm:text-sm px-4 py-1 rounded-lg border-2 border-slate-950 shadow-md whitespace-nowrap tracking-wider rotate-[6deg] scale-105">
                      ★ 消火完了 ★
                    </div>
                  </motion.div>
                </div>

                <h4 className="text-xl sm:text-2xl font-black mb-1 font-sans text-yellow-200 tracking-wider">
                  かんぺき！しょうかせいこう！
                </h4>
                <p className="text-xs font-bold text-white mb-5 leading-normal">
                  マーシャルのパワフルな放水（ほうすい）で、すべての火をきれいに消したよ！
                </p>

                <motion.button
                  id="marshall-panel-victory-continue-btn"
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

// Small helper components
function X({ size }: { size: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}
