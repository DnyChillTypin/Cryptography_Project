import { useState, useMemo } from 'react';
import { modPow, extendedGCD, modInverse, phi, isPrimitiveRoot, discreteLog, crt } from '../utils/bigIntMath';

export function useFastPowering() {
  const [base, setBase] = useState('499');
  const [exp, setExp] = useState('6337');
  const [mod, setMod] = useState('6337');

  const { result, steps, error } = useMemo(() => {
    try {
      if (!base || !exp || !mod) return { result: '', steps: [] };
      return { ...modPow(BigInt(base), BigInt(exp), BigInt(mod)), error: null };
    } catch (e) {
      return { result: '', steps: [], error: e.message };
    }
  }, [base, exp, mod]);

  return { base, setBase, exp, setExp, mod, setMod, result, steps, error };
}

export function useExtendedEuclidean() {
  const [a, setA] = useState('2705');
  const [n, setN] = useState('6577');

  const { g, x, y, steps, inverse, error } = useMemo(() => {
    try {
      if (!a || !n) return { steps: [] };
      const res = extendedGCD(BigInt(a), BigInt(n));
      let inv = null;
      if (res.g === 1n) inv = modInverse(BigInt(a), BigInt(n));
      return { ...res, inverse: inv?.toString(), error: null };
    } catch(e) {
      return { steps: [], error: e.message };
    }
  }, [a, n]);

  return { a, setA, n, setN, g, x, y, steps, inverse, error };
}

export function useFermatLittle() {
  const [a, setA] = useState('281');
  const [m, setM] = useState('764');
  const [p, setP] = useState('6967');

  const { result, steps, isPrime, error } = useMemo(() => {
    try {
      if (!a || !m || !p) return { steps: [] };
      return { ...modPow(BigInt(a), BigInt(m), BigInt(p)), isPrime: null /* basic implementation assumes P is prime */, error: null };
    } catch(e) {
      return { steps: [], error: e.message };
    }
  }, [a, m, p]);

  return { a, setA, m, setM, p, setP, result, steps, error };
}

export function useTotient() {
  const [n, setN] = useState('2863');

  const { result, factors, formulaStr, error } = useMemo(() => {
    try {
      if (!n) return { factors: [] };
      return { ...phi(BigInt(n)), error: null };
    } catch(e) {
      return { factors: [], error: e.message };
    }
  }, [n]);

  return { n, setN, result, factors, formulaStr, error };
}

export function useEulersTheorem() {
  const [a, setA] = useState('27');
  const [m, setM] = useState('2201');
  const [n, setN] = useState('5400');

  const { result, totient, steps, error } = useMemo(() => {
    try {
      if (!a || !m || !n) return { steps: [] };
      const tot = phi(BigInt(n)).result;
      const reducedExp = BigInt(m) % tot;
      const powRes = modPow(BigInt(a), reducedExp, BigInt(n));
      return { result: powRes.result, totient: tot, steps: powRes.steps, error: null };
    } catch(e) {
      return { steps: [], error: e.message };
    }
  }, [a, m, n]);

  return { a, setA, m, setM, n, setN, result, totient, steps, error };
}

export function useCRTExp() {
  const [a, setA] = useState('101');
  const [k, setK] = useState('76');
  const [p, setP] = useState('227'); // 49913 = 227 * 219 (Wait, problem states n=49913, we can just use fast powering or factor it for them if p,q not given. Let's just use fast powering for now)
  const [n, setN] = useState('49913');

  const { result, steps, error } = useMemo(() => {
    try {
      if (!a || !k || !n) return { steps: [] };
      return { ...modPow(BigInt(a), BigInt(k), BigInt(n)), error: null };
    } catch(e) {
      return { steps: [], error: e.message };
    }
  }, [a, k, n]);

  return { a, setA, k, setK, n, setN, result, steps, error };
}

export function useCRTSystem() {
  const [eqs, setEqs] = useState([{a:'6',n:'11'}, {a:'2',n:'13'}, {a:'4',n:'17'}]);

  const { result, N, steps, error } = useMemo(() => {
    try {
      const validEqs = eqs.filter(e => e.a && e.n).map(e => ({a: BigInt(e.a), n: BigInt(e.n)}));
      if (validEqs.length === 0) return { steps: [] };
      return { ...crt(validEqs), error: null };
    } catch(e) {
      return { steps: [], error: e.message };
    }
  }, [eqs]);

  const updateEq = (idx, field, val) => {
    const newEqs = [...eqs];
    newEqs[idx][field] = val;
    setEqs(newEqs);
  };
  const addEq = () => setEqs([...eqs, {a:'', n:''}]);
  const removeEq = (idx) => setEqs(eqs.filter((_, i) => i !== idx));

  return { eqs, updateEq, addEq, removeEq, result, N, steps, error };
}

export function usePrimitiveRoot() {
  const [a, setA] = useState('11');
  const [n, setN] = useState('293');

  const { isPrimitive, steps, failingPrime, error } = useMemo(() => {
    try {
      if (!a || !n) return { steps: [] };
      return { ...isPrimitiveRoot(BigInt(a), BigInt(n)), error: null };
    } catch(e) {
      return { steps: [], error: e.message };
    }
  }, [a, n]);

  return { a, setA, n, setN, isPrimitive, steps, failingPrime, error };
}

export function useDiscreteLog() {
  const [a, setA] = useState('3');
  const [b, setB] = useState('8');
  const [n, setN] = useState('19');

  const { result, found, steps, error } = useMemo(() => {
    try {
      if (!a || !b || !n) return { found: false, steps: {} };
      if (BigInt(n) > 10000000n) throw new Error("n is too large for UI blocking BSGS computation.");
      return { ...discreteLog(BigInt(a), BigInt(b), BigInt(n)), error: null };
    } catch(e) {
      return { found: false, steps: {}, error: e.message };
    }
  }, [a, b, n]);

  return { a, setA, b, setB, n, setN, result, found, steps, error };
}

export function useBasicModulo() {
  const [a, setA] = useState('83');
  const [b, setB] = useState('17');
  const [x, setX] = useState('354');
  const [y, setY] = useState('314');
  const [n, setN] = useState('241');

  const { exp1, exp2, exp3, exp4, exp5, error } = useMemo(() => {
    try {
      const A = BigInt(a), B = BigInt(b), X = BigInt(x), Y = BigInt(y), N = BigInt(n);
      const ax = (A * X) % N;
      const by = (B * Y) % N;
      
      const exp1 = (ax + by) % N;
      const exp2 = (ax - by + N * 100n) % N; // ensure positive
      const exp3 = (ax * by) % N;
      const byInv = modInverse(by, N);
      const exp4 = byInv;
      const exp5 = (ax * byInv) % N;
      
      return { exp1, exp2, exp3, exp4, exp5, error: null };
    } catch(e) {
      return { error: e.message };
    }
  }, [a,b,x,y,n]);

  return { a, setA, b, setB, x, setX, y, setY, n, setN, exp1, exp2, exp3, exp4, exp5, error };
}
