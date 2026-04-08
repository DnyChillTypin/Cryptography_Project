import React from 'react';
import { 
  CaesarSolver, 
  VigenereRepeatingSolver, 
  VigenereAutokeySolver, 
  MonoalphabeticSolver, 
  PlayfairSolver, 
  PermutationSolver 
} from './components/ClassicalCiphersComponents';

export default function ClassicalCiphersPage() {
  return (
    <div className="pt-2 pl-[40px] max-w-[1200px]">
      <div className="mb-10">
        <div className="text-[12px] text-text-muted mb-2 flex items-center gap-1.5">
          <span>Cryptography</span><span className="opacity-50">›</span><span>Modules</span><span className="opacity-50">›</span><span className="text-neon-orange font-semibold">Classical Ciphers</span>
        </div>
        <h1 className="text-[32px] font-extrabold tracking-tight bg-gradient-to-br from-text-primary to-neon-orange text-transparent bg-clip-text leading-tight mb-2">
          Classical Ciphers
        </h1>
        <p className="text-[15px] text-text-secondary max-w-[680px] leading-relaxed">
          Historical encryption algorithms based on character substitution and transposition. Though insecure for modern uses, they establish the foundation for symmetric-key cryptography.
        </p>
      </div>

      <div className="flex flex-col gap-12">
        <CaesarSolver />
        <VigenereRepeatingSolver />
        <VigenereAutokeySolver />
        <MonoalphabeticSolver />
        <PlayfairSolver />
        <PermutationSolver />
      </div>
    </div>
  );
}
