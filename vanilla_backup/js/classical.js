/**
 * Cryptography — Classical Ciphers Module
 * Solvers: Caesar, Vigenère (Repeating & Autokey), Monoalphabetic, Playfair, Permutation Cipher
 * Layout: Dashboard (Inputs on left, Visualization on right)
 */
(function () {
  'use strict';

  const container = document.getElementById('classical-content');
  if (!container) return;

  // ── Utility ──────────────────────────────────────────────────────
  const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const mod = (n, m) => ((n % m) + m) % m;
  const charIdx = (c) => A.indexOf(c.toUpperCase());

  function escapeHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  // ── UI helpers ───────────────────────────────────────────────────
  function solverDashboard(id, number, title, subtitle, leftForms, rightId) {
    return `
    <div class="solver-dashboard mb-4 pb-4" style="border-bottom: 1px solid var(--border-subtle); margin-bottom: 40px !important; padding-bottom: 40px !important;">
      
      <!-- LEFT PANEL (Inputs & Outputs) -->
      <div class="solver-panel-left shadow-lg">
        <div class="solver-header">
          <h3>${title}</h3>
          <span class="problem-id">#${number}</span>
        </div>
        <p class="card-subtitle" style="font-size:12px;">${subtitle}</p>
        
        <div class="inputs-section mt-4">
          ${leftForms}
        </div>
        
        <!-- Output injected here -->
        <div id="${id}-out-left"></div>
      </div>
      
      <!-- RIGHT PANEL (Visualization & Analysis) -->
      <div class="solver-panel-right" id="${rightId}">
        <!-- Dynamic visualizations injected here -->
      </div>
      
    </div>`;
  }

  function formGroup(label, id, value, placeholder) {
    return `
    <div class="form-group">
      <label for="${id}">${label}</label>
      <input type="text" id="${id}" value="${escapeHtml(value)}" placeholder="${placeholder}" />
    </div>`;
  }

  function runBtn(id, text = 'Encrypt') {
    return `<button class="btn btn-primary btn-block mt-2" id="${id}">⚡ ${text}</button>`;
  }

  // Quick frequency analysis for visualization
  function getFreq(text) {
    const counts = new Array(26).fill(0);
    let total = 0;
    for (let c of text.toUpperCase()) {
      let idx = charIdx(c);
      if (idx !== -1) { counts[idx]++; total++; }
    }
    return {counts, total};
  }
  
  function renderFreqChart(plain, cipher) {
    const ptFreq = getFreq(plain);
    const ctFreq = getFreq(cipher);
    
    let genBars = (counts, total, color) => {
      let bars = '';
      for (let i = 0; i < 26; i++) {
        let h = total === 0 ? 0 : (counts[i] / total) * 100;
        bars += `<div style="display:flex; flex-direction:column; align-items:center; flex:1;">
                   <div style="height:40px; width:100%; display:flex; align-items:flex-end;">
                     <div style="height:${h}%; width:60%; background:${color}; border-radius:2px 2px 0 0;"></div>
                   </div>
                   <div style="font-size:8px; margin-top:4px; color:var(--text-muted);">${A[i]}</div>
                 </div>`;
      }
      return bars;
    };

    return `
      <div class="viz-panel">
        <h4>Frequency Analysis</h4>
        <div style="display:flex; margin-top:8px;">
          <div style="width:60px; font-size:10px; color:var(--text-secondary); display:flex; align-items:center;">Plain</div>
          <div style="display:flex; flex:1; gap:1px;">${genBars(ptFreq.counts, ptFreq.total, 'rgba(255,255,255,0.8)')}</div>
        </div>
        <div style="display:flex; margin-top:16px;">
          <div style="width:60px; font-size:10px; color:var(--neon-orange); display:flex; align-items:center;">Cipher</div>
          <div style="display:flex; flex:1; gap:1px;">${genBars(ctFreq.counts, ctFreq.total, 'var(--neon-orange)')}</div>
        </div>
      </div>
    `;
  }

  // ════════════════════════════════════════════════════════════════
  //  1 — CAESAR CIPHER
  // ════════════════════════════════════════════════════════════════
  function caesarEncrypt(plaintext, key) {
    const k = mod(parseInt(key, 10), 26);
    let cipher = '';
    for (const ch of plaintext.toUpperCase()) {
      const i = charIdx(ch);
      if (i === -1) { cipher += ch; continue; }
      cipher += A[mod(i + k, 26)];
    }
    return { cipher, k };
  }

  function renderCaesar() {
    const M = document.getElementById('caesar-m').value.toUpperCase().replace(/[^A-Z]/g, '');
    const K = document.getElementById('caesar-k').value;
    const { cipher, k } = caesarEncrypt(M, K);
    
    // Left output updates
    document.getElementById('caesar-out-left').innerHTML = `
      <div class="result-box">
        <div class="result-label">Ciphertext</div>
        <div class="result-value" style="color:var(--neon-orange)">${cipher}</div>
      </div>
    `;

    // Right visualization updates (Encryption System string mapping + Freq Analysis)
    let sysRowPlain = A.split('').map(c => `<th>${c}</th>`).join('');
    let sysRowCipher = A.split('').map((c, i) => `<td style="color:var(--neon-orange); font-weight:700;">${A[mod(i+k, 26)]}</td>`).join('');

    document.getElementById('viz-caesar').innerHTML = `
      <div class="viz-panel">
        <h4>Encryption System</h4>
        <div style="font-size:12px; margin-bottom:12px; color:var(--text-secondary);">
          Formula: <span class="text-cyan">C = (P + K) mod 26</span>, where K = ${k}. Below is the substitution mapping:
        </div>
        <div style="overflow-x:auto;">
          <table class="data-table" style="font-size:11px;">
            <thead><tr><th style="font-size:9px;">Plain</th>${sysRowPlain}</tr></thead>
            <tbody><tr><td style="font-size:9px;color:var(--neon-orange);">Cipher</td>${sysRowCipher}</tr></tbody>
          </table>
        </div>
      </div>
      ${renderFreqChart(M, cipher)}
    `;
  }

  // ════════════════════════════════════════════════════════════════
  //  2 — VIGENÈRE (REPEATING KEY)
  // ════════════════════════════════════════════════════════════════
  function renderVigenereRepeating() {
    const M = document.getElementById('vig-rep-m').value.replace(/[^A-Z]/gi, '').toUpperCase();
    const K = document.getElementById('vig-rep-k').value.replace(/[^A-Z]/gi, '').toUpperCase() || 'A';
    let cipher = '', steps = [];
    for (let i = 0; i < M.length; i++) {
      const pi = charIdx(M[i]);
      const ki = charIdx(K[i % K.length]);
      const ci = mod(pi + ki, 26);
      cipher += A[ci];
      steps.push({ p: M[i], pIdx: pi, k: K[i % K.length], kIdx: ki, ci, c: A[ci] });
    }

    document.getElementById('vig-rep-out-left').innerHTML = `
      <div class="result-box">
        <div class="result-label">Ciphertext</div>
        <div class="result-value" style="color:var(--neon-orange)">${cipher}</div>
      </div>
    `;

    let tableRows = steps.map((s, i) => `
      <tr>
        <td>${i + 1}</td>
        <td class="text-cyan">${s.p}</td>
        <td style="color:var(--neon-orange)">${s.k}</td>
        <td>${s.pIdx} + ${s.kIdx} = ${s.ci}</td>
        <td class="text-green" style="font-weight:700">${s.c}</td>
      </tr>`).join('');

    document.getElementById('viz-vig-rep').innerHTML = `
      <div class="viz-panel">
        <h4>Step-by-Step Calculation</h4>
        <div style="font-size:12px; margin-bottom:12px; color:var(--text-secondary);">
          Formula: <span class="text-cyan">C<sub>i</sub> = (P<sub>i</sub> + K<sub>i mod len(key)</sub>) mod 26</span>
        </div>
        <div style="max-height: 250px; overflow-y: auto;">
          <table class="data-table">
            <thead><tr style="position:sticky;top:0;background:var(--bg-deep);"><th>#</th><th>Plain</th><th>Key</th><th>Calc (P+K)</th><th>Cipher</th></tr></thead>
            <tbody>${tableRows}</tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ════════════════════════════════════════════════════════════════
  //  3 — VIGENÈRE (AUTOKEY)
  // ════════════════════════════════════════════════════════════════
  function renderVigenereAutokey() {
    const M = document.getElementById('vig-auto-m').value.replace(/[^A-Z]/gi, '').toUpperCase();
    const initK = document.getElementById('vig-auto-k').value.replace(/[^A-Z]/gi, '').toUpperCase() || 'A';
    let cipher = '', steps = [];
    for (let i = 0; i < M.length; i++) {
        let keyChar = i < initK.length ? initK[i] : M[i - initK.length];
        let pi = charIdx(M[i]);
        let ki = charIdx(keyChar);
        let ci = mod(pi + ki, 26);
        cipher += A[ci];
        steps.push({ p: M[i], k: keyChar, src: i < initK.length ? 'Initial' : 'Plaintext', ci, c: A[ci] });
    }

    document.getElementById('vig-auto-out-left').innerHTML = `
      <div class="result-box">
        <div class="result-label">Ciphertext</div>
        <div class="result-value" style="color:var(--neon-orange)">${cipher}</div>
      </div>
    `;

    let tableRows = steps.map((s, i) => `
      <tr>
        <td>${i + 1}</td>
        <td class="text-cyan">${s.p}</td>
        <td style="color:var(--neon-orange)">${s.k}</td>
        <td style="font-size:10px;">${s.src}</td>
        <td class="text-green" style="font-weight:700">${s.c}</td>
      </tr>`).join('');

    document.getElementById('viz-vig-auto').innerHTML = `
      <div class="viz-panel">
        <h4>Autokey Generation</h4>
        <div style="font-size:12px; margin-bottom:12px; color:var(--text-secondary);">
          Full Keystream = "${initK}" + Plaintext
        </div>
        <div style="max-height: 250px; overflow-y: auto;">
          <table class="data-table">
            <thead><tr style="position:sticky;top:0;background:var(--bg-deep);"><th>#</th><th>Plain</th><th>Key</th><th>Source</th><th>Cipher</th></tr></thead>
            <tbody>${tableRows}</tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ════════════════════════════════════════════════════════════════
  //  4 — MONOALPHABETIC
  // ════════════════════════════════════════════════════════════════
  function renderMonoalphabetic() {
    const M = document.getElementById('mono-m').value.toUpperCase().replace(/[^A-Z]/g, '');
    const K = document.getElementById('mono-k').value.toUpperCase().replace(/[^A-Z]/g, '');
    let ka = K.length === 26 ? K : A;
    let cipher = '';
    
    for (const ch of M) {
      cipher += ka[charIdx(ch)];
    }

    document.getElementById('mono-out-left').innerHTML = `
      <div class="result-box">
        <div class="result-label">Ciphertext</div>
        <div class="result-value" style="color:var(--neon-orange)">${cipher}</div>
      </div>
      ${K.length !== 26 ? '<div style="color:var(--neon-magenta); font-size:12px; margin-top:8px;">Warning: Key alphabet must be exactly 26 letters.</div>' : ''}
    `;

    let sysRowPlain = A.split('').map(c => `<th>${c}</th>`).join('');
    let sysRowCipher = ka.split('').map(c => `<td style="color:var(--neon-orange); font-weight:700;">${c}</td>`).join('');

    document.getElementById('viz-mono').innerHTML = `
      <div class="viz-panel">
        <h4>Substitution Map</h4>
        <div style="overflow-x:auto;">
          <table class="data-table" style="font-size:11px;">
            <thead><tr><th style="font-size:9px;">Plain</th>${sysRowPlain}</tr></thead>
            <tbody><tr><td style="font-size:9px;color:var(--neon-orange);">Cipher</td>${sysRowCipher}</tr></tbody>
          </table>
        </div>
      </div>
      ${renderFreqChart(M, cipher)}
    `;
  }

  // ════════════════════════════════════════════════════════════════
  //  5 — PLAYFAIR
  // ════════════════════════════════════════════════════════════════
  function renderPlayfair() {
    const M = document.getElementById('playfair-m').value;
    const K = document.getElementById('playfair-k').value;
    
    // Matrix gen
    const seen = new Set();
    const matrix = [];
    for (const ch of (K.toUpperCase() + A).replace(/J/g, 'I')) {
      if (ch >= 'A' && ch <= 'Z' && !seen.has(ch)) { seen.add(ch); matrix.push(ch); }
    }
    
    const pos = {};
    for (let i = 0; i < 25; i++) pos[matrix[i]] = { row: Math.floor(i/5), col: i%5 };

    let pt = M.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
    const digs = [];
    let idx = 0;
    while(idx < pt.length) {
      let a = pt[idx], b;
      if (idx+1 >= pt.length) { b = 'X'; idx++; }
      else if (pt[idx] === pt[idx+1]) { b = 'X'; idx++; }
      else { b = pt[idx+1]; idx += 2; }
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

    document.getElementById('playfair-out-left').innerHTML = `
      <div class="result-box">
        <div class="result-label">Ciphertext</div>
        <div class="result-value" style="color:var(--neon-orange)">${cipher}</div>
      </div>
    `;

    let matrixHtml = '<div class="matrix-grid" style="grid-template-columns:repeat(5,1fr);max-width:200px;margin:12px auto;">';
    for (let i = 0; i < 25; i++) matrixHtml += `<div class="matrix-cell" style="color:white; border-color:var(--neon-orange);">${matrix[i]}</div>`;
    matrixHtml += '</div>';

    let tableRows = steps.map(s => `<tr>
      <td class="text-cyan">${s.a}${s.b}</td>
      <td style="color:var(--text-muted);font-size:11px;">${s.rule}</td>
      <td class="text-green" style="font-weight:700">${s.ca}${s.cb}</td>
    </tr>`).join('');

    document.getElementById('viz-playfair').innerHTML = `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
        <div class="viz-panel">
          <h4>5×5 Matrix</h4>
          ${matrixHtml}
        </div>
        <div class="viz-panel">
          <h4>Digraphs & Rules</h4>
          <div style="max-height: 200px; overflow-y: auto;">
             <table class="data-table">
               <thead><tr style="position:sticky;top:0;background:var(--bg-deep);"><th>Pair</th><th>Rule</th><th>Cipher</th></tr></thead>
               <tbody>${tableRows}</tbody>
             </table>
          </div>
        </div>
      </div>
    `;
  }

  // ════════════════════════════════════════════════════════════════
  //  6 — PERMUTATION
  // ════════════════════════════════════════════════════════════════
  function renderPermutation() {
    const M = document.getElementById('perm-m').value.toUpperCase().replace(/[^A-Z]/g, '');
    const C = parseInt(document.getElementById('perm-k').value, 10);
    if (!C || C < 2) return;

    let padded = M;
    while(padded.length % C !== 0) padded += 'X';
    let rows = padded.length / C;
    
    let grid = [];
    for(let r=0; r<rows; r++) grid.push(padded.slice(r*C, r*C+C));

    let cipher = '';
    for(let c=0; c<C; c++) {
      for(let r=0; r<rows; r++) cipher += grid[r][c];
    }

    document.getElementById('perm-out-left').innerHTML = `
      <div class="result-box">
        <div class="result-label">Ciphertext</div>
        <div class="result-value" style="color:var(--neon-orange)">${cipher}</div>
      </div>
    `;

    let gridHtml = '<table class="data-table" style="margin: 0 auto; max-width:100%;">';
    gridHtml += '<thead><tr>' + [...Array(C)].map((_,i)=>`<th>Col ${i+1}</th>`).join('') + '</tr></thead><tbody>';
    for(let r=0; r<rows; r++) {
      gridHtml += '<tr>' + [...Array(C)].map((_,c)=>`<td class="text-cyan">${grid[r][c]}</td>`).join('') + '</tr>';
    }
    gridHtml += '</tbody></table>';

    document.getElementById('viz-perm').innerHTML = `
      <div class="viz-panel">
        <h4>Transposition Grid</h4>
        <div style="font-size:12px; margin-bottom:12px; color:var(--text-secondary);">
          Written left-to-right, read top-to-bottom.
        </div>
        ${gridHtml}
      </div>
    `;
  }

  // ════════════════════════════════════════════════════════════════
  //  INITIALIZE DASHBOARD Layout
  // ════════════════════════════════════════════════════════════════
  container.innerHTML = `
    ${solverDashboard('caesar', '1', 'Caesar Cipher', 'Single-alphabet shift cipher. C = (P + K) mod 26.',
      formGroup('Plain Text', 'caesar-m', 'SAVEFORARAINYDAY', 'Enter plaintext...') +
      formGroup('Key (Shift)', 'caesar-k', '25', '0-25') +
      runBtn('btn-caesar', 'Encrypt'),
      'viz-caesar'
    )}
    ${solverDashboard('vig-rep', '2', 'Vigenère Cipher (Repeating Key)', 'Polyalphabetic substitution using a cyclic key.',
      formGroup('Plain Text', 'vig-rep-m', 'WHENINROMEDO', '') +
      formGroup('Key Word', 'vig-rep-k', 'THETRU', '') +
      runBtn('btn-vig-rep', 'Encrypt'),
      'viz-vig-rep'
    )}
    ${solverDashboard('vig-auto', '3', 'Vigenère Cipher (Autokey)', 'Key stream appends the plaintext after initial key.',
      formGroup('Plain Text', 'vig-auto-m', 'BARKINGDOGSS', '') +
      formGroup('Initial Key', 'vig-auto-k', 'LIKEFA', '') +
      runBtn('btn-vig-auto', 'Encrypt'),
      'viz-vig-auto'
    )}
    ${solverDashboard('mono', '4', 'Monoalphabetic Substitution', 'Maps alphabet to a shuffled 26-character sequence.',
      formGroup('Plain Text', 'mono-m', 'PENNYWISEPOUNDFO', '') +
      formGroup('26-Char Key Map', 'mono-k', 'KGOXPMUHCAYTJQWZRIVESFLDNB', '') +
      runBtn('btn-mono', 'Encrypt'),
      'viz-mono'
    )}
    ${solverDashboard('playfair', '5', 'Playfair Cipher', 'Digraph encryption on a 5×5 matrix (replaces J with I).',
      formGroup('Plain Text', 'playfair-m', 'STILLWATERSR', '') +
      formGroup('Key Word', 'playfair-k', 'SAVEFORA', '') +
      runBtn('btn-playfair', 'Encrypt'),
      'viz-playfair'
    )}
    ${solverDashboard('perm', '6', 'Permutation Cipher', 'Writes text into columns, reads columns downwards.',
      formGroup('Plain Text', 'perm-m', 'TIMEISMONEYTIMEISM', '') +
      formGroup('Grid Columns', 'perm-k', '5', '') +
      runBtn('btn-perm', 'Encrypt'),
      'viz-perm'
    )}
  `;

  // Bind Listeners
  document.getElementById('btn-caesar').addEventListener('click', renderCaesar);
  document.getElementById('btn-vig-rep').addEventListener('click', renderVigenereRepeating);
  document.getElementById('btn-vig-auto').addEventListener('click', renderVigenereAutokey);
  document.getElementById('btn-mono').addEventListener('click', renderMonoalphabetic);
  document.getElementById('btn-playfair').addEventListener('click', renderPlayfair);
  document.getElementById('btn-perm').addEventListener('click', renderPermutation);

  // Auto-run all initial states
  renderCaesar();
  renderVigenereRepeating();
  renderVigenereAutokey();
  renderMonoalphabetic();
  renderPlayfair();
  renderPermutation();

})();
