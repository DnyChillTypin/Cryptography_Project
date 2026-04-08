import { SBOX, RCON } from './aesTables';

function subWord(word) {
  return word.map(b => SBOX[b]);
}

function rotWord(word) {
  return [word[1], word[2], word[3], word[0]];
}

export function keyExpansion(keyHex) {
  // keyHex is a 32-char hex string (128 bit)
  const keyBytes = [];
  for (let i = 0; i < 32; i += 2) {
    keyBytes.push(parseInt(keyHex.substr(i, 2), 16));
  }

  const w = [];
  for (let i = 0; i < 4; i++) {
    w.push([keyBytes[4*i], keyBytes[4*i+1], keyBytes[4*i+2], keyBytes[4*i+3]]);
  }

  const steps = [];

  for (let i = 4; i < 44; i++) {
    let temp = [...w[i - 1]];
    let action = "No action";
    let sub = null, rot = null, rconVal = null;
    
    if (i % 4 === 0) {
      rot = rotWord(temp);
      sub = subWord(rot);
      rconVal = [RCON[i / 4], 0, 0, 0];
      temp = [
        sub[0] ^ rconVal[0],
        sub[1] ^ rconVal[1],
        sub[2] ^ rconVal[2],
        sub[3] ^ rconVal[3]
      ];
      action = "RotWord, SubWord, XOR Rcon";
    }

    const newW = [
      w[i - 4][0] ^ temp[0],
      w[i - 4][1] ^ temp[1],
      w[i - 4][2] ^ temp[2],
      w[i - 4][3] ^ temp[3]
    ];
    w.push(newW);

    if (i % 4 === 0) {
      steps.push({
        i, prevW: w[i-1],
        rot, sub, rconVal, temp,
        w_new: newW
      });
    }
  }

  const roundKeys = [];
  for (let i = 0; i < 11; i++) {
    const k = [];
    for (let c = 0; c < 4; c++) {
      k.push(w[i * 4 + c]);
    }
    // Convert to matrix format [row][col] where k has [col][row] conceptually
    const mat = [[],[],[],[]];
    for (let c = 0; c < 4; c++) {
      for (let r = 0; r < 4; r++) mat[r][c] = k[c][r];
    }
    roundKeys.push(mat);
  }

  return { w, steps, roundKeys };
}

function hexToBytes(hex) {
  const bytes = [];
  for (let i=0; i<hex.length; i+=2) bytes.push(parseInt(hex.substr(i,2), 16));
  return bytes;
}

function bytesToMatrix(bytes) {
  const mat = [[],[],[],[]];
  for (let i=0; i<16; i++) {
    mat[i % 4][Math.floor(i / 4)] = bytes[i];
  }
  return mat;
}

function cloneMatrix(mat) {
  return [ [...mat[0]], [...mat[1]], [...mat[2]], [...mat[3]] ];
}

function addRoundKey(state, key) {
  const next = cloneMatrix(state);
  for (let c=0; c<4; c++) {
    for (let r=0; r<4; r++) {
      next[r][c] ^= key[r][c];
    }
  }
  return next;
}

function subBytes(state) {
  const next = cloneMatrix(state);
  for (let r=0; r<4; r++) {
    for (let c=0; c<4; c++) {
      next[r][c] = SBOX[next[r][c]];
    }
  }
  return next;
}

function shiftRows(state) {
  const next = cloneMatrix(state);
  next[1] = [next[1][1], next[1][2], next[1][3], next[1][0]];
  next[2] = [next[2][2], next[2][3], next[2][0], next[2][1]];
  next[3] = [next[3][3], next[3][0], next[3][1], next[3][2]];
  return next;
}

function galoisMult(a, b) {
  let p = 0;
  for (let counter = 0; counter < 8; counter++) {
    if ((b & 1) !== 0) p ^= a;
    let hi_bit_set = (a & 0x80) !== 0;
    a <<= 1;
    if (hi_bit_set) a ^= 0x11B; // x^8 + x^4 + x^3 + x + 1
    b >>= 1;
  }
  return p & 0xFF;
}

function mixColumns(state) {
  const next = cloneMatrix(state);
  for (let c=0; c<4; c++) {
    let s0 = state[0][c], s1 = state[1][c], s2 = state[2][c], s3 = state[3][c];
    next[0][c] = galoisMult(0x02, s0) ^ galoisMult(0x03, s1) ^ s2 ^ s3;
    next[1][c] = s0 ^ galoisMult(0x02, s1) ^ galoisMult(0x03, s2) ^ s3;
    next[2][c] = s0 ^ s1 ^ galoisMult(0x02, s2) ^ galoisMult(0x03, s3);
    next[3][c] = galoisMult(0x03, s0) ^ s1 ^ s2 ^ galoisMult(0x02, s3);
  }
  return next;
}

export function formatMatHex(mat) {
  return mat.map(row => row.map(b => b.toString(16).padStart(2, '0').toUpperCase()));
}

export function runAES(hexMsg, hexKey) {
  const keyExp = keyExpansion(hexKey);
  const roundKeys = keyExp.roundKeys;
  
  let state = bytesToMatrix(hexToBytes(hexMsg));
  const rounds = [];

  // Round 0 (Initial AddRoundKey)
  state = addRoundKey(state, roundKeys[0]);
  rounds.push({ round: 0, stateAfter: formatMatHex(state) });

  // Rounds 1-9
  for (let i = 1; i <= 9; i++) {
    const preSub = state;
    state = subBytes(state);
    const postSub = state;
    state = shiftRows(state);
    const postShift = state;
    state = mixColumns(state);
    const postMix = state;
    state = addRoundKey(state, roundKeys[i]);
    
    rounds.push({
      round: i,
      preSub: formatMatHex(preSub),
      postSub: formatMatHex(postSub),
      postShift: formatMatHex(postShift),
      postMix: formatMatHex(postMix),
      stateAfter: formatMatHex(state),
      K: formatMatHex(roundKeys[i])
    });
  }

  // Round 10
  const r10_preSub = state;
  state = subBytes(state);
  const r10_postSub = state;
  state = shiftRows(state);
  const r10_postShift = state;
  state = addRoundKey(state, roundKeys[10]);

  rounds.push({
    round: 10,
    preSub: formatMatHex(r10_preSub),
    postSub: formatMatHex(r10_postSub),
    postShift: formatMatHex(r10_postShift),
    postMix: null, // no mix columns
    stateAfter: formatMatHex(state),
    K: formatMatHex(roundKeys[10])
  });

  // flatten to hex string
  let finalHex = "";
  for(let c=0; c<4; c++){
    for(let r=0; r<4; r++){
      finalHex += state[r][c].toString(16).padStart(2, '0').toUpperCase();
    }
  }

  return { keyExpSteps: keyExp.steps, rounds, finalHex };
}
