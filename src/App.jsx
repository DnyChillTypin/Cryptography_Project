import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import ClassicalCiphersPage from './features/classical-ciphers/ClassicalCiphersPage';
import NumberTheoryPage from './features/number-theory/NumberTheoryPage';
import DESPage from './features/block-ciphers/des/DESPage';
import AESPage from './features/block-ciphers/aes/AESPage';
import PublicKeyPage from './features/public-key/PublicKeyPage';
import { ThemeProvider } from './components/ThemeContext';

import { Link } from 'react-router-dom';
import { Landmark, Hash, Lock, Shield, KeyRound, ChevronRight } from 'lucide-react';

const Home = () => {
  const modules = [
    { title: 'Classical Ciphers', path: '/classical', icon: Landmark, color: 'text-neon-cyan', bgHover: 'hover:border-neon-cyan', desc: 'Explore historical encryption like Caesar, Vigenère, and Playfair ciphers.' },
    { title: 'Number Theory', path: '/number-theory', icon: Hash, color: 'text-neon-orange', bgHover: 'hover:border-neon-orange', desc: 'Mathematical foundations: Modular Exponentiation, Extended GCD, Primitive Roots.' },
    { title: 'DES Encryption', path: '/des', icon: Lock, color: 'text-neon-green', bgHover: 'hover:border-neon-green', desc: 'Step-by-step 16-round Feistel Network logic and visual debugging.' },
    { title: 'AES Encryption', path: '/aes', icon: Shield, color: 'text-neon-purple', bgHover: 'hover:border-neon-purple', desc: 'Galois Field math, SubBytes, ShiftRows, and MixColumns visualizer.' },
    { title: 'Public Key Crypto', path: '/public-key', icon: KeyRound, color: 'text-neon-magenta', bgHover: 'hover:border-neon-magenta', desc: 'RSA, Diffie-Hellman, ElGamal, and DSA identity signatures.' }
  ];

  return (
    <div className="pt-8 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black bg-gradient-to-br from-neon-cyan via-neon-green to-neon-purple text-transparent bg-clip-text mb-4">
          Cryptography<br/>Security Workbench
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          An interactive laboratory for exploring, computing, and visualizing cryptographic algorithms — from Caesar to DSA.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((m, i) => (
          <Link to={m.path} key={i} className={`group block p-6 dark:bg-white/5 bg-black/5 border border-border-subtle rounded-2xl transition-all hover:-translate-y-1 ${m.bgHover} shadow-lg hover:shadow-xl`}>
            <div className={`w-12 h-12 rounded-xl bg-bg-surface flex items-center justify-center mb-4 ${m.color} border border-border-subtle`}>
              <m.icon strokeWidth={2} className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-text-primary group-hover:text-neon-cyan transition-colors mb-2">{m.title}</h3>
            <p className="text-sm text-text-secondary mb-6">{m.desc}</p>
            <div className="flex items-center text-xs font-bold uppercase tracking-wider text-text-muted group-hover:text-neon-cyan transition-colors">
              Access Module <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <DashboardLayout>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/classical" element={<ClassicalCiphersPage />} />
          <Route path="/number-theory" element={<NumberTheoryPage />} />
          <Route path="/des" element={<DESPage />} />
          <Route path="/aes" element={<AESPage />} />
          <Route path="/public-key" element={<PublicKeyPage />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
    </ThemeProvider>
  );
}
