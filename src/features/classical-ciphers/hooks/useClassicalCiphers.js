import { useState, useMemo } from 'react';
import { A, mod, charIdx, sanitize } from '../utils/cryptoMath';

export function useCaesarCipher(initialPlaintext = 'SAVEFORARAINYDAY', initialKey = '25') {
  const [plain, setPlain] = useState(initialPlaintext);
  const [key, setKey] = useState(initialKey);

  const result = useMemo(() => {
    const k = mod(parseInt(key, 10) || 0, 26);
    let cipher = '';
    for (const ch of sanitize(plain)) {
      const i = charIdx(ch);
      cipher += A[mod(i + k, 26)];
    }
    return { cipher, k, plain: sanitize(plain) };
  }, [plain, key]);

  return { plain, setPlain, key, setKey, ...result };
}

export function useVigenereRepeating(initialPlaintext = 'WHENINROMEDO', initialKey = 'THETRU') {
  const [plain, setPlain] = useState(initialPlaintext);
  const [key, setKey] = useState(initialKey);

  const result = useMemo(() => {
    const M = sanitize(plain);
    const K = sanitize(key) || 'A';
    let cipher = '', steps = [];
    for (let i = 0; i < M.length; i++) {
      const pi = charIdx(M[i]);
      const ki = charIdx(K[i % K.length]);
      const ci = mod(pi + ki, 26);
      cipher += A[ci];
      steps.push({ p: M[i], pIdx: pi, k: K[i % K.length], kIdx: ki, ci, c: A[ci] });
    }
    return { cipher, steps, M, K };
  }, [plain, key]);

  return { plain, setPlain, key, setKey, ...result };
}

export function useVigenereAutokey(initialPlaintext = 'BARKINGDOGSS', initialKey = 'LIKEFA') {
  const [plain, setPlain] = useState(initialPlaintext);
  const [key, setKey] = useState(initialKey);

  const result = useMemo(() => {
    const M = sanitize(plain);
    const initK = sanitize(key) || 'A';
    let cipher = '', steps = [];
    for (let i = 0; i < M.length; i++) {
        let keyChar = i < initK.length ? initK[i] : M[i - initK.length];
        let pi = charIdx(M[i]);
        let ki = charIdx(keyChar);
        let ci = mod(pi + ki, 26);
        cipher += A[ci];
        steps.push({ p: M[i], k: keyChar, src: i < initK.length ? 'Initial' : 'Plaintext', ci, c: A[ci] });
    }
    return { cipher, steps, M, initK };
  }, [plain, key]);

  return { plain, setPlain, key, setKey, ...result };
}

export function useMonoalphabetic(initialPlaintext = 'PENNYWISEPOUNDFO', initialKey = 'KGOXPMUHCAYTJQWZRIVESFLDNB') {
  const [plain, setPlain] = useState(initialPlaintext);
  const [key, setKey] = useState(initialKey);

  const result = useMemo(() => {
    const M = sanitize(plain);
    const K = sanitize(key);
    let ka = K.length === 26 ? K : A;
    let cipher = '';
    for (const ch of M) cipher += ka[charIdx(ch)];
    return { cipher, M, ka, isValid: K.length === 26 };
  }, [plain, key]);

  return { plain, setPlain, key, setKey, ...result };
}

export function usePlayfair(initialPlaintext = 'STILLWATERSR', initialKey = 'SAVEFORA') {
  const [plain, setPlain] = useState(initialPlaintext);
  const [key, setKey] = useState(initialKey);

  const result = useMemo(() => {
    const M = sanitize(plain).replace(/J/g, 'I');
    const K = sanitize(key);
    
    const seen = new Set();
    const matrix = [];
    for (const ch of (K + A).replace(/J/g, 'I')) {
      if (ch >= 'A' && ch <= 'Z' && !seen.has(ch)) { seen.add(ch); matrix.push(ch); }
    }
    
    const pos = {};
    for (let i = 0; i < 25; i++) pos[matrix[i]] = { row: Math.floor(i/5), col: i%5 };

    const digs = [];
    let idx = 0;
    while(idx < M.length) {
      let a = M[idx], b;
      if (idx+1 >= M.length) { b = 'X'; idx++; }
      else if (M[idx] === M[idx+1]) { b = 'X'; idx++; }
      else { b = M[idx+1]; idx += 2; }
      digs.push([a, b]);
    }

    let cipher = '', steps = [];
    for(const [a, b] of digs) {
      let pa = pos[a], pb = pos[b], ca, cb, rule;
      if (pa.row === pb.row) {
        ca = matrix[pa.row*5 + mod(pa.col+1, 5)]; cb = matrix[pb.row*5 + mod(pb.col+1, 5)]; rule='Row →';
      } else if (pa.col === pb.col) {
        ca = matrix[mod(pa.row+1, 5)*5 + pa.col]; cb = matrix[mod(pb.row+1, 5)*5 + pb.col]; rule='Col ↓';
      } else {
        ca = matrix[pa.row*5 + pb.col]; cb = matrix[pb.row*5 + pa.col]; rule='Rect ⤨';
      }
      cipher += ca+cb;
      steps.push({a, b, rule, ca, cb});
    }
    
    return { cipher, steps, matrix, M };
  }, [plain, key]);

  return { plain, setPlain, key, setKey, ...result };
}

export function usePermutation(initialPlaintext = 'TIMEISMONEYTIMEISM', initialKey = '5') {
  const [plain, setPlain] = useState(initialPlaintext);
  const [key, setKey] = useState(initialKey);

  const result = useMemo(() => {
    const M = sanitize(plain);
    const C = parseInt(key, 10);
    if (!C || C < 2) return { cipher: '', grid: [], rows: 0, C, M };

    let padded = M;
    while(padded.length % C !== 0) padded += 'X';
    let rows = padded.length / C;
    
    let grid = [];
    for(let r=0; r<rows; r++) grid.push(padded.slice(r*C, r*C+C));

    let cipher = '';
    for(let c=0; c<C; c++) {
      for(let r=0; r<rows; r++) cipher += grid[r][c];
    }
    return { cipher, grid, rows, C, padded };
  }, [plain, key]);

  return { plain, setPlain, key, setKey, ...result };
}
