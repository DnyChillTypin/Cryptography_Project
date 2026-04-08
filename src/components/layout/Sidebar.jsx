import { NavLink } from 'react-router-dom';
import { Home, Landmark, Hash, Lock, KeyRound, Shield, Sun, Moon } from 'lucide-react';
import { useTheme } from '../ThemeContext';

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home, badge: null },
    { name: 'Classical Ciphers', path: '/classical', icon: Landmark, badge: 6 },
    { name: 'Number Theory', path: '/number-theory', icon: Hash, badge: 10 },
    { name: 'DES Encryption', path: '/des', icon: Lock, badge: 11 },
    { name: 'AES Encryption', path: '/aes', icon: Shield, badge: 11 },
    { name: 'Public Key Crypto', path: '/public-key', icon: KeyRound, badge: 5 },
  ];

  return (
    <aside className="w-[280px] min-h-screen fixed top-0 left-0 z-50 flex flex-col bg-gradient-to-b from-bg-deep/95 to-bg-deepest/95 border-r border-border-subtle backdrop-blur-xl transition-colors duration-300">
      <div className="p-6 pb-5 border-b border-border-subtle">
        <NavLink to="/" className="flex items-center gap-3 no-underline">
          {/* Removed shadow-neon-cyan per user request */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-green flex items-center justify-center text-xl flex-shrink-0">
            🔐
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-bold text-text-primary tracking-tight leading-tight">Cryptography</span>
            <span className="text-[11px] text-text-secondary font-normal tracking-wide uppercase">Security Workbench</span>
          </div>
        </NavLink>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
        <div className="text-[10px] font-semibold text-text-muted uppercase tracking-widest px-3 pt-4 pb-2">Overview</div>
        <NavItem item={navItems[0]} />

        <div className="text-[10px] font-semibold text-text-muted uppercase tracking-widest px-3 pt-4 pb-2">Modules</div>
        {navItems.slice(1).map(item => <NavItem key={item.path} item={item} />)}
      </nav>

      {/* Theme Toggle System placed at the bottom */}
      <div className="px-4 py-3 border-t border-border-subtle flex justify-between items-center text-[11px] text-text-muted">
         <div className="flex flex-col items-start leading-tight">
           <span>ATTT Course</span>
           <span>Univ. of Vietnam</span>
         </div>
         <button 
           onClick={toggleTheme}
           className="w-8 h-8 rounded-full bg-bg-surface flex items-center justify-center text-text-primary hover:bg-white/10 transition-colors border border-border-subtle"
           aria-label="Toggle Theme"
         >
           {theme === 'dark' ? <Sun className="w-4 h-4 text-neon-orange" /> : <Moon className="w-4 h-4 text-neon-purple" />}
         </button>
      </div>
    </aside>
  );
}

function NavItem({ item }) {
  return (
    <NavLink 
      to={item.path}
      className={({isActive}) => `
        flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13.5px] font-medium transition-all group relative select-none
        ${isActive 
          ? 'bg-neon-cyan-dim text-neon-cyan border-none' 
          : 'text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 hover:text-text-primary border border-transparent'}
      `}
    >
      {({isActive}) => (
        <>
          {isActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] bg-neon-cyan rounded-r shadow-[0_0_8px_rgba(0,240,255,0.5)]" />
          )}
          <item.icon className="w-[18px] h-[18px]" strokeWidth={2.5} />
          <span>{item.name}</span>
          {item.badge !== null && (
            <span className={`ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full ${isActive ? 'bg-neon-cyan-dim text-neon-cyan' : 'bg-black/5 dark:bg-white/5 text-text-muted'}`}>
              {item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}
