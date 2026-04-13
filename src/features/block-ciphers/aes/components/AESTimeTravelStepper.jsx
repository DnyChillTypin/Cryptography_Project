import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { getAESHistory } from '../utils/aesTimeTravel';

/**
 * AESTimeTravelStepper - Kinetic Version
 * 
 * KINETIC LOGIC:
 * 1. Current Step Index: User moves the slider.
 * 2. Phase 1 (0-1s): SHOWING_OPERATOR. 
 *    - Left Box shows State(N-1). 
 *    - Right Box pops up with the "Operator" (Key, Sub result, etc.).
 * 3. Phase 2 (1-1.5s): MERGING.
 *    - Right Box content physically glides into the Left Box coordinates.
 * 4. Phase 3 (1.5s+): COMPLETED.
 *    - Left Box updates to State(N).
 *    - Right Box is empty or ready for next step.
 */

export function AESTimeTravelStepper({ plaintext = "00112233445566778899AABBCCDDEEFF", encryptionKey = "000102030405060708090A0B0C0D0E0F" }) {
  const history = useMemo(() => getAESHistory(plaintext, encryptionKey), [plaintext, encryptionKey]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationPhase, setAnimationPhase] = useState('showing_operator'); // 'showing_operator', 'merging', 'completed'

  const currentStep = history[currentIndex];
  const totalSteps = history.length;

  useEffect(() => {
    // Reset animation cycle on index change
    setAnimationPhase('showing_operator');
    
    // Step 2: Begin merge after 1s
    const mergeTimer = setTimeout(() => {
      setAnimationPhase('merging');
    }, 1000);

    // Step 3: Complete merge after 0.5s of sliding
    const completeTimer = setTimeout(() => {
      setAnimationPhase('completed');
    }, 1500);

    return () => {
      clearTimeout(mergeTimer);
      clearTimeout(completeTimer);
    };
  }, [currentIndex]);

  const handleNext = () => setCurrentIndex(prev => Math.min(prev + 1, totalSteps - 1));
  const handlePrev = () => setCurrentIndex(prev => Math.max(prev - 1, 0));

  return (
    <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 shadow-xl space-y-8 min-h-[600px]">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-neon-cyan flex items-center gap-2 uppercase tracking-tight">
            Kinetic AES Engine
          </h3>
          <p className="text-sm text-text-secondary mt-1">
            Watch transformations migrate from source to result.
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-bg-surface p-2 rounded-xl border border-white/5">
          <button onClick={handlePrev} disabled={currentIndex === 0} className="p-2 hover:bg-white/5 rounded-lg disabled:opacity-30 transition-colors text-neon-cyan">
             <ChevronLeft size={20} />
          </button>
          <div className="text-sm font-mono font-bold text-text-primary px-4 border-x border-white/10">
            STEP {currentIndex + 1} / {totalSteps}
          </div>
          <button onClick={handleNext} disabled={currentIndex === totalSteps - 1} className="p-2 hover:bg-white/5 rounded-lg disabled:opacity-30 transition-colors text-neon-cyan">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
        
        {/* Kinetic Arena */}
        <div className="space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-16 relative">
            
            {/* Box 1: OPERATOR SOURCE (Now on Left) */}
            <div className="space-y-4">
              <div className="flex justify-between items-end px-1">
                <span className="text-[10px] font-black text-neon-gold uppercase tracking-[0.2em]">Operator Source</span>
                <span className="text-[9px] text-neon-gold font-mono animate-pulse">{currentStep.type.toUpperCase()}</span>
              </div>
              <div className="relative aspect-square p-2 bg-black/60 rounded-3xl border-2 border-neon-gold/10 shadow-[inner_0_0_40px_rgba(0,0,0,0.8)]">
                <AnimatePresence mode="wait">
                  {animationPhase !== 'completed' && (
                    <motion.div 
                      key={`op-container-${currentIndex}`}
                      className="grid grid-cols-4 grid-rows-4 gap-2 w-full h-full grow-columns"
                      initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1, 
                        rotateY: 0,
                        // Displacement = 100% (width) + 4rem (gap) + 20px (padding/borders of both boxes)
                        x: animationPhase === 'merging' ? 'calc(100% + 4rem + 20px)' : 0 
                      }}

                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ 
                         duration: animationPhase === 'merging' ? 0.4 : 0.4,
                         ease: animationPhase === 'merging' ? "circIn" : "easeOut"
                      }}
                    >
                      {currentStep.operatorState.map((byte, idx) => (
                        <motion.div
                          key={`op-${idx}`}
                          className="flex items-center justify-center bg-bg-surface border-2 border-neon-gold/40 rounded-xl font-mono text-xs sm:text-sm md:text-base font-bold text-neon-gold shadow-[0_0_15px_rgba(255,215,0,0.1)]"
                        >
                          {byte.toString(16).padStart(2, '0').toUpperCase()}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Status Indicator */}
                {animationPhase === 'completed' && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="absolute inset-0 flex items-center justify-center text-neon-gold/10 font-black text-4xl italic select-none"
                  >
                    MERGED
                  </motion.div>
                )}
              </div>
            </div>

            {/* Box 2: ACCUMULATED RESULT (Now on Right) */}
            <div className="space-y-4">
              <div className="flex justify-between items-end px-1">
                <span className="text-[10px] font-black text-neon-cyan uppercase tracking-[0.2em]">Result Box</span>
                <span className="text-[9px] text-text-muted font-mono">{animationPhase === 'completed' ? 'UPDATED' : 'WAITING...'}</span>
              </div>
              <div className="relative aspect-square p-2 bg-black/60 rounded-3xl border-2 border-neon-cyan/20 shadow-[inner_0_0_40px_rgba(0,0,0,0.8)] overflow-visible">
                <div className="grid grid-cols-4 grid-rows-4 gap-2 w-full h-full grow-columns">
                  {(animationPhase === 'completed' ? currentStep.nextState : currentStep.prevState).map((byte, idx) => (
                    <div
                      key={`res-${idx}`}
                      className={`flex items-center justify-center rounded-xl font-mono text-xs sm:text-sm md:text-base font-bold transition-all duration-300 ${animationPhase === 'completed' ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40 scale-[1.05]' : 'bg-white/5 text-text-muted border border-white/10'}`}
                    >
                      {byte.toString(16).padStart(2, '0').toUpperCase()}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Kinetic Bridge Arrow (Visible during merge) */}
            <AnimatePresence>
               {animationPhase === 'merging' && (
                 <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
                 >
                   <div className="text-4xl text-neon-cyan animate-pulse text-shadow-neon">➔</div>
                 </motion.div>
               )}
            </AnimatePresence>
          </div>


          {/* Slider */}
          <div className="relative pt-12 pb-4">
            <input 
              type="range"
              min="0"
              max={totalSteps - 1}
              value={currentIndex}
              onChange={(e) => setCurrentIndex(parseInt(e.target.value))}
              className="w-full h-1.5 bg-bg-surface rounded-full appearance-none cursor-pointer accent-neon-cyan border border-white/5 active:scale-[1.01] transition-transform"
            />
            <div className="grid grid-cols-3 mt-6 text-[10px] font-mono font-bold tracking-[0.1em] uppercase">
              <div className="text-text-muted">PLAINTEXT</div>
              <div className="text-center bg-neon-cyan/10 text-neon-cyan py-1 px-3 rounded-full border border-neon-cyan/20 w-fit mx-auto min-w-[140px]">
                {currentStep.label}
              </div>
              <div className="text-right text-text-muted">CIPHERTEXT</div>
            </div>
          </div>
        </div>

        {/* Info Column */}
        <div className="space-y-6">
          <div className="bg-[#0f0f1e]/80 border border-white/5 rounded-3xl p-6 h-full flex flex-col backdrop-blur-md">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-3 h-3 rounded-full shadow-[0_0_10px] ${animationPhase === 'showing_operator' ? 'bg-neon-gold shadow-neon-gold animate-pulse' : 'bg-neon-cyan shadow-neon-cyan'}`}></div>
              <h4 className="text-xs font-black text-text-primary uppercase tracking-widest italic">Process Terminal</h4>
            </div>
            
            <div className="flex-1 space-y-6">
               <div>
                  <div className="text-neon-cyan font-mono text-xl font-black mb-2 flex items-baseline gap-2">
                    <span className="text-xs opacity-40">STEP_</span>{currentStep.label}
                  </div>
                  <div className="h-0.5 w-12 bg-neon-cyan/30 rounded-full mb-4"></div>
                  <p className="text-xs text-text-secondary leading-relaxed font-medium">
                    {currentStep.description}
                  </p>
               </div>

               <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-neon-cyan/30 transition-colors">
                    <span className="text-[9px] font-black text-text-muted block mb-2 uppercase tracking-wider">Current Operation</span>
                    <span className="text-xs font-mono text-neon-gold">{currentStep.type.toUpperCase()}</span>
                  </div>
                  
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-[9px] font-black text-text-muted block mb-2 uppercase tracking-wider">Status Log</span>
                    <span className="text-[10px] font-mono text-text-primary uppercase">
                       {animationPhase === 'showing_operator' && '> LOADING_SOURCE...'}
                       {animationPhase === 'merging' && '> MERGING_TRANSFORM...'}
                       {animationPhase === 'completed' && '> COMPUTE_FINALIZED.'}
                    </span>
                  </div>
               </div>
            </div>

            <button 
              onClick={() => setCurrentIndex(0)}
              className="mt-8 flex items-center justify-center gap-3 py-4 bg-bg-surface border border-white/5 hover:border-neon-cyan/50 hover:bg-neon-cyan/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all"
            >
              <RefreshCw size={14} /> REBOOT SEQUENCE
            </button>
          </div>
        </div>

      </div>

      <style>{`
        .grow-columns {
            grid-auto-flow: column;
        }
        .text-shadow-neon {
            text-shadow: 0 0 10px rgba(0, 240, 255, 0.8), 0 0 20px rgba(0, 240, 255, 0.4);
        }
      `}</style>
    </div>
  );
}
