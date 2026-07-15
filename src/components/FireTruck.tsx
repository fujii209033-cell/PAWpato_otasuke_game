import React from 'react';
import { motion } from 'motion/react';
import { CharacterId } from '../types';

interface FireTruckProps {
  xPercent: number; // 0 to 100 representing horizontal position on the road
  isMoving: boolean;
  isSpraying: boolean;
  angleToFire: number; // Angle to rotate the water hose nozzle / helper launcher
  onNozzleClick?: () => void;
  characterId?: CharacterId;
}

export default function FireTruck({ xPercent, isMoving, isSpraying, angleToFire, onNozzleClick, characterId = 'marshall' }: FireTruckProps) {
  const isChase = characterId === 'chase';
  const isSkye = characterId === 'skye';
  const isRubble = characterId === 'rubble';

  return (
    <motion.div
      id="rescue-vehicle"
      animate={{ 
        left: `${xPercent}%`,
        y: isSkye ? [0, -6, 0] : 0
      }}
      transition={{ 
        left: { type: 'spring', stiffness: 80, damping: 15 },
        y: isSkye ? { repeat: Infinity, duration: 1.5, ease: 'easeInOut' } : {}
      }}
      className={`absolute ${isSkye ? 'bottom-[12%]' : 'bottom-[2%]'} w-[110px] h-[75px] -ml-[55px] sm:w-[160px] sm:h-[105px] sm:-ml-[80px] md:w-[200px] md:h-[130px] md:-ml-[100px] select-none z-20 pointer-events-none`}
    >
      {/* Blue & Red Siren Light Effect Glow */}
      {isMoving && (
        <div className={`absolute top-[-15px] left-[65%] w-16 h-16 ${isSkye ? 'bg-pink-500/25' : isChase ? 'bg-blue-600/35' : 'bg-red-500/20'} rounded-full blur-lg animate-pulse`} />
      )}
      {isSpraying && (
        <div className={`absolute top-[-15px] left-[40%] w-16 h-16 ${isSkye ? 'bg-pink-400/25' : isChase ? 'bg-yellow-400/25' : 'bg-sky-400/20'} rounded-full blur-lg animate-pulse`} />
      )}
      
      {/* Main Vehicle SVG */}
      <svg viewBox="0 0 150 100" className="w-full h-full overflow-visible">
        {/* Exhaust smoke when driving */}
        {isMoving && !isSkye && (
          <g>
            <motion.circle 
              cx="4" cy="76" r="4.5" fill="#cbd5e1" opacity="0.8" 
              animate={{ x: [-12, -28], y: [-6, -18], scale: [1, 2.3], opacity: [0.8, 0] }}
              transition={{ repeat: Infinity, duration: 0.55, delay: 0 }}
            />
            <motion.circle 
              cx="4" cy="76" r="3.5" fill="#94a3b8" opacity="0.6" 
              animate={{ x: [-10, -22], y: [1, -10], scale: [1, 1.9], opacity: [0.6, 0] }}
              transition={{ repeat: Infinity, duration: 0.45, delay: 0.12 }}
            />
          </g>
        )}

        {isSkye ? (
          // ==================== SKYE'S HIGH-TECH HELICOPTER ====================
          <>
             {/* Tail Boom and Tail Rotor */}
             <path d="M 44 50 L 12 40 L 14 30 L 44 46 Z" fill="#ec4899" stroke="#db2777" strokeWidth="2" />
             <rect x="8" y="24" width="4" height="24" fill="#64748b" rx="1" />
             {/* Spinning Tail Rotor blades */}
             <motion.g
               transform="translate(10, 36)"
               animate={{ rotate: -360 }}
               transition={{ repeat: Infinity, duration: 0.2, ease: 'linear' }}
             >
               <line x1="-12" y1="0" x2="12" y2="0" stroke="#f1f5f9" strokeWidth="2.5" />
               <line x1="0" y1="-12" x2="0" y2="12" stroke="#f1f5f9" strokeWidth="2.5" />
               <circle cx="0" cy="0" r="3.5" fill="#db2777" />
             </motion.g>

             {/* Helicopter Main Body (Egg-shaped sleek aviation capsule) */}
             <path 
               d="M 38 68 C 38 46, 52 38, 76 38 C 104 38, 126 44, 128 58 C 130 70, 114 78, 76 78 C 48 78, 38 74, 38 68 Z" 
               fill="#fbcfe8" 
               stroke="#db2777" 
               strokeWidth="2.5" 
             />
             {/* Secondary magenta accents on body */}
             <path d="M 68 39 C 84 39, 108 44, 114 54 C 114 54, 94 62, 68 54 Z" fill="#ec4899" opacity="0.8" />

             {/* Landing Skids (Helicopter skids instead of wheels) */}
             <g>
               {/* Skid supports */}
               <line x1="58" y1="78" x2="48" y2="92" stroke="#64748b" strokeWidth="3" />
               <line x1="94" y1="78" x2="104" y2="92" stroke="#64748b" strokeWidth="3" />
               {/* Horizontal skid runner bar */}
               <rect x="34" y="90" width="86" height="4.5" fill="#475569" rx="2.5" stroke="#334155" strokeWidth="1" />
               {/* Curved front of the skid */}
               <path d="M 120 92 Q 128 92, 126 84" fill="none" stroke="#475569" strokeWidth="4.5" strokeLinecap="round" />
             </g>

             {/* Pink Wings / Jet Boosters on sides */}
             <g>
               {/* Left/Right folding wings or booster pack */}
               <path d="M 52 56 L 24 58 L 26 66 L 52 62 Z" fill="#db2777" stroke="#9d174d" strokeWidth="1.5" />
               <polygon points="24,58 14,62 26,66" fill="#fbcfe8" />
               <circle cx="20" cy="61" r="2" fill="#38bdf8" className="animate-pulse" /> {/* Wings tip light */}
             </g>

             {/* Skye's Iconic Puppy Badge shield emblem (Pink shield with propeller icon) */}
             <g transform="translate(68, 58)">
               <path d="M 8 1 C 8 1, 14 3, 14 8 C 14 13, 8 15, 8 15 C 8 15, 2 13, 2 8 C 2 3, 8 1, 8 1 Z" fill="#ffffff" stroke="#db2777" strokeWidth="1.5" />
               {/* Propeller symbol */}
               <circle cx="8" cy="8" r="1.8" fill="#ec4899" />
               <line x1="4" y1="8" x2="12" y2="8" stroke="#ec4899" strokeWidth="1.2" />
               <line x1="8" y1="4" x2="8" y2="12" stroke="#ec4899" strokeWidth="1.2" />
             </g>

             {/* Large cockpit bubble window with sky blue tint */}
             <path d="M 82 42 Q 106 42, 116 54 L 88 56 Z" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.8" />
             
             {/* Skye Cockapoo Pilot peeking out */}
             <motion.g
               transform="translate(86, 44)"
               animate={isSpraying ? {
                 y: [0, -4, 0],
                 rotate: [0, -3, 3, 0]
               } : { y: 0, rotate: 0 }}
               transition={{ repeat: Infinity, duration: 0.6 }}
             >
               {/* Cute floppy dog ears */}
               <path d="M 2 10 Q -4 4, 1 8" fill="#ea580c" stroke="#451a03" strokeWidth="1.2" />
               <path d="M 12 10 Q 18 4, 13 8" fill="#ea580c" stroke="#451a03" strokeWidth="1.2" />

               {/* Face Brown Base */}
               <circle cx="7" cy="12" r="5" fill="#fed7aa" stroke="#7c2d12" strokeWidth="1" />
               {/* Tan snout */}
               <ellipse cx="7" cy="13.5" rx="3" ry="2" fill="#ffedd5" />

               {/* Pink Flight Cap & Goggles */}
               <path d="M 2.5 9.5 C 4.5 5.5, 9.5 5.5, 11.5 9.5 Z" fill="#ec4899" stroke="#db2777" strokeWidth="1" />
               <rect x="2" y="8.5" width="10" height="1.5" fill="#db2777" rx="0.5" />
               {/* Goggles on cap */}
               <rect x="3.5" y="6" width="3" height="2.5" fill="#bae6fd" stroke="#475569" strokeWidth="0.8" rx="0.5" />
               <rect x="7.5" y="6" width="3" height="2.5" fill="#bae6fd" stroke="#475569" strokeWidth="0.8" rx="0.5" />

               {/* Beautiful Pink Eyes */}
               <ellipse cx="5" cy="11.5" rx="1.3" ry="1.7" fill="#ffffff" stroke="#1e293b" strokeWidth="0.6" />
               <circle cx="5" cy="11.5" r="0.8" fill="#ec4899" />
               
               <ellipse cx="9" cy="11.5" rx="1.3" ry="1.7" fill="#ffffff" stroke="#1e293b" strokeWidth="0.6" />
               <circle cx="9" cy="11.5" r="0.8" fill="#ec4899" />
               
               {/* Smile and black nose */}
               <path d="M 6.2 14.2 Q 7 15 7.8 14.2" fill="none" stroke="#1e293b" strokeWidth="0.8" />
               <circle cx="7" cy="12.8" r="0.7" fill="#1e293b" />
             </motion.g>

             {/* Rotor Shaft on Top */}
             <rect x="73" y="24" width="6" height="15" fill="#475569" stroke="#334155" strokeWidth="1" />

             {/* SPINNING MAIN ROTOR BLADE */}
             <g transform="translate(76, 24)">
               <motion.g
                 animate={{ rotate: 360 }}
                 transition={{ repeat: Infinity, duration: 0.12, ease: 'linear' }}
               >
                 {/* Hub */}
                 <ellipse cx="0" cy="0" rx="6" ry="3" fill="#1e293b" />
                 {/* Left blade */}
                 <path d="M -6 -2 L -56 -4 C -58 -4, -58 4, -56 4 L -6 2 Z" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
                 <rect x="-50" y="-3" width="8" height="6" fill="#db2777" /> {/* Pink tips */}
                 {/* Right blade */}
                 <path d="M 6 -2 L 56 -4 C 58 -4, 58 4, 56 4 L 6 2 Z" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
                 <rect x="42" y="-3" width="8" height="6" fill="#db2777" /> {/* Pink tips */}
               </motion.g>
             </g>
          </>
        ) : isRubble ? (
          // ==================== RUBBLE'S POWER SHOVEL / BULLDOZER ====================
          <>
            {/* Back Heavy Construction Rig/Drill or Concrete Mixer */}
            <rect x="18" y="46" width="16" height="14" fill="#475569" rx="1" />
            <circle cx="26" cy="53" r="6" fill="#f59e0b" stroke="#e2e8f0" strokeWidth="1.2" />
            {/* Swirling indicator inside construction drum */}
            <line x1="22" y1="53" x2="30" y2="53" stroke="#1e293b" strokeWidth="1" />

            {/* Powerful Hydraulic Excavator Arm on Top */}
            <g className="origin-bottom-left">
              <motion.g
                animate={isSpraying ? { rotate: [-8, 8, -8] } : { rotate: 0 }}
                transition={{ repeat: Infinity, duration: 1.2 }}
              >
                {/* Yellow Heavy Arm beams */}
                <path d="M 12 32 L 48 18 L 52 24 L 16 38 Z" fill="#fbbf24" stroke="#b45309" strokeWidth="1.5" />
                <path d="M 46 20 L 78 30 L 76 36 L 44 26 Z" fill="#fbbf24" stroke="#b45309" strokeWidth="1.5" />
                {/* Silver joints */}
                <circle cx="48" cy="21" r="4.5" fill="#cbd5e1" stroke="#475569" strokeWidth="1.2" />
                <circle cx="77" cy="33" r="4" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
              </motion.g>
            </g>

            {/* Bright Yellow Bulldozer/Excavator Main Body */}
            <rect x="14" y="44" width="118" height="34" fill="#fbbf24" rx="6" stroke="#d97706" strokeWidth="2.5" />
            
            {/* Cab front box */}
            <path d="M 85 44 L 126 44 C 131 44, 136 49, 136 55 L 136 78 L 85 78 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="2.5" />

            {/* Silver heavy grates */}
            <path d="M 14 62 L 14 74 L 18 74 Z" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />

            {/* Yellow-and-Black hazard lines at side */}
            <g>
              <rect x="14" y="59" width="121" height="4" fill="#1e293b" />
              <line x1="20" y1="59" x2="23" y2="63" stroke="#fbbf24" strokeWidth="1.5" />
              <line x1="40" y1="59" x2="43" y2="63" stroke="#fbbf24" strokeWidth="1.5" />
              <line x1="60" y1="59" x2="63" y2="63" stroke="#fbbf24" strokeWidth="1.5" />
              <line x1="80" y1="59" x2="83" y2="63" stroke="#fbbf24" strokeWidth="1.5" />
              <line x1="100" y1="59" x2="103" y2="63" stroke="#fbbf24" strokeWidth="1.5" />
              <line x1="120" y1="59" x2="123" y2="63" stroke="#fbbf24" strokeWidth="1.5" />
            </g>

            {/* Rubble's "06" badge number in big white graphic */}
            <g transform="translate(22, 65)">
              <rect x="0" y="0" width="16" height="10" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.2" rx="2" />
              <text x="8" y="8" fill="#d97706" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">06</text>
            </g>

            {/* Cab glass with sky blue tint */}
            <path d="M 98 48 L 118 48 C 122 48, 124 51, 124 55 L 124 61 L 98 61 Z" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.5" />

            {/* Rubble Bulldog Driver face peeking out */}
            <motion.g
              transform="translate(101, 46)"
              animate={isSpraying ? {
                y: [0, -4, 0],
                rotate: [0, -3, 3, 0]
              } : { y: 0, rotate: 0 }}
              transition={{ repeat: Infinity, duration: 0.6 }}
            >
              {/* Chubby bulldog ears */}
              <path d="M 3 11 C 1 13, 1 17, 3.5 19" fill="#78350f" stroke="#1e293b" strokeWidth="1" />
              <circle cx="2.5" cy="14" r="1.0" fill="#1e293b" />

              {/* Head base */}
              <circle cx="9" cy="13" r="5.5" fill="#fef08a" stroke="#1e293b" strokeWidth="1" />
              {/* White face patches */}
              <circle cx="7" cy="12" r="2" fill="#ffffff" />
              <circle cx="11" cy="12" r="2.2" fill="#d97706" />

              {/* Eyes */}
              <ellipse cx="11.5" cy="11.8" rx="1.6" ry="2.2" fill="#ffffff" stroke="#1e293b" strokeWidth="0.8" />
              <circle cx="11.5" cy="11.8" r="1.1" fill="#ca8a04" />
              <circle cx="11.5" cy="11.8" r="0.6" fill="#0f172a" />

              {/* Yellow Safety Hard Hat */}
              <path d="M 4 9.5 C 6 5.5, 12 5.5, 14 9.5 Z" fill="#eab308" stroke="#1e293b" strokeWidth="1" />
              <rect x="3" y="8.5" width="12.5" height="1.8" fill="#ca8a04" rx="0.5" />
              {/* Hard hat stripe */}
              <rect x="8" y="5.5" width="2.5" height="3" fill="#1e293b" />

              {/* Bulldog chubby snout and smile */}
              <ellipse cx="8.5" cy="14.8" rx="3" ry="2" fill="#fef08a" />
              <path d="M 7 15.5 Q 8.5 16.5 10 15.5" fill="none" stroke="#1e293b" strokeWidth="0.8" />
              <ellipse cx="8.5" cy="13.8" rx="1.0" ry="0.6" fill="#1e293b" />
            </motion.g>

            {/* Official Construction Wrench Shield badge on Cabin door */}
            <g transform="translate(62, 51)">
              <path d="M 8 1 C 8 1, 14 3, 14 8 C 14 13, 8 15, 8 15 C 8 15, 2 13, 2 8 C 2 3, 8 1, 8 1 Z" fill="#ffffff" stroke="#d97706" strokeWidth="1.5" />
              <circle cx="8" cy="8" r="3" fill="#ca8a04" />
              <rect x="7" y="6" width="2" height="5" fill="#ffffff" />
              <circle cx="8" cy="6" r="1.5" fill="#ffffff" />
            </g>

            {/* Dynamic Front Shovel Loader Bucket */}
            <g className="origin-left">
              <motion.g
                animate={isSpraying ? { 
                  y: [0, -12, 6, 0], 
                  rotate: [0, -20, 15, 0] 
                } : { y: 0, rotate: 0 }}
                transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
              >
                {/* Connecting arms to loader scoop */}
                <path d="M 112 66 L 142 74 L 140 78 L 110 70 Z" fill="#475569" stroke="#334155" strokeWidth="1" />
                {/* Loader Scoop bucket */}
                <path 
                  d="M 132 50 C 132 50, 148 52, 148 68 C 148 84, 134 84, 130 84 L 126 84 L 126 58 Z" 
                  fill="#fbbf24" 
                  stroke="#b45309" 
                  strokeWidth="2.2" 
                />
                {/* Bucket scoop teeth for digging dirt and debris */}
                <polygon points="148,64 153,67 148,70" fill="#475569" />
                <polygon points="148,71 153,74 148,77" fill="#475569" />
                <polygon points="147,78 152,81 147,84" fill="#475569" />
              </motion.g>
            </g>

            {/* Rubble's Heavy Duty Crawler Tracks (Caterpillar Treads) */}
            <g transform="translate(18, 76)">
              {/* Outer track loop */}
              <rect x="0" y="0" width="105" height="18" rx="9" fill="#1e293b" stroke="#334155" strokeWidth="2.5" />
              {/* Internal driving gears/wheels spinning when moving */}
              <g transform="translate(12, 9)">
                <motion.g animate={isMoving ? { rotate: 360 } : { rotate: 0 }} transition={{ repeat: Infinity, duration: 0.45, ease: 'linear' }}>
                  <circle cx="0" cy="0" r="6.5" fill="#facc15" stroke="#475569" strokeWidth="1" />
                  <line x1="-6" y1="0" x2="6" y2="0" stroke="#1e293b" strokeWidth="1" />
                  <line x1="0" y1="-6" x2="0" y2="6" stroke="#1e293b" strokeWidth="1" />
                </motion.g>
              </g>
              <g transform="translate(38, 9)">
                <motion.g animate={isMoving ? { rotate: 360 } : { rotate: 0 }} transition={{ repeat: Infinity, duration: 0.45, ease: 'linear' }}>
                  <circle cx="0" cy="0" r="6.5" fill="#facc15" stroke="#475569" strokeWidth="1" />
                  <line x1="-6" y1="0" x2="6" y2="0" stroke="#1e293b" strokeWidth="1" />
                  <line x1="0" y1="-6" x2="0" y2="6" stroke="#1e293b" strokeWidth="1" />
                </motion.g>
              </g>
              <g transform="translate(64, 9)">
                <motion.g animate={isMoving ? { rotate: 360 } : { rotate: 0 }} transition={{ repeat: Infinity, duration: 0.45, ease: 'linear' }}>
                  <circle cx="0" cy="0" r="6.5" fill="#facc15" stroke="#475569" strokeWidth="1" />
                  <line x1="-6" y1="0" x2="6" y2="0" stroke="#1e293b" strokeWidth="1" />
                  <line x1="0" y1="-6" x2="0" y2="6" stroke="#1e293b" strokeWidth="1" />
                </motion.g>
              </g>
              <g transform="translate(90, 9)">
                <motion.g animate={isMoving ? { rotate: 360 } : { rotate: 0 }} transition={{ repeat: Infinity, duration: 0.45, ease: 'linear' }}>
                  <circle cx="0" cy="0" r="6.5" fill="#facc15" stroke="#475569" strokeWidth="1" />
                  <line x1="-6" y1="0" x2="6" y2="0" stroke="#1e293b" strokeWidth="1" />
                  <line x1="0" y1="-6" x2="0" y2="6" stroke="#1e293b" strokeWidth="1" />
                </motion.g>
              </g>
              {/* Outer tread grip lines */}
              <line x1="10" y1="0" x2="10" y2="3" stroke="#475569" strokeWidth="1.5" />
              <line x1="30" y1="0" x2="30" y2="3" stroke="#475569" strokeWidth="1.5" />
              <line x1="50" y1="0" x2="50" y2="3" stroke="#475569" strokeWidth="1.5" />
              <line x1="70" y1="0" x2="70" y2="3" stroke="#475569" strokeWidth="1.5" />
              <line x1="90" y1="0" x2="90" y2="3" stroke="#475569" strokeWidth="1.5" />
            </g>
          </>
        ) : !isChase ? (
          // ==================== MARSHALL'S FIRE TRUCK ====================
          <>
            {/* Back Ladder Support & Fire Hose Reel */}
            <rect x="18" y="46" width="18" height="12" fill="#64748b" rx="2" />
            <circle cx="27" cy="52" r="7" fill="#ef4444" stroke="#e2e8f0" strokeWidth="1.5" />
            {/* Wrapped white water hose inside reel */}
            <circle cx="27" cy="52" r="4" fill="none" stroke="#f8fafc" strokeWidth="1.8" strokeDasharray="3,2" />
            <line x1="22" y1="52" x2="32" y2="52" stroke="#ffffff" strokeWidth="1" />

            {/* Retractable Silver Metal Ladder on Top */}
            <g className="origin-bottom-left">
              <motion.g
                animate={isSpraying ? { rotate: [-4, 4, -4] } : { rotate: 0 }}
                transition={{ repeat: Infinity, duration: 1.8 }}
              >
                {/* Ladder body with real chrome finish */}
                <rect x="10" y="22" width="76" height="11" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" rx="1" />
                <line x1="20" y1="22" x2="20" y2="33" stroke="#475569" strokeWidth="1.5" />
                <line x1="30" y1="22" x2="30" y2="33" stroke="#475569" strokeWidth="1.5" />
                <line x1="40" y1="22" x2="40" y2="33" stroke="#475569" strokeWidth="1.5" />
                <line x1="50" y1="22" x2="50" y2="33" stroke="#475569" strokeWidth="1.5" />
                <line x1="60" y1="22" x2="60" y2="33" stroke="#475569" strokeWidth="1.5" />
                <line x1="70" y1="22" x2="70" y2="33" stroke="#475569" strokeWidth="1.5" />
                <line x1="80" y1="22" x2="80" y2="33" stroke="#475569" strokeWidth="1.5" />
              </motion.g>
            </g>

            {/* Red Fire Truck Body */}
            <rect x="14" y="44" width="118" height="36" fill="#ef4444" rx="6" stroke="#b91c1c" strokeWidth="2.5" />
            
            {/* Cab front box */}
            <path d="M 85 44 L 126 44 C 131 44, 136 49, 136 55 L 136 80 L 85 80 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="2.5" />

            {/* Silver hazard protection plates at back & bumper */}
            <path d="M 14 66 L 14 78 L 18 78 Z" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />

            {/* Yellow-and-Black Hazard Striping on side */}
            <g>
              <rect x="14" y="62" width="121" height="4" fill="#facc15" />
              <line x1="20" y1="62" x2="23" y2="66" stroke="#1e293b" strokeWidth="1.5" />
              <line x1="40" y1="62" x2="43" y2="66" stroke="#1e293b" strokeWidth="1.5" />
              <line x1="60" y1="62" x2="63" y2="66" stroke="#1e293b" strokeWidth="1.5" />
              <line x1="80" y1="62" x2="83" y2="66" stroke="#1e293b" strokeWidth="1.5" />
              <line x1="100" y1="62" x2="103" y2="66" stroke="#1e293b" strokeWidth="1.5" />
              <line x1="120" y1="62" x2="123" y2="66" stroke="#1e293b" strokeWidth="1.5" />
            </g>

            {/* Marshall's Iconic "03" emblem printed big in white */}
            <g transform="translate(22, 68)">
              <rect x="0" y="0" width="16" height="10" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.2" rx="2" />
              <text x="8" y="8" fill="#ef4444" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">03</text>
            </g>

            {/* Windows with sleek sky tint */}
            <path d="M 98 48 L 118 48 C 122 48, 124 51, 124 55 L 124 61 L 98 61 Z" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.5" />
            
            {/* Marshall Dalmatian Driver peeking out */}
            <motion.g
              transform="translate(101, 46)"
              animate={isSpraying ? {
                y: [0, -4, 0],
                rotate: [0, -3, 3, 0]
              } : { y: 0, rotate: 0 }}
              transition={{ repeat: Infinity, duration: 0.6 }}
            >
              <path d="M 3 10 C 1 12, 1 17, 4 19" fill="#ffffff" stroke="#1e293b" strokeWidth="1" />
              <circle cx="2.5" cy="14" r="1.0" fill="#1e293b" />
              <circle cx="3.5" cy="17" r="0.8" fill="#1e293b" />
              
              <circle cx="9" cy="13" r="5.5" fill="#ffffff" stroke="#1e293b" strokeWidth="1" />
              <circle cx="6.5" cy="11.5" r="0.8" fill="#1e293b" />
              
              <ellipse cx="11.5" cy="11.8" rx="1.8" ry="2.2" fill="#ffffff" stroke="#1e293b" strokeWidth="0.8" />
              <circle cx="11.5" cy="11.8" r="1.1" fill="#0284c7" />
              <circle cx="11.5" cy="11.8" r="0.6" fill="#0f172a" />
              
              <path d="M 4 9.5 C 6 5.5, 12 5.5, 14 9.5 Z" fill="#ef4444" stroke="#1e293b" strokeWidth="1" />
              <rect x="3" y="8.5" width="12.5" height="1.8" fill="#dc2626" rx="0.5" />
              <path d="M 9 16 Q 10.5 17 12 16" fill="none" stroke="#1e293b" strokeWidth="0.8" />
              <ellipse cx="13.5" cy="14" rx="1.0" ry="0.7" fill="#1e293b" />
            </motion.g>

            {/* Official Paw Badge shield emblem on Cabin door */}
            <g transform="translate(62, 53)">
              <path d="M 8 1 C 8 1, 14 3, 14 8 C 14 13, 8 15, 8 15 C 8 15, 2 13, 2 8 C 2 3, 8 1, 8 1 Z" fill="#ffffff" stroke="#b91c1c" strokeWidth="1.5" />
              <ellipse cx="8" cy="8.5" rx="2.5" ry="2" fill="#ef4444" />
              <circle cx="5.5" cy="5.5" r="0.9" fill="#ef4444" />
              <circle cx="8" cy="4.5" r="1.0" fill="#ef4444" />
              <circle cx="10.5" cy="5.5" r="0.9" fill="#ef4444" />
            </g>

            {/* Double Silver Compartment Panels */}
            <g>
              <rect x="42" y="47" width="16" height="11" fill="#94a3b8" stroke="#475569" strokeWidth="1.2" rx="1" />
              <line x1="45" y1="51" x2="55" y2="51" stroke="#334155" strokeWidth="1" />
              <line x1="45" y1="55" x2="55" y2="55" stroke="#334155" strokeWidth="1" />
              <circle cx="50" cy="52" r="1.5" fill="#f1f5f9" />
              
              <rect x="60" y="47" width="11" height="11" fill="#94a3b8" stroke="#475569" strokeWidth="1.2" rx="1" />
              <line x1="62" y1="52" x2="69" y2="52" stroke="#334155" strokeWidth="1.5" />
            </g>
          </>
        ) : (
          // ==================== CHASE'S POLICE CRUISER ====================
          <>
            {/* Back spoiler/wing or tech tower instead of the flat boxy truck bed */}
            <path d="M 18 48 L 26 36 L 34 36 L 28 48 Z" fill="#0f172a" stroke="#111827" strokeWidth="1.5" />
            <circle cx="30" cy="36" r="3.5" fill="#ef4444" className="animate-pulse" />

            {/* Police Cruiser Main Body (Sleek SUV / Patrol Cruiser shape) */}
            <path 
              d="M 14 78 L 14 52 C 14 49, 17 48, 20 48 L 78 48 C 82 48, 84 45, 86 42 L 92 34 C 94 32, 97 32, 114 32 L 122 32 C 126 32, 128 35, 130 38 L 134 48 L 137 48 C 140 48, 141 50, 141 53 L 141 78 Z" 
              fill="#1e3a8a" 
              stroke="#172554" 
              strokeWidth="2.5" 
            />

            {/* Front bumper guard / rugged bullbar on the patrol car */}
            <path d="M 134 46 L 143 46 L 143 78 L 134 78 Z" fill="#0f172a" stroke="#1e293b" strokeWidth="1.2" />
            <line x1="134" y1="56" x2="143" y2="56" stroke="#fbbf24" strokeWidth="2.5" />
            <line x1="134" y1="68" x2="143" y2="68" stroke="#38bdf8" strokeWidth="2.5" />

            {/* White Police Side door panel with custom police decal */}
            <path d="M 44 48 L 86 48 L 86 76 L 44 76 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="65" y="70" fill="#1e3a8a" fontSize="8" fontWeight="black" textAnchor="middle" letterSpacing="0.5" fontFamily="sans-serif">POLICE</text>

            {/* Silver hazard protection plates at back */}
            <path d="M 14 66 L 14 78 L 18 78 Z" fill="#94a3b8" stroke="#475569" strokeWidth="1" />

            {/* Sleek Golden / Yellow and black hazard stripe at the bottom */}
            <g>
              <rect x="14" y="66" width="122" height="4" fill="#fbbf24" />
              <line x1="20" y1="66" x2="23" y2="70" stroke="#1e293b" strokeWidth="1.5" />
              <line x1="40" y1="66" x2="43" y2="70" stroke="#1e293b" strokeWidth="1.5" />
              <line x1="60" y1="66" x2="63" y2="70" stroke="#1e293b" strokeWidth="1.5" />
              <line x1="80" y1="66" x2="83" y2="70" stroke="#1e293b" strokeWidth="1.5" />
              <line x1="100" y1="66" x2="103" y2="70" stroke="#1e293b" strokeWidth="1.5" />
              <line x1="120" y1="66" x2="123" y2="70" stroke="#1e293b" strokeWidth="1.5" />
            </g>

            {/* Chase's Police star emblem badge on white door panel */}
            <g transform="translate(55, 49)">
              <polygon points="10,1 12,7 19,7 14,11 16,17 10,13 4,17 6,11 1,7 8,7" fill="#fbbf24" stroke="#b45309" strokeWidth="1" />
              <circle cx="10" cy="9" r="4.5" fill="#1d4ed8" />
              <text x="10" y="11.5" fill="#ffffff" fontSize="7" fontWeight="black" textAnchor="middle" fontFamily="sans-serif">02</text>
            </g>

            {/* Cabin sloped driver window for police car */}
            <path d="M 94 38 L 114 38 C 118 38, 121 41, 121 45 L 121 55 L 94 55 Z" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.5" />
            
            {/* Chase German Shepherd Driver peeking out */}
            <motion.g
              transform="translate(97, 44)"
              animate={isSpraying ? {
                y: [0, -4, 0],
                rotate: [0, -3, 3, 0]
              } : { y: 0, rotate: 0 }}
              transition={{ repeat: Infinity, duration: 0.6 }}
            >
              {/* Ears */}
              <path d="M 2 11 Q -3 3, 1 8" fill="#d97706" stroke="#451a03" strokeWidth="1.2" />
              <path d="M 12 11 Q 17 3, 13 8" fill="#d97706" stroke="#451a03" strokeWidth="1.2" />

              {/* Face Brown Base */}
              <circle cx="8" cy="13" r="5.5" fill="#d97706" stroke="#451a03" strokeWidth="1" />
              {/* Tan snout overlay */}
              <ellipse cx="8" cy="14.5" rx="3.5" ry="2.5" fill="#fde047" />

              {/* Eyes */}
              <ellipse cx="6" cy="11.8" rx="1.6" ry="2.0" fill="#ffffff" stroke="#1e293b" strokeWidth="0.8" />
              <circle cx="6" cy="11.8" r="1.0" fill="#2563eb" />
              <circle cx="6" cy="11.8" r="0.5" fill="#0f172a" />

              <ellipse cx="10" cy="11.8" rx="1.6" ry="2.0" fill="#ffffff" stroke="#1e293b" strokeWidth="0.8" />
              <circle cx="10" cy="11.8" r="1.0" fill="#2563eb" />
              <circle cx="10" cy="11.8" r="0.5" fill="#0f172a" />
              
              {/* Police Cap */}
              <path d="M 3 9.5 C 5 5.0, 11 5.0, 13 9.5 Z" fill="#1e3a8a" stroke="#172554" strokeWidth="1" />
              <rect x="2" y="8.5" width="12" height="1.8" fill="#fbbf24" rx="0.5" />
              {/* Gold cap badge */}
              <circle cx="8" cy="6.5" r="1.5" fill="#fbbf24" stroke="#d97706" strokeWidth="0.6" />
              
              {/* Cute smile */}
              <path d="M 7 15 Q 8 16 9 15" fill="none" stroke="#1e293b" strokeWidth="0.8" />
              {/* Black Nose */}
              <ellipse cx="8" cy="13.2" rx="0.9" ry="0.6" fill="#1e293b" />
            </motion.g>

            {/* Golden Star Emblem Shield on cruiser side */}
            <g transform="translate(90, 64)">
              <polygon points="5,0 6,3 9,3 7,5 8,8 5,6 2,8 3,5 1,3 4,3" fill="#fbbf24" stroke="#b45309" strokeWidth="1" />
            </g>

            {/* Rear rescue tool panels / storage compartments */}
            <g>
              <rect x="26" y="52" width="14" height="11" fill="#cbd5e1" stroke="#475569" strokeWidth="1.2" rx="1" />
              <line x1="28" y1="57" x2="38" y2="57" stroke="#334155" strokeWidth="1" />
              <circle cx="33" cy="57" r="1.5" fill="#1e293b" />
            </g>
          </>
        )}

        {/* Swivel Rescue Gun Nozzle / Launch Pod (Mounted on vehicle roof or cockpit top) */}
        <g 
          transform={isSkye ? "translate(76, 38)" : "translate(74, 44)"} 
          className="pointer-events-auto cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onNozzleClick?.();
          }}
        >
          <motion.g
            animate={{ rotate: angleToFire }}
            whileTap={{ scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 120, damping: 10 }}
            style={{ originX: '5px', originY: '0px' }}
          >
            {/* Swivel Mount */}
            <circle cx="5" cy="0" r="7" fill="#475569" stroke="#cbd5e1" strokeWidth="1" />
            
            {/* Nozzle/Launch Body */}
            <rect x="0" y="-19" width="10" height="19" fill={isSkye ? '#ec4899' : isChase ? '#1e3a8a' : isRubble ? '#ca8a04' : '#94a3b8'} rx="2" stroke="#334155" strokeWidth="1.2" />
            <rect x="2" y="-25" width="6" height="6" fill="#1e293b" />
            <rect x="1.5" y="-22" width="7" height="1.5" fill="#facc15" /> {/* Gold ring accent */}
            
            {/* Sparkle release exit animation */}
            {isSpraying && (
              <motion.polygon 
                points="5,-30 8,-23 2,-23" 
                fill={isSkye ? '#f472b6' : isChase ? '#facc15' : isRubble ? '#facc15' : '#38bdf8'}
                animate={{ scale: [1, 1.4, 1], y: [0, -2, 0] }}
                transition={{ repeat: Infinity, duration: 0.15 }}
              />
            )}
          </motion.g>
        </g>

        {!isSkye && !isRubble && (
          <>
            {/* Wheels with stylish chrome hubs & treads */}
            {/* Back Wheel */}
            <g transform="translate(38, 80)">
              <motion.g
                animate={isMoving ? { rotate: 360 } : { rotate: 0 }}
                transition={isMoving ? { repeat: Infinity, duration: 0.45, ease: 'linear' } : {}}
              >
                <circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#475569" strokeWidth="2.5" />
                <line x1="-14" y1="0" x2="-10" y2="0" stroke="#1e293b" strokeWidth="2" />
                <line x1="10" y1="0" x2="14" y2="0" stroke="#1e293b" strokeWidth="2" />
                <line x1="0" y1="-14" x2="0" y2="-10" stroke="#1e293b" strokeWidth="2" />
                <line x1="0" y1="10" x2="0" y2="14" stroke="#1e293b" strokeWidth="2" />
                <circle cx="0" cy="0" r="7.5" fill={isChase ? '#fbbf24' : '#e2e8f0'} stroke={isChase ? '#b45309' : '#334155'} strokeWidth="1" />
                <circle cx="0" cy="0" r="3.5" fill={isChase ? '#1d4ed8' : '#94a3b8'} />
              </motion.g>
            </g>

            {/* Front Wheel */}
            <g transform="translate(108, 80)">
              <motion.g
                animate={isMoving ? { rotate: 360 } : { rotate: 0 }}
                transition={isMoving ? { repeat: Infinity, duration: 0.45, ease: 'linear' } : {}}
              >
                <circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#475569" strokeWidth="2.5" />
                <line x1="-14" y1="0" x2="-10" y2="0" stroke="#1e293b" strokeWidth="2" />
                <line x1="10" y1="0" x2="14" y2="0" stroke="#1e293b" strokeWidth="2" />
                <line x1="0" y1="-14" x2="0" y2="-10" stroke="#1e293b" strokeWidth="2" />
                <line x1="0" y1="10" x2="0" y2="14" stroke="#1e293b" strokeWidth="2" />
                <circle cx="0" cy="0" r="7.5" fill={isChase ? '#fbbf24' : '#e2e8f0'} stroke={isChase ? '#b45309' : '#334155'} strokeWidth="1" />
                <circle cx="0" cy="0" r="3.5" fill={isChase ? '#1d4ed8' : '#94a3b8'} />
              </motion.g>
            </g>

            {/* Dual Flashing Siren Light Bar (Left Blue/Red, Right Blue/Yellow) */}
            <g transform={isChase ? "translate(105, 30)" : "translate(112, 38)"}>
              <rect x="-10" y="2" width="20" height="4" fill="#cbd5e1" stroke="#475569" strokeWidth="1" rx="1" />
              
              {/* Left Siren */}
              <motion.path 
                d="M -7 2 Q -4 -5 -1 2 Z" 
                fill={isChase ? '#ef4444' : '#ef4444'} 
                animate={{
                  fill: isChase ? ['#ef4444', '#fecaca', '#ef4444'] : ['#ef4444', '#fee2e2', '#ef4444'],
                  opacity: [1, 0.4, 1]
                }}
                transition={{ repeat: Infinity, duration: 0.25 }}
              />

              {/* Right Siren */}
              <motion.path 
                d="M 1 2 Q 4 -5 7 2 Z" 
                fill={isChase ? '#2563eb' : '#3b82f6'} 
                animate={{
                  fill: isChase ? ['#2563eb', '#bfdbfe', '#2563eb'] : ['#3b82f6', '#dbeafe', '#3b82f6'],
                  opacity: [0.4, 1, 0.4]
                }}
                transition={{ repeat: Infinity, duration: 0.25 }}
              />
            </g>

            {/* Front Chrome Grid and Bumper */}
            <rect x="131" y="71" width="7" height="9" fill="#cbd5e1" stroke="#475569" strokeWidth="1.2" rx="1" />
            <circle cx="128" cy="73" r="2.5" fill="#facc15" stroke="#e2e8f0" strokeWidth="0.8" />
          </>
        )}
      </svg>
    </motion.div>
  );
}

