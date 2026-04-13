import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Activity } from 'lucide-react';

/**
 * ModularOrbitViz - An interactive visualizer for Modular Exponentiation Orbits.
 * 
 * ROLE: Professor & Senior FE Engineer
 * 
 * TECHNICAL BREAKDOWN & TRIGONOMETRY:
 * 1. POLAR TO CARTESIAN CONVERSION:
 *    To map a modulus 'n' onto a circle, we treat the circle as a wrap-around number line.
 *    For any residue 'b' in [0, n-1]:
 *    - Normalized position: t = b / n
 *    - Angle (radians): θ = (t * 2π) - (π / 2)
 *      Note: Subtracting π/2 (90°) rotates the 0 point to the Top (12 o'clock).
 *    - Cartesian x = center + radius * cos(θ)
 *    - Cartesian y = center + radius * sin(θ)
 * 
 * 2. ANIMATION LOOP (State Management):
 *    To animate 'requestAnimationFrame' without infinite React re-renders, we use 
 *    a 'ref' to track the current animation index (m) and only update React state 
 *    at a controlled frequency or when a significant change occurs.
 * 
 * 3. SVG SCALING:
 *    The 'viewBox' is fixed (0 0 500 500) while the 'n' determines the granularity 
 *    of the point distribution.
 */

export function ModularOrbitViz({ a = 2, n = 7 }) {
  const [points, setPoints] = useState([]);
  const [m, setM] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const cx = 250;
  const cy = 250;
  const radius = 220;
  
  const animationRef = useRef();
  const lastUpdateRef = useRef(0);

  // Math Helper: b = a^m mod n
  const calculatePoints = useMemo(() => {
    const sequence = [];
    let current = BigInt(1);
    const bigA = BigInt(a);
    const bigN = BigInt(n);
    
    // We generate up to n points (maximum cycle length)
    for (let i = 0; i < n; i++) {
      const b = Number(current);
      const angle = ((b / n) * 2 * Math.PI) - (Math.PI / 2);
      sequence.push({
        val: b,
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle)
      });
      current = (current * bigA) % bigN;
      if (current === 1n && i > 0) break; // Cycle found
    }
    return sequence;
  }, [a, n]);

  useEffect(() => {
    setPoints([]);
    setM(0);
    setIsAnimating(false);
  }, [a, n]);

  const startAnimation = () => {
    setPoints([]);
    setM(0);
    setIsAnimating(true);
    lastUpdateRef.current = performance.now();
    animate(0);
  };

  const animate = (currentIdx) => {
    if (currentIdx >= calculatePoints.length) {
      setIsAnimating(false);
      return;
    }

    setM(currentIdx);
    setPoints(prev => [...prev, calculatePoints[currentIdx]]);
    
    animationRef.current = requestAnimationFrame(() => animate(currentIdx + 1));
  };

  const reset = () => {
    cancelAnimationFrame(animationRef.current);
    setPoints([]);
    setM(0);
    setIsAnimating(false);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-bg-surface/30 rounded-3xl border border-white/5 backdrop-blur-md">
      <div className="relative w-full max-w-[500px] aspect-square">
        <svg viewBox="0 0 500 500" className="w-full h-full drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          {/* OUTER PERIMETER */}
          <circle cx={cx} cy={cy} r={radius} className="fill-none stroke-white/10 stroke-1" />
          <circle cx={cx} cy={cy} r={radius + 10} className="fill-none stroke-neon-cyan/5 stroke-[0.5] stroke-dasharray-[2,4]" />
          
          {/* ORBIT PATH */}
          <motion.path
            d={points.length > 0 ? `M ${points[0].x} ${points[0].y} ` + points.map(p => `L ${p.x} ${p.y}`).join(' ') : ''}
            className="fill-none stroke-neon-cyan stroke-1 opacity-60"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* POINTS */}
          {points.map((p, i) => (
            <circle 
              key={i} 
              cx={p.x} cy={p.y} r={n > 100 ? 1 : 3} 
              className={i === points.length - 1 ? "fill-neon-gold shadow-[0_0_10px_gold]" : "fill-neon-cyan/40"} 
            />
          ))}

          {/* AXIS LABELS (Key Residues) */}
          {[0, 0.25, 0.5, 0.75].map(t => {
            const angle = (t * 2 * Math.PI) - (Math.PI / 2);
            const lx = cx + (radius + 25) * Math.cos(angle);
            const ly = cy + (radius + 25) * Math.sin(angle);
            return (
              <text key={t} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" className="fill-text-muted font-mono text-[10px] uppercase font-black">
                {Math.round(t * n)}
              </text>
            );
          })}
        </svg>

        {/* STATUS HUD */}
        <div className="absolute top-4 left-4 bg-black/60 px-4 py-2 rounded-xl border border-white/5 backdrop-blur-xl">
           <div className="text-[10px] font-black text-neon-cyan uppercase tracking-widest mb-1">Orbit Analysis</div>
           <div className="font-mono text-sm text-text-primary">
              m = {m} | b = {calculatePoints[m]?.val}
           </div>
        </div>

        <div className="absolute bottom-4 right-4 text-right">
           <div className="text-[10px] font-black text-text-muted uppercase mb-1">Primitive Status</div>
           <div className={`text-sm font-black italic ${calculatePoints.length === n - 1 ? 'text-neon-cyan' : 'text-neon-magenta'}`}>
              {calculatePoints.length === n - 1 ? 'PRIMITIVE' : 'SUBGROUP'}
           </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={startAnimation} 
          disabled={isAnimating}
          className="flex items-center gap-2 px-6 py-3 bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/30 rounded-2xl text-neon-cyan text-xs font-black uppercase tracking-widest transition-all disabled:opacity-30"
        >
          <Play size={16} /> Animate
        </button>
        <button 
          onClick={reset}
          className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-text-primary text-xs font-black uppercase tracking-widest transition-all"
        >
          <RotateCcw size={16} /> Reset
        </button>
      </div>
      
      <div className="w-full p-4 bg-black/40 rounded-2xl border border-white/5 space-y-2">
         <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-text-muted uppercase">Formula</span>
            <span className="text-xs font-mono text-neon-gold">{a}<sup>m</sup> mod {n}</span>
         </div>
         <div className="text-[10px] text-text-secondary italic leading-relaxed">
            The orbit traces the sequence of powers. A Primitive Root will visit all residues (points) around the circle before returning to 1.
         </div>
      </div>
    </div>
  );
}
