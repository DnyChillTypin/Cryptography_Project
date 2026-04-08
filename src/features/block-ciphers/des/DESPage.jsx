import React from 'react';
import { useDES } from './hooks/useDES';
import { FormGroup, ResultBox, VizPanel } from '../../../components/ui/SolverComponents';
import { ErrorBoundary } from '../../../components/ui/ErrorBoundary';

function HexGrid({ hexStr, blockSize=2, title }) {
  if (!hexStr) return null;
  const blocks = [];
  for(let i=0; i<hexStr.length; i+=blockSize) blocks.push(hexStr.substr(i, blockSize));
  return (
    <div className="mb-4">
      {title && <h5 className="text-[14px] text-text-muted uppercase mb-1 font-bold">{title} (Hex)</h5>}
      <div className="flex flex-wrap gap-1 font-mono text-sm">
        {blocks.map((b, i) => (
           <span key={i} className="dark:bg-white/5 bg-black/5 border border-border-subtle px-1.5 py-0.5 rounded text-neon-cyan">{b}</span>
        ))}
      </div>
    </div>
  );
}

export default function DESPage() {
  const { hexMessage, setHexMessage, hexKey, setHexKey, selectedRound, setSelectedRound, result, error } = useDES();

  return (
    <div className="pt-2 pl-[40px] max-w-[1200px]">
      <div className="mb-10">
        <div className="text-[12px] text-text-muted mb-2 flex items-center gap-1.5">
          <span>Cryptography</span><span className="opacity-50">›</span><span>Modules</span><span className="opacity-50">›</span><span className="text-neon-purple font-semibold">DES Encryption</span>
        </div>
        <h1 className="text-[32px] font-extrabold tracking-tight bg-gradient-to-br from-text-primary to-neon-green text-transparent bg-clip-text leading-tight mb-2">
          Data Encryption Standard (DES)
        </h1>
        <p className="text-[15px] text-text-secondary max-w-[680px] leading-relaxed">
          A step-by-step 16-round Feistel network visualization. Observe permutations, S-Box substitutions, and subkey generations.
        </p>
      </div>

      <ErrorBoundary>
        <div className="grid grid-cols-1 lg:grid-cols-[320px_750px] gap-6 mb-10">
          <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 shadow-lg flex flex-col h-full">
            <h3 className="text-lg font-bold text-neon-purple mb-5">Configuration & Output</h3>
            <FormGroup label="Plaintext (64-bit Hex)" value={hexMessage} onChange={e=>setHexMessage(e.target.value)} />
            <FormGroup label="Key (64-bit Hex)" value={hexKey} onChange={e=>setHexKey(e.target.value)} />
            
            {error ? (
              <div className="text-neon-magenta text-sm mt-4">{error}</div>
            ) : (
              <div className="mt-auto">
                <ResultBox label="Final Ciphertext (Hex)" value={result?.finalCipherHex} />
              </div>
            )}
          </div>

          {!error && result && (
             <div className="flex flex-col gap-5">
               <div className="grid grid-cols-2 gap-5">
                 <VizPanel title="1. Initial Permutation (IP)">
                   <HexGrid title="Original M" hexStr={hexMessage} blockSize={8} />
                   <HexGrid title="IP Output (L0 R0)" hexStr={result.ipOut} blockSize={8} />
                 </VizPanel>
                 <VizPanel title="2. Key Generation (PC-1)">
                   <HexGrid title="Original Key" hexStr={hexKey} blockSize={8} />
                   <HexGrid title="PC-1 Output (56-bit)" hexStr={result.pc1Out} blockSize={7} />
                 </VizPanel>
               </div>
               
               <VizPanel title="3. Feistel Network Rounds (1 - 16)">
                 <div className="flex flex-wrap gap-2 mb-4 dark:bg-black/40 bg-black/10 p-2 rounded-lg">
                   {[...Array(16)].map((_, i) => (
                     <button 
                       key={i} 
                       onClick={() => setSelectedRound(i+1)}
                       className={`px-3 py-1 rounded text-xs font-mono transition-colors ${selectedRound === i+1 ? 'bg-neon-green text-black font-bold' : 'dark:bg-white/5 bg-black/5 text-text-secondary hover:bg-white/10'}`}
                     >
                       R{i+1}
                     </button>
                   ))}
                 </div>
                 
                 {result.rounds[selectedRound - 1] && (() => {
                   const r = result.rounds[selectedRound - 1];
                   return (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm font-mono text-text-secondary">
                        <div className="dark:bg-white/5 bg-black/5 p-4 rounded-xl border border-border-subtle">
                          <div className="text-neon-purple mb-2 uppercase text-[14px] tracking-widest font-bold">Input (L{r.round-1}, R{r.round-1})</div>
                          <div>L: <span className="text-text-primary">{r.prevL_hex}</span></div>
                          <div>R: <span className="text-text-primary">{r.prevR_hex}</span></div>
                          <div className="mt-3 text-neon-gold uppercase text-[14px] tracking-widest font-bold">Subkey K{r.round}</div>
                          <div>K: <span className="text-neon-gold">{r.K_hex}</span></div>
                        </div>
                        
                        <div className="bg-bg-surface dark:bg-[#121220] p-4 rounded-xl border border-border-medium dark:border-neon-cyan/20">
                          <div className="text-neon-cyan mb-2 uppercase text-[14px] tracking-widest font-bold">f-function execution</div>
                          <div className="flex justify-between border-b border-border-subtle pb-1 mb-1"><span className="font-bold">E(R{r.round-1})</span><span className="dark:text-white text-text-primary">{r.expR_hex}</span></div>
                          <div className="flex justify-between border-b border-border-subtle pb-1 mb-1"><span className="font-bold">XOR K{r.round}</span><span className="dark:text-white text-text-primary">{r.xorRes_hex}</span></div>
                          <div className="flex justify-between border-b border-border-subtle pb-1 mb-1"><span className="font-bold">S-Box Out</span><span className="text-neon-magenta">{r.sboxOut_hex}</span></div>
                          <div className="flex justify-between"><span className="font-bold">P-Permute</span><span className="text-neon-purple font-bold">{r.fOut_hex}</span></div>
                        </div>

                        <div className="md:col-span-2 bg-neon-green/10 p-4 rounded-xl border border-neon-green/30 mt-2">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                             <div>
                               <div className="text-neon-purple mb-2 uppercase text-[14px] tracking-widest font-bold">Output (L{r.round}, R{r.round})</div>
                               <div>L: <span className="dark:text-white text-text-primary font-bold text-lg">{r.L_hex}</span></div>
                               <div>R: <span className="dark:text-white text-text-primary font-bold text-lg">{r.R_hex}</span></div>
                             </div>
                             <div className="flex items-center">
                               <div className="text-neon-purple uppercase text-[14px] tracking-widest font-bold opacity-70">L{r.round} = R{r.round-1}, R{r.round} = L{r.round-1} ⊕ f</div>
                             </div>
                           </div>
                        </div>
                     </div>
                   )
                 })()}
               </VizPanel>
               
               <VizPanel title="4. Final IP^-1">
                  <div className="text-sm text-text-secondary font-mono mb-2">Pre-output (R16 L16 swapped): <span className="dark:text-white text-text-primary">{result.preOutputHex}</span></div>
                  <div className="text-sm text-text-secondary font-mono">Final Ciphertext: <span className="text-neon-purple font-bold">{result.finalCipherHex}</span></div>
               </VizPanel>

             </div>
          )}
        </div>
      </ErrorBoundary>
    </div>
  );
}
