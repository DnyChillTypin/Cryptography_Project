/**
 * Hex and Binary string utilities for Block Ciphers.
 */

export function hexToBin(hex) {
  let bin = "";
  for (let i = 0; i < hex.length; i++) {
    bin += parseInt(hex[i], 16).toString(2).padStart(4, "0");
  }
  return bin.toUpperCase();
}

export function binToHex(bin) {
  let hex = "";
  for (let i = 0; i < bin.length; i += 4) {
    hex += parseInt(bin.substr(i, 4), 2).toString(16).toUpperCase();
  }
  return hex;
}

export function xorBin(b1, b2) {
  let res = "";
  for (let i = 0; i < b1.length; i++) {
    res += b1[i] === b2[i] ? "0" : "1";
  }
  return res;
}

export function xorHex(h1, h2) {
  const b1 = hexToBin(h1);
  const b2 = hexToBin(h2);
  return binToHex(xorBin(b1, b2));
}

/** Format a hex string into a 4x4 matrix representation (array of arrays of 2 chars) */
export function hexToMatrix(hex) {
  const matrix = [[], [], [], []];
  let idx = 0;
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 4; r++) {
       matrix[r][c] = hex.substr(idx, 2).toUpperCase();
       idx += 2;
    }
  }
  return matrix;
}

export function matrixToHex(matrix) {
  let hex = "";
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 4; r++) {
      hex += matrix[r][c];
    }
  }
  return hex.toUpperCase();
}
