import React from 'react';
import { useAES } from './hooks/useAES';
import { FormGroup, ResultBox, VizPanel } from '../../../components/ui/SolverComponents';
import { ErrorBoundary } from '../../../components/ui/ErrorBoundary';
import { AESTimeTravelStepper } from './components/AESTimeTravelStepper';


function HexMatrix({ mat, title, highlight=false }) {
  if (!mat) return null;
  return (
    <div className="mb-4">
      {title && <h5 className="text-[14px] text-text-muted uppercase mb-1 font-bold">{title}</h5>}
      <div className="grid grid-cols-4 gap-1 w-[120px]">
        {mat.map((row, r) => 
          row.map((val, c) => (
             <div key={`${r}-${c}`} className={`flex items-center justify-center font-mono text-xs w-6 h-6 rounded ${highlight ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50' : 'dark:bg-white/5 bg-black/5 text-text-primary border border-border-subtle'}`}>
               {val}
             </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function AESPage() {
  const { hexMessage, setHexMessage, hexKey, setHexKey, selectedRound, setSelectedRound, result, error } = useAES();

  return (
    <div className="pt-2 pl-[40px] max-w-[1200px]">
      <div className="mb-10">
        <div className="text-[12px] text-text-muted mb-2 flex items-center gap-1.5">
          <span>Cryptography</span><span className="opacity-50">›</span><span>Modules</span><span className="opacity-50">›</span><span className="text-neon-cyan font-semibold">AES Encryption</span>
        </div>
        <h1 className="text-[32px] font-extrabold tracking-tight bg-gradient-to-br from-text-primary to-neon-cyan text-transparent bg-clip-text leading-tight mb-2">
          Advanced Encryption Standard (AES)
        </h1>
        <p className="text-[15px] text-text-secondary max-w-[680px] leading-relaxed">
          State matrix visualization across 10 rounds. Watch Galois Field matrix multiplications (MixColumns) and Rijndael S-Box substitutions dynamically.
        </p>
      </div>

      <ErrorBoundary>
        <div className="grid grid-cols-1 lg:grid-cols-[320px_750px] gap-6 mb-10">
          <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 shadow-lg flex flex-col h-full">
            <h3 className="text-lg font-bold text-neon-cyan mb-5">Configuration & Output</h3>
            <FormGroup label="Plaintext (128-bit Hex)" value={hexMessage} onChange={e=>setHexMessage(e.target.value)} />
            <FormGroup label="Key (128-bit Hex)" value={hexKey} onChange={e=>setHexKey(e.target.value)} />
            
            {error ? (
              <div className="text-neon-magenta text-sm mt-4">{error}</div>
            ) : (
              <div className="mt-auto">
                <ResultBox label="Final Ciphertext (Hex)" value={result?.finalHex} />
              </div>
            )}
          </div>

          {!error && result && (
             <div className="flex flex-col gap-5">
               <VizPanel title="1. Key Expansion (w_i generation)">
                  <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left text-[14px] font-mono border-collapse">
                      <thead className="sticky top-0 bg-bg-surface dark:bg-[#121220] text-neon-cyan">
                        <tr><th className="py-2 font-bold">Word</th><th className="py-2 font-bold">Prev w[i-1]</th><th className="py-2 font-bold">Prev w[i-4]</th><th className="py-2 font-bold">RotWord/SubWord Temp</th><th className="py-2 font-bold">w[i] Output</th></tr>
                      </thead>
                      <tbody className="divide-y divide-border-subtle">
                        {result.keyExpSteps.slice(0, 10).map((s, i) => ( // Show first 10 for brevity
                           <tr key={i} className="hover:dark:bg-white/5 bg-black/5">
                             <td className="py-2 text-text-secondary">w_{s.i}</td>
                             <td className="py-2">{s.prevW.map(x=>x.toString(16).padStart(2,'0').toUpperCase()).join('')}</td>
                             <td className="py-2">{s.w_new.map((x,idx)=>(x^s.temp[idx]).toString(16).padStart(2,'0').toUpperCase()).join('')}</td>
                             <td className="py-2 text-neon-gold">{s.temp.map(x=>x.toString(16).padStart(2,'0').toUpperCase()).join('')}</td>
                             <td className="py-2 text-neon-purple font-bold">{s.w_new.map(x=>x.toString(16).padStart(2,'0').toUpperCase()).join('')}</td>
                           </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </VizPanel>
               
               <VizPanel title="2. Internal State per Round (0 - 10)">
                 <div className="flex flex-wrap gap-2 mb-4 dark:bg-black/40 bg-black/10 p-2 rounded-lg justify-between">
                   {[...Array(11)].map((_, i) => (
                     <button 
                       key={i} 
                       onClick={() => setSelectedRound(i)}
                       className={`px-3 py-1 rounded text-xs font-mono transition-colors flex-1 ${selectedRound === i ? 'bg-neon-cyan text-black font-bold' : 'dark:bg-white/5 bg-black/5 text-text-secondary hover:bg-white/10'}`}
                     >
                       R{i}
                     </button>
                   ))}
                 </div>
                 
                 {(() => {
                   const r = result.rounds[selectedRound];
                   if (!r) return null;
                   
                   if (r.round === 0) {
                     return (
                        <div className="overflow-x-auto custom-scrollbar pb-4">
                          <div className="flex gap-4 min-w-max">
                             <HexMatrix mat={result.rounds[1].preSub} title="Input State" />
                             <HexMatrix mat={r.stateAfter} title="After AddRoundKey (K0)" highlight />
                          </div>
                        </div>
                     )
                   }
                   
                   return (
                     <div className="overflow-x-auto custom-scrollbar pb-4">
                       <div className="flex gap-4 min-w-max">
                          <HexMatrix mat={r.preSub} title="Input State" />
                          <HexMatrix mat={r.postSub} title="After SubBytes" />
                          <HexMatrix mat={r.postShift} title="After ShiftRows" />
                          {r.postMix ? (
                            <HexMatrix mat={r.postMix} title="After MixColumns" />
                          ) : (
                            <div className="w-[120px] h-[120px] flex items-center justify-center text-xs text-text-muted italic border border-dashed border-border-subtle rounded">No MixColumns</div>
                          )}
                          <HexMatrix mat={r.stateAfter} title={`AddRoundKey (K${r.round})`} highlight />
                       </div>
                     </div>
                   )
                 })()}
               </VizPanel>

             </div>
        </div>

          {!error && result && (
            <div className="mt-12">
              <AESTimeTravelStepper 
                plaintext={hexMessage} 
                encryptionKey={hexKey} 
              />
            </div>
          )}
      </ErrorBoundary>

    </div>
  );
}
