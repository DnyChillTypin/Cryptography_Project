import { PC1, PC2, IP, IP_INV, E, P, SHIFT_SCHEDULE, SBOX } from './desTables';
import { hexToBin, binToHex, xorBin } from '../../../../utils/hexMath';

export function permute(inputBin, table) {
  let output = "";
  for (let i = 0; i < table.length; i++) {
    output += inputBin[table[i] - 1]; // 1-indexed tables
  }
  return output;
}

export function shiftLeft(binStr, shifts) {
  return binStr.substring(shifts) + binStr.substring(0, shifts);
}

export function sboxSubstitute(expanded48) {
  let output32 = "";
  for (let i = 0; i < 8; i++) {
    const chunk = expanded48.substr(i * 6, 6);
    const row = parseInt(chunk[0] + chunk[5], 2);
    const col = parseInt(chunk.substring(1, 5), 2);
    const val = SBOX[i][row][col];
    output32 += val.toString(2).padStart(4, "0");
  }
  return output32;
}

export function generateKeys(hexKey) {
  let binKey = hexToBin(hexKey);
  if (binKey.length !== 64) binKey = binKey.padEnd(64, '0');
  
  const pc1Out = permute(binKey, PC1);
  let C = pc1Out.substring(0, 28);
  let D = pc1Out.substring(28, 56);
  
  const keys = [];
  for (let round = 0; round < 16; round++) {
    C = shiftLeft(C, SHIFT_SCHEDULE[round]);
    D = shiftLeft(D, SHIFT_SCHEDULE[round]);
    const K = permute(C + D, PC2);
    keys.push({ round: round + 1, C, D, K_bin: K, K_hex: binToHex(K) });
  }
  return { pc1Out, keys };
}

export function runDES(hexMessage, hexKey) {
  const { pc1Out, keys } = generateKeys(hexKey);
  
  let binMsg = hexToBin(hexMessage);
  if (binMsg.length !== 64) binMsg = binMsg.padEnd(64, '0');
  
  const ipOut = permute(binMsg, IP);
  let L = ipOut.substring(0, 32);
  let R = ipOut.substring(32, 64);
  
  const rounds = [];
  
  for (let i = 0; i < 16; i++) {
    const prevL = L;
    const prevR = R;
    const K = keys[i].K_bin;
    
    // f-function
    const expR = permute(R, E);
    const xorRes = xorBin(expR, K);
    const sboxOut = sboxSubstitute(xorRes);
    const fOut = permute(sboxOut, P);
    
    // final
    L = prevR;
    R = xorBin(prevL, fOut);
    
    rounds.push({
      round: i + 1,
      prevL_hex: binToHex(prevL), prevR_hex: binToHex(prevR),
      K_hex: keys[i].K_hex,
      expR_hex: binToHex(expR),
      xorRes_hex: binToHex(xorRes),
      sboxOut_hex: binToHex(sboxOut),
      fOut_hex: binToHex(fOut),
      L_hex: binToHex(L), R_hex: binToHex(R)
    });
  }
  
  const preOutput = R + L; // swapped
  const finalCipherBin = permute(preOutput, IP_INV);
  const finalCipherHex = binToHex(finalCipherBin);
  
  return {
    binMsg, pc1Out: binToHex(pc1Out), ipOut: binToHex(ipOut),
    L0: binToHex(ipOut.substring(0,32)), R0: binToHex(ipOut.substring(32,64)),
    keys, rounds,
    finalCipherHex, preOutputHex: binToHex(preOutput)
  };
}
