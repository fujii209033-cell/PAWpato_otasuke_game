import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speech } from '../utils/speech';
import { CharacterId } from '../types';

interface SpeechBubbleProps {
  text: string;
  isSpeaking: boolean;
  onReplay?: () => void;
  characterId?: CharacterId;
}

export default function MarshallSpeechBubble({ text, isSpeaking, onReplay, characterId = 'marshall' }: SpeechBubbleProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Styling based on character
  const isChase = characterId === 'chase';
  const isSkye = characterId === 'skye';
  
  let labelText = "🚒 マーシャル (Marshall):";
  let labelColorClass = "text-red-500";
  let avatarBorderClass = "border-red-500";
  let bubbleBorderColor = "border-red-500";
  let bubbleShadowColor = "#ef4444";
  let buttonColorClass = "bg-rose-100 hover:bg-rose-200 text-rose-600 border-rose-200";

  if (isChase) {
    labelText = "🚓 チェイス (Chase):";
    labelColorClass = "text-blue-600";
    avatarBorderClass = "border-blue-600";
    bubbleBorderColor = "border-blue-600";
    bubbleShadowColor = "#2563eb";
    buttonColorClass = "bg-blue-100 hover:bg-blue-200 text-blue-600 border-blue-200";
  } else if (isSkye) {
    labelText = "🚁 スカイ (Skye):";
    labelColorClass = "text-pink-500";
    avatarBorderClass = "border-pink-500";
    bubbleBorderColor = "border-pink-500";
    bubbleShadowColor = "#ec4899";
    buttonColorClass = "bg-pink-100 hover:bg-pink-200 text-pink-600 border-pink-200";
  }

  const renderAvatarContent = (sizeClass: string = "w-full h-full") => {
    if (characterId === 'skye') {
      return (
        <svg viewBox="0 0 100 100" className={`${sizeClass} bg-pink-100 p-0.5 rounded-full`}>
          <defs>
            <linearGradient id="skye-skin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fed7aa" />
              <stop offset="100%" stopColor="#fca5a5" />
            </linearGradient>
            <linearGradient id="skye-ears" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>
          {/* Ears */}
          <ellipse cx="20" cy="55" rx="12" ry="24" fill="url(#skye-ears)" stroke="#7c2d12" strokeWidth="1" transform="rotate(15 20 55)" />
          <ellipse cx="80" cy="55" rx="12" ry="24" fill="url(#skye-ears)" stroke="#7c2d12" strokeWidth="1" transform="rotate(-15 80 55)" />
          {/* Inner ears */}
          <ellipse cx="20" cy="55" rx="7" ry="16" fill="#fca5a5" transform="rotate(15 20 55)" />
          <ellipse cx="80" cy="55" rx="7" ry="16" fill="#fca5a5" transform="rotate(-15 80 55)" />
          {/* Face Base */}
          <circle cx="50" cy="50" r="28" fill="url(#skye-skin)" stroke="#7c2d12" strokeWidth="1" />
          <ellipse cx="50" cy="58" rx="18" ry="14" fill="#ffedd5" />
          {/* Goggles on head (Pink flight cap details) */}
          <path d="M 28 32 C 28 18, 72 18, 72 32 Z" fill="#ec4899" stroke="#db2777" strokeWidth="1" />
          <rect x="35" y="22" width="12" height="10" rx="2" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
          <rect x="53" y="22" width="12" height="10" rx="2" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
          <line x1="47" y1="27" x2="53" y2="27" stroke="#475569" strokeWidth="2" />
          <rect x="25" y="28" width="50" height="4" fill="#db2777" />
          {/* Goggles strap */}
          <path d="M 24 32 L 28 32 Q 50 25, 72 32 L 76 32" stroke="#ec4899" strokeWidth="3" fill="none" />
          {/* Eyes */}
          <ellipse cx="38" cy="48" rx="5.5" ry="7.5" fill="#ffffff" stroke="#1e293b" strokeWidth="1" />
          <ellipse cx="38" cy="48" rx="3.5" ry="4.5" fill="#ec4899" />
          <circle cx="38" cy="48" r="2" fill="#1e293b" />
          <circle cx="36" cy="45" r="1" fill="#ffffff" />
          <ellipse cx="62" cy="48" rx="5.5" ry="7.5" fill="#ffffff" stroke="#1e293b" strokeWidth="1" />
          <ellipse cx="62" cy="48" rx="3.5" ry="4.5" fill="#ec4899" />
          <circle cx="62" cy="48" r="2" fill="#1e293b" />
          <circle cx="60" cy="45" r="1" fill="#ffffff" />
          {/* Eye lashes */}
          <path d="M 33 42 Q 35 38, 38 41" stroke="#1e293b" strokeWidth="1.5" fill="none" />
          <path d="M 67 42 Q 65 38, 62 41" stroke="#1e293b" strokeWidth="1.5" fill="none" />
          {/* Nose */}
          <ellipse cx="50" cy="54" rx="4.5" ry="3" fill="#1e293b" />
          {/* Smile */}
          <path d="M 43 59 Q 50 66, 57 59" fill="none" stroke="#7c2d12" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    }
    const avatarImg = characterId === 'chase' 
      ? "/src/assets/images/chase_face_only_1784068369473.jpg" 
      : "/src/assets/images/marshall_face_only_1784061084168.jpg";
    return (
      <img 
        src={avatarImg} 
        alt={`${characterId} Avatar`} 
        className={`${sizeClass} object-cover rounded-full select-none`}
        referrerPolicy="no-referrer"
      />
    );
  };

  return (
    <div id="speech-bubble-container" className="relative z-40 flex-shrink-0 flex items-center sm:items-end gap-2 sm:gap-3 max-w-2xl mx-auto my-1 sm:my-2 px-3 sm:px-4">
      {/* Character Vector Avatar */}
      <div 
        id="character-avatar" 
        className="relative flex-shrink-0 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onReplay}
      >
        <motion.div
          animate={isSpeaking ? {
            y: [0, -6, 0],
            rotate: [0, -2, 2, 0]
          } : isHovered ? {
            scale: 1.1,
            rotate: [0, -5, 5, 0]
          } : { scale: 1 }}
          transition={isSpeaking ? { repeat: Infinity, duration: 0.6 } : { duration: 0.3 }}
          className={`w-12 h-12 sm:w-16 sm:h-16 md:w-18 md:h-18 bg-white rounded-full border-2 sm:border-3 ${avatarBorderClass} shadow-md sm:shadow-lg overflow-hidden flex items-center justify-center`}
        >
          {/* Generated character face illustration */}
          {renderAvatarContent()}
        </motion.div>
        
        {/* Floating "Tap me" cue for narration play */}
        <div className="absolute -bottom-1 right-0 bg-yellow-400 text-slate-800 rounded-full px-1.5 py-0.5 text-[9px] font-bold shadow border border-white flex items-center gap-0.5">
          <Volume2 size={8} />
          こえ
        </div>
      </div>

      {/* Speech Bubble with Tri-color shadow */}
      <motion.div 
        id="character-speech-bubble"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        style={{
          boxShadow: `3px 3px 0px ${bubbleShadowColor}`
        }}
        className={`relative bg-white border-2 sm:border-3 ${bubbleBorderColor} rounded-xl sm:rounded-2xl p-2 sm:p-2.5 md:p-3 flex-grow select-none`}
      >
        {/* Bubble Triangle pointer */}
        <div className={`absolute left-[-12px] sm:left-[-16px] bottom-[15px] sm:bottom-[20px] w-0 h-0 border-y-[8px] sm:border-y-[12px] border-y-transparent border-r-[12px] sm:border-r-[16px] ${isChase ? 'border-r-blue-600' : isSkye ? 'border-r-pink-500' : 'border-r-red-500'}`}>
          <div className="absolute left-[3px] sm:left-[4px] top-[-6px] sm:top-[-9px] w-0 h-0 border-y-[6px] sm:border-y-[9px] border-y-transparent border-r-[9px] sm:border-r-[13px] border-r-white"></div>
        </div>

        {/* Content */}
        <div className="flex items-start justify-between gap-2">
          <div className="text-slate-800 font-bold text-xs sm:text-sm md:text-base tracking-wider leading-relaxed">
            <span className={`${labelColorClass} text-[10px] sm:text-xs md:text-sm flex items-center gap-1.5 mb-0.5 font-sans`}>
              {renderAvatarContent("w-4 h-4 rounded-full border border-pink-400 object-cover")}
              <span>{labelText}</span>
            </span>
            <div className="font-sans antialiased">
              {text}
            </div>
          </div>
          
          {onReplay && (
            <button 
              id="replay-btn"
              onClick={onReplay}
              className={`mt-0.5 rounded-full p-1 sm:p-2 flex-shrink-0 transition-all duration-200 ${buttonColorClass} active:scale-95`}
              title="もういちどきく"
            >
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

