import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';
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

interface SkyeRescuePanelProps {
  target: Fire;
  soundEnabled: boolean;
  onComplete: () => void;
  onClose: () => void;
}

interface StrandedFriend {
  id: string;
  name: string;
  emoji: string;
  x: number; // percentage width
  y: number; // percentage height
  rescued: boolean;
  ledgeType: 'cloud' | 'rock' | 'balloon';
}

export default function SkyeRescuePanel({ target, soundEnabled, onComplete, onClose }: SkyeRescuePanelProps) {
  const playgroundRef = useRef<HTMLDivElement | null>(null);
  const [friends, setFriends] = useState<StrandedFriend[]>([]);
  const [successCount, setSuccessCount] = useState(0);
  const [showVictory, setShowVictory] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // Winch animation state
  const [animatingFriendId, setAnimatingFriendId] = useState<string | null>(null);
  const [winchProgress, setWinchProgress] = useState(0); // 0 (at helicopter) to 100 (at friend)
  const [winchPhase, setWinchPhase] = useState<'descending' | 'ascending' | 'idle'>('idle');

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
  const playWinchSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(180, ctx.currentTime + 0.35);
      
      gainNode.gain.setValueAtTime(0.08 * 0.6, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {}
  };

  const playRescueChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode1 = ctx.createGain();
      const gainNode2 = ctx.createGain();
      
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
      gainNode1.gain.setValueAtTime(0.12 * 0.6, ctx.currentTime);
      gainNode1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc1.connect(gainNode1);
      gainNode1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.2);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(987.77, ctx.currentTime + 0.08); // B5
      gainNode2.gain.setValueAtTime(0.15 * 0.6, ctx.currentTime + 0.08);
      gainNode2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
      osc2.connect(gainNode2);
      gainNode2.connect(ctx.destination);
      osc2.start();
      osc2.stop(ctx.currentTime + 0.28);
    } catch (e) {}
  };

  const playYaySound = () => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6 cheer
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
        
        osc.start();
        osc.stop(ctx.currentTime + idx * 0.08 + 0.25);
      });
    } catch (e) {}
  };

  // Initialize stranded friends
  useEffect(() => {
    const items: StrandedFriend[] = [
      { id: 'sf-1', name: 'こねこちゃん', emoji: '🐱', x: 20, y: 58, rescued: false, ledgeType: 'rock' },
      { id: 'sf-2', name: 'ひよこちゃん', emoji: '🐥', x: 50, y: 72, rescued: false, ledgeType: 'cloud' },
      { id: 'sf-3', name: 'まいごのうさぎ', emoji: '🐰', x: 80, y: 55, rescued: false, ledgeType: 'balloon' }
    ];
    setFriends(items);
    setSuccessCount(0);
    setShowVictory(false);
    setWinchPhase('idle');
    setAnimatingFriendId(null);
  }, [target]);

  // Hoist winch control ticker
  useEffect(() => {
    if (winchPhase === 'idle' || !animatingFriendId) return;

    const interval = setInterval(() => {
      setWinchProgress((prev) => {
        if (winchPhase === 'descending') {
          const next = prev + 5;
          if (next >= 100) {
            // Arrived at friend! Snatch and turn back
            playRescueChime();
            setWinchPhase('ascending');
            return 100;
          }
          if (Math.random() < 0.3) playWinchSound();
          return next;
        } else if (winchPhase === 'ascending') {
          const next = prev - 5;
          if (next <= 0) {
            // Rescued successfully at the heli door!
            setWinchPhase('idle');
            setFriends((prevF) =>
              prevF.map((f) => (f.id === animatingFriendId ? { ...f, rescued: true } : f))
            );
            setSuccessCount((prevCount) => {
              const nextCount = prevCount + 1;
              if (nextCount === friends.length) {
                setTimeout(() => {
                  playYaySound();
                  setShowVictory(true);
                }, 500);
              }
              return nextCount;
            });
            setAnimatingFriendId(null);
            return 0;
          }
          if (Math.random() < 0.3) playWinchSound();
          return next;
        }
        return prev;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [winchPhase, animatingFriendId, friends.length]);

  const handleFriendTap = (friend: StrandedFriend) => {
    if (winchPhase !== 'idle' || friend.rescued) return;
    playWinchSound();
    setAnimatingFriendId(friend.id);
    setWinchProgress(0);
    setWinchPhase('descending');
  };

  // Coordinates of Skye's Helicopter pulley
  const heliX = 50; // top center
  const heliY = 22;

  // Active coordinates of basket
  const activeFriend = friends.find((f) => f.id === animatingFriendId);
  const targetX = activeFriend ? activeFriend.x : heliX;
  const targetY = activeFriend ? activeFriend.y : heliY;

  const basketX = heliX + (targetX - heliX) * (winchProgress / 100);
  const basketY = heliY + (targetY - heliY) * (winchProgress / 100);

  return (
    <div 
      id="skye-challenge-overlay"
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
        className="relative w-full max-w-xl bg-gradient-to-b from-pink-50 to-pink-100 rounded-3xl border-6 border-pink-400 shadow-2xl text-slate-800 flex flex-col overflow-hidden max-h-[94vh] h-auto"
      >
        {/* Warning hazard pink striped borders */}
        <div 
          className="h-3 w-full flex-shrink-0 flex" 
          style={{
            background: 'repeating-linear-gradient(45deg, #ec4899, #ec4899 12px, #fbcfe8 12px, #fbcfe8 24px)'
          }}
        />

        {/* Header bar */}
        <div className="bg-pink-400 p-2.5 sm:p-4 text-center border-b-3 border-pink-500 shadow-md flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2.5 text-slate-900">
            <span className="text-xl sm:text-2xl animate-bounce">🚁</span>
            <div className="text-left">
              <h3 className="font-black text-sm sm:text-lg tracking-wide leading-tight text-pink-900">
                スカイの そらとぶホイストゲーム！
              </h3>
              <p className="text-[10px] sm:text-xs font-bold text-pink-700 leading-none mt-0.5">
                おともだちをタップして、ロープをおろして救出（きゅうしゅつ）しよう！
              </p>
            </div>
          </div>

          <button 
            id="skye-panel-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-full bg-pink-500 hover:bg-pink-600 text-pink-900 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Playfield body */}
        <div 
          className="relative flex-grow flex flex-col justify-between p-2.5 sm:p-5 min-h-0 sm:min-h-[250px]"
        >
          {/* Instructions banner */}
          <div className="bg-pink-100 border border-pink-200 p-1.5 sm:p-2.5 rounded-xl shadow-xs text-center flex items-center justify-center gap-1.5 sm:gap-2 mb-2">
            <Heart size={16} className="text-pink-500 animate-pulse fill-pink-200" />
            <span className="text-xs sm:text-sm font-black text-pink-800">
              そらやがけで、こまっているおともだちをタップして助けてね！🚁💖
            </span>
          </div>

          {/* Core hoist playground row */}
          <div 
            ref={playgroundRef}
            className="flex-grow relative flex items-stretch rounded-2xl border-2 border-dashed border-pink-300 overflow-hidden min-h-[170px] sm:min-h-[210px]"
          >
            {/* Dynamic cartoon background illustration */}
            <MiniGameBackground type={target.type} />
            {/* Dynamic Sky Cloud layers background */}
            <div className="absolute inset-x-0 top-6 h-12 bg-white/30 rounded-full blur-md pointer-events-none" />
            <div className="absolute left-8 bottom-10 h-8 w-24 bg-white/40 rounded-full blur-sm pointer-events-none" />
            <div className="absolute right-12 top-20 h-10 w-28 bg-white/40 rounded-full blur-sm pointer-events-none" />

            {/* Skye's Helicopter base top center */}
            <div 
              style={{ left: `${heliX}%`, top: `${heliY}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-30"
            >
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 1.4 }}
                className="relative flex flex-col items-center"
              >
                {/* Spinning blades */}
                <div className="w-16 h-1 bg-slate-400 rounded-full animate-spin mb-[-3px]" style={{ animationDuration: '0.15s' }} />
                {/* Cute Pink Helicopter */}
                <div className="bg-pink-400 border-2 border-pink-600 px-3 py-1.5 rounded-xl shadow-md text-white font-extrabold text-[10px] flex items-center gap-1">
                  <span>🚁</span>
                  <span className="text-[8px] tracking-tighter">SKYE</span>
                </div>
              </motion.div>
            </div>

            {/* Active Hoist Steel Line Layer */}
            {winchPhase !== 'idle' && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
                <line
                  x1={`${heliX}%`}
                  y1={`${heliY}%`}
                  x2={`${basketX}%`}
                  y2={`${basketY}%`}
                  stroke="#db2777"
                  strokeWidth="2.5"
                  strokeDasharray="4,3"
                />
              </svg>
            )}

            {/* Sliding Hoist Rescue Basket */}
            {winchPhase !== 'idle' && (
              <div
                style={{ left: `${basketX}%`, top: `${basketY}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center z-25"
              >
                {/* Cable links */}
                <div className="w-1 h-3 bg-pink-500" />
                {/* Winch Basket with potential passenger inside */}
                <div className="w-9 h-6 rounded-b-lg border-2 border-pink-500 bg-pink-200/90 flex items-center justify-center shadow-md relative">
                  {winchPhase === 'ascending' && activeFriend && (
                    <span className="text-sm absolute -top-1 animate-bounce">{activeFriend.emoji}</span>
                  )}
                  <span className="text-[6px] text-pink-700 font-bold leading-none scale-90">RESCUE</span>
                </div>
              </div>
            )}

            {/* Stranded friends on ledges */}
            {friends.map((f) => {
              if (f.rescued) return null;
              const isTargetOfWinch = animatingFriendId === f.id;

              return (
                <div
                  key={f.id}
                  style={{
                    left: `${f.x}%`,
                    top: `${f.y}%`
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20"
                >
                  {/* The ledge platform they stand on */}
                  <div className="absolute top-4 pointer-events-none">
                    {f.ledgeType === 'cloud' && (
                      <div className="w-14 h-6 bg-white border border-slate-200 rounded-full shadow-xs flex items-center justify-center opacity-90">
                        <span className="text-[8px] font-bold text-slate-400">くも</span>
                      </div>
                    )}
                    {f.ledgeType === 'rock' && (
                      <div className="w-14 h-6 bg-amber-700 border border-amber-800 rounded-t-lg shadow-xs flex items-center justify-center">
                        <span className="text-[8px] font-bold text-amber-200">いわば</span>
                      </div>
                    )}
                    {f.ledgeType === 'balloon' && (
                      <div className="flex flex-col items-center -mt-1 scale-90">
                        <div className="w-6 h-6 rounded-full bg-red-400" />
                        <div className="w-[1px] h-4 bg-slate-400" />
                      </div>
                    )}
                  </div>

                  {/* Stranded Friend Item */}
                  <motion.div
                    whileHover={winchPhase === 'idle' ? { scale: 1.15 } : {}}
                    whileTap={winchPhase === 'idle' ? { scale: 0.9 } : {}}
                    onClick={() => handleFriendTap(f)}
                    className={`relative flex flex-col items-center p-1.5 rounded-xl cursor-pointer ${
                      winchPhase === 'idle' ? 'hover:bg-pink-500/10' : 'cursor-not-allowed'
                    }`}
                  >
                    {!isTargetOfWinch && (
                      <motion.div
                        animate={{ y: [0, -3, 0] }}
                        transition={{ repeat: Infinity, duration: 1.2, delay: Math.random() }}
                        className="flex flex-col items-center"
                      >
                        {/* Stranded Friend Emoji */}
                        <span className="text-2xl sm:text-3xl filter drop-shadow">{f.emoji}</span>
                        {/* Help Call Speechbubble */}
                        <div className="bg-pink-500 text-white font-sans font-black text-[7px] sm:text-[9px] px-1.5 py-0.5 rounded-full border border-white -mt-0.5 shadow-xs whitespace-nowrap animate-pulse">
                          たすけて！
                        </div>
                      </motion.div>
                    )}

                    {/* Placeholder space during active winching */}
                    {isTargetOfWinch && <div className="h-10 w-10 border-2 border-dashed border-pink-400/50 rounded-full animate-ping" />}
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* Progress and status details */}
          <div className="mt-3.5 flex items-center justify-between gap-3 font-sans shrink-0">
            <div className="flex-grow flex flex-col gap-1">
              <div className="flex justify-between text-xs font-extrabold text-slate-700 px-0.5">
                <span>きゅうじょの しんちょく (Progress):</span>
                <span className="text-pink-600 font-black">{successCount} / 3こレスキュー</span>
              </div>
              <div className="h-4 bg-slate-200 rounded-full overflow-hidden border border-slate-300 p-0.5 shadow-inner">
                <div
                  style={{ width: `${(successCount / 3) * 100}%` }}
                  className="h-full bg-gradient-to-r from-pink-400 to-pink-600 rounded-full transition-all duration-300 shadow flex items-center justify-end px-2"
                >
                  {successCount > 0 && (
                    <span className="text-[8px] font-black text-white">{Math.round((successCount / 3) * 100)}%</span>
                  )}
                </div>
              </div>
            </div>

            {/* Target Information */}
            <div className="bg-slate-800 text-white px-3 py-1.5 rounded-xl border border-slate-700 shadow-sm flex flex-col items-center justify-center shrink-0 max-w-[130px]">
              <span className="text-[8px] font-bold text-pink-300 leading-none">フライング救助</span>
              <span className="text-xs font-black text-pink-200 leading-tight truncate w-full text-center mt-0.5">{target.name.split(' (')[0]}</span>
            </div>
          </div>
        </div>

        {/* Stripes Bottom */}
        <div 
          className="h-3 w-full flex mt-auto" 
          style={{
            background: 'repeating-linear-gradient(45deg, #ec4899, #ec4899 12px, #fbcfe8 12px, #fbcfe8 24px)'
          }}
        />

        {/* Victory stamp modal */}
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
                {/* Stamp */}
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

                    {/* Paw Print */}
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
                  かんぺき！レスキューせいこう！
                </h4>
                <p className="text-xs font-bold text-white mb-5 leading-normal">
                  スカイのフライングきゅうじょで、こまっていたおともだちを全員（ぜんいん）ぶじに空からたすけたよ！
                </p>

                <motion.button
                  id="skye-panel-victory-continue-btn"
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
