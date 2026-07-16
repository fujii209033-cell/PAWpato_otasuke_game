import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Sparkles, Heart, HelpCircle, AlertCircle, Smile } from 'lucide-react';
import { CharacterId } from '../types';

interface FireItemProps {
  key?: string;
  id: string;
  x: number; // percentage (0 to 100)
  y: number; // percentage (0 to 100)
  size: number; // current health / trouble (0 to 100)
  maxSize: number; // scale modifier
  type: 'house' | 'tree' | 'car' | 'shop' | 'trash' | 'lost_kitten' | 'injured_boy' | 'lost_girl' | 'puppy_tree' | 'lost_keys' | 'trapped_high' | 'cliff_rescue' | 'tree_rescue' | 'rooftop_rescue' | 'balloon_rescue';
  name: string;
  isTargeted: boolean;
  onSelect: () => void;
  hp: number;
  maxHp: number;
  characterId?: CharacterId;
}

export default function FireItem({ id, x, y, size, maxSize, type, name, isTargeted, onSelect, hp, maxHp, characterId = 'marshall' }: FireItemProps) {
  const isExtinguished = size <= 0;
  const isRyderTargetable = !isExtinguished && hp <= maxHp * 0.5;

  const prevExtinguishedRef = React.useRef(isExtinguished);
  const [confettiParticles, setConfettiParticles] = React.useState<{ id: number; color: string; tx: number; ty: number; size: number; shape: 'circle' | 'square' | 'star'; delay: number; duration: number }[]>([]);

  React.useEffect(() => {
    if (!prevExtinguishedRef.current && isExtinguished) {
      // Create 24 colorful, sparkling particles that burst outwards
      const particles = Array.from({ length: 24 }).map((_, i) => {
        const angle = Math.random() * 2 * Math.PI;
        const distance = 40 + Math.random() * 80;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance - (30 + Math.random() * 50); // initial upward pop
        const color = [
          '#f43f5e', // rose
          '#3b82f6', // blue
          '#eab308', // yellow
          '#22c55e', // green
          '#a855f7', // purple
          '#06b6d4', // cyan
          '#f97316', // orange
          '#ff007f', // pink
          '#facc15'  // gold
        ][Math.floor(Math.random() * 9)];
        
        const shapes: ('circle' | 'square' | 'star')[] = ['circle', 'square', 'star'];
        const shape = shapes[Math.floor(Math.random() * 3)];
        const size = 8 + Math.random() * 12;
        const delay = Math.random() * 0.1;
        const duration = 1.0 + Math.random() * 1.2;

        return { id: i, color, tx, ty, size, shape, delay, duration };
      });
      setConfettiParticles(particles);

      const timer = setTimeout(() => {
        setConfettiParticles([]);
      }, 2500);
      return () => clearTimeout(timer);
    }
    prevExtinguishedRef.current = isExtinguished;
  }, [isExtinguished]);

  // Choose appropriate object graphic background based on type
  const renderObjectGraphic = () => {
    // Skye rescue specific icons
    if (characterId === 'skye') {
      if (type === 'trapped_high' || name.includes('すべり台') || name.includes('絶壁') || name.includes('展望台') || name.includes('ヘリポート')) {
        return (
          <svg viewBox="0 0 80 80" className="w-16 h-16 drop-shadow-md">
            {/* High Ledge/Structure */}
            <path d="M 10 75 L 30 45 L 50 45 L 70 75 Z" fill="#64748b" stroke="#334155" strokeWidth="2" />
            <rect x="26" y="40" width="28" height="6" fill="#475569" rx="1.5" />
            {/* Trapped Person */}
            <g transform="translate(40, 20)">
              <circle cx="0" cy="0" r="10" fill="#ffedd5" stroke="#7c2d12" strokeWidth="1.5" />
              <path d="M -8 -2 C -8 -10, 8 -10, 8 -2 Z" fill="#fb7185" />
              <circle cx="-3" cy="1" r="1" fill="#1e293b" />
              <circle cx="3" cy="1" r="1" fill="#1e293b" />
              {!isExtinguished ? (
                <>
                  <path d="M -3 4 Q 0 1 3 4" fill="none" stroke="#e11d48" strokeWidth="1.2" />
                  <path d="M -10 -2 Q -18 -12, -12 -16" fill="none" stroke="#ffedd5" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 10 -2 Q 18 -12, 12 -16" fill="none" stroke="#ffedd5" strokeWidth="2" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <path d="M -3 4 Q 0 8 3 4" fill="none" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="0" cy="14" r="7" fill="none" stroke="#ec4899" strokeWidth="2" strokeDasharray="3,2" />
                </>
              )}
            </g>
          </svg>
        );
      }
      if (type === 'cliff_rescue' || name.includes('坂の下') || name.includes('崖の下') || name.includes('階段の下')) {
        return (
          <svg viewBox="0 0 80 80" className="w-16 h-16 drop-shadow-md">
            {/* Steep Cliff */}
            <path d="M 0 10 L 45 10 L 35 75 L 0 75 Z" fill="#78716c" stroke="#44403c" strokeWidth="2" />
            {/* Climber at the bottom edge */}
            <g transform="translate(54, 52)">
              <circle cx="0" cy="0" r="10" fill="#ffedd5" stroke="#7c2d12" strokeWidth="1.5" />
              <circle cx="-3" cy="0" r="1" fill="#1e293b" />
              <circle cx="3" cy="0" r="1" fill="#1e293b" />
              {!isExtinguished ? (
                <>
                  <path d="M -3 4 Q 0 2 3 4" fill="none" stroke="#1e293b" strokeWidth="1" />
                  <path d="M -8 -2 Q -15 8, -12 12" fill="none" stroke="#ffedd5" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 8 -2 Q 15 -10, 12 -14" fill="none" stroke="#ffedd5" strokeWidth="2" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <path d="M -3 3 Q 0 7 3 3" fill="none" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
                  <rect x="-8" y="8" width="16" height="5" fill="#fbcfe8" stroke="#db2777" strokeWidth="1" rx="1" />
                </>
              )}
            </g>
          </svg>
        );
      }
      if (type === 'tree_rescue' || name.includes('木の上') || name.includes('街路樹')) {
        return (
          <svg viewBox="0 0 80 80" className="w-16 h-16 drop-shadow-md">
            {/* Tree Trunk & Branches */}
            <rect x="36" y="44" width="8" height="32" fill="#78350f" rx="1" />
            <ellipse cx="40" cy="34" rx="24" ry="20" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
            {/* Cute Kitten or bird stuck inside leaf area */}
            <g transform="translate(40, 26)">
              <circle cx="0" cy="0" r="9" fill={isExtinguished ? "#cbd5e1" : "#f59e0b"} stroke="#78350f" strokeWidth="1.2" />
              <polygon points="-8,-4 -12,-16 -4,-8" fill={isExtinguished ? "#94a3b8" : "#f59e0b"} stroke="#78350f" strokeWidth="1" />
              <polygon points="8,-4 12,-16 4,-8" fill={isExtinguished ? "#94a3b8" : "#f59e0b"} stroke="#78350f" strokeWidth="1" />
              <circle cx="-3.5" cy="-1" r="1.2" fill="#1e293b" />
              <circle cx="3.5" cy="-1" r="1.2" fill="#1e293b" />
              <polygon points="-1,2 1,2 0,4" fill="#f43f5e" />
              {!isExtinguished ? (
                <path d="M -4 4 Q 0 0 4 4" fill="none" stroke="#78350f" strokeWidth="1.2" />
              ) : (
                <path d="M -4 4 Q 0 7 4 4" fill="none" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
              )}
            </g>
          </svg>
        );
      }
      if (type === 'rooftop_rescue' || name.includes('屋根') || name.includes('テラス')) {
        return (
          <svg viewBox="0 0 80 80" className="w-16 h-16 drop-shadow-md">
            {/* Red sloped house roof */}
            <polygon points="10,65 40,25 70,65" fill="#f43f5e" stroke="#9d174d" strokeWidth="2" />
            {/* Cute animal or person stuck on roof peak */}
            <g transform="translate(40, 18)">
              <circle cx="0" cy="0" r="9" fill="#ffedd5" stroke="#7c2d12" strokeWidth="1.5" />
              <circle cx="-3" cy="0" r="1" fill="#1e293b" />
              <circle cx="3" cy="0" r="1" fill="#1e293b" />
              {!isExtinguished ? (
                <>
                  <path d="M -3 3 Q 0 0 3 3" fill="none" stroke="#7c2d12" strokeWidth="1.2" />
                  <path d="M -6 -8 Q -10 -15, -6 -18" fill="none" stroke="#ffedd5" strokeWidth="1.8" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <path d="M -3 3 Q 0 6 3 3" fill="none" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M -15 10 Q 0 16 15 10" stroke="#db2777" strokeWidth="2" fill="none" />
                </>
              )}
            </g>
          </svg>
        );
      }
      if (type === 'balloon_rescue' || name.includes('風船') || name.includes('浮いた')) {
        return (
          <svg viewBox="0 0 80 80" className="w-16 h-16 drop-shadow-md">
            {/* Strings of the balloons */}
            <line x1="40" y1="36" x2="40" y2="55" stroke="#475569" strokeWidth="1.5" />
            <line x1="32" y1="34" x2="40" y2="55" stroke="#475569" strokeWidth="1.2" />
            <line x1="48" y1="34" x2="40" y2="55" stroke="#475569" strokeWidth="1.2" />
            
            {/* Three colorful balloons */}
            <g>
              <ellipse cx="32" cy="24" rx="8" ry="11" fill="#f43f5e" stroke="#be123c" strokeWidth="1" />
              <ellipse cx="48" cy="24" rx="8" ry="11" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1" />
              <ellipse cx="40" cy="18" rx="9" ry="12" fill="#eab308" stroke="#a16207" strokeWidth="1" />
            </g>

            {/* Floating Kid/Animal holding the balloons */}
            <g transform="translate(40, 56)">
              <circle cx="0" cy="0" r="9" fill="#ffedd5" stroke="#7c2d12" strokeWidth="1.2" />
              <circle cx="-3" cy="-1" r="1" fill="#1e293b" />
              <circle cx="3" cy="-1" r="1" fill="#1e293b" />
              {!isExtinguished ? (
                <>
                  <path d="M -3 3 Q 0 0 3 3" fill="none" stroke="#7c2d12" strokeWidth="1" />
                  <rect x="-4" y="9" width="8" height="12" fill="#a855f7" rx="1" />
                  <line x1="-3" y1="21" x2="-5" y2="28" stroke="#ffedd5" strokeWidth="2" />
                  <line x1="3" y1="21" x2="5" y2="28" stroke="#ffedd5" strokeWidth="2" />
                </>
              ) : (
                <>
                  <path d="M -3 3 Q 0 6 3 3" fill="none" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M -8 10 L 8 10 M 0 10 L 0 -10" stroke="#db2777" strokeWidth="2" strokeDasharray="2,2" />
                </>
              )}
            </g>
          </svg>
        );
      }
    }

    // Chase rescue specific icons
    if (characterId === 'chase') {
      if (type === 'lost_kitten' || name.includes('ネコ') || name.includes('ねこ')) {
        return (
          <svg viewBox="0 0 80 80" className="w-16 h-16 drop-shadow-md">
            <circle cx="40" cy="45" r="22" fill={isExtinguished ? "#cbd5e1" : "#f59e0b"} stroke="#78350f" strokeWidth="2" />
            <polygon points="20,30 28,15 36,32" fill={isExtinguished ? "#94a3b8" : "#f59e0b"} stroke="#78350f" strokeWidth="2" />
            <polygon points="60,30 52,15 44,32" fill={isExtinguished ? "#94a3b8" : "#f59e0b"} stroke="#78350f" strokeWidth="2" />
            <polygon points="23,28 28,19 33,29" fill="#fca5a5" />
            <polygon points="57,28 52,19 47,29" fill="#fca5a5" />
            <circle cx="32" cy="42" r="3" fill="#1e293b" />
            <circle cx="48" cy="42" r="3" fill="#1e293b" />
            <circle cx="31" cy="41" r="1" fill="#ffffff" />
            <circle cx="47" cy="41" r="1" fill="#ffffff" />
            {!isExtinguished && (
              <path d="M 32 45 Q 30 52 28 50 M 48 45 Q 50 52 52 50" stroke="#38bdf8" strokeWidth="2" fill="none" strokeLinecap="round" />
            )}
            <polygon points="38,47 42,47 40,49" fill="#f43f5e" />
            <line x1="28" y1="48" x2="16" y2="46" stroke="#78350f" strokeWidth="1.5" />
            <line x1="28" y1="51" x2="18" y2="52" stroke="#78350f" strokeWidth="1.5" />
            <line x1="52" y1="48" x2="64" y2="46" stroke="#78350f" strokeWidth="1.5" />
            <line x1="52" y1="51" x2="62" y2="52" stroke="#78350f" strokeWidth="1.5" />
            {isExtinguished ? (
              <path d="M 36 52 Q 40 56 44 52" fill="none" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
            ) : (
              <path d="M 36 55 Q 40 52 44 55" fill="none" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
            )}
          </svg>
        );
      }
      if (type === 'injured_boy' || name.includes('おとこのこ') || name.includes('こども')) {
        return (
          <svg viewBox="0 0 80 80" className="w-16 h-16 drop-shadow-md">
            <circle cx="40" cy="40" r="22" fill="#ffedd5" stroke="#7c2d12" strokeWidth="2" />
            <path d="M 16 34 C 16 14, 64 14, 64 34 Q 40 18 16 34 Z" fill="#78350f" stroke="#451a03" strokeWidth="1" />
            <circle cx="32" cy="42" r="2.5" fill="#1e293b" />
            <circle cx="48" cy="42" r="2.5" fill="#1e293b" />
            {!isExtinguished ? (
              <>
                <path d="M 32 46 Q 30 52 28 50" stroke="#38bdf8" strokeWidth="2" fill="none" />
                <rect x="48" y="48" width="12" height="4" fill="#fde047" stroke="#ca8a04" strokeWidth="0.8" transform="rotate(30 54 50)" />
                <rect x="48" y="48" width="12" height="4" fill="#fde047" stroke="#ca8a04" strokeWidth="0.8" transform="rotate(-60 54 50)" />
                <path d="M 34 54 Q 40 50 46 54" fill="none" stroke="#7c2d12" strokeWidth="1.5" strokeLinecap="round" />
              </>
            ) : (
              <>
                <path d="M 34 50 Q 40 56 46 50" fill="none" stroke="#7c2d12" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="52" cy="48" r="2.5" fill="#f43f5e" opacity="0.6" />
              </>
            )}
          </svg>
        );
      }
      if (type === 'lost_girl' || name.includes('おんなのこ')) {
        return (
          <svg viewBox="0 0 80 80" className="w-16 h-16 drop-shadow-md">
            <circle cx="40" cy="40" r="22" fill="#ffedd5" stroke="#7c2d12" strokeWidth="2" />
            <path d="M 16 34 C 16 14, 64 14, 64 34 Q 40 18 16 34 Z" fill="#f472b6" stroke="#db2777" strokeWidth="1" />
            <circle cx="16" cy="38" r="7" fill="#f472b6" stroke="#db2777" strokeWidth="1" />
            <circle cx="64" cy="38" r="7" fill="#f472b6" stroke="#db2777" strokeWidth="1" />
            <rect x="14" y="28" width="5" height="5" fill="#e11d48" rx="1" />
            <rect x="61" y="28" width="5" height="5" fill="#e11d48" rx="1" />
            <circle cx="32" cy="42" r="2.5" fill="#1e293b" />
            <circle cx="48" cy="42" r="2.5" fill="#1e293b" />
            {!isExtinguished ? (
              <>
                <path d="M 48 46 Q 50 52 52 50" stroke="#38bdf8" strokeWidth="2" fill="none" />
                <path d="M 34 54 Q 40 50 46 54" fill="none" stroke="#7c2d12" strokeWidth="1.5" strokeLinecap="round" />
              </>
            ) : (
              <>
                <path d="M 34 50 Q 40 56 46 50" fill="none" stroke="#7c2d12" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="26" cy="48" r="2.5" fill="#f43f5e" opacity="0.6" />
                <circle cx="54" cy="48" r="2.5" fill="#f43f5e" opacity="0.6" />
              </>
            )}
          </svg>
        );
      }
      if (type === 'puppy_tree' || name.includes('いぬ') || name.includes('イヌ')) {
        return (
          <svg viewBox="0 0 80 80" className="w-16 h-16 drop-shadow-md">
            <circle cx="40" cy="42" r="22" fill={isExtinguished ? "#cbd5e1" : "#d97706"} stroke="#451a03" strokeWidth="2" />
            <path d="M 18 30 Q 12 45, 18 50 Z" fill={isExtinguished ? "#94a3b8" : "#92400e"} stroke="#451a03" strokeWidth="1.5" />
            <path d="M 62 30 Q 68 45, 62 50 Z" fill={isExtinguished ? "#94a3b8" : "#92400e"} stroke="#451a03" strokeWidth="1.5" />
            <ellipse cx="32" cy="38" rx="3" ry="4" fill="#ffffff" stroke="#1e293b" strokeWidth="1" />
            <circle cx="32" cy="38" r="1.5" fill="#1d4ed8" />
            <ellipse cx="48" cy="38" rx="3" ry="4" fill="#ffffff" stroke="#1e293b" strokeWidth="1" />
            <circle cx="48" cy="38" r="1.5" fill="#1d4ed8" />
            {!isExtinguished ? (
              <>
                <path d="M 32 43 Q 30 48 29 47" stroke="#38bdf8" strokeWidth="1.5" fill="none" />
                <path d="M 35 50 Q 40 47 45 50" fill="none" stroke="#451a03" strokeWidth="1.5" />
              </>
            ) : (
              <path d="M 34 47 Q 40 53 46 47" fill="none" stroke="#451a03" strokeWidth="1.5" strokeLinecap="round" />
            )}
            <ellipse cx="40" cy="43" rx="2" ry="1.2" fill="#1e293b" />
          </svg>
        );
      }
      if (type === 'lost_keys' || name.includes('カギ') || name.includes('かぎ')) {
        return (
          <svg viewBox="0 0 80 80" className="w-16 h-16 drop-shadow-md">
            <g transform="translate(15, 15)">
              <circle cx="25" cy="25" r="12" fill="none" stroke={isExtinguished ? "#94a3b8" : "#fbbf24"} strokeWidth="4" />
              <g transform="rotate(45 25 25)">
                <rect x="23" y="35" width="4" height="25" fill={isExtinguished ? "#cbd5e1" : "#f59e0b"} stroke="#78350f" strokeWidth="1" />
                <rect x="27" y="50" width="6" height="3" fill={isExtinguished ? "#cbd5e1" : "#f59e0b"} stroke="#78350f" strokeWidth="1" />
                <rect x="27" y="56" width="6" height="3" fill={isExtinguished ? "#cbd5e1" : "#f59e0b"} stroke="#78350f" strokeWidth="1" />
              </g>
              <g transform="rotate(-30 25 25)">
                <rect x="23" y="35" width="4" height="20" fill={isExtinguished ? "#94a3b8" : "#fbbf24"} stroke="#78350f" strokeWidth="1" />
                <rect x="27" y="44" width="4" height="2" fill={isExtinguished ? "#94a3b8" : "#fbbf24"} stroke="#78350f" strokeWidth="1" />
                <rect x="27" y="49" width="4" height="2" fill={isExtinguished ? "#94a3b8" : "#fbbf24"} stroke="#78350f" strokeWidth="1" />
              </g>
            </g>
          </svg>
        );
      }
    }

    // Custom Stage Name overrides for rich visuals
    if (name === 'キャンプのテント') {
      return (
        <svg viewBox="0 0 100 80" className="w-16 h-14 md:w-20 md:h-16 drop-shadow-md">
          <polygon points="10,70 50,15 90,70" fill={isExtinguished ? "#94a3b8" : "#fb923c"} stroke="#475569" strokeWidth="2.5" />
          <polygon points="35,70 50,35 65,70" fill={isExtinguished ? "#cbd5e1" : "#fdba74"} stroke="#475569" strokeWidth="2" />
          <rect x="47" y="55" width="6" height="15" fill="#475569" />
          {isExtinguished && (
            <g transform="translate(50, 48)">
              <circle cx="-5" cy="0" r="1.5" fill="#475569" />
              <circle cx="5" cy="0" r="1.5" fill="#475569" />
              <path d="M -4 3 Q 0 7 4 3" fill="none" stroke="#475569" strokeWidth="1" />
            </g>
          )}
        </svg>
      );
    }
    if (name === 'やまごや') {
      return (
        <svg viewBox="0 0 100 80" className="w-16 h-14 md:w-20 md:h-16 drop-shadow-md">
          <rect x="20" y="35" width="60" height="40" fill={isExtinguished ? "#94a3b8" : "#b45309"} stroke="#475569" strokeWidth="2.5" rx="2" />
          <line x1="20" y1="45" x2="80" y2="45" stroke="#78350f" strokeWidth="2" />
          <line x1="20" y1="55" x2="80" y2="55" stroke="#78350f" strokeWidth="2" />
          <line x1="20" y1="65" x2="80" y2="65" stroke="#78350f" strokeWidth="2" />
          <polygon points="10,35 50,10 90,35" fill={isExtinguished ? "#cbd5e1" : "#ef4444"} stroke="#475569" strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
      );
    }
    if (name === 'ロッジ') {
      return (
        <svg viewBox="0 0 100 80" className="w-16 h-14 md:w-20 md:h-16 drop-shadow-md">
          <polygon points="50,10 15,75 85,75" fill={isExtinguished ? "#cbd5e1" : "#d97706"} stroke="#475569" strokeWidth="2.5" />
          <polygon points="50,25 25,75 75,75" fill={isExtinguished ? "#94a3b8" : "#78350f"} stroke="#475569" strokeWidth="2" />
          <rect x="42" y="55" width="16" height="20" fill={isExtinguished ? "#cbd5e1" : "#fef08a"} stroke="#475569" strokeWidth="1.5" />
        </svg>
      );
    }
    if (name === 'あかいもみじ') {
      return (
        <svg viewBox="0 0 80 100" className="w-14 h-16 md:w-16 md:h-20 drop-shadow-md">
          <rect x="34" y="60" width="12" height="35" fill="#78350f" rx="2" />
          <ellipse cx="40" cy="40" rx="30" ry="25" fill={isExtinguished ? "#cbd5e1" : "#f97316"} stroke="#c2410c" strokeWidth="2.5" />
          <ellipse cx="25" cy="35" rx="18" ry="15" fill={isExtinguished ? "#e2e8f0" : "#ef4444"} />
          <ellipse cx="55" cy="42" rx="20" ry="16" fill={isExtinguished ? "#94a3b8" : "#ea580c"} />
        </svg>
      );
    }
    if (name === 'おおきなマツのき') {
      return (
        <svg viewBox="0 0 80 100" className="w-14 h-16 md:w-16 md:h-20 drop-shadow-md">
          <rect x="34" y="65" width="12" height="30" fill="#78350f" rx="2" />
          <polygon points="40,10 15,40 65,40" fill={isExtinguished ? "#cbd5e1" : "#15803d"} stroke="#14532d" strokeWidth="2.5" />
          <polygon points="40,30 10,65 70,65" fill={isExtinguished ? "#94a3b8" : "#166534"} stroke="#14532d" strokeWidth="2.5" />
        </svg>
      );
    }
    if (name === 'キャンピングカー') {
      return (
        <svg viewBox="0 0 100 60" className="w-16 h-12 md:w-20 md:h-14 drop-shadow-md">
          <circle cx="25" cy="46" r="10" fill="#1e293b" />
          <circle cx="25" cy="46" r="4" fill="#94a3b8" />
          <circle cx="75" cy="46" r="10" fill="#1e293b" />
          <circle cx="75" cy="46" r="4" fill="#94a3b8" />
          <rect x="10" y="14" width="80" height="28" fill={isExtinguished ? "#cbd5e1" : "#f8fafc"} stroke="#1e293b" strokeWidth="2.5" rx="4" />
          <rect x="15" y="18" width="16" height="12" fill="#bae6fd" stroke="#1e293b" strokeWidth="1.5" />
          <rect x="38" y="18" width="24" height="12" fill="#bae6fd" stroke="#1e293b" strokeWidth="1.5" />
          <rect x="68" y="18" width="16" height="12" fill="#bae6fd" stroke="#1e293b" strokeWidth="1.5" />
          <rect x="10" y="32" width="80" height="4" fill={isExtinguished ? "#94a3b8" : "#38bdf8"} />
        </svg>
      );
    }
    if (name === 'キャンプファイヤー') {
      return (
        <svg viewBox="0 0 60 80" className="w-10 h-12 md:w-12 md:h-16 drop-shadow-md">
          <rect x="10" y="45" width="40" height="10" fill="#78350f" rx="2" transform="rotate(15 30 50)" stroke="#475569" strokeWidth="1.5" />
          <rect x="10" y="45" width="40" height="10" fill="#92400e" rx="2" transform="rotate(-15 30 50)" stroke="#475569" strokeWidth="1.5" />
          <ellipse cx="30" cy="58" rx="20" ry="8" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
        </svg>
      );
    }
    if (name === 'ヤシのき' || name === 'ちいさなヤシのき') {
      return (
        <svg viewBox="0 0 80 100" className="w-14 h-16 md:w-16 md:h-20 drop-shadow-md">
          <path d="M 40 90 Q 35 60 40 30" stroke="#78350f" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M 40 30 Q 15 25 10 40" stroke={isExtinguished ? "#cbd5e1" : "#16a34a"} strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M 40 30 Q 25 15 20 10" stroke={isExtinguished ? "#e2e8f0" : "#22c55e"} strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M 40 30 Q 55 15 60 10" stroke={isExtinguished ? "#cbd5e1" : "#22c55e"} strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M 40 30 Q 65 25 70 40" stroke={isExtinguished ? "#cbd5e1" : "#16a34a"} strokeWidth="5" fill="none" strokeLinecap="round" />
          <circle cx="37" cy="33" r="4.5" fill="#451a03" />
          <circle cx="44" cy="31" r="4" fill="#451a03" />
        </svg>
      );
    }
    if (name === 'とうだい') {
      return (
        <svg viewBox="0 0 100 90" className="w-16 h-16 md:w-20 md:h-20 drop-shadow-md">
          <polygon points="35,80 40,25 60,25 65,80" fill="#f8fafc" stroke="#1e293b" strokeWidth="2.5" />
          <polygon points="37.5,60 39,40 61,40 62.5,60" fill={isExtinguished ? "#cbd5e1" : "#ef4444"} stroke="#1e293b" strokeWidth="1" />
          <rect x="42" y="10" width="16" height="15" fill={isExtinguished ? "#cbd5e1" : "#fef08a"} stroke="#1e293b" strokeWidth="2" />
          <polygon points="38,10 50,0 62,10" fill="#1e293b" />
          <rect x="38" y="22" width="24" height="4" fill="#1e293b" />
        </svg>
      );
    }
    if (name === 'うみのいえ') {
      return (
        <svg viewBox="0 0 100 80" className="w-16 h-14 md:w-20 md:h-16 drop-shadow-md">
          <rect x="20" y="35" width="60" height="40" fill={isExtinguished ? "#cbd5e1" : "#fef08a"} stroke="#475569" strokeWidth="2" rx="2" />
          <polygon points="10,35 50,8 90,35" fill={isExtinguished ? "#cbd5e1" : "#fbbf24"} stroke="#475569" strokeWidth="2" />
          <ellipse cx="30" cy="55" rx="6" ry="18" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
          <rect x="45" y="48" width="25" height="27" fill={isExtinguished ? "#cbd5e1" : "#f472b6"} />
        </svg>
      );
    }
    if (name === 'ヨット') {
      return (
        <svg viewBox="0 0 100 60" className="w-16 h-12 md:w-20 md:h-14 drop-shadow-md">
          <path d="M 10 40 Q 50 44 90 40 L 90 50 L 10 50 Z" fill="#38bdf8" opacity="0.6" />
          <path d="M 15 30 L 85 30 L 75 46 L 25 46 Z" fill={isExtinguished ? "#94a3b8" : "#f87171"} stroke="#1e293b" strokeWidth="2" />
          <line x1="50" y1="5" x2="50" y2="30" stroke="#1e293b" strokeWidth="2.5" />
          <polygon points="50,5 50,28 80,28" fill={isExtinguished ? "#cbd5e1" : "#f8fafc"} stroke="#1e293b" strokeWidth="1.5" />
          <polygon points="50,8 50,25 32,25" fill={isExtinguished ? "#e2e8f0" : "#38bdf8"} stroke="#1e293b" strokeWidth="1" />
        </svg>
      );
    }
    if (name === 'ビーチパラソル') {
      return (
        <svg viewBox="0 0 60 80" className="w-10 h-12 md:w-12 md:h-16 drop-shadow-md">
          <rect x="28" y="30" width="4" height="45" fill="#94a3b8" />
          <path d="M 10 30 Q 30 5 50 30 Z" fill={isExtinguished ? "#cbd5e1" : "#f43f5e"} stroke="#1e293b" strokeWidth="2" />
          <path d="M 20 30 Q 30 10 40 30" fill={isExtinguished ? "#cbd5e1" : "#f8fafc"} stroke="#1e293b" strokeWidth="1" />
        </svg>
      );
    }
    if (name === 'こうそうビル') {
      return (
        <svg viewBox="0 0 100 80" className="w-16 h-14 md:w-20 md:h-16 drop-shadow-md">
          <rect x="25" y="5" width="50" height="70" fill={isExtinguished ? "#cbd5e1" : "#475569"} stroke="#1e293b" strokeWidth="2.5" rx="2" />
          <rect x="32" y="12" width="8" height="8" fill={isExtinguished ? "#cbd5e1" : "#fef08a"} />
          <rect x="46" y="12" width="8" height="8" fill={isExtinguished ? "#cbd5e1" : "#fef08a"} />
          <rect x="60" y="12" width="8" height="8" fill={isExtinguished ? "#cbd5e1" : "#fef08a"} />
          <rect x="32" y="26" width="8" height="8" fill={isExtinguished ? "#cbd5e1" : "#fef08a"} />
          <rect x="46" y="26" width="8" height="8" fill={isExtinguished ? "#cbd5e1" : "#fef08a"} />
          <rect x="60" y="26" width="8" height="8" fill={isExtinguished ? "#cbd5e1" : "#fef08a"} />
          <rect x="32" y="40" width="8" height="8" fill={isExtinguished ? "#cbd5e1" : "#fef08a"} />
          <rect x="46" y="40" width="8" height="8" fill={isExtinguished ? "#cbd5e1" : "#fef08a"} />
          <rect x="60" y="40" width="8" height="8" fill={isExtinguished ? "#cbd5e1" : "#fef08a"} />
          <rect x="32" y="54" width="8" height="8" fill={isExtinguished ? "#cbd5e1" : "#fef08a"} />
          <rect x="46" y="54" width="8" height="8" fill={isExtinguished ? "#cbd5e1" : "#fef08a"} />
          <rect x="60" y="54" width="8" height="8" fill={isExtinguished ? "#cbd5e1" : "#fef08a"} />
        </svg>
      );
    }
    if (name === 'タワーマンション') {
      return (
        <svg viewBox="0 0 100 80" className="w-16 h-14 md:w-20 md:h-16 drop-shadow-md">
          <path d="M 30 75 L 35 10 Q 50 15 65 10 L 70 75 Z" fill={isExtinguished ? "#cbd5e1" : "#0284c7"} stroke="#1e293b" strokeWidth="2.5" />
          <line x1="50" y1="12" x2="50" y2="75" stroke="#e0f2fe" strokeWidth="2" strokeDasharray="3 3" />
        </svg>
      );
    }
    if (name === 'スポーツカー') {
      return (
        <svg viewBox="0 0 100 60" className="w-16 h-12 md:w-20 md:h-14 drop-shadow-md">
          <circle cx="28" cy="44" r="9" fill="#0f172a" />
          <circle cx="28" cy="44" r="3" fill="#cbd5e1" />
          <circle cx="72" cy="44" r="9" fill="#0f172a" />
          <circle cx="72" cy="44" r="3" fill="#cbd5e1" />
          <path d="M 12 36 L 22 24 L 62 20 L 88 28 L 92 36 L 90 42 L 12 42 Z" fill={isExtinguished ? "#94a3b8" : "#ec4899"} stroke="#0f172a" strokeWidth="2.5" />
          <rect x="8" y="24" width="10" height="4" fill="#0f172a" />
          <line x1="13" y1="28" x2="13" y2="36" stroke="#0f172a" strokeWidth="2" />
        </svg>
      );
    }
    if (name === 'デパート') {
      return (
        <svg viewBox="0 0 100 90" className="w-16 h-16 md:w-20 md:h-20 drop-shadow-md">
          <rect x="15" y="20" width="70" height="65" fill={isExtinguished ? "#e2e8f0" : "#a855f7"} stroke="#1e293b" strokeWidth="2.5" rx="3" />
          <rect x="25" y="30" width="50" height="25" fill="#cbd5e1" opacity="0.5" stroke="#1e293b" strokeWidth="1.5" />
          <rect x="38" y="62" width="24" height="23" fill="#cbd5e1" stroke="#1e293b" strokeWidth="2" />
        </svg>
      );
    }
    if (name === 'あかるいじどうはんばいき') {
      return (
        <svg viewBox="0 0 60 80" className="w-10 h-12 md:w-12 md:h-16 drop-shadow-md">
          <rect x="10" y="15" width="40" height="60" fill={isExtinguished ? "#cbd5e1" : "#3b82f6"} stroke="#1e293b" strokeWidth="2.5" rx="2" />
          <rect x="16" y="22" width="6" height="8" fill="#ef4444" />
          <rect x="24" y="22" width="6" height="8" fill="#38bdf8" />
          <rect x="32" y="22" width="6" height="8" fill="#22c55e" />
          <rect x="18" y="58" width="24" height="10" fill="#1e293b" rx="1" />
        </svg>
      );
    }

    // Default Fallbacks
    switch (type) {
      case 'house':
        return (
          <svg viewBox="0 0 100 80" className="w-16 h-14 md:w-20 md:h-16 drop-shadow-md">
            {/* House body */}
            <rect x="20" y="35" width="60" height="40" fill={isExtinguished ? "#cbd5e1" : "#fef08a"} stroke="#475569" strokeWidth="2.5" rx="3" />
            {/* Roof */}
            <polygon points="10,35 50,10 90,35" fill={isExtinguished ? "#94a3b8" : "#f87171"} stroke="#475569" strokeWidth="2.5" strokeLinejoin="round" />
            {/* Door */}
            <rect x="42" y="52" width="16" height="23" fill={isExtinguished ? "#94a3b8" : "#b45309"} />
            <circle cx="46" cy="63" r="1.5" fill="#facc15" />
            {/* Window */}
            <rect x="28" y="42" width="12" height="12" fill="#bae6fd" stroke="#475569" strokeWidth="1.5" rx="1" />
            <rect x="60" y="42" width="12" height="12" fill="#bae6fd" stroke="#475569" strokeWidth="1.5" rx="1" />
            {/* Happy Face when safe */}
            {isExtinguished && (
              <g transform="translate(50, 43)">
                <circle cx="-10" cy="0" r="1.5" fill="#475569" />
                <circle cx="10" cy="0" r="1.5" fill="#475569" />
                <path d="M -8 5 Q 0 12 8 5" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
              </g>
            )}
          </svg>
        );
      case 'tree':
        return (
          <svg viewBox="0 0 80 100" className="w-14 h-16 md:w-16 md:h-20 drop-shadow-md">
            {/* Trunk */}
            <rect x="34" y="60" width="12" height="35" fill="#78350f" rx="2" />
            {/* Leaves */}
            <ellipse cx="40" cy="40" rx="30" ry="25" fill={isExtinguished ? "#86efac" : "#22c55e"} stroke="#15803d" strokeWidth="2.5" />
            <ellipse cx="25" cy="35" rx="18" ry="15" fill={isExtinguished ? "#4ade80" : "#4ade80"} />
            <ellipse cx="55" cy="42" rx="20" ry="16" fill={isExtinguished ? "#22c55e" : "#16a34a"} />
            {/* Happy Face when safe */}
            {isExtinguished && (
              <g transform="translate(40, 38)">
                <circle cx="-8" cy="0" r="1.5" fill="#14532d" />
                <circle cx="8" cy="0" r="1.5" fill="#14532d" />
                <path d="M -6 5 Q 0 10 6 5" fill="none" stroke="#14532d" strokeWidth="2" strokeLinecap="round" />
              </g>
            )}
          </svg>
        );
      case 'car':
        return (
          <svg viewBox="0 0 100 60" className="w-16 h-12 md:w-20 md:h-14 drop-shadow-md">
            {/* Wheels */}
            <circle cx="30" cy="46" r="10" fill="#1e293b" />
            <circle cx="30" cy="46" r="4" fill="#94a3b8" />
            <circle cx="70" cy="46" r="10" fill="#1e293b" />
            <circle cx="70" cy="46" r="4" fill="#94a3b8" />
            {/* Car body */}
            <path 
              d="M 10 36 L 15 24 C 18 16, 32 14, 45 14 L 70 14 C 78 14, 88 18, 92 28 L 95 36 Q 98 42, 90 42 L 15 42 Q 8 42, 10 36 Z" 
              fill={isExtinguished ? "#94a3b8" : "#3b82f6"} 
              stroke="#1e293b" 
              strokeWidth="2.5" 
            />
            {/* Window */}
            <path d="M 32 18 L 50 18 L 50 28 L 24 28 Z" fill="#e0f2fe" stroke="#1e293b" strokeWidth="1.5" />
            <path d="M 54 18 L 68 18 L 74 28 L 54 28 Z" fill="#e0f2fe" stroke="#1e293b" strokeWidth="1.5" />
            {/* Eyes on windshield when safe */}
            {isExtinguished && (
              <g transform="translate(42, 23)">
                <circle cx="-6" cy="0" r="1" fill="#1e293b" />
                <circle cx="6" cy="0" r="1" fill="#1e293b" />
              </g>
            )}
          </svg>
        );
      case 'shop':
        return (
          <svg viewBox="0 0 100 90" className="w-16 h-16 md:w-20 md:h-20 drop-shadow-md">
            {/* Shop base */}
            <rect x="15" y="35" width="70" height="50" fill={isExtinguished ? "#e2e8f0" : "#fbcfe8"} stroke="#475569" strokeWidth="2.5" rx="2" />
            {/* Awning stripes */}
            <path d="M 10 35 L 20 20 L 30 35" fill="#f43f5e" stroke="#475569" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M 30 35 L 40 20 L 50 35" fill="#ffffff" stroke="#475569" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M 50 35 L 60 20 L 70 35" fill="#f43f5e" stroke="#475569" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M 70 35 L 80 20 L 90 35" fill="#ffffff" stroke="#475569" strokeWidth="2.5" strokeLinejoin="round" />
            {/* Window glass */}
            <rect x="25" y="48" width="20" height="25" fill="#e0f2fe" stroke="#475569" strokeWidth="1.5" rx="1" />
            {/* Door */}
            <rect x="52" y="48" width="22" height="37" fill={isExtinguished ? "#cbd5e1" : "#f472b6"} stroke="#475569" strokeWidth="1.5" />
            {/* Smile when safe */}
            {isExtinguished && (
              <g transform="translate(35, 58)">
                <circle cx="-5" cy="0" r="1" fill="#475569" />
                <circle cx="5" cy="0" r="1" fill="#475569" />
                <path d="M -4 4 Q 0 8 4 4" fill="none" stroke="#475569" strokeWidth="1.5" />
              </g>
            )}
          </svg>
        );
      case 'trash':
      default:
        return (
          <svg viewBox="0 0 60 80" className="w-10 h-12 md:w-12 md:h-16 drop-shadow-md">
            {/* Trash Bin */}
            <path d="M 10 20 L 15 70 C 15 72, 45 72, 45 70 L 50 20 Z" fill={isExtinguished ? "#cbd5e1" : "#fbbf24"} stroke="#475569" strokeWidth="2" />
            {/* Lid */}
            <rect x="6" y="12" width="48" height="8" fill={isExtinguished ? "#94a3b8" : "#f59e0b"} stroke="#475569" strokeWidth="2" rx="2" />
            {/* Handle */}
            <path d="M 22 12 Q 30 4 38 12" fill="none" stroke="#475569" strokeWidth="2" />
            {/* Smile when safe */}
            {isExtinguished && (
              <g transform="translate(30, 42)">
                <circle cx="-6" cy="0" r="1.2" fill="#78350f" />
                <circle cx="6" cy="0" r="1.2" fill="#78350f" />
                <path d="M -4 4 Q 0 8 4 4" fill="none" stroke="#78350f" strokeWidth="1.5" />
              </g>
            )}
          </svg>
        );
    }
  };

  const isChase = characterId === 'chase';

  return (
    <div
      id={`fire-item-${id}`}
      style={{ left: `${x}%`, top: `${y}%` }}
      onClick={() => {
        if (!isExtinguished) {
          onSelect();
        }
      }}
      className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer select-none z-10 flex flex-col items-center justify-center p-2 group scale-[0.62] sm:scale-100 transition-transform duration-200`}
    >
      {/* Ryder Targetable Badge */}
      {isRyderTargetable && (
        <motion.div
          animate={{ scale: [0.9, 1.05, 0.9], y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute -top-10 bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-cyan-200 shadow-md flex items-center gap-1 z-30 whitespace-nowrap"
        >
          <Sparkles size={10} className="text-yellow-300 animate-spin" />
          <span>{isChase ? 'ケントがおたすけするよ！🌟' : 'ケントが けせるよ！🌟'}</span>
        </motion.div>
      )}

      {/* Targeted Ring Indicator */}
      {isTargeted && !isExtinguished && (
        <motion.div
          animate={{ scale: [0.95, 1.15, 0.95] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className={`absolute inset-0 rounded-full border-4 border-dashed ${isChase ? 'border-yellow-400' : 'border-sky-400'} opacity-60 w-24 h-24 -ml-2`}
        />
      )}

      {/* Object Graphic with wiggle if burning */}
      <motion.div
        animate={!isExtinguished ? {
          y: [0, -3, 0],
          rotate: [-1, 1, -1]
        } : { scale: 1.05 }}
        transition={!isExtinguished ? { repeat: Infinity, duration: 1.2 } : { duration: 0.3 }}
        className="relative"
      >
        {renderObjectGraphic()}

        {/* Extinguishing Steam / Water splashing particles or Chase's Helping Hand */}
        {isTargeted && !isExtinguished && (
          characterId === 'skye' ? (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              {/* Pink sweet glowing pulse */}
              <motion.div 
                className="absolute w-16 h-16 bg-pink-300 rounded-full opacity-35 blur-md"
                animate={{ scale: [0.8, 1.7], opacity: [0.4, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
              />
              {/* Fluttering butterflies/hearts */}
              <motion.div
                className="absolute text-pink-500 font-sans"
                initial={{ y: 20, scale: 0.5, opacity: 0 }}
                animate={{ y: [-10, -45], x: [0, -10, 5], scale: [0.5, 1.3, 0.8], opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1.1, ease: "easeOut" }}
              >
                🌸
              </motion.div>
              <motion.div
                className="absolute text-pink-400 font-sans"
                initial={{ y: 15, scale: 0.4, opacity: 0 }}
                animate={{ y: [-5, -40], x: [10, -5, 10], scale: [0.4, 1.1, 0.6], opacity: [0, 0.9, 0] }}
                transition={{ repeat: Infinity, duration: 1.3, ease: "easeOut", delay: 0.25 }}
              >
                💖
              </motion.div>
              {/* Skye's Helicopter Rescue Winch Basket / Harness */}
              <motion.div
                animate={{
                  y: [-30, 2, -30],
                }}
                transition={{ repeat: Infinity, duration: 2.0, ease: "easeInOut" }}
                className="absolute flex flex-col items-center justify-center"
              >
                {/* Rope line */}
                <div className="w-0.5 h-16 bg-pink-400 opacity-80" />
                {/* Tiny rescue harness / ring */}
                <div className="w-8 h-4 rounded-full border-2 border-pink-500 bg-pink-100 flex items-center justify-center shadow-md -mt-1">
                  <span className="text-[10px] filter drop-shadow font-black text-pink-600">🚁</span>
                </div>
              </motion.div>
            </div>
          ) : isChase ? (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              {/* Outer soft golden pulse */}
              <motion.div 
                className="absolute w-16 h-16 bg-yellow-300 rounded-full opacity-30 blur-md"
                animate={{ scale: [0.8, 1.6], opacity: [0.4, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
              />
              {/* Gentle floating hearts */}
              <motion.div
                className="absolute text-rose-500 font-sans"
                initial={{ y: 20, scale: 0.5, opacity: 0 }}
                animate={{ y: [-10, -40], scale: [0.5, 1.2, 0.8], opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "easeOut" }}
              >
                💖
              </motion.div>
              <motion.div
                className="absolute text-yellow-400 font-sans"
                initial={{ y: 10, scale: 0.4, opacity: 0 }}
                animate={{ y: [-5, -35], x: [-15, 15], scale: [0.4, 1.0, 0.5], opacity: [0, 0.9, 0] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: "easeOut", delay: 0.3 }}
              >
                ✨
              </motion.div>
              {/* Reaching Helping Hand visual */}
              <motion.div
                animate={{
                  scale: [1, 1.25, 1],
                  y: [4, -8, 4],
                }}
                transition={{ repeat: Infinity, duration: 1.0, ease: "easeInOut" }}
                className="relative flex items-center justify-center bg-white/95 rounded-full p-2 border-2 border-yellow-400 shadow-lg"
              >
                <span className="text-xl sm:text-2xl filter drop-shadow">🤝</span>
                <span className="absolute -top-1 -right-1 text-[8px] bg-red-500 text-white font-black px-1 rounded-full animate-bounce">HELP</span>
              </motion.div>
            </div>
          ) : (
            <div className="absolute inset-x-0 top-0 flex justify-center">
              {/* Animated Splash circles */}
              <motion.div 
                className="absolute w-12 h-12 bg-sky-200 rounded-full opacity-40 blur-sm"
                animate={{ scale: [0.5, 1.5], opacity: [0.6, 0] }}
                transition={{ repeat: Infinity, duration: 0.4 }}
              />
              <motion.div 
                className="absolute w-14 h-14 bg-white rounded-full opacity-50 blur-xs"
                animate={{ scale: [0.3, 1.3], opacity: [0.5, 0] }}
                transition={{ repeat: Infinity, duration: 0.3, delay: 0.15 }}
              />
            </div>
          )
        )}

        {/* Animated Fire overlay if burning */}
        <AnimatePresence>
          {!isExtinguished && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: maxSize * (0.4 + (size / 100) * 0.7), opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute top-[-30px] left-1/2 -translate-x-1/2 z-10 pointer-events-none origin-bottom flex flex-col items-center"
            >
              {characterId === 'skye' ? (
                /* Pulsing Pink HELP distress cloud for Skye Mode */
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.15, 0.95, 1.1, 1],
                      y: [0, -4, 2, -2, 0]
                    }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 border-2 border-white shadow-[0_0_15px_rgba(236,72,153,0.6)] flex items-center justify-center text-white font-black text-[10px] font-sans select-none"
                  >
                    たすけて!
                  </motion.div>
                  <motion.div
                    className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-pink-500 rounded-full border border-white"
                    animate={{ scale: [0.7, 1.2, 0.7] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                  />
                </div>
              ) : isChase ? (
                /* Pulsing SOS help cloud for Chase Mode */
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.15, 0.95, 1.1, 1],
                      y: [0, -4, 2, -2, 0]
                    }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 border-2 border-white shadow-[0_0_15px_rgba(245,158,11,0.6)] flex items-center justify-center text-white font-black text-xs font-mono select-none"
                  >
                    SOS!
                  </motion.div>
                  <motion.div
                    className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border border-white"
                    animate={{ scale: [0.7, 1.2, 0.7] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                  />
                </div>
              ) : characterId === 'rubble' ? (
                /* Debris pile and barricade animation for Rubble Mode */
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 0.95, 1.05, 1],
                      rotate: [-2, 2, -1, 1, -2]
                    }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                    className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 border-2 border-slate-800 rounded-lg shadow-[0_0_12px_rgba(217,119,6,0.6)] flex flex-col items-center justify-center select-none p-1"
                  >
                    <div className="text-[8px] font-black text-white leading-none mb-1 text-center bg-slate-900/40 px-1 rounded">がれき</div>
                    <span className="text-base">🪨🚧</span>
                  </motion.div>
                  <motion.div
                    className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border border-slate-950 flex items-center justify-center font-bold text-[8px] text-slate-950"
                    animate={{ scale: [0.8, 1.2, 0.8] }}
                    transition={{ repeat: Infinity, duration: 1.0 }}
                  >
                    ⚠️
                  </motion.div>
                </div>
              ) : (
                /* Flame animation for Marshall Mode */
                <div className="relative w-14 h-14">
                  <motion.div
                    animate={{
                      scaleY: [1, 1.15, 0.9, 1.1, 1],
                      scaleX: [1, 0.9, 1.1, 0.95, 1],
                      skewX: [-4, 4, -2, 2, -4]
                    }}
                    transition={{ repeat: Infinity, duration: 0.4 + Math.random() * 0.2, ease: 'easeInOut' }}
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-12 bg-red-500 rounded-b-full rounded-t-[80%] origin-bottom shadow-[0_0_15px_#f97316] flex items-end justify-center"
                  >
                    {/* Inside orange flame */}
                    <motion.div 
                      className="w-7 h-9 bg-amber-500 rounded-b-full rounded-t-[80%] origin-bottom"
                      animate={{ scaleY: [1, 1.2, 0.85, 1] }}
                      transition={{ repeat: Infinity, duration: 0.3, delay: 0.1 }}
                    />
                    {/* Innermost yellow core */}
                    <motion.div 
                      className="absolute bottom-1 w-4 h-6 bg-yellow-300 rounded-b-full rounded-t-[80%] origin-bottom"
                      animate={{ scaleY: [1, 1.1, 0.9, 1] }}
                      transition={{ repeat: Infinity, duration: 0.2, delay: 0.05 }}
                    />
                  </motion.div>
                  
                  {/* Floating Sparks */}
                  <motion.div
                    className="absolute top-2 left-3 w-1.5 h-1.5 bg-yellow-400 rounded-full"
                    animate={{ y: [0, -25], x: [0, -10], opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                  />
                  <motion.div
                    className="absolute top-1 right-3 w-1.5 h-1.5 bg-amber-400 rounded-full"
                    animate={{ y: [0, -30], x: [0, 8], opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.7, delay: 0.25 }}
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Steam / smoke cloud rising from extinguished fire */}
        {isExtinguished && (
          <motion.div
            initial={{ y: 0, opacity: 1, scale: 0.8 }}
            animate={{ y: -30, opacity: 0, scale: 1.5 }}
            transition={{ duration: 1.2 }}
            className="absolute top-[-20px] left-1/2 -translate-x-1/2 text-slate-300 pointer-events-none flex items-center justify-center"
          >
            {/* White steam cloud puffs */}
            <div className="w-8 h-8 bg-slate-100 rounded-full filter blur-xs opacity-60" />
            <div className="w-6 h-6 bg-white rounded-full filter blur-xs opacity-75 -ml-3" />
          </motion.div>
        )}

        {/* Shiny stars sparkling when safe */}
        {isExtinguished && (
          <div className="absolute top-[-25px] left-1/2 -translate-x-1/2 flex gap-1 text-yellow-400 pointer-events-none">
            <motion.div animate={{ scale: [1, 1.4, 1], rotate: 360 }} transition={{ repeat: Infinity, duration: 2 }}>
              <Sparkles className="w-4 h-4 fill-yellow-400" />
            </motion.div>
            <motion.div animate={{ scale: [1.3, 0.9, 1.3], rotate: -180 }} transition={{ repeat: Infinity, duration: 1.8, delay: 0.4 }}>
              <Sparkles className="w-3 h-3 fill-yellow-400" />
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Real-time Fire Health / Extinguishing Progress Meter */}
      {!isExtinguished && (
        <div className="flex flex-col gap-1 mt-1 bg-slate-900/80 p-1.5 rounded-lg border border-slate-700/50 shadow">
          {/* Fire size (Flame) / Rescue progress */}
          <div className="text-[9px] text-white flex items-center gap-1 font-bold font-sans">
            {characterId === 'chase' ? (
              <>
                <HelpCircle size={10} className="text-yellow-400 animate-pulse" />
                <div className="w-12 bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${size}%` }} 
                    className="h-full transition-all duration-100 bg-yellow-400"
                  />
                </div>
                <span className="text-[8px] text-yellow-200 font-mono w-6 text-right">{Math.ceil(size)}%</span>
              </>
            ) : characterId === 'skye' ? (
              <>
                <Heart size={10} className="text-pink-400 animate-pulse fill-pink-400" />
                <div className="w-12 bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${size}%` }} 
                    className="h-full transition-all duration-100 bg-pink-400"
                  />
                </div>
                <span className="text-[8px] text-pink-200 font-mono w-6 text-right">{Math.ceil(size)}%</span>
              </>
            ) : characterId === 'rubble' ? (
              <>
                <AlertCircle size={10} className="text-amber-400 animate-pulse" />
                <div className="w-12 bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${size}%` }} 
                    className="h-full transition-all duration-100 bg-amber-500"
                  />
                </div>
                <span className="text-[8px] text-amber-200 font-mono w-6 text-right">{Math.ceil(size)}%</span>
              </>
            ) : (
              <>
                <Flame size={10} className="text-red-400 animate-pulse fill-red-400" />
                <div className="w-12 bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${size}%` }} 
                    className={`h-full transition-all duration-100 ${size > 50 ? 'bg-red-500' : 'bg-amber-400'}`}
                  />
                </div>
                <span className="text-[8px] text-sky-200 font-mono w-6 text-right">{Math.ceil(size)}%</span>
              </>
            )}
          </div>
          
          {/* Building Durability (Heart HP) / Citizen Energy */}
          <div className="text-[9px] text-white flex items-center gap-1 font-bold font-sans">
            {characterId === 'chase' ? (
              <>
                <Smile size={10} className="text-indigo-400 animate-pulse" />
                <div className="w-12 bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${(hp / maxHp) * 100}%` }} 
                    className="h-full bg-indigo-400 transition-all duration-100"
                  />
                </div>
                <span className="text-[8px] text-indigo-200 font-mono w-6 text-right">{Math.max(0, Math.ceil(hp))}</span>
              </>
            ) : characterId === 'skye' ? (
              <>
                <Smile size={10} className="text-emerald-400 animate-pulse" />
                <div className="w-12 bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${(hp / maxHp) * 100}%` }} 
                    className="h-full bg-emerald-400 transition-all duration-100"
                  />
                </div>
                <span className="text-[8px] text-emerald-200 font-mono w-6 text-right">{Math.max(0, Math.ceil(hp))}</span>
              </>
            ) : characterId === 'rubble' ? (
              <>
                <Smile size={10} className="text-yellow-400 animate-pulse" />
                <div className="w-12 bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${(hp / maxHp) * 100}%` }} 
                    className="h-full bg-yellow-500 transition-all duration-100"
                  />
                </div>
                <span className="text-[8px] text-yellow-200 font-mono w-6 text-right">{Math.max(0, Math.ceil(hp))}</span>
              </>
            ) : (
              <>
                <Heart size={10} className="text-rose-400 animate-pulse fill-rose-400" />
                <div className="w-12 bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${(hp / maxHp) * 100}%` }} 
                    className="h-full bg-rose-500 transition-all duration-100"
                  />
                </div>
                <span className="text-[8px] text-rose-200 font-mono w-6 text-right">{Math.max(0, Math.ceil(hp))}</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Extinguished Ribbon */}
      {isExtinguished && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mt-1 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow border border-green-300 flex items-center gap-0.5"
        >
          <span>
            {characterId === 'chase'
              ? 'おたすけ完了! 🚨'
              : characterId === 'skye'
              ? 'きゅうじょ完了! 🚁'
              : characterId === 'rubble'
              ? 'かたづけ完了! 🚧'
              : 'あんぜん! 🚒'}
          </span>
        </motion.div>
      )}

      {/* Hiragana Vocabulary Label */}
      <span className="mt-1.5 text-xs font-black text-slate-800 bg-white/90 px-2 py-0.5 rounded-md shadow-xs border border-slate-300 font-sans tracking-wide">
        {name}
      </span>

      {/* Bursting Confetti & Glitter Particles on Extinguishment */}
      {confettiParticles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
          animate={{
            x: p.tx,
            y: p.ty + 80, // Falling down mimicking gravity
            scale: [0, 1.3, 1, 0],
            opacity: [1, 1, 0.8, 0],
            rotate: [0, Math.random() * 720 - 360]
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: [0.12, 0.85, 0.3, 1] // Custom snappy blast curve
          }}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.shape !== 'star' ? p.color : undefined,
            borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'square' ? '2px' : undefined,
            zIndex: 40,
            pointerEvents: 'none'
          }}
          className="shadow-xs flex items-center justify-center"
        >
          {p.shape === 'star' && (
            <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-sm animate-pulse" style={{ fill: p.color }}>
              <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192z" />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
}
