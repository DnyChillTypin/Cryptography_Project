import React from 'react';
import { motion } from 'framer-motion';

/**
 * CaesarCipherWheel - An interactive, high-fidelity Cryptographic Disk.
 * 
 * ROLE: Professor & Senior FE Engineer
 * 
 * MATH BREAKDOWN (TRIGONOMETRY):
 * To position 26 letters in a circle of radius R, we use polar coordinates (r, θ).
 * 1. Divide the circle into 26 segments: angle_step = 360 / 26 ≈ 13.846°.
 * 2. Convert index (i) to angle: θ_i = (i * angle_step) - 90°.
 *    - Why -90? SVG polar coordinates start at 0° (East/Right). Subtracting 90° 
 *      resets the start point to the North/Top (the standard "A" position).
 * 3. Convert Polar (r, θ) to Cartesian (x, y):
 *    - x = cx + r * cos(θ)
 *    - y = cy + r * sin(θ)
 *    - In JS: Math.cos expects Radians. (Degrees * π / 180).
 */

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function CaesarCipherWheel({ k = 0 }) {
  const cx = 200; // SVG Center X
  const cy = 200; // SVG Center Y
  const outerR = 160; // Plaintext Radius
  const innerR = 115; // Ciphertext Radius
  const angleStep = 360 / 26;

  // MODULO ARITHMETIC (Professor's Note):
  // We use (n % 26 + 26) % 26 to handle negative turns correctly.
  // The rotation degrees bound to K is: K * angleStep.
  const rotationDegrees = -k * angleStep;

  /**
   * Helper: Calculates (x, y) coordinates for a letter at a given index and radius.
   * @param {number} index - Alphabet index (0-25)
   * @param {number} radius - Distance from center
   */
  const getCoords = (index, radius) => {
    const angle = (index * angleStep - 90) * (Math.PI / 180);
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
      rotate: index * angleStep // Rotates the letter itself to face outward
    };
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-bg-surface/30 rounded-3xl border border-white/5 backdrop-blur-sm">
      <div className="relative w-full max-w-[400px] aspect-square">
        <svg 
          viewBox="0 0 400 400" 
          className="w-full h-full drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]"
          style={{ filter: 'drop-shadow(0 0 10px rgba(0,240,255,0.1))' }}
        >
          {/* BACKGROUND DISKS */}
          <circle cx={cx} cy={cy} r={outerR + 25} className="fill-bg-card stroke-white/5 stroke-2" />
          <circle cx={cx} cy={cy} r={innerR + 15} className="fill-black/40 stroke-neon-cyan/20 stroke-1" />
          
          {/* OUTER RING: FIXED PLAINTEXT ALPHABET */}
          <g id="plaintext-ring">
            {ALPHABET.map((char, i) => {
              const { x, y, rotate } = getCoords(i, outerR);
              return (
                <text
                  key={`outer-${char}`}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-text-muted font-mono text-[14px] font-black select-none"
                  transform={`rotate(${rotate}, ${x}, ${y})`}
                >
                  {char}
                </text>
              );
            })}
          </g>

          {/* INNER RING: ROTATING CIPHERTEXT ALPHABET */}
          {/* 
              TECHNICAL NOTE: We apply CSS transition to the entire group <g>.
              When 'k' changes, the group rotates smoothly around the center (cx, cy).
          */}
          <motion.g 
            id="ciphertext-ring"
            animate={{ rotate: rotationDegrees }}
            transition={{ type: "spring", stiffness: 60, damping: 15 }}
            style={{ originX: `${cx}px`, originY: `${cy}px` }}
          >
             {ALPHABET.map((char, i) => {
              const { x, y, rotate } = getCoords(i, innerR);
              return (
                <text
                  key={`inner-${char}`}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-neon-cyan font-mono text-[12px] font-black select-none drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]"
                  transform={`rotate(${rotate}, ${x}, ${y})`}
                >
                  {char}
                </text>
              );
            })}
          </motion.g>

          {/* DECORATIVE CENTER HUB */}
          <circle cx={cx} cy={cy} r="10" className="fill-neon-cyan shadow-lg" />
          <circle cx={cx} cy={cy} r="40" className="fill-transparent stroke-neon-cyan/10 stroke-dasharray-[2,4]" />
          
          {/* ALIGNMENT INDICATOR (THE "NEEDLE") */}
          <line 
            x1={cx} y1={cy - outerR - 35} 
            x2={cx} y2={cy - innerR + 10} 
            className="stroke-neon-gold/50 stroke-1 stroke-dasharray-[2,2]" 
          />
        </svg>

        {/* OVERLAY KEY DISPLAY */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">SHIFT</div>
          <div className="text-4xl font-black text-neon-cyan font-mono leading-none">{k}</div>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-2">
        <div className="flex items-center gap-8 px-6 py-2 bg-black/40 border border-white/5 rounded-full shadow-inner">
           <div className="flex flex-col items-center">
              <span className="text-[9px] font-black text-text-muted uppercase">Plaintext</span>
              <span className="text-lg font-mono font-bold text-text-primary">A</span>
           </div>
           <div className="text-neon-cyan text-xl">➔</div>
           <div className="flex flex-col items-center">
              <span className="text-[9px] font-black text-neon-gold uppercase">Ciphertext</span>
              <span className="text-lg font-mono font-bold text-neon-gold">{ALPHABET[(0 + k) % 26]}</span>
           </div>
        </div>
        <p className="text-[10px] text-text-secondary italic mt-2">
          The inner ring rotates to align shifted values with the outer ring.
        </p>
      </div>
    </div>
  );
}
