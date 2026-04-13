import { 
  SolverDashboard, FormGroup, ResultBox, VizPanel, FrequencyChart 
} from '../../../components/ui/SolverComponents';
import { 
  useCaesarCipher, useVigenereRepeating, useVigenereAutokey, 
  useMonoalphabetic, usePlayfair, usePermutation 
} from '../hooks/useClassicalCiphers';
import { CaesarCipherWheel } from './CaesarCipherWheel';
import { A, mod } from '../utils/cryptoMath';

export function CaesarSolver() {
  const { plain, setPlain, key, setKey, cipher, k } = useCaesarCipher();

  return (
    <SolverDashboard title="Caesar Cipher" number="1" subtitle="Single-alphabet shift cipher. C = (P + K) mod 26.">
      <div className="flex flex-col gap-6">
        <FormGroup label="Plain Text" value={plain} onChange={e => setPlain(e.target.value)} />
        <FormGroup label="Key (Shift)" value={key} onChange={e => setKey(e.target.value)} type="number" />
        <ResultBox value={cipher} />
        
        <FrequencyChart plain={plain} cipher={cipher} />
      </div>
      
      <div className="flex flex-col gap-6">
        <VizPanel 
          title="Interactive Cipher Disk" 
          description={`Formula: C = (P + ${k}) mod 26. The inner ring shifts ${k} positions.`}
        >
          <div className="flex justify-center py-4">
            <CaesarCipherWheel k={k} />
          </div>
        </VizPanel>

        <VizPanel title="Mapping Table" description="Quick reference for current shift.">
          <div className="overflow-x-auto custom-scrollbar pb-2">
            <table className="w-full text-left text-[11px] font-mono border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-border-medium">
                  <th className="py-2 text-text-secondary font-bold pr-4 border-r border-border-subtle">Plain</th>
                  {A.split('').map(c => <th key={c} className="px-1 py-1 text-center text-text-primary font-bold">{c}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 text-neon-cyan font-semibold pr-4 border-r border-border-subtle uppercase">Cipher</td>
                  {A.split('').map((c, i) => <td key={c} className="px-1 py-1 text-center text-neon-cyan font-bold">{A[mod(i+k, 26)]}</td>)}
                </tr>
              </tbody>
            </table>
          </div>
        </VizPanel>
      </div>
    </SolverDashboard>
  );
}

export function VigenereRepeatingSolver() {
  const { plain, setPlain, key, setKey, cipher, steps } = useVigenereRepeating();
  return (
    <SolverDashboard title="Vigenère Cipher (Repeating Key)" number="2" subtitle="Polyalphabetic substitution using a cyclic key.">
      <>
        <FormGroup label="Plain Text" value={plain} onChange={e => setPlain(e.target.value)} />
        <FormGroup label="Key Word" value={key} onChange={e => setKey(e.target.value)} />
        <ResultBox value={cipher} />
      </>
      <>
        <VizPanel title="Step-by-Step Calculation" description={<>Formula: <span className="text-neon-cyan">C<sub>i</sub> = (P<sub>i</sub> + K<sub>i mod len</sub>) mod 26</span></>}>
          <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
            <table className="w-full text-[14px] font-mono text-left">
              <thead className="sticky top-0 bg-bg-surface dark:bg-[#121220] text-neon-cyan text-[14px] uppercase z-10 shadow-md">
                <tr><th className="p-2 font-bold">#</th><th className="p-2 font-bold">Plain</th><th className="p-2 font-bold">Key</th><th className="p-2 font-bold">Calc (P+K)</th><th className="p-2 font-bold">Cipher</th></tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {steps.map((s, i) => (
                  <tr key={i} className="hover:dark:bg-white/5 bg-black/5 transition-colors">
                    <td className="p-2 text-text-secondary">{i+1}</td>
                    <td className="p-2 text-neon-cyan/90">{s.p}</td>
                    <td className="p-2 text-neon-gold">{s.k}</td>
                    <td className="p-2 text-text-secondary">{s.pIdx} + {s.kIdx} = {s.ci}</td>
                    <td className="p-2 text-neon-purple font-bold">{s.c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </VizPanel>
      </>
    </SolverDashboard>
  );
}

export function VigenereAutokeySolver() {
  const { plain, setPlain, key, setKey, cipher, steps, initK } = useVigenereAutokey();
  return (
    <SolverDashboard title="Vigenère Cipher (Autokey)" number="3" subtitle="Key stream appends the plaintext after initial key.">
      <>
        <FormGroup label="Plain Text" value={plain} onChange={e => setPlain(e.target.value)} />
        <FormGroup label="Initial Key" value={key} onChange={e => setKey(e.target.value)} />
        <ResultBox value={cipher} />
      </>
      <>
        <VizPanel title="Autokey Generation" description={`Full Keystream = "${initK}" + Plaintext`}>
          <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
            <table className="w-full text-[14px] font-mono text-left">
              <thead className="sticky top-0 bg-bg-surface dark:bg-[#121220] text-neon-cyan text-[14px] uppercase z-10 shadow-md">
                <tr><th className="p-2 font-bold">#</th><th className="p-2 font-bold">Plain</th><th className="p-2 font-bold">Key</th><th className="p-2 font-bold">Source</th><th className="p-2 font-bold">Cipher</th></tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {steps.map((s, i) => (
                  <tr key={i} className="hover:dark:bg-white/5 bg-black/5 transition-colors">
                    <td className="p-2 text-text-secondary">{i+1}</td>
                    <td className="p-2 text-neon-cyan/90">{s.p}</td>
                    <td className="p-2 text-neon-gold">{s.k}</td>
                    <td className="p-2 text-text-secondary">{s.src}</td>
                    <td className="p-2 text-neon-purple font-bold">{s.c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </VizPanel>
      </>
    </SolverDashboard>
  );
}

export function MonoalphabeticSolver() {
  const { plain, setPlain, key, setKey, cipher, ka, isValid } = useMonoalphabetic();
  return (
    <SolverDashboard title="Monoalphabetic Substitution" number="4" subtitle="Maps alphabet to a shuffled 26-character sequence.">
      <>
        <FormGroup label="Plain Text" value={plain} onChange={e => setPlain(e.target.value)} />
        <FormGroup label="26-Char Key Map" value={key} onChange={e => setKey(e.target.value)} />
        <ResultBox value={cipher} warning={!isValid ? 'Warning: Key alphabet must be exactly 26 letters.' : null} />
      </>
      <>
        <VizPanel title="Substitution Map">
          <table className="w-full text-left text-[14px] font-mono border-collapse">
            <thead>
              <tr className="border-b border-border-medium">
                <th className="py-2 text-text-secondary font-bold pr-4 border-r border-border-subtle">Plain</th>
                {A.split('').map(c => <th key={c} className="px-2 py-2 text-center text-text-primary font-bold">{c}</th>)}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 text-neon-gold font-semibold pr-4 border-r border-border-subtle">Cipher</td>
                {ka.split('').map((c, i) => <td key={i} className="px-2 py-2 text-center text-neon-gold font-bold">{c}</td>)}
              </tr>
            </tbody>
          </table>
        </VizPanel>
        <FrequencyChart plain={plain} cipher={cipher} />
      </>
    </SolverDashboard>
  );
}

export function PlayfairSolver() {
  const { plain, setPlain, key, setKey, cipher, steps, matrix } = usePlayfair();
  return (
    <SolverDashboard title="Playfair Cipher" number="5" subtitle="Digraph encryption on a 5×5 matrix (replaces J with I).">
      <>
        <FormGroup label="Plain Text" value={plain} onChange={e => setPlain(e.target.value)} />
        <FormGroup label="Key Word" value={key} onChange={e => setKey(e.target.value)} />
        <ResultBox value={cipher} />
      </>
      <>
        <div className="grid grid-cols-2 gap-4">
          <VizPanel title="5×5 Matrix">
            <div className="grid grid-cols-5 gap-1.5 mx-auto mt-2">
              {matrix.map((c, i) => (
                <div key={i} className="aspect-square flex items-center justify-center font-mono font-bold text-[14px] dark:bg-white/5 bg-black/5 border border-neon-orange/40 rounded-lg dark:text-white text-text-primary">
                  {c}
                </div>
              ))}
            </div>
          </VizPanel>
          <VizPanel title="Digraphs & Rules">
            <div className="overflow-y-auto custom-scrollbar flex-1">
              <table className="w-full text-[14px] font-mono text-left">
                <thead className="sticky top-0 bg-bg-surface dark:bg-[#121220] text-neon-cyan text-[14px] uppercase z-10">
                  <tr><th className="pb-2 font-bold">Pair</th><th className="pb-2 font-bold">Rule</th><th className="pb-2 font-bold">Cipher</th></tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {steps.map((s, i) => (
                    <tr key={i}>
                      <td className="py-2 text-neon-cyan/90">{s.a}{s.b}</td>
                      <td className="py-2 text-text-muted">{s.rule}</td>
                      <td className="py-2 text-neon-purple font-bold">{s.ca}{s.cb}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </VizPanel>
        </div>
      </>
    </SolverDashboard>
  );
}

export function PermutationSolver() {
  const { plain, setPlain, key, setKey, cipher, grid, rows, C } = usePermutation();
  return (
    <SolverDashboard title="Permutation Cipher" number="6" subtitle="Writes text into columns, reads columns downwards.">
      <>
        <FormGroup label="Plain Text" value={plain} onChange={e => setPlain(e.target.value)} />
        <FormGroup label="Grid Columns" value={key} onChange={e => setKey(e.target.value)} type="number" />
        <ResultBox value={cipher} />
      </>
      <>
        <VizPanel title="Transposition Grid" description="Written left-to-right, read top-to-bottom.">
          {grid.length > 0 && C > 1 && (
            <table className="w-full mx-auto text-[14px] font-mono text-center">
              <thead className="border-b border-border-medium text-neon-cyan">
                <tr>{[...Array(C)].map((_, i) => <th key={i} className="py-2 font-bold">Col {i+1}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {grid.map((rowArr, r) => (
                  <tr key={r} className="hover:dark:bg-white/5 bg-black/5 transition-colors">
                    {[...rowArr].map((char, c) => <td key={c} className="py-2 text-text-primary text-lg font-semibold">{char}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </VizPanel>
      </>
    </SolverDashboard>
  );
}
