import React, { useState } from 'react';
import { 
  SolverDashboard, FormGroup, ResultBox, VizPanel 
} from '../../../components/ui/SolverComponents';
import { ErrorBoundary } from '../../../components/ui/ErrorBoundary';
import {
  useFastPowering, useExtendedEuclidean, useFermatLittle, useTotient,
  useEulersTheorem, useCRTExp, useCRTSystem, usePrimitiveRoot,
  useDiscreteLog, useBasicModulo
} from '../hooks/useNumberTheory';
import { ModularOrbitViz } from './ModularOrbitViz';

export function FastPoweringSolver() {
  const { base, setBase, exp, setExp, mod, setMod, result, steps, error } = useFastPowering();

  return (
    <ErrorBoundary>
      <SolverDashboard title="Fast Modular Exponentiation" number="1" subtitle="Compute b = a^m (mod n) efficiently.">
        <>
          <div className="grid grid-cols-3 gap-3">
            <FormGroup label="a (base)" value={base} onChange={e=>setBase(e.target.value)} type="number" />
            <FormGroup label="m (exp)" value={exp} onChange={e=>setExp(e.target.value)} type="number" />
            <FormGroup label="n (mod)" value={mod} onChange={e=>setMod(e.target.value)} type="number" />
          </div>
          {error ? <div className="text-neon-magenta mt-4 text-sm">{error}</div> : <ResultBox label="b" value={result?.toString()} />}
        </>
        <>
          <VizPanel title="Square and Multiply Steps">
            <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
              <table className="w-full text-[14px] font-mono text-left">
                <thead className="sticky top-0 bg-bg-surface dark:bg-[#121220] text-neon-cyan text-[14px] uppercase z-10">
                  <tr><th className="pb-2 font-bold">Step</th><th className="pb-2 font-bold">Action</th><th className="pb-2 font-bold">Calculation</th></tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {steps.map((s, i) => (
                    <tr key={i}>
                      <td className="py-2 text-text-secondary font-bold">{s.step}</td>
                      <td className="py-2 text-neon-gold font-bold">{s.action}</td>
                      <td className="py-2 text-neon-cyan/90">{s.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </VizPanel>
        </>
      </SolverDashboard>
    </ErrorBoundary>
  );
}

export function ExtendedEuclideanSolver() {
  const { a, setA, n, setN, g, x, y, steps, inverse, error } = useExtendedEuclidean();
  return (
    <ErrorBoundary>
      <SolverDashboard title="Extended Euclidean Algorithm" number="2" subtitle="Finds gcd(a, n) and its Bézout coefficients (x, y). Used for Mod Inverse.">
        <>
          <div className="grid grid-cols-2 gap-4">
            <FormGroup label="a" value={a} onChange={e=>setA(e.target.value)} type="number" />
            <FormGroup label="n (mod)" value={n} onChange={e=>setN(e.target.value)} type="number" />
          </div>
          {error ? <div className="text-neon-magenta mt-4 text-sm">{error}</div> : (
            <div className="mt-4">
              <div className="text-[14px] text-text-secondary mb-2">GCD({a || 'A'}, {n || 'N'}) = <span className="text-neon-cyan font-bold">{g?.toString()}</span></div>
              <ResultBox label={inverse ? "Modular Inverse (a^-1 mod n)" : "Result"} value={inverse || "Inverse Does Not Exist"} />
            </div>
          )}
        </>
        <>
          <VizPanel title="Algorithmic Steps (a*x + n*y = gcd)">
             <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
              <table className="w-full text-[14px] font-mono text-left">
                <thead className="sticky top-0 bg-bg-surface dark:bg-[#121220] text-neon-cyan text-[14px] uppercase z-10">
                  <tr>
                    <th className="pb-2 w-[16%] font-bold">q</th>
                    <th className="pb-2 w-[16%] font-bold">A</th>
                    <th className="pb-2 w-[16%] font-bold">N</th>
                    <th className="pb-2 w-[16%] font-bold">r</th>
                    <th className="pb-2 w-[16%] font-bold">x0</th>
                    <th className="pb-2 w-[16%] font-bold">y0</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {steps.map((s, i) => (
                    <tr key={i} className="hover:dark:bg-white/5 bg-black/5 transition-colors">
                      <td className="py-2 text-neon-magenta">{s.q}</td>
                      <td className="py-2 text-text-primary font-normal">{s.A}</td>
                      <td className="py-2 text-text-secondary">{s.B}</td>
                      <td className="py-2 text-neon-purple">{s.r}</td>
                      <td className="py-2 text-neon-gold">{s.x0}</td>
                      <td className="py-2 text-neon-cyan/90">{s.y0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </VizPanel>
        </>
      </SolverDashboard>
    </ErrorBoundary>
  );
}

export function FermatLittleSolver() {
  const { a, setA, m, setM, p, setP, result, error } = useFermatLittle();
  return (
    <ErrorBoundary>
      <SolverDashboard title="Fermat's Little Theorem" number="3" subtitle="b = a^m mod p. If p is prime and gcd(a,p)=1, a^(p-1) ≡ 1 mod p.">
         <>
          <div className="grid grid-cols-3 gap-3">
            <FormGroup label="a (base)" value={a} onChange={e=>setA(e.target.value)} type="number" />
            <FormGroup label="m (exp)" value={m} onChange={e=>setM(e.target.value)} type="number" />
            <FormGroup label="p (prime)" value={p} onChange={e=>setP(e.target.value)} type="number" />
          </div>
          {error ? <div className="text-neon-magenta mt-4 text-sm">{error}</div> : <ResultBox label="Result (b)" value={result?.toString()} />}
        </>
        <>
          <VizPanel title="Theorem Context">
             <div className="text-[14px] font-mono text-text-secondary leading-loose">
                <div>If {p || 'p'} is a prime number:</div>
                <div className="dark:bg-white/5 bg-black/5 p-3 rounded-lg border border-border-subtle mt-2 mb-2 text-neon-cyan text-center text-lg">
                  {a || 'a'}<sup>{p ? `${p}-1` : 'p-1'}</sup> ≡ 1 (mod {p || 'p'})
                </div>
                <div>Because exponent m = {m}, we can simplify: <span className="text-neon-gold">{m} = k*({(p ? parseInt(p)-1 : 'p-1')}) + r</span></div>
             </div>
          </VizPanel>
        </>
      </SolverDashboard>
    </ErrorBoundary>
  );
}

export function TotientSolver() {
  const { n, setN, result, factors, formulaStr, error } = useTotient();
  return (
    <ErrorBoundary>
      <SolverDashboard title="Euler's Totient Function φ(n)" number="4" subtitle="Counts the positive integers up to n that are coprime to n.">
        <>
            <FormGroup label="n" value={n} onChange={e=>setN(e.target.value)} type="number" />
          {error ? <div className="text-neon-magenta">{error}</div> : <ResultBox label="φ(n)" value={result?.toString()} />}
        </>
        <>
          <VizPanel title="Prime Factorization & Calculation" description="φ(n) = n * Π(1 - 1/p)">
            <div className="flex gap-4">
              <div className="dark:bg-white/5 bg-black/5 p-4 rounded-lg flex-1 border border-border-subtle">
                <span className="text-neon-cyan font-bold text-[14px] uppercase block mb-2">Prime Factors</span>
                {factors.length === 0 ? <span className="text-text-muted">Loading...</span> : 
                  factors.map((f, i) => <span key={i} className="font-mono text-sm">{i>0?' * ':''}{f.p.toString()}<sup className="text-neon-gold">{f.k.toString()}</sup></span>)
                }
              </div>
              <div className="dark:bg-white/5 bg-black/5 p-4 rounded-lg flex-[2] border border-border-subtle">
                <span className="text-neon-cyan font-bold text-[14px] uppercase block mb-2">Formula</span>
                <span className="font-mono text-[14px] break-all text-text-secondary">{formulaStr}</span>
              </div>
            </div>
          </VizPanel>
        </>
      </SolverDashboard>
    </ErrorBoundary>
  );
}

export function EulersTheoremSolver() {
  const { a, setA, m, setM, n, setN, result, totient, error } = useEulersTheorem();
  return (
    <ErrorBoundary>
      <SolverDashboard title="Euler's Theorem" number="5" subtitle="Generalization of Fermat's Little Theorem. a^φ(n) ≡ 1 (mod n) for gcd(a,n)=1.">
        <>
          <div className="grid grid-cols-3 gap-3">
            <FormGroup label="a (base)" value={a} onChange={e=>setA(e.target.value)} type="number" />
            <FormGroup label="m (exp)" value={m} onChange={e=>setM(e.target.value)} type="number" />
            <FormGroup label="n (mod)" value={n} onChange={e=>setN(e.target.value)} type="number" />
          </div>
          {error ? <div className="text-neon-magenta">{error}</div> : <ResultBox label="Result (b)" value={result?.toString()} />}
        </>
         <>
          <VizPanel title="Application in Modular Exponentiation">
             <div className="text-[14px] font-mono text-text-secondary leading-loose">
                <ul className="list-disc pl-5">
                  <li>Compute φ(n) = φ({n}) = <span className="text-neon-gold font-bold">{totient?.toString()}</span></li>
                  <li>a<sup>φ(n)</sup> ≡ 1 (mod n) ⟶ {a}<sup>{totient?.toString()}</sup> ≡ 1 (mod {n})</li>
                  <li>Therefore, {a}<sup>{m}</sup> ≡ {a}<sup>{m} mod {totient?.toString()}</sup> (mod {n})</li>
                </ul>
             </div>
          </VizPanel>
        </>
      </SolverDashboard>
    </ErrorBoundary>
  );
}

export function CRTExpSolver() {
  const { a, setA, k, setK, n, setN, result, error } = useCRTExp();
  return (
    <ErrorBoundary>
      <SolverDashboard title="Chinese Remainder (Exponentiation)" number="6" subtitle="b = a^k mod n via fast powering or CRT shortcuts.">
        <>
          <div className="grid grid-cols-3 gap-3">
            <FormGroup label="a (base)" value={a} onChange={e=>setA(e.target.value)} type="number" />
            <FormGroup label="k (exp)" value={k} onChange={e=>setK(e.target.value)} type="number" />
            <FormGroup label="n (mod)" value={n} onChange={e=>setN(e.target.value)} type="number" />
          </div>
          {error ? <div className="text-neon-magenta">{error}</div> : <ResultBox label="b" value={result?.toString()} />}
        </>
        <>
          <VizPanel title="Alternative: Fast Powering Used" description="Due to absence of explicit primes (p,q), computed strictly via BigInt ModPow optimizations." />
        </>
      </SolverDashboard>
    </ErrorBoundary>
  );
}

export function CRTSystemSolver() {
  const { eqs, updateEq, addEq, removeEq, result, N, steps, error } = useCRTSystem();
  const [removeMode, setRemoveMode] = useState(false);
  return (
    <ErrorBoundary>
      <SolverDashboard title="Chinese Remainder Theorem (Equations)" number="7" subtitle="Solves system of congruences: x ≡ a_i (mod n_i)">
        <>
          <div className="mb-4 space-y-2 max-h-[160px] overflow-y-auto">
            {eqs.map((eq, i) => (
              <div 
                key={i} 
                className={`flex gap-2 items-center dark:bg-white/5 bg-black/5 p-2 rounded-lg border transition-colors ${
                  removeMode 
                    ? 'border-neon-magenta/30 cursor-pointer hover:bg-neon-magenta/20 hover:border-neon-magenta' 
                    : 'border-border-subtle'
                }`}
                onClick={() => { if (removeMode && eqs.length > 1) { removeEq(i); if (eqs.length <= 2) setRemoveMode(false); } }}
              >
                <span className="text-neon-cyan font-mono text-sm w-12">x ≡</span>
                <input type="number" value={eq.a} onChange={e=>updateEq(i, 'a', e.target.value)} className="w-[80px] bg-bg-input border border-border-medium rounded px-2 py-1 outline-none focus:border-neon-cyan text-sm" placeholder="a" onClick={e => removeMode && e.stopPropagation()} />
                <span className="text-text-secondary font-mono text-sm mx-2">(mod</span>
                <input type="number" value={eq.n} onChange={e=>updateEq(i, 'n', e.target.value)} className="w-[80px] bg-bg-input border border-border-medium rounded px-2 py-1 outline-none focus:border-neon-cyan text-sm" placeholder="n" onClick={e => removeMode && e.stopPropagation()} />
                <span className="text-text-secondary font-mono text-sm">)</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={addEq} className="flex-1 py-2 dark:bg-white/5 bg-black/5 hover:bg-white/10 rounded-lg text-xs font-semibold uppercase tracking-wider transition border border-white/10 dark:text-white text-text-primary">+ Add Equation</button>
            {eqs.length > 1 && (
              <button 
                onClick={() => setRemoveMode(!removeMode)} 
                className={`flex-1 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition border ${
                  removeMode 
                    ? 'bg-neon-magenta/20 border-neon-magenta text-neon-magenta' 
                    : 'dark:bg-white/5 bg-black/5 border-white/10 dark:text-white text-text-primary hover:bg-white/10'
                }`}
              >
                {removeMode ? '✕ Cancel' : '- Remove Equation'}
              </button>
            )}
          </div>
          
          {error ? <div className="text-neon-magenta mt-4 text-sm">{error}</div> : <ResultBox label={`x (mod ${N?.toString()})`} value={result?.toString()} />}
        </>
        <>
          <VizPanel title="Gauss Algorithm Components" description="x = Σ a_i * M_i * y_i (mod N)">
            <table className="w-full text-left text-[14px] font-mono border-collapse">
            <thead>
              <tr className="border-b border-border-medium text-neon-cyan">
                <th className="py-2 font-bold">i</th><th className="py-2 font-bold">a_i</th><th className="py-2 font-bold">n_i</th><th className="py-2 font-bold">M_i (N/n_i)</th><th className="py-2 font-bold">y_i (M_i^-1)</th>
              </tr>
            </thead>
            <tbody>
              {steps.map(s => (
                <tr key={s.i} className="border-b border-border-subtle">
                  <td className="py-2 text-text-secondary">{s.i}</td>
                  <td className="py-2 font-bold">{s.a}</td>
                  <td className="py-2 text-neon-gold">{s.n}</td>
                  <td className="py-2 text-neon-purple">{s.m}</td>
                  <td className="py-2 text-neon-purple">{s.y}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </VizPanel>
        </>
      </SolverDashboard>
    </ErrorBoundary>
  );
}

export function PrimitiveRootSolver() {
  const { a, setA, n, setN, isPrimitive, steps, failingPrime, error } = usePrimitiveRoot();
  return (
    <ErrorBoundary>
      <SolverDashboard title="Primitive Root Check" number="8" subtitle="Checks if 'a' is a primitive root modulo n.">
        <>
          <div className="grid grid-cols-2 gap-4">
            <FormGroup label="a (base)" value={a} onChange={e=>setA(e.target.value)} type="number" />
            <FormGroup label="n (mod)" value={n} onChange={e=>setN(e.target.value)} type="number" />
          </div>
          {error ? <div className="text-neon-magenta text-sm mt-4">{error}</div> : (
            <div className="mt-4 p-5 rounded-xl border border-border-subtle dark:bg-white/5 bg-black/5 flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider text-sm text-text-primary">Status</span>
              {isPrimitive ? 
                <span className="text-neon-purple font-bold text-lg px-3 py-1 bg-neon-green/10 rounded-lg">TRUE</span> :
                <span className="text-neon-magenta font-bold text-lg px-3 py-1 bg-neon-magenta/10 rounded-lg">FALSE</span>
              }
            </div>
          )}
        </>
        <>
          <VizPanel title="Subgroup Checking" description="Checks a^(φ(n)/p) mod n for all prime factors p of φ(n). If any equal 1, it is NOT primitive.">
            <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
              <table className="w-full text-left text-[14px] font-mono border-collapse">
              <thead><tr className="border-b border-border-medium text-neon-cyan"><th className="py-2 font-bold">Prime Factor (p)</th><th className="py-2 font-bold">Power: φ(n)/p</th><th className="py-2 font-bold">Result a^Power</th></tr></thead>
              <tbody>
                {steps.map((s,i) => (
                  <tr key={i} className="border-b border-border-subtle">
                    <td className="py-2 text-neon-gold">{s.p}</td>
                    <td className="py-2 text-text-secondary">{s.power}</td>
                    <td className={`py-2 font-bold ${s.res === '1' ? 'text-neon-magenta' : 'text-neon-purple'}`}>{s.res}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            {!isPrimitive && failingPrime && <div className="mt-4 text-[14px] font-semibold text-neon-magenta bg-neon-magenta/10 p-3 rounded-lg border border-neon-magenta/20">Failed because a^(φ(n)/{failingPrime}) ≡ 1</div>}
          </VizPanel>
        </>
      </SolverDashboard>
    </ErrorBoundary>
  );
}

export function DiscreteLogSolver() {
  const { a, setA, b, setB, n, setN, result, found, steps, error } = useDiscreteLog();
  return (
    <ErrorBoundary>
      <SolverDashboard title="Discrete Logarithm" number="9" subtitle="Finds k such that a^k ≡ b (mod n). Uses Baby-step Giant-step algorithm.">
        <>
          <div className="grid grid-cols-3 gap-3">
            <FormGroup label="a (base)" value={a} onChange={e=>setA(e.target.value)} type="number" />
            <FormGroup label="b (result)" value={b} onChange={e=>setB(e.target.value)} type="number" />
            <FormGroup label="n (mod)" value={n} onChange={e=>setN(e.target.value)} type="number" />
          </div>
          {error ? <div className="text-neon-magenta mt-4 text-sm">{error}</div> : (
             <ResultBox label={found ? "Found k = log_a(b)" : "Status"} value={found ? result?.toString() : "No integer solution found"} />
          )}
        </>
        <>
           <VizPanel title="Baby-Step Giant-Step Results" description="O(√N) matching index outputs">
             {found ? (
               <div className="space-y-3 font-mono text-sm text-text-secondary">
                 <div>n = ⌈√N⌉ = <span className="text-neon-gold">{steps.n}</span></div>
                 <div>Intersection Found at:</div>
                 <div className="dark:bg-white/5 bg-black/5 p-3 rounded border border-border-subtle dark:text-white text-text-primary">
                   Giant Step <span className="text-neon-cyan/90">q = {steps.q}</span> <br/>
                   Baby Step <span className="text-neon-purple">p = {steps.p}</span>
                 </div>
                 <div className="text-neon-purple font-bold text-lg mt-2 pt-2 border-t border-border-subtle">
                   k = q * n + p = {result.toString()}
                 </div>
               </div>
             ) : (
                <span className="text-text-muted">Requires valid input intersection.</span>
             )}
           </VizPanel>
        </>
      </SolverDashboard>
    </ErrorBoundary>
  );
}

export function BasicModuloSolver() {
  const { a, setA, b, setB, x, setX, y, setY, n, setN, exp1, exp2, exp3, exp4, exp5, error } = useBasicModulo();
  return (
    <ErrorBoundary>
      <SolverDashboard title="Basic Modulo Expressions" number="10" subtitle="Evaluates multi-variable modular algebraic equations.">
        <>
          <div className="grid grid-cols-3 gap-2">
            <FormGroup label="a" value={a} onChange={e=>setA(e.target.value)} type="number" />
            <FormGroup label="x" value={x} onChange={e=>setX(e.target.value)} type="number" />
            <FormGroup label="b" value={b} onChange={e=>setB(e.target.value)} type="number" />
          </div>
          <div className="grid grid-cols-2 gap-2">  
            <FormGroup label="y" value={y} onChange={e=>setY(e.target.value)} type="number" />
            <FormGroup label="n" value={n} onChange={e=>setN(e.target.value)} type="number" />
          </div>
          {error && <div className="text-neon-magenta mt-4 text-sm">{error}</div>}
        </>
        <>
        {!error && (
          <VizPanel title="Evaluations">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-sm text-text-secondary">
               <div className="dark:bg-white/5 bg-black/5 p-3 rounded border border-border-subtle flex justify-between">
                 <span>ax + by</span><span className="text-neon-cyan font-bold">{exp1?.toString()}</span>
               </div>
               <div className="dark:bg-white/5 bg-black/5 p-3 rounded border border-border-subtle flex justify-between">
                 <span>ax - by</span><span className="text-neon-cyan font-bold">{exp2?.toString()}</span>
               </div>
               <div className="dark:bg-white/5 bg-black/5 p-3 rounded border border-border-subtle flex justify-between">
                 <span>ax * by</span><span className="text-neon-cyan font-bold">{exp3?.toString()}</span>
               </div>
               <div className="dark:bg-white/5 bg-black/5 p-3 rounded border border-border-subtle flex justify-between">
                 <span>(by)^-1</span><span className="text-neon-purple font-bold">{exp4?.toString()}</span>
               </div>
               <div className="dark:bg-white/5 bg-black/5 p-3 rounded border border-border-subtle flex justify-between md:col-span-2">
                 <span>ax / by</span><span className="text-neon-purple font-bold text-lg">{exp5?.toString()}</span>
               </div>
             </div>
          </VizPanel>
        )}
        </>
      </SolverDashboard>
    </ErrorBoundary>
  );
}
 
export function ModularOrbitSolver() {
  const [a, setA] = useState('11');
  const [n, setN] = useState('293');

  return (
    <ErrorBoundary>
      <SolverDashboard title="Modular Arithmetic Orbits" number="11" subtitle="Visualizing multiplicative groups and primitive roots.">
        <>
          <div className="grid grid-cols-2 gap-4">
             <FormGroup label="a (base)" value={a} onChange={e=>setA(e.target.value)} type="number" />
             <FormGroup label="n (modulus)" value={n} onChange={e=>setN(e.target.value)} type="number" />
          </div>
          <div className="mt-4 p-4 bg-black/20 rounded-xl border border-border-subtle">
             <div className="text-xs font-bold text-neon-cyan uppercase mb-2 tracking-widest">Orbit Logic</div>
             <p className="text-xs text-text-secondary leading-relaxed">
                This tool maps residues to points on a circle. The resulting geometric pattern (or "web") illustrates the cyclic properties of modular powers. If $a$ is a primitive root, the web will be maximally dense.
             </p>
          </div>
        </>
        <>
          <VizPanel title="Geometric Subgroup Trace" description={`Path: ${a}^m mod ${n} as m increases.`}>
             <div className="flex justify-center py-4">
                <ModularOrbitViz a={parseInt(a) || 1} n={parseInt(n) || 1} />
             </div>
          </VizPanel>
        </>
      </SolverDashboard>
    </ErrorBoundary>
  );
}
