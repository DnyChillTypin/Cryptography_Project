/**
 * Number Theory math utilities using JavaScript BigInt for cryptographic scale numbers.
 */

export function extendedGCD(a, b) {
  let A = BigInt(a);
  let B = BigInt(b);
  if (A < 0n || B < 0n) throw new Error("extendedGCD expects positive numbers");
  
  let x0 = 1n, y0 = 0n, x1 = 0n, y1 = 1n;
  const steps = [];

  while (B !== 0n) {
    const q = A / B;
    const r = A % B;
    
    steps.push({ q: q.toString(), A: A.toString(), B: B.toString(), r: r.toString(), x0: x0.toString(), y0: y0.toString() });

    A = B;
    B = r;
    
    const x2 = x0 - q * x1;
    const y2 = y0 - q * y1;
    
    x0 = x1;
    x1 = x2;
    y0 = y1;
    y1 = y2;
  }
  
  steps.push({ q: '-', A: A.toString(), B: '0', r: '0', x0: x0.toString(), y0: y0.toString() });
  
  return { g: A, x: x0, y: y0, steps };
}

export function modInverse(a, mod) {
  const result = extendedGCD(a, mod);
  if (result.g !== 1n) {
    throw new Error(`Inverse does not exist. gcd(${a}, ${mod}) = ${result.g} ≠ 1`);
  }
  return (result.x % BigInt(mod) + BigInt(mod)) % BigInt(mod);
}

export function modPow(base, exp, mod) {
  let res = 1n;
  let b = BigInt(base) % BigInt(mod);
  let e = BigInt(exp);
  const m = BigInt(mod);
  const steps = [];

  let stepCount = 0;
  while (e > 0n) {
    const bit = e % 2n;
    if (bit === 1n) {
      const oldRes = res;
      res = (res * b) % m;
      steps.push({ step: ++stepCount, action: 'Multiply', desc: `res = (${oldRes} * ${b}) % ${m} = ${res}` });
    }
    e = e / 2n;
    if (e > 0n) {
      const oldB = b;
      b = (b * b) % m;
      steps.push({ step: ++stepCount, action: 'Square', desc: `base = (${oldB}^2) % ${m} = ${b}` });
    }
  }
  
  return { result: res, steps };
}

export function primeFactors(n) {
  let num = BigInt(n);
  const factors = [];
  let d = 2n;
  
  while (num % 2n === 0n) {
    factors.push(2n);
    num /= 2n;
  }
  
  d = 3n;
  while (d * d <= num) {
    while (num % d === 0n) {
      factors.push(d);
      num /= d;
    }
    d += 2n;
  }
  if (num > 1n) factors.push(num);
  
  const grouped = [];
  let currentP = null;
  let count = 0n;
  for (const f of factors) {
    if (f === currentP) {
      count++;
    } else {
      if (currentP !== null) grouped.push({ p: currentP, k: count });
      currentP = f;
      count = 1n;
    }
  }
  if (currentP !== null) grouped.push({ p: currentP, k: count });
  return grouped;
}

export function phi(n) {
  const N = BigInt(n);
  const factors = primeFactors(N);
  let res = N;
  let formulaStr = `${N}`;
  
  for (const f of factors) {
    res = res - (res / f.p);
    formulaStr += ` * (1 - 1/${f.p})`;
  }
  return { result: res, factors, formulaStr };
}

export function isPrimitiveRoot(a, n) {
  const A = BigInt(a);
  const N = BigInt(n);
  const N_phi = phi(N).result;
  const factors = primeFactors(N_phi);
  const steps = [];

  for (const f of factors) {
    const power = N_phi / f.p;
    const res = modPow(A, power, N).result;
    steps.push({ p: f.p.toString(), power: power.toString(), res: res.toString() });
    if (res === 1n) {
      return { isPrimitive: false, steps, failingPrime: f.p.toString() };
    }
  }
  return { isPrimitive: true, steps };
}

export function discreteLog(a, b, m) {
  const A = BigInt(a);
  const B = BigInt(b);
  const M = BigInt(m);
  
  // Baby-step giant-step
  let n = 1n;
  while (n * n < M) n++; // ceil(sqrt(M))
  
  const vals = new Map();
  // Baby steps
  let cur = 1n;
  for (let p = 0n; p <= n; p++) {
    if (!vals.has(cur)) vals.set(cur, p);
    cur = (cur * A) % M;
  }
  
  // Giant steps
  const aInv = modInverse(A, M);
  const aMn = modPow(aInv, n, M).result;
  
  cur = B;
  for (let q = 0n; q <= n; q++) {
    if (vals.has(cur)) {
      const p = vals.get(cur);
      const res = (q * n + p) % M;
      return { result: res, found: true, steps: { n: n.toString(), p: p.toString(), q: q.toString()} };
    }
    cur = (cur * aMn) % M;
  }
  
  return { result: -1n, found: false, steps: {} };
}

export function crt(equations) {
  let N = 1n;
  for (const eq of equations) {
    N *= BigInt(eq.n);
  }
  
  let x = 0n;
  const steps = [];
  
  for (let i = 0; i < equations.length; i++) {
    const a_i = BigInt(equations[i].a);
    const n_i = BigInt(equations[i].n);
    const m_i = N / n_i;
    const y_i = modInverse(m_i, n_i);
    
    x += a_i * m_i * y_i;
    steps.push({ i: i+1, a: a_i.toString(), n: n_i.toString(), m: m_i.toString(), y: y_i.toString() });
  }
  
  return { result: x % N, N, steps };
}
