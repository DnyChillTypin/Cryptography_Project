import { SBOX, RCON } from './aesTables';

/**
 * AES Time-Travel Stepper Utility
 * 
 * DESIGN RATIONALE:
 * This utility runs a complete AES-128 encryption synchronously and captures 
 * every intermediate state into a "historyArray". 
 * 
 * DEEP CLONING STRATEGY:
 * To prevent reference mutation (where modifying a later state would overwrite
 * earlier ones in the history), we use JSON.parse(JSON.stringify(state)) 
 * for every push. This ensures that every entry in the history is a unique 
 * snapshot in memory of that specific algorithmic step.
 * 
 * STATE REPRESENTATION:
 * Internally, the state is a 1D array of 16 bytes.
 * Mapping to 2D Grid (Column-Major):
 * [ 0,  4,  8,  12 ]
 * [ 1,  5,  9,  13 ]
 * [ 2,  6,  10, 14 ]
 * [ 3,  7,  11, 15 ]
 * This matches the AES standard where bytes are filled column by column.
 */

// Helper: RotWord (used in Key Expansion)
function rotWord(word) {
    return [word[1], word[2], word[3], word[0]];
}

// Helper: SubWord (used in Key Expansion)
function subWord(word) {
    return word.map(b => SBOX[b]);
}

// AES Key Expansion (128-bit)
export function expandKey(keyHex) {
    const keyBytes = [];
    for (let i = 0; i < 32; i += 2) {
        keyBytes.push(parseInt(keyHex.substr(i, 2), 16));
    }

    const w = [];
    for (let i = 0; i < 4; i++) {
        w.push([keyBytes[4 * i], keyBytes[4 * i + 1], keyBytes[4 * i + 2], keyBytes[4 * i + 3]]);
    }

    for (let i = 4; i < 44; i++) {
        let temp = [...w[i - 1]];
        if (i % 4 === 0) {
            temp = subWord(rotWord(temp));
            temp[0] ^= RCON[i / 4];
        }
        w.push([
            w[i - 4][0] ^ temp[0],
            w[i - 4][1] ^ temp[1],
            w[i - 4][2] ^ temp[2],
            w[i - 4][3] ^ temp[3]
        ]);
    }

    // Flatten into round keys (16 bytes each)
    const roundKeys = [];
    for (let i = 0; i < 11; i++) {
        const rk = [];
        for (let j = 0; j < 4; j++) {
            rk.push(...w[i * 4 + j]);
        }
        roundKeys.push(rk);
    }
    return roundKeys;
}

// AES Sub-functions
function subBytes(state) {
    return state.map(b => SBOX[b]);
}

function shiftRows(state) {
    const next = [...state];
    // Row 1: Shift left 1
    next[1] = state[1+4*0]; next[5] = state[1+4*1]; next[9] = state[1+4*2]; next[13] = state[1+4*3];
    const r1 = [next[1], next[5], next[9], next[13]];
    [next[1], next[5], next[9], next[13]] = [r1[1], r1[2], r1[3], r1[0]];
    
    // Row 2: Shift left 2
    const r2 = [state[2+4*0], state[2+4*1], state[2+4*2], state[2+4*3]];
    [next[2], next[6], next[10], next[14]] = [r2[2], r2[3], r2[0], r2[1]];
    
    // Row 3: Shift left 3
    const r3 = [state[3+4*0], state[3+4*1], state[3+4*2], state[3+4*3]];
    [next[3], next[7], next[11], next[15]] = [r3[3], r3[0], r3[1], r3[2]];
    
    return next;
}

function galoisMult(a, b) {
    let p = 0;
    for (let i = 0; i < 8; i++) {
        if (b & 1) p ^= a;
        let hiSet = a & 0x80;
        a <<= 1;
        if (hiSet) a ^= 0x11B;
        b >>= 1;
    }
    return p & 0xFF;
}

function mixColumns(state) {
    const next = [...state];
    for (let i = 0; i < 4; i++) {
        const s0 = state[i * 4 + 0], s1 = state[i * 4 + 1], s2 = state[i * 4 + 2], s3 = state[i * 4 + 3];
        next[i * 4 + 0] = galoisMult(0x02, s0) ^ galoisMult(0x03, s1) ^ s2 ^ s3;
        next[i * 4 + 1] = s0 ^ galoisMult(0x02, s1) ^ galoisMult(0x03, s2) ^ s3;
        next[i * 4 + 2] = s0 ^ s1 ^ galoisMult(0x02, s2) ^ galoisMult(0x03, s3);
        next[i * 4 + 3] = galoisMult(0x03, s0) ^ s1 ^ s2 ^ galoisMult(0x02, s3);
    }
    return next;
}

function addRoundKey(state, key) {
    return state.map((b, i) => b ^ key[i]);
}

/**
 * Generates the exhaustive history of AES encryption steps.
 */
export function getAESHistory(plaintextHex, keyHex) {
    const history = [];
    const push = (label, state, rKey, desc) => {
        history.push({
            label,
            // DEEP CLONE: Ensures each step is an immutable snapshot
            state: JSON.parse(JSON.stringify(state)),
            roundKey: rKey ? JSON.parse(JSON.stringify(rKey)) : null,
            description: desc
        });
    };

    // Convert input
    let state = [];
    for (let i = 0; i < 32; i += 2) state.push(parseInt(plaintextHex.substr(i, 2), 16));
    const roundKeys = expandKey(keyHex);

    push("Initial State", state, null, "The 128-bit plaintext is loaded into a 4x4 matrix (column-major order).");

    // Pre-round (Round 0)
    state = addRoundKey(state, roundKeys[0]);
    push("AddRoundKey (R0)", state, roundKeys[0], "The initial round key is XORed with the state.");

    // Rounds 1 to 10
    for (let r = 1; r <= 10; r++) {
        // SubBytes
        state = subBytes(state);
        push(`SubBytes (R${r})`, state, null, "Each byte in the state is replaced with its entry in the Rijndael S-Box.");

        // ShiftRows
        state = shiftRows(state);
        push(`ShiftRows (R${r})`, state, null, "The last three rows of the state are shifted cyclically to the left by different offsets.");

        // MixColumns (Not in final round)
        if (r < 10) {
            state = mixColumns(state);
            push(`MixColumns (R${r})`, state, null, "The four bytes of each column are combined using an invertible linear transformation.");
        }

        // AddRoundKey
        state = addRoundKey(state, roundKeys[r]);
        push(`AddRoundKey (R${r})`, state, roundKeys[r], `The round key for round ${r} is XORed with the state.`);
    }

    return history;
}
