const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const mod = (n, m) => ((n % m) + m) % m;
const ci = c => A.indexOf(c);

// 1. Caesar: SAVEFORARAINYDAY, K=25
let c1 = '';
for (const ch of 'SAVEFORARAINYDAY') c1 += A[mod(ci(ch) + 25, 26)];
console.log('1. Caesar K=25:', c1);

// 2. Vigenere Repeating: WHENINROMEDO, K=THETRU
let c2 = '', k2 = 'THETRU', pt2 = 'WHENINROMEDO';
for (let i = 0; i < pt2.length; i++) c2 += A[mod(ci(pt2[i]) + ci(k2[i % k2.length]), 26)];
console.log('2. Vigenere Repeating:', c2);

// 3. Vigenere Autokey: BARKINGDOGSS, K=LIKEFA
let c3 = '', k3 = 'LIKEFA', pt3 = 'BARKINGDOGSS';
for (let i = 0; i < pt3.length; i++) {
  let kc = i < k3.length ? k3[i] : pt3[i - k3.length];
  c3 += A[mod(ci(pt3[i]) + ci(kc), 26)];
}
console.log('3. Vigenere Autokey:', c3);

// 4. Monoalphabetic: PENNYWISEPOUNDFO, K=KGOXPMUHCAYTJQWZRIVESFLDNB
let ka = 'KGOXPMUHCAYTJQWZRIVESFLDNB', c4 = '';
for (const ch of 'PENNYWISEPOUNDFO') c4 += ka[ci(ch)];
console.log('4. Monoalphabetic:', c4);

// 5. Playfair: STILLWATERSR, K=SAVEFORA
let seen = new Set(), mx = [];
for (const ch of ('SAVEFORA' + A).replace(/J/g, 'I')) {
  if (ch >= 'A' && ch <= 'Z' && !seen.has(ch)) { seen.add(ch); mx.push(ch); }
}
console.log('5. Playfair Matrix:', mx.join(''));
let pos = {};
for (let i = 0; i < 25; i++) pos[mx[i]] = { r: Math.floor(i / 5), c: i % 5 };

let pt5 = 'STILLWATERSR'.replace(/J/g, 'I');
let digs = [], idx = 0;
while (idx < pt5.length) {
  let a = pt5[idx], b;
  if (idx + 1 >= pt5.length) { b = 'X'; idx += 1; }
  else if (pt5[idx] === pt5[idx + 1]) { b = 'X'; idx += 1; }
  else { b = pt5[idx + 1]; idx += 2; }
  digs.push([a, b]);
}
console.log('   Digraphs:', digs.map(d => d.join('')).join(' '));
let c5 = '';
for (const [a, b] of digs) {
  let pa = pos[a], pb = pos[b];
  if (pa.r === pb.r) { c5 += mx[pa.r * 5 + mod(pa.c + 1, 5)] + mx[pb.r * 5 + mod(pb.c + 1, 5)]; }
  else if (pa.c === pb.c) { c5 += mx[mod(pa.r + 1, 5) * 5 + pa.c] + mx[mod(pb.r + 1, 5) * 5 + pb.c]; }
  else { c5 += mx[pa.r * 5 + pb.c] + mx[pb.r * 5 + pa.c]; }
}
console.log('   Playfair ciphertext:', c5);

// 6. Permutation: TIMEISMONEYTIMEISM, K=5
let pt6 = 'TIMEISMONEYTIMEISM';
while (pt6.length % 5 !== 0) pt6 += 'X';
console.log('6. Permutation padded:', pt6, 'len:', pt6.length);
let rows6 = pt6.length / 5;
for (let r = 0; r < rows6; r++) console.log('   Row', r + 1, ':', pt6.slice(r * 5, r * 5 + 5));
let c6 = '';
for (let col = 0; col < 5; col++) {
  for (let r = 0; r < rows6; r++) c6 += pt6[r * 5 + col];
}
console.log('   Permutation ciphertext:', c6);
