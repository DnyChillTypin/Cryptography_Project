import { SBOX, RCON } from './aesTables';

/**
 * AES Kinetic History Utility
 * 
 * DESIGN RATIONALE:
 * This utility stores each step of AES as a "Transition".
 * Instead of just snapshots, each entry contains:
 * - prevState: The result of the PREVIOUS step.
 * - operatorState: The "new" content (Round Key, S-Box results, etc.) that will "merge" into the result.
 * - nextState: The final state after the merge.
 */

// Helper: RotWord
function rotWord(word) {
    return [word[1], word[2], word[3], word[0]];
}

// Helper: SubWord
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
    next[1] = state[1+4*0]; next[5] = state[1+4*1]; next[9] = state[1+4*2]; next[13] = state[1+4*3];
    const r1 = [next[1], next[5], next[9], next[13]];
    [next[1], next[5], next[9], next[13]] = [r1[1], r1[2], r1[3], r1[0]];
    const r2 = [state[2+4*0], state[2+4*1], state[2+4*2], state[2+4*3]];
    [next[2], next[6], next[10], next[14]] = [r2[2], r2[3], r2[0], r2[1]];
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
 * Generates the history of AES transitions.
 */
export function getAESHistory(plaintextHex, keyHex) {
    const history = [];
    const push = (label, prevState, operatorState, nextState, desc, type) => {
        history.push({
            label,
            prevState: JSON.parse(JSON.stringify(prevState)),
            operatorState: JSON.parse(JSON.stringify(operatorState)),
            nextState: JSON.parse(JSON.stringify(nextState)),
            description: desc,
            type // 'xor', 'sub', 'shift', 'mix', 'init'
        });
    };

    // Convert input
    let state = [];
    for (let i = 0; i < 32; i += 2) state.push(parseInt(plaintextHex.substr(i, 2), 16));
    const roundKeys = expandKey(keyHex);

    // Initial
    push("Initial Alignment", [], state, state, "The 128-bit plaintext is prepared for the first alignment.", "init");

    // Pre-round (Round 0)
    let next = addRoundKey(state, roundKeys[0]);
    push("AddRoundKey (R0)", state, roundKeys[0], next, "The initial round key merges with the state via XOR.", "xor");
    state = next;

    // Rounds 1 to 10
    for (let r = 1; r <= 10; r++) {
        // SubBytes
        next = subBytes(state);
        push(`SubBytes (R${r})`, state, next, next, "S-Box substitutions are calculated and merged into the result.", "sub");
        state = next;

        // ShiftRows
        next = shiftRows(state);
        push(`ShiftRows (R${r})`, state, next, next, "The row shifts are calculated and merged into the result.", "shift");
        state = next;

        // MixColumns
        if (r < 10) {
            next = mixColumns(state);
            push(`MixColumns (R${r})`, state, next, next, "The column mix transformations are calculated and merged into the result.", "mix");
            state = next;
        }

        // AddRoundKey
        next = addRoundKey(state, roundKeys[r]);
        push(`AddRoundKey (R${r})`, state, roundKeys[r], next, `The round ${r} key merges with the state via XOR.`, "xor");
        state = next;
    }

    return history;
}
