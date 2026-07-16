import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShieldCheck } from 'lucide-react';
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

interface ChaseTrafficControlPanelProps {
  target: Fire;
  soundEnabled: boolean;
  onComplete: () => void;
  onClose: () => void;
}

interface ConeItem {
  id: string;
  startX: number; // percentage width
  startY: number; // percentage height
  currentX: number;
  currentY: number;
  placedOnTargetId: string | null;
  emoji: string;
}

interface DropTarget {
  id: string;
  x: number; // percentage width
  y: number; // percentage height
  filledByConeId: string | null;
}

export default function ChaseTrafficControlPanel({ target, soundEnabled, onComplete, onClose }: ChaseTrafficControlPanelProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playgroundRef = useRef<HTMLDivElement | null>(null);
  const [cones, setCones] = useState<ConeItem[]>([]);
  const [targets, setTargets] = useState<DropTarget[]>([]);
  const [successCount, setSuccessCount] = useState(0);
  const [showVictory, setShowVictory] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

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
  const playSirenSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(950, ctx.currentTime + 0.15);
      osc.frequency.linearRampToValueAtTime(650, ctx.currentTime + 0.3);
      
      gainNode.gain.setValueAtTime(0.12 * 0.6, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  };

  const playSnapSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      
      // Double chirp / beep
      const osc1 = ctx.createOscillator();
      const gainNode1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, ctx.currentTime);
      gainNode1.gain.setValueAtTime(0.1 * 0.6, ctx.currentTime);
      gainNode1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc1.connect(gainNode1);
      gainNode1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.08);

      const osc2 = ctx.createOscillator();
      const gainNode2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1200, ctx.currentTime + 0.06);
      gainNode2.gain.setValueAtTime(0.12 * 0.6, ctx.currentTime + 0.06);
      gainNode2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
      osc2.connect(gainNode2);
      gainNode2.connect(ctx.destination);
      osc2.start();
      osc2.stop(ctx.currentTime + 0.16);
    } catch (e) {}
  };

  const playYaySound = () => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      
      const notes = [329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // E4, G4, C5, E5, G5, C6 cheer
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);
        
        gainNode.gain.setValueAtTime(0, ctx.currentTime + idx * 0.07);
        gainNode.gain.linearRampToValueAtTime(0.15 * 0.6, ctx.currentTime + idx * 0.07 + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.07 + 0.25);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + idx * 0.07 + 0.25);
      });
    } catch (e) {}
  };

  // Initialize cones and targets
  useEffect(() => {
    // 3 cones scattered on the left side
    const initialCones: ConeItem[] = [
      { id: 'cone-1', startX: 10, startY: 30, currentX: 10, currentY: 30, placedOnTargetId: null, emoji: '🚧' },
      { id: 'cone-2', startX: 10, startY: 52, currentX: 10, currentY: 52, placedOnTargetId: null, emoji: '⚠️' },
      { id: 'cone-3', startX: 10, startY: 74, currentX: 10, currentY: 74, placedOnTargetId: null, emoji: '🚨' }
    ];

    // 3 target safety slots on the road/lane (right part of screen)
    const initialTargets: DropTarget[] = [
      { id: 'trg-1', x: 45, y: 55, filledByConeId: null },
      { id: 'trg-2', x: 65, y: 40, filledByConeId: null },
      { id: 'trg-3', x: 80, y: 65, filledByConeId: null }
    ];

    setCones(initialCones);
    setTargets(initialTargets);
    setSuccessCount(0);
    setShowVictory(false);
    playSirenSound();
  }, [target]);

  const handleDragStart = (id: string) => {
    setActiveDragId(id);
  };

  const handleDragEnd = (event: any, info: any, coneId: string) => {
    setActiveDragId(null);
    const playground = playgroundRef.current;
    if (!playground) return;

    const rect = playground.getBoundingClientRect();
    const dropXPercent = ((info.point.x - rect.left) / rect.width) * 100;
    const dropYPercent = ((info.point.y - rect.top) / rect.height) * 100;

    // Search for closest empty target
    let matchedTargetId: string | null = null;
    let minDistance = 16; // strict percentage threshold for snapping

    targets.forEach((trg) => {
      if (trg.filledByConeId === null || trg.filledByConeId === coneId) {
        const dx = trg.x - dropXPercent;
        const dy = trg.y - dropYPercent;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDistance) {
          minDistance = dist;
          matchedTargetId = trg.id;
        }
      }
    });

    if (matchedTargetId) {
      // Snap to target!
      playSnapSound();

      setTargets((prevTargets) =>
        prevTargets.map((t) => {
          // If this target was filled by this cone previously, free it
          if (t.filledByConeId === coneId) return { ...t, filledByConeId: null };
          // Fill target
          if (t.id === matchedTargetId) return { ...t, filledByConeId: coneId };
          return t;
        })
      );

      setCones((prevCones) => {
        const updated = prevCones.map((c) => {
          if (c.id === coneId) {
            const targetObj = targets.find((t) => t.id === matchedTargetId);
            return {
              ...c,
              placedOnTargetId: matchedTargetId,
              currentX: targetObj ? targetObj.x : c.startX,
              currentY: targetObj ? targetObj.y : c.startY
            };
          }
          return c;
        });

        const snapCount = updated.filter((c) => c.placedOnTargetId !== null).length;
        setSuccessCount(snapCount);

        if (snapCount === targets.length) {
          setTimeout(() => {
            playYaySound();
            setShowVictory(true);
          }, 600);
        }

        return updated;
      });
    } else {
      // Drop failed, return back to original side tray
      setCones((prevCones) =>
        prevCones.map((c) => {
          if (c.id === coneId) {
            // Free any target filled by this cone
            setTargets((prevT) =>
              prevT.map((t) => (t.filledByConeId === coneId ? { ...t, filledByConeId: null } : t))
            );
            return {
              ...c,
              placedOnTargetId: null,
              currentX: c.startX,
              currentY: c.startY
            };
          }
          return c;
        })
      );
      setSuccessCount((prev) => Math.max(0, prev - 1));
    }
  };

  return (
    <div 
      id="chase-challenge-overlay"
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
        className="relative w-full max-w-xl bg-gradient-to-b from-blue-50 to-indigo-100 rounded-3xl border-6 border-blue-600 shadow-2xl text-slate-800 flex flex-col overflow-hidden max-h-[94vh] h-auto"
      >
        {/* Police Stripes Blue & Gold */}
        <div 
          className="h-3 w-full flex-shrink-0 flex" 
          style={{
            background: 'repeating-linear-gradient(45deg, #2563eb, #2563eb 12px, #facc15 12px, #facc15 24px)'
          }}
        />

        {/* Header bar */}
        <div className="bg-blue-600 p-2.5 sm:p-4 text-center border-b-3 border-blue-700 shadow-md flex items-center justify-between flex-shrink-0 text-white font-sans">
          <div className="flex items-center gap-1.5 sm:gap-2.5 text-white">
            <span className="text-xl sm:text-2xl animate-bounce">🚔</span>
            <div className="text-left">
              <h3 className="font-black text-sm sm:text-lg tracking-wide leading-tight">
                チェイスの あんぜんコーンゲーム！
              </h3>
              <p className="text-[10px] sm:text-xs font-bold text-blue-100 leading-none mt-0.5">
                コーンをドラッグして、おたすけエリアをまもろう！
              </p>
            </div>
          </div>

          <button 
            id="chase-panel-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-full bg-blue-700 hover:bg-blue-800 text-blue-100 hover:text-white transition-colors cursor-pointer"
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
          <div className="bg-blue-100 border border-blue-200 p-1.5 sm:p-2.5 rounded-xl shadow-xs text-center flex items-center justify-center gap-1.5 sm:gap-2 mb-2">
            <ShieldCheck size={16} className="text-blue-600 animate-pulse fill-blue-200" />
            <span className="text-xs sm:text-sm font-black text-blue-800">
              左の「あんぜんコーン」をドラッグして、あおい丸いわくに置いてね！🚔✨
            </span>
          </div>

          {/* Core drag playground row */}
          <div 
            ref={playgroundRef}
            className="flex-grow relative flex items-stretch rounded-2xl border-2 border-dashed border-blue-300 overflow-hidden min-h-[170px] sm:min-h-[210px]"
          >
            {/* Dynamic cartoon background illustration */}
            <MiniGameBackground type={target.type} />
            {/* Left Box Container for available cones */}
            <div className="w-[24%] border-r-2 border-dashed border-blue-200 bg-blue-100/40 flex flex-col items-center justify-around py-1 pointer-events-none z-10">
              <span className="text-[8px] sm:text-[9px] font-black text-blue-800 bg-blue-200 px-1.5 py-0.5 rounded-md uppercase tracking-wider scale-90 whitespace-nowrap">
                コーンそうこ
              </span>
              <div className="flex-grow" />
            </div>

            {/* Road lane visuals for children */}
            <div className="absolute inset-y-0 left-[24%] right-0 flex flex-col justify-around pointer-events-none select-none">
              <div className="w-full h-8 bg-slate-300/40 border-y border-dashed border-slate-300 flex items-center justify-around text-[9px] font-mono text-slate-400">
                <span>◀ LANE 1 ▶</span>
                <span>◀ LANE 1 ▶</span>
              </div>
              <div className="w-full h-8 bg-slate-300/40 border-y border-dashed border-slate-300 flex items-center justify-around text-[9px] font-mono text-slate-400">
                <span>◀ LANE 2 ▶</span>
                <span>◀ LANE 2 ▶</span>
              </div>
            </div>

            {/* Glowing drop targets */}
            {targets.map((trg) => {
              const isFilled = trg.filledByConeId !== null;
              return (
                <div
                  key={trg.id}
                  style={{
                    left: `${trg.x}%`,
                    top: `${trg.y}%`
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-10 pointer-events-none"
                >
                  {/* Glowing halo indicator */}
                  <motion.div
                    animate={isFilled ? { scale: 0.9 } : { scale: [1, 1.25, 1], opacity: [0.7, 0.3, 0.7] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className={`w-11 h-11 rounded-full border-3 border-dashed flex items-center justify-center ${
                      isFilled ? 'border-emerald-500 bg-emerald-100/30' : 'border-blue-400 bg-blue-100/30'
                    }`}
                  >
                    {!isFilled && (
                      <span className="text-[8px] font-extrabold text-blue-500 bg-white/90 px-1 rounded-md shadow-xs scale-75 whitespace-nowrap animate-bounce">
                        ココに置く!
                      </span>
                    )}
                  </motion.div>
                </div>
              );
            })}

            {/* Scattered cones */}
            {cones.map((c) => {
              const isPlaced = c.placedOnTargetId !== null;
              const isActive = activeDragId === c.id;

              return (
                <motion.div
                  key={c.id}
                  id={`drag-cone-${c.id}`}
                  drag
                  dragConstraints={playgroundRef}
                  dragElastic={0.15}
                  onDragStart={() => handleDragStart(c.id)}
                  onDragEnd={(e, info) => handleDragEnd(e, info, c.id)}
                  style={{
                    left: `${isPlaced ? c.currentX : c.startX}%`,
                    top: `${isPlaced ? c.currentY : c.startY}%`,
                    zIndex: isActive ? 50 : 20,
                    touchAction: 'none'
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing pointer-events-auto flex flex-col items-center justify-center"
                >
                  {/* Visual rescue link pointer shown when dragged */}
                  {isActive && (
                    <motion.div
                      initial={{ y: -35, scale: 0.8, opacity: 0 }}
                      animate={{ y: -22, scale: 1.05, opacity: 1 }}
                      className="absolute flex flex-col items-center pointer-events-none z-30"
                    >
                      <div className="w-1 h-8 bg-blue-500" />
                      <div className="bg-blue-600 px-1.5 py-0.5 rounded-md border border-white text-[8px] text-white font-extrabold whitespace-nowrap -mt-1 shadow-md">
                        はこび中！🌟
                      </div>
                    </motion.div>
                  )}

                  {/* Cone graphic item */}
                  <motion.div
                    animate={{
                      scale: isActive ? 1.25 : 1,
                      rotate: isActive ? 10 : 0,
                      boxShadow: isActive ? '0px 10px 15px rgba(0,0,0,0.25)' : '0px 3px 5px rgba(0,0,0,0.1)'
                    }}
                    className="p-1 rounded-full bg-white/10"
                  >
                    {/* SVG traffic cone graphic */}
                    <div className="w-11 h-11 flex flex-col items-center justify-center relative">
                      <svg viewBox="0 0 40 40" className="w-9 h-9 drop-shadow-sm">
                        {/* Orange Cone base */}
                        <path d="M 5 35 L 35 35 L 28 8 L 12 8 Z" fill="#f97316" stroke="#1e293b" strokeWidth="2.2" />
                        {/* Reflective silver stripes */}
                        <path d="M 15 21 L 25 21 L 27 15 L 13 15 Z" fill="#e2e8f0" stroke="#1e293b" strokeWidth="1.5" />
                        {/* Black rubber stand */}
                        <rect x="2" y="34" width="36" height="4" rx="1.5" fill="#1e293b" />
                        <ellipse cx="20" cy="11" rx="6" ry="2" fill="#ea580c" />
                      </svg>

                      {/* Display warning badge */}
                      <span className="absolute bottom-2 text-xs filter drop-shadow">{c.emoji}</span>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Progress and metadata row */}
          <div className="mt-3.5 flex items-center justify-between gap-3 font-sans shrink-0">
            <div className="flex-grow flex flex-col gap-1">
              <div className="flex justify-between text-xs font-extrabold text-slate-700 px-0.5">
                <span>コーンはいち しんちょく (Progress):</span>
                <span className="text-blue-600 font-black">{successCount} / 3こ配置</span>
              </div>
              <div className="h-4 bg-slate-200 rounded-full overflow-hidden border border-slate-300 p-0.5 shadow-inner">
                <div
                  style={{ width: `${(successCount / 3) * 100}%` }}
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300 shadow flex items-center justify-end px-2"
                >
                  {successCount > 0 && (
                    <span className="text-[8px] font-black text-white">{Math.round((successCount / 3) * 100)}%</span>
                  )}
                </div>
              </div>
            </div>

            {/* Target information */}
            <div className="bg-slate-800 text-white px-3 py-1.5 rounded-xl border border-slate-700 shadow-sm flex flex-col items-center justify-center shrink-0 max-w-[130px]">
              <span className="text-[8px] font-bold text-blue-300 leading-none">安全レスキュー</span>
              <span className="text-xs font-black text-blue-200 leading-tight truncate w-full text-center mt-0.5">{target.name.split(' (')[0]}</span>
            </div>
          </div>
        </div>

        {/* Stripes Bottom */}
        <div 
          className="h-3 w-full flex mt-auto" 
          style={{
            background: 'repeating-linear-gradient(45deg, #2563eb, #2563eb 12px, #facc15 12px, #facc15 24px)'
          }}
        />

        {/* Victory overlay */}
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

                    {/* Paw print */}
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
                      ★ 任務完了 ★
                    </div>
                  </motion.div>
                </div>

                <h4 className="text-xl sm:text-2xl font-black mb-1 font-sans text-yellow-200 tracking-wider">
                  かんぺき！おたすけせいこう！
                </h4>
                <p className="text-xs font-bold text-white mb-5 leading-normal">
                  チェイスのパトロール活動で、あんぜんコーンをすべて設置し エリアをしっかりと守ったよ！
                </p>

                <motion.button
                  id="chase-panel-victory-continue-btn"
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
