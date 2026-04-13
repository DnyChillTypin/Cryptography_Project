import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, RefreshCw } from 'lucide-react';
import { getAESHistory } from '../utils/aesTimeTravel';

/**
 * AESTimeTravelStepper - An interactive visualizer for the AES-128 sub-steps.
 * 
 * TECHNICAL BREAKDOWN:
 * 1. STATE BINDING: The slider input maps directly to the index of our historyArray.
 *    Changing the slider updates 'currentIndex', which triggers a re-render of the specific
 *    matrix state associated with that step.
 * 
 * 2. 1D to 2D MAPPING:
 *    The AES state is a 1D array of 16 bytes. To visualize this as a 4x4 matrix, we use 
 *    CSS Grid with 'grid-auto-flow: column'. This ensures that indices 0-3 are placed 
 *    in the first column, matching the mathematical representation.
 * 
 * 3. ANIMATION LOGIC:
 *    We use Framer Motion's 'layout' prop. Each byte is rendered in a <motion.div>
 *    with a 'layoutId' based on its original position in the plaintext (if we tracked it)
 *    or simply its value/position. For ShiftRows, the values change indices. Framer Motion
 *    detects the change in the DOM tree and performs a FLIP animation to slide the 
 *    elements to their new coordinates.
 */

export function AESTimeTravelStepper({ plaintext = "00112233445566778899AABBCCDDEEFF", encryptionKey = "000102030405060708090A0B0C0D0E0F" }) {
  const history = useMemo(() => getAESHistory(plaintext, encryptionKey), [plaintext, encryptionKey]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentStep = history[currentIndex];
  const totalSteps = history.length;

  const handleNext = () => setCurrentIndex(prev => Math.min(prev + 1, totalSteps - 1));
  const handlePrev = () => setCurrentIndex(prev => Math.max(prev - 1, 0));

  return (
    <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 shadow-xl space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-neon-cyan flex items-center gap-2">
            AES-128 Time-Travel Stepper
          </h3>
          <p className="text-sm text-text-secondary mt-1">
            Scrub through every sub-step of the encryption process.
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-bg-surface p-2 rounded-xl border border-white/5">
          <button onClick={handlePrev} disabled={currentIndex === 0} className="p-2 hover:bg-white/5 rounded-lg disabled:opacity-30 transition-colors">
            <ChevronLeft size={20} className="text-neon-cyan" />
          </button>
          <div className="text-sm font-mono font-bold text-text-primary px-4 border-x border-white/10">
            STEP {currentIndex + 1} / {totalSteps}
          </div>
          <button onClick={handleNext} disabled={currentIndex === totalSteps - 1} className="p-2 hover:bg-white/5 rounded-lg disabled:opacity-30 transition-colors">
            <ChevronRight size={20} className="text-neon-cyan" />
          </button>
        </div>
      </div>

      {/* Main Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        
        {/* Matrix Area */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* State Matrix */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-text-muted uppercase tracking-widest">State Matrix</span>
              <div className="grid grid-cols-4 grid-rows-4 gap-2 w-full p-2 bg-black/40 rounded-2xl border border-white/5 shadow-inner grow-columns">
                {currentStep.state.map((byte, idx) => (
                  <motion.div
                    key={`state-${idx}`}
                    layout
                    className="flex items-center justify-center bg-bg-surface border border-neon-cyan/20 rounded-lg font-mono text-xs sm:text-sm md:text-base font-bold text-neon-cyan shadow-[0_0_10px_rgba(0,240,255,0.05)] aspect-square"
                  >
                    {byte.toString(16).padStart(2, '0').toUpperCase()}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Round Key Matrix (If applicable) */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Round Key</span>
              {currentStep.roundKey ? (
                <div className="grid grid-cols-4 grid-rows-4 gap-2 w-full p-2 bg-black/40 rounded-2xl border border-neon-gold/10 shadow-inner grow-columns">
                  {currentStep.roundKey.map((byte, idx) => (
                    <motion.div
                      key={`key-${idx}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center justify-center bg-bg-surface border border-neon-gold/20 rounded-lg font-mono text-xs sm:text-sm md:text-base font-bold text-neon-gold aspect-square"
                    >
                      {byte.toString(16).padStart(2, '0').toUpperCase()}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="w-full aspect-square bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center italic text-text-muted text-xs sm:text-sm text-center p-6">
                  Not used in this step.
                </div>
              )}
            </div>

          </div>

          {/* Slider */}
          <div className="relative pt-6">
            <input 
              type="range"
              min="0"
              max={totalSteps - 1}
              value={currentIndex}
              onChange={(e) => setCurrentIndex(parseInt(e.target.value))}
              className="w-full h-2 bg-bg-surface rounded-lg appearance-none cursor-pointer accent-neon-cyan hover:accent-neon-cyan/80 transition-all border border-white/5"
            />
            <div className="grid grid-cols-3 mt-4 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-tighter">
              <div className="text-left text-text-muted">
                START <span className="hidden sm:inline block opacity-40 text-[8px]">PLAINTEXT</span>
              </div>
              <div className="text-center text-neon-cyan truncate px-2">
                {currentStep.label}
              </div>
              <div className="text-right text-text-muted">
                FINAL <span className="hidden sm:inline block opacity-40 text-[8px]">CIPHER</span>
              </div>
            </div>
          </div>
        </div>



        {/* Sidebar: Step Details */}
        <div className="flex flex-col gap-4">
          <div className="bg-[#0f0f1e66] border border-border-subtle rounded-2xl p-5 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse"></div>
              <h4 className="text-sm font-bold text-text-primary uppercase tracking-wide">Step Explanation</h4>
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="text-neon-cyan font-mono text-lg font-bold border-b border-white/5 pb-2">
                {currentStep.label}
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                {currentStep.description}
              </p>
              
              <div className="pt-4 space-y-3">
                <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                  <span className="text-[10px] font-bold text-text-muted block mb-1">ALGORITHM PHASE</span>
                  <span className="text-xs font-mono text-text-primary">
                    {currentIndex === 0 ? 'Initialization' : currentIndex === totalSteps - 1 ? 'Final State' : 'Round Processing'}
                  </span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setCurrentIndex(0)}
              className="mt-6 flex items-center justify-center gap-2 py-3 bg-bg-surface border border-white/5 hover:border-neon-cyan/30 hover:bg-neon-cyan/5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
            >
              <RefreshCw size={14} /> RESET STEPS
            </button>
          </div>
        </div>

      </div>

      <style>{`
        .grow-columns {
            grid-auto-flow: column;
        }
      `}</style>
    </div>
  );
}
