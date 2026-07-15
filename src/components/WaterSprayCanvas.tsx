import React, { useEffect, useRef } from 'react';
import { CharacterId } from '../types';

interface WaterSprayCanvasProps {
  isActive: boolean;
  truckXPercent: number; // 0 to 100
  targetXPercent: number | null; // 0 to 100
  targetYPercent: number | null; // 0 to 100
  containerWidth: number;
  containerHeight: number;
  burstTrigger?: number; // Incremented on click to trigger a water splash burst
  characterId?: CharacterId;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  life: number; // 0 to 1
  decay: number;
  type: 'water' | 'splash' | 'smoke';
  growRate?: number;
}

// Custom star drawing helper for Chase mode particles
const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number, fillStyle: string) => {
  let rot = Math.PI / 2 * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fillStyle = fillStyle;
  ctx.fill();
};

// Custom heart drawing helper for Skye mode particles
const drawHeart = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, fillStyle: string) => {
  ctx.save();
  ctx.beginPath();
  const d = r * 1.1;
  ctx.moveTo(cx, cy - d * 0.2);
  ctx.bezierCurveTo(cx - d * 0.5, cy - d * 0.8, cx - d, cy - d * 0.1, cx, cy + d * 0.7);
  ctx.bezierCurveTo(cx + d, cy - d * 0.1, cx + d * 0.5, cy - d * 0.8, cx, cy - d * 0.2);
  ctx.closePath();
  ctx.fillStyle = fillStyle;
  ctx.fill();
  ctx.restore();
};

export default function WaterSprayCanvas({
  isActive,
  truckXPercent,
  targetXPercent,
  targetYPercent,
  containerWidth,
  containerHeight,
  burstTrigger,
  characterId = 'marshall',
}: WaterSprayCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  const isChase = characterId === 'chase';
  const isSkye = characterId === 'skye';

  // Triggered when clicking the water gun nozzle - emits high speed fanned water spray particles!
  useEffect(() => {
    if (burstTrigger === undefined || burstTrigger === 0) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const particles = particlesRef.current;
    const startX = (truckXPercent / 100) * canvas.width;
    const startY = canvas.height * 0.85;

    const particleCount = 38;
    for (let i = 0; i < particleCount; i++) {
      // Fan angle between -135 to -45 degrees (pointing up & fanning out)
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * (Math.PI * 0.5);
      const speed = 7 + Math.random() * 9;

      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      // Color choice
      const color = isSkye
        ? ['#fbcfe8', '#f472b6', '#ec4899', '#f43f5e', '#ffffff', '#c084fc'][Math.floor(Math.random() * 6)]
        : isChase
        ? ['#facc15', '#fbbf24', '#60a5fa', '#93c5fd', '#ffffff', '#a855f7'][Math.floor(Math.random() * 6)]
        : (Math.random() > 0.4 ? '#38bdf8' : '#e0f2fe');

      particles.push({
        x: startX,
        y: startY,
        vx,
        vy,
        radius: 3 + Math.random() * 4.5,
        color,
        alpha: 1.0,
        life: 1.0,
        decay: 0.015 + Math.random() * 0.015,
        type: 'water',
      });

      // Extra tiny shiny splash droplets
      if (Math.random() > 0.2) {
        const splashColor = isSkye
          ? ['#fbcfe8', '#f472b6', '#ffffff'][Math.floor(Math.random() * 3)]
          : isChase
          ? ['#fef08a', '#fbbf24', '#ffffff', '#e0f2fe'][Math.floor(Math.random() * 4)]
          : '#ffffff';

        particles.push({
          x: startX,
          y: startY,
          vx: vx * 0.75 + (Math.random() * 2 - 1),
          vy: vy * 0.75 + (Math.random() * 2 - 1),
          radius: 1.2 + Math.random() * 2,
          color: splashColor,
          alpha: 1.0,
          life: 1.0,
          decay: 0.04 + Math.random() * 0.04,
          type: 'splash',
        });
      }
    }
  }, [burstTrigger, truckXPercent, containerWidth, containerHeight, isChase, isSkye]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = containerWidth;
    canvas.height = containerHeight;

    const particles = particlesRef.current;

    const animate = () => {
      // Clear canvas with a transparent slate
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Emit new water particles if spraying is active
      if (isActive && targetXPercent !== null && targetYPercent !== null) {
        // Calculate real pixel coordinates
        const startX = (truckXPercent / 100) * canvas.width;
        const startY = canvas.height * 0.85; // Hose height
        
        const endX = (targetXPercent / 100) * canvas.width;
        const endY = (targetYPercent / 100) * canvas.height;

        // Emit multiple particles per frame for density
        const particlesToEmit = 5;
        for (let p = 0; p < particlesToEmit; p++) {
          const dx = endX - startX;
          const dy = endY - startY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Calculate base velocity vector pointing to target
          // Add some physical gravity compensation (arching up)
          const speedFactor = distance * 0.045; // adjustment based on distance
          const angle = Math.atan2(dy - 40, dx); // Aim slightly higher for gravity arch
          
          // Add random spray dispersion (wobble)
          const dispersion = 0.08;
          const finalAngle = angle + (Math.random() * dispersion - dispersion / 2);
          const speed = speedFactor * (0.9 + Math.random() * 0.2);

          const vx = Math.cos(finalAngle) * speed;
          const vy = Math.sin(finalAngle) * speed;

          const color = isSkye
            ? ['#fbcfe8', '#f472b6', '#ec4899', '#f43f5e', '#ffffff'][Math.floor(Math.random() * 5)]
            : isChase
            ? ['#facc15', '#fbbf24', '#60a5fa', '#3b82f6', '#ffffff'][Math.floor(Math.random() * 5)]
            : (Math.random() > 0.4 ? '#38bdf8' : '#60a5fa');

          particles.push({
            x: startX,
            y: startY,
            vx,
            vy,
            radius: 3 + Math.random() * 4,
            color,
            alpha: 1,
            life: 1,
            decay: 0.015 + Math.random() * 0.015,
            type: 'water',
          });
        }
      }

      // Update and draw existing particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        // Physics update based on particle type
        if (p.type === 'water') {
          p.vy += 0.22; // Gravity pulls water down
          p.x += p.vx;
          p.y += p.vy;
          p.life -= p.decay;

          // Impact detection near target x, y
          if (targetXPercent !== null && targetYPercent !== null) {
            const targetX = (targetXPercent / 100) * canvas.width;
            const targetY = (targetYPercent / 100) * canvas.height;
            const distToTarget = Math.sqrt((p.x - targetX) * (p.x - targetX) + (p.y - targetY) * (p.y - targetY));
            
            // Splat & turn into splashes and smoke on target hit
            if (distToTarget < 38) {
              // Create dynamic splash droplets
              const splashCount = Math.floor(Math.random() * 2) + 1;
              for (let s = 0; s < splashCount; s++) {
                const splashColor = isSkye
                  ? ['#fbcfe8', '#f472b6', '#ffffff', '#ec4899'][Math.floor(Math.random() * 4)]
                  : isChase
                  ? ['#facc15', '#fbbf24', '#e0f2fe', '#ffffff'][Math.floor(Math.random() * 4)]
                  : (Math.random() > 0.3 ? '#7dd3fc' : '#e0f2fe');

                particles.push({
                  x: p.x,
                  y: p.y,
                  vx: (Math.random() * 8 - 4),
                  vy: (Math.random() * -6 - 2), // bounce up/outwards
                  radius: 1.5 + Math.random() * 2.5,
                  color: splashColor,
                  alpha: 1.0,
                  life: 1.0,
                  decay: 0.05 + Math.random() * 0.05,
                  type: 'splash',
                });
              }

              // Create steam/smoke particles ("jizzing" extinguishing visual)
              if (Math.random() > 0.4) {
                const smokeColor = isSkye ? '#fbcfe8' : isChase ? '#fef08a' : '#f8fafc';
                particles.push({
                  x: p.x + (Math.random() * 24 - 12),
                  y: p.y + (Math.random() * 24 - 12),
                  vx: (Math.random() * 2 - 1),
                  vy: (Math.random() * -1.5 - 1.5), // Float upwards
                  radius: 4 + Math.random() * 6,
                  color: smokeColor,
                  alpha: 0.75,
                  life: 1.0,
                  decay: 0.025 + Math.random() * 0.02,
                  type: 'smoke',
                  growRate: 0.4 + Math.random() * 0.5,
                });
              }

              // Tiny extra bright sparkle
              if (Math.random() > 0.75) {
                particles.push({
                  x: p.x,
                  y: p.y,
                  vx: (Math.random() * 6 - 3),
                  vy: (Math.random() * -5 - 1),
                  radius: 1.2,
                  color: '#ffffff',
                  alpha: 1.0,
                  life: 1.0,
                  decay: 0.08,
                  type: 'splash',
                });
              }

              p.life = 0; // Destroy original stream particle on impact
            }
          }
        } else if (p.type === 'splash') {
          p.vy += 0.28; // Higher gravity for splash droplets
          p.x += p.vx;
          p.y += p.vy;
          p.life -= p.decay;
        } else if (p.type === 'smoke') {
          p.vy -= 0.07; // Rising buoyancy
          p.vx += (Math.random() * 0.3 - 0.15); // drifting
          p.x += p.vx;
          p.y += p.vy;
          if (p.growRate) p.radius += p.growRate;
          p.life -= p.decay;
        }

        // Draw particle based on type
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life * p.alpha);
        ctx.beginPath();

        if (p.type === 'water') {
          if (isSkye) {
            // Alternate between hearts and stars
            if (p.radius % 2 < 1) {
              drawHeart(ctx, p.x, p.y, p.radius * 1.5, p.color);
            } else {
              drawStar(ctx, p.x, p.y, 4, p.radius * 1.6, p.radius * 0.6, p.color);
            }
          } else if (isChase) {
            // Draw a shiny star for Chase
            drawStar(ctx, p.x, p.y, 4, p.radius * 1.6, p.radius * 0.6, p.color);
          } else {
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (speed > 1) {
              ctx.ellipse(p.x, p.y, p.radius, p.radius * 0.6, Math.atan2(p.vy, p.vx), 0, Math.PI * 2);
            } else {
              ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            }
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 4;
            ctx.shadowColor = '#e0f2fe';
            ctx.fill();
          }
        } else if (p.type === 'splash') {
          if (isSkye) {
            drawStar(ctx, p.x, p.y, 4, p.radius * 1.4, p.radius * 0.5, p.color);
          } else if (isChase) {
            drawStar(ctx, p.x, p.y, 4, p.radius * 1.3, p.radius * 0.5, p.color);
          } else {
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 6;
            ctx.shadowColor = '#38bdf8';
            ctx.fill();
          }
        } else if (p.type === 'smoke') {
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          const grad = ctx.createRadialGradient(p.x, p.y, p.radius * 0.1, p.x, p.y, p.radius);
          if (isSkye) {
            grad.addColorStop(0, 'rgba(251, 207, 232, 0.7)'); // Soft rose/pink cloud
            grad.addColorStop(0.4, 'rgba(244, 114, 182, 0.35)');
          } else if (isChase) {
            grad.addColorStop(0, 'rgba(254, 240, 138, 0.65)'); // Soft warm yellow star dust
            grad.addColorStop(0.4, 'rgba(253, 224, 71, 0.35)');
          } else {
            grad.addColorStop(0, 'rgba(255, 255, 255, 0.65)');
            grad.addColorStop(0.4, 'rgba(241, 245, 249, 0.35)');
          }
          grad.addColorStop(1, 'rgba(241, 245, 249, 0)');
          ctx.fillStyle = grad;
          ctx.fill();
        }

        ctx.restore();

        // Remove dead particles
        if (p.life <= 0 || p.y > canvas.height + 20 || p.x < -20 || p.x > canvas.width + 20) {
          particles.splice(i, 1);
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, truckXPercent, targetXPercent, targetYPercent, containerWidth, containerHeight, isChase]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-15"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}

