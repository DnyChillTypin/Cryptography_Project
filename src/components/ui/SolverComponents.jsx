export function SolverDashboard({ title, number, subtitle, children }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 mb-10 pb-10 border-b border-border-subtle">
      {/* LEFT PANEL */}
      <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 flex flex-col shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold text-neon-cyan flex items-center gap-2">{title}</h3>
          <span className="font-mono text-sm font-semibold px-2 py-0.5 bg-white/5 rounded text-neon-cyan opacity-80">#{number}</span>
        </div>
        <p className="text-base text-text-secondary mb-6 leading-relaxed">{subtitle}</p>
        
        <div className="flex flex-col flex-1">
          {children[0]} {/* Inputs */}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex flex-col gap-5 flex-1">
        {children[1]} {/* Visualizations */}
      </div>
    </div>
  );
}

export function FormGroup({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      <input 
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-bg-input border border-border-medium rounded-lg text-text-primary font-mono text-base outline-none transition-all focus:border-neon-cyan focus:shadow-[0_0_0_3px_rgba(0,240,255,0.1),0_0_15px_rgba(0,240,255,0.05)] placeholder-text-muted/50"
      />
    </div>
  );
}

export function ResultBox({ label = "Ciphertext", value, warning }) {
  return (
    <div className="mt-5 p-5 bg-neon-purple/5 border border-neon-purple/20 rounded-xl animate-[resultReveal_0.4s_ease-out]">
      <div className="text-sm font-bold uppercase tracking-widest text-neon-purple mb-2">{label}</div>
      <div className="font-mono text-xl font-bold text-neon-gold break-all">{value}</div>
      {warning && (
        <div className="mt-3 text-sm text-neon-magenta font-semibold opacity-90">{warning}</div>
      )}
    </div>
  );
}


export function VizPanel({ title, description, children }) {
  return (
    <div className="bg-[#0f0f1e66] dark:bg-[#0f0f1e66] bg-black/5 border border-border-subtle rounded-2xl p-6 relative overflow-hidden transition-colors hover:border-border-medium">
      <h4 className="text-base font-bold text-neon-cyan mb-3 uppercase tracking-wide flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-neon-cyan shadow-neon-cyan"></div>
        {title}
      </h4>
      {description && <div className="text-base font-medium text-text-secondary mb-5 leading-relaxed">{description}</div>}
      <div className="overflow-x-auto custom-scrollbar">
        {children}
      </div>
    </div>
  );
}

export function FrequencyChart({ plain, cipher }) {
  const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const getFreq = (text) => {
    const counts = new Array(26).fill(0);
    let total = 0;
    for (let c of text.toUpperCase()) {
      let idx = A.indexOf(c);
      if (idx !== -1) { counts[idx]++; total++; }
    }
    return {counts, total};
  };

  const ptFreq = getFreq(plain);
  const ctFreq = getFreq(cipher);

  const renderBars = (counts, total, colorClass) => A.split('').map((char, i) => {
    const h = total === 0 ? 0 : (counts[i] / total) * 100;
    return (
      <div key={char} className="flex flex-col items-center flex-1 group">
        <div className="h-12 w-full flex items-end">
          <div 
            style={{ height: `${h}%` }} 
            className={`w-[60%] mx-auto rounded-t-[2px] transition-all ${colorClass} group-hover:brightness-125`}
          ></div>
        </div>
        <div className="text-sm font-mono font-bold mt-1 text-text-muted group-hover:text-text-primary transition-colors">{char}</div>
      </div>
    );
  });

  return (
    <VizPanel title="Frequency Analysis">
      <div className="flex mt-2">
        <div className="w-[60px] text-sm font-mono font-bold text-text-secondary flex items-center">Plain</div>
        <div className="flex flex-1 gap-[2px]">{renderBars(ptFreq.counts, ptFreq.total, 'bg-white/80')}</div>
      </div>
      <div className="flex mt-5">
        <div className="w-[60px] text-sm font-mono font-bold text-neon-gold flex items-center">Cipher</div>
        <div className="flex flex-1 gap-[2px]">{renderBars(ctFreq.counts, ctFreq.total, 'bg-neon-gold')}</div>
      </div>
    </VizPanel>
  );
}
