import { useState, useMemo } from 'react';
import { modPow, modInverse } from '../../number-theory/utils/bigIntMath';

export function useDiffieHellman() {
  const [q, setQ] = useState('7523');
  const [a, setA] = useState('5');
  const [xA, setXA] = useState('387');
  const [xB, setXB] = useState('247');

  const { result, error } = useMemo(() => {
    try {
      if (!q || !a || !xA || !xB) return { result: null };
      
      const Q = BigInt(q), A = BigInt(a), XA = BigInt(xA), XB = BigInt(xB);
      
      const YA = modPow(A, XA, Q).result;
      const YB = modPow(A, XB, Q).result;

      const K_Alice = modPow(YB, XA, Q).result;
      const K_Bob = modPow(YA, XB, Q).result;

      if (K_Alice !== K_Bob) throw new Error("Key mismatch! Math error.");

      return { result: { YA: YA.toString(), YB: YB.toString(), K: K_Alice.toString() }, error: null };
    } catch (e) {
      return { error: e.message };
    }
  }, [q, a, xA, xB]);

  return { q, setQ, a, setA, xA, setXA, xB, setXB, result, error };
}

export function useRSA() {
  const [p, setP] = useState('47');
  const [q, setQ] = useState('71');
  const [e, setE] = useState('61');
  const [M, setM] = useState('59');
  const [mode, setMode] = useState('encrypt'); // encrypt or sign

  const { result, error } = useMemo(() => {
    try {
      if (!p || !q || !e || !M) return { result: null };
      
      const P = BigInt(p), Q = BigInt(q), E = BigInt(e), msg = BigInt(M);
      const N = P * Q;
      const phi = (P - 1n) * (Q - 1n);

      if (E >= phi) throw new Error("e must be less than phi(n)");

      const D = modInverse(E, phi);

      let C, decrypted;
      if (mode === 'encrypt') {
        // Encrypt with Public Key (E, N)
        C = modPow(msg, E, N).result;
        // Decrypt with Private Key (D, N)
        decrypted = modPow(C, D, N).result;
      } else {
        // Sign with Private Key (D, N)
        C = modPow(msg, D, N).result;
        // Verify with Public Key (E, N)
        decrypted = modPow(C, E, N).result;
      }

      return { 
        result: { 
          N: N.toString(), phi: phi.toString(), D: D.toString(), 
          C: C.toString(), decrypted: decrypted.toString() 
        }, 
        error: null 
      };
    } catch (err) {
      return { error: err.message };
    }
  }, [p, q, e, M, mode]);

  return { p, setP, q, setQ, e, setE, M, setM, mode, setMode, result, error };
}

export function useElGamal() {
  const [q, setQ] = useState('7433');
  const [a, setA] = useState('3');
  const [xA, setXA] = useState('341'); // Alice private
  const [k, setK] = useState('872');   // Bob ephemeral
  const [M, setM] = useState('403');

  const { result, error } = useMemo(() => {
    try {
      if (!q || !a || !xA || !k || !M) return { result: null };
      
      const Q = BigInt(q), A = BigInt(a), XA = BigInt(xA), K_eph = BigInt(k), msg = BigInt(M);

      // Alice generates Public Key YA
      const YA = modPow(A, XA, Q).result;

      // Bob encrypts targeting YA
      const K_secret = modPow(YA, K_eph, Q).result; // Bob's shared key
      const C1 = modPow(A, K_eph, Q).result;
      const C2 = (K_secret * msg) % Q;

      // Alice decrypts
      const K_alice = modPow(C1, XA, Q).result;
      const K_inv = modInverse(K_alice, Q);
      const decrypted = (C2 * K_inv) % Q;

      return {
        result: {
          YA: YA.toString(),
          K_bob: K_secret.toString(),
          C1: C1.toString(),
          C2: C2.toString(),
          K_alice: K_alice.toString(),
          K_inv: K_inv.toString(),
          decrypted: decrypted.toString()
        },
        error: null
      }
    } catch (err) {
      return { error: err.message };
    }
  }, [q, a, xA, k, M]);

  return { q, setQ, a, setA, xA, setXA, k, setK, M, setM, result, error };
}

export function useDSA() {
  const [p, setP] = useState('47');
  const [q, setQ] = useState('23');
  const [h, setH] = useState('34'); // 1 < h < p-1
  const [xA, setXA] = useState('2'); // Alice Private
  const [k, setK] = useState('10'); // Ephemeral random
  const [H_M, setH_M] = useState('15'); // Hash of Message

  const { result, error } = useMemo(() => {
    try {
      if (!p || !q || !h || !xA || !k || !H_M) return { result: null };
      
      const P = BigInt(p), Q = BigInt(q), H_base = BigInt(h);
      const XA = BigInt(xA), K_eph = BigInt(k), Hash = BigInt(H_M);

      if ((P - 1n) % Q !== 0n) throw new Error("q must be a prime divisor of p-1");
      
      // Global parameters
      const g = modPow(H_base, (P - 1n) / Q, P).result;
      if (g <= 1n) throw new Error("g must be > 1. Pick a different h.");

      // Alice Public Key
      const YA = modPow(g, XA, P).result;

      // Signing
      const r_pre = modPow(g, K_eph, P).result;
      const r = r_pre % Q;
      if (r === 0n) throw new Error("r=0, pick different k");
      
      const k_inv = modInverse(K_eph, Q);
      const s = (k_inv * (Hash + XA * r)) % Q;
      if (s === 0n) throw new Error("s=0, pick different k");

      // Verifying
      const w = modInverse(s, Q);
      const u1 = (Hash * w) % Q;
      const u2 = (r * w) % Q;
      const v_pre = (modPow(g, u1, P).result * modPow(YA, u2, P).result) % P;
      const v = v_pre % Q;

      const isValid = (v === r);

      return {
        result: {
          g: g.toString(),
          YA: YA.toString(),
          r: r.toString(),
          s: s.toString(),
          w: w.toString(),
          u1: u1.toString(),
          u2: u2.toString(),
          v: v.toString(),
          isValid
        },
        error: null
      }
    } catch (err) {
      return { error: err.message };
    }
  }, [p, q, h, xA, k, H_M]);

  return { p, setP, q, setQ, h, setH, xA, setXA, k, setK, H_M, setH_M, result, error };
}
