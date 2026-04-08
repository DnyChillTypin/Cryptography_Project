import React from 'react';
import { 
  SolverDashboard, FormGroup, ResultBox, VizPanel 
} from '../../../components/ui/SolverComponents';
import { ErrorBoundary } from '../../../components/ui/ErrorBoundary';
import {
  useDiffieHellman, useRSA, useElGamal, useDSA
} from '../hooks/usePublicKey';

export function DiffieHellmanSolver() {
  const { q, setQ, a, setA, xA, setXA, xB, setXB, result, error } = useDiffieHellman();

  return (
    <ErrorBoundary>
      <SolverDashboard title="Diffie-Hellman Key Exchange" number="1" subtitle="Establish a shared secret over an insecure channel. Alice and Bob generate private keys and exchange public components.">
        <>
          <div className="grid grid-cols-2 gap-4 mb-4">
             <FormGroup label="Prime Modulus (q)" value={q} onChange={e=>setQ(e.target.value)} type="number" />
             <FormGroup label={<>Generator<br/>(a)</>} value={a} onChange={e=>setA(e.target.value)} type="number" />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <FormGroup label="Alice Private (xA)" value={xA} onChange={e=>setXA(e.target.value)} type="number" />
             <FormGroup label="Bob Private (xB)" value={xB} onChange={e=>setXB(e.target.value)} type="number" />
          </div>
          {error ? <div className="text-neon-magenta mt-4 text-sm font-semibold p-3 bg-neon-magenta/10 rounded">{error}</div> : (
              <ResultBox label="Shared Session Key (K)" value={result?.K} />
          )}
        </>
        <>
          <VizPanel title="Key Exchange Simulation">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-text-secondary">
               
               <div className="bg-neon-cyan/5 p-4 rounded-xl border border-neon-cyan/20">
                 <div className="text-neon-cyan font-bold tracking-widest uppercase text-[14px] border-b border-neon-cyan/20 pb-2 mb-3">Alice's System</div>
                 <div>Calculates Public Key <span className="font-mono text-neon-gold font-bold">YA</span>:</div>
                 <div className="font-mono dark:bg-black/40 bg-black/10 p-2 rounded mt-1 mb-4">YA = a^xA mod q = {result?.YA}</div>
                 
                 <div>Receives YB from Bob.</div>
                 <div>Derives shared secret <span className="font-mono dark:text-white text-text-primary font-bold">K</span>:</div>
                 <div className="font-mono text-neon-purple font-bold dark:bg-black/40 bg-black/10 p-2 rounded mt-1">K = YB^xA mod q = {result?.K}</div>
               </div>
               
               <div className="bg-neon-orange/5 p-4 rounded-xl border border-neon-orange/20">
                 <div className="text-neon-gold font-bold tracking-widest uppercase text-[14px] border-b border-neon-orange/20 pb-2 mb-3">Bob's System</div>
                 <div>Calculates Public Key <span className="font-mono text-neon-cyan font-bold">YB</span>:</div>
                 <div className="font-mono dark:bg-black/40 bg-black/10 p-2 rounded mt-1 mb-4">YB = a^xB mod q = {result?.YB}</div>
                 
                 <div>Receives YA from Alice.</div>
                 <div>Derives shared secret <span className="font-mono dark:text-white text-text-primary font-bold">K</span>:</div>
                 <div className="font-mono text-neon-purple font-bold dark:bg-black/40 bg-black/10 p-2 rounded mt-1">K = YA^xB mod q = {result?.K}</div>
               </div>

             </div>
          </VizPanel>
        </>
      </SolverDashboard>
    </ErrorBoundary>
  )
}

export function RSASolver() {
  const { p, setP, q, setQ, e, setE, M, setM, mode, setMode, result, error } = useRSA();

  return (
    <ErrorBoundary>
      <SolverDashboard title="Rivest–Shamir–Adleman (RSA)" number="2" subtitle="Asymmetric encryption system. Using Public Key provides Secrecy. Using Private Key provides Signatures.">
        <>
          <div className="grid grid-cols-3 gap-2 mb-3">
             <FormGroup label={<>Prime<br/>(p)</>} value={p} onChange={e=>setP(e.target.value)} type="number" />
             <FormGroup label={<>Prime<br/>(q)</>} value={q} onChange={e=>setQ(e.target.value)} type="number" />
             <FormGroup label="Public Exp (e)" value={e} onChange={e=>setE(e.target.value)} type="number" />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Operation Mode</label>
            <div className="flex bg-bg-input rounded-lg overflow-hidden border border-border-medium">
              <button 
                onClick={() => setMode('encrypt')} 
                className={`flex-1 py-2.5 text-sm font-bold uppercase transition-all border-2 rounded-l-lg ${mode === 'encrypt' ? 'border-neon-cyan text-neon-cyan shadow-[0_0_15px_rgba(0,240,255,0.1)]' : 'border-transparent text-text-secondary hover:dark:bg-white/5 bg-black/5'}`}
              >
                Encrypt (Secrecy)
              </button>
              <button 
                onClick={() => setMode('sign')} 
                className={`flex-1 py-2.5 text-sm font-bold uppercase transition-all border-2 rounded-r-lg ${mode === 'sign' ? 'border-neon-magenta text-neon-magenta shadow-[0_0_15px_rgba(255,0,255,0.1)]' : 'border-transparent text-text-secondary hover:dark:bg-white/5 bg-black/5'}`}
              >
                Sign (Identity)
              </button>
            </div>
          </div>

          <FormGroup label="Message (M)" value={M} onChange={ev=>setM(ev.target.value)} type="number" />

          {error ? <div className="text-neon-magenta mt-4 text-sm font-semibold p-3 bg-neon-magenta/10 rounded">{error}</div> : (
              <ResultBox label={mode === 'encrypt' ? "Ciphertext (C)" : "Signature (S)"} value={result?.C} />
          )}
        </>
        <>
          <VizPanel title="System Parameters (Key Generation)">
             <div className="grid grid-cols-2 gap-4 text-sm font-mono text-text-secondary">
                <div className="dark:bg-white/5 bg-black/5 p-3 rounded border border-border-subtle">
                  <div className="text-neon-cyan text-[14px] font-bold uppercase mb-1">Modulus N</div>
                  N = p * q = {result?.N}
                </div>
                <div className="dark:bg-white/5 bg-black/5 p-3 rounded border border-border-subtle">
                  <div className="text-neon-cyan text-[14px] font-bold uppercase mb-1">Totient phi(n)</div>
                  phi(n) = (p-1)(q-1) = {result?.phi}
                </div>
                <div className="dark:bg-white/5 bg-black/5 p-3 rounded border border-border-subtle col-span-2">
                  <div className="text-neon-magenta text-[14px] font-bold uppercase mb-1">Private Exponent (d)</div>
                  d = e^-1 mod phi(n)<br/>
                  d = <span className="dark:text-white text-text-primary font-bold">{result?.D}</span>
                </div>
             </div>
          </VizPanel>

          {!error && (
            <VizPanel title={`Process: ${mode === 'encrypt' ? 'Encryption & Decryption' : 'Signing & Verification'}`}>
               <div className="dark:bg-white/5 bg-black/5 p-4 rounded-xl border border-border-subtle text-sm text-text-secondary mb-3">
                 {mode === 'encrypt' ? (
                   <p className="text-neon-cyan mb-2">Encryption provides <strong>Secrecy</strong>. Only the receiver, who holds the Private Key (d), can decrypt the message encrypted with the Public Key (e).</p>
                 ) : (
                   <p className="text-neon-magenta mb-2">Signing provides <strong>Identity</strong>. The sender encrypts with their Private Key (d). Anyone can decrypt it with the Public Key (e) to verify the sender's identity.</p>
                 )}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono mt-4">
                  <div className="p-4 border border-border-subtle rounded-xl">
                    <div className="text-xs uppercase text-text-muted mb-2 tracking-widest">{mode === 'encrypt' ? 'Encryption (C)' : 'Signature (S)'}</div>
                    C = M^{mode === 'encrypt' ? 'e' : 'd'} mod N<br/>
                    C = {M}^{mode === 'encrypt' ? e : result?.D} mod {result?.N}<br/>
                    C = <span className="text-neon-gold font-bold text-lg">{result?.C}</span>
                  </div>
                  <div className="p-4 border border-neon-green/30 bg-neon-green/5 rounded-xl">
                    <div className="text-xs uppercase text-neon-purple mb-2 tracking-widest">Verification Cycle</div>
                    M = C^{mode === 'encrypt' ? 'd' : 'e'} mod N<br/>
                    M = {result?.C}^{mode === 'encrypt' ? result?.D : e} mod {result?.N}<br/>
                    M = <span className="dark:text-white text-text-primary font-bold text-lg">{result?.decrypted}</span>
                  </div>
               </div>
            </VizPanel>
          )}
        </>
      </SolverDashboard>
    </ErrorBoundary>
  )
}

export function ElGamalSolver() {
   const { q, setQ, a, setA, xA, setXA, k, setK, M, setM, result, error } = useElGamal();

   return (
     <ErrorBoundary>
       <SolverDashboard title="ElGamal Public-Key" number="3" subtitle="Asymmetric encryption based on Diffie-Hellman key exchange. Requires a unique ephemeral key 'k' per message.">
         <>
           <div className="grid grid-cols-2 gap-4 mb-3">
            <FormGroup label="Prime (q)" value={q} onChange={e=>setQ(e.target.value)} type="number" />
            <FormGroup label="Generator (a)" value={a} onChange={e=>setA(e.target.value)} type="number" />
           </div>
           <div className="grid grid-cols-2 gap-4 mb-3 bg-neon-cyan/5 p-3 rounded border border-neon-cyan/20">
            <FormGroup label="Alice Private (xA)" value={xA} onChange={e=>setXA(e.target.value)} type="number" />
            <FormGroup label="Bob Ephemeral (k)" value={k} onChange={e=>setK(e.target.value)} type="number" />
           </div>
           
           <FormGroup label="Message to Encrypt (M)" value={M} onChange={e=>setM(e.target.value)} type="number" />

           {error ? <div className="text-neon-magenta mt-4 text-sm">{error}</div> : (
              <ResultBox label="Ciphertext Pair (C1, C2)" value={`(${result?.C1}, ${result?.C2})`} />
           )}
         </>

         <>
          {!error && (
            <VizPanel title="Encryption & Decryption Cycle">
              <div className="grid grid-cols-1 gap-6 text-sm text-text-secondary font-mono">
                <div>
                   <div className="text-neon-cyan uppercase text-xs font-bold mb-1">0. Alice Key Generation</div>
                   <div className="dark:bg-black/40 bg-black/10 p-2 rounded">YA = a^xA mod q = {result?.YA}</div>
                </div>

                <div>
                   <div className="text-neon-gold uppercase text-xs font-bold mb-1">1. Bob Encrypts Message</div>
                   <div className="dark:bg-black/40 bg-black/10 p-3 rounded">
                      <div>K = YA^k mod q = {result?.K_bob}</div>
                      <div className="mt-2 dark:text-white text-text-primary">C1 = a^k mod q = <span className="font-bold">{result?.C1}</span></div>
                      <div className="dark:text-white text-text-primary">C2 = (K * M) mod q = <span className="font-bold">{result?.C2}</span></div>
                   </div>
                </div>

                <div>
                   <div className="text-neon-purple uppercase text-xs font-bold mb-1">2. Alice Decrypts Message</div>
                   <div className="dark:bg-black/40 bg-black/10 p-3 rounded border border-neon-green/30">
                      <div>K = C1^xA mod q = {result?.K_alice}</div>
                      <div>K_inv = K^-1 mod q = {result?.K_inv}</div>
                      <div className="mt-2 dark:text-white text-text-primary text-base">M = (C2 * K_inv) mod q = <span className="font-bold">{result?.decrypted}</span></div>
                   </div>
                </div>
              </div>
            </VizPanel>
          )}
         </>
       </SolverDashboard>
     </ErrorBoundary>
   )
}

export function DSASolver() {
  const { p, setP, q, setQ, h, setH, xA, setXA, k, setK, H_M, setH_M, result, error } = useDSA();

  return (
    <ErrorBoundary>
      <SolverDashboard title="Digital Signature Algorithm (DSA)" number="4" subtitle="A Federal Information Processing Standard for digital signatures. Generates (r,s) tuples.">
         <>
           <div className="grid grid-cols-3 gap-2 mb-3">
             <FormGroup label={<>Prime<br/>(p)</>} value={p} onChange={e=>setP(e.target.value)} type="number" />
             <FormGroup label={<>SubPrime<br/>(q)</>} value={q} onChange={e=>setQ(e.target.value)} type="number" />
             <FormGroup label={<>Seed<br/>(h)</>} value={h} onChange={e=>setH(e.target.value)} type="number" />
           </div>
           
           <div className="grid grid-cols-2 gap-4 mb-3">
            <FormGroup label="Private (xA)" value={xA} onChange={e=>setXA(e.target.value)} type="number" />
            <FormGroup label="Random (k)" value={k} onChange={e=>setK(e.target.value)} type="number" />
           </div>

           <FormGroup label="Hash of Message H(M)" value={H_M} onChange={e=>setH_M(e.target.value)} type="number" />

           {error ? <div className="text-neon-magenta mt-4 text-sm">{error}</div> : (
              <ResultBox label="Signature Pair (r, s)" value={`(${result?.r}, ${result?.s})`} />
           )}
         </>

         <>
          {!error && (
            <VizPanel title="Digital Signature Generation and Verification">
              <div className="space-y-4 text-sm text-text-secondary font-mono">
                 
                 <div className="border border-border-subtle p-3 rounded-lg">
                   <div className="text-neon-cyan uppercase text-[14px] font-bold mb-1">Global & Public Key</div>
                   <div>g = h^((p-1)/q) mod p = {result?.g}</div>
                   <div>YA = g^xA mod p = {result?.YA}</div>
                 </div>

                 <div className="border border-border-subtle p-3 rounded-lg">
                   <div className="text-neon-gold uppercase text-[14px] font-bold mb-1">Signature Generation</div>
                   <div>r = (g^k mod p) mod q = {result?.r}</div>
                   <div>s = (k^-1 * (H(M) + xA * r)) mod q = {result?.s}</div>
                 </div>

                 <div className={`border ${result?.isValid ? 'border-neon-green bg-neon-green/10' : 'border-neon-magenta bg-neon-magenta/10'} p-3 rounded-lg`}>
                   <div className={`${result?.isValid ? 'text-neon-purple' : 'text-neon-magenta'} uppercase text-[14px] font-bold mb-1 flex justify-between`}>
                     <span>Verification Logic</span>
                     <span className="text-base">{result?.isValid ? 'VALID ✓' : 'INVALID ✗'}</span>
                   </div>
                   <div>w = s^-1 mod q = {result?.w}</div>
                   <div>u1 = (H(M) * w) mod q = {result?.u1}</div>
                   <div>u2 = (r * w) mod q = {result?.u2}</div>
                   <div>v = ((g^u1 * YA^u2) mod p) mod q = {result?.v}</div>
                   <div className="mt-2 dark:text-white text-text-primary bold">v ?= r ⟶ {result?.v} ?= {result?.r}</div>
                 </div>

              </div>
            </VizPanel>
          )}
         </>
      </SolverDashboard>
    </ErrorBoundary>
  )
}
