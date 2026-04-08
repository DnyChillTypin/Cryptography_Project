import React from 'react';
import {
  DiffieHellmanSolver, RSASolver, ElGamalSolver, DSASolver
} from './components/PublicKeyComponents';

export default function PublicKeyPage() {
  return (
    <div className="pt-2 pl-[40px] max-w-[1200px]">
      <div className="mb-10">
        <div className="text-[12px] text-text-muted mb-2 flex items-center gap-1.5">
          <span>Cryptography</span><span className="opacity-50">›</span><span>Modules</span><span className="opacity-50">›</span><span className="text-neon-purple font-semibold">Public Key Cryptography</span>
        </div>
        <h1 className="text-[32px] font-extrabold tracking-tight bg-gradient-to-br from-text-primary to-neon-purple text-transparent bg-clip-text leading-tight mb-2">
          Public Key & Asymmetric Crypto
        </h1>
        <p className="text-[15px] text-text-secondary max-w-[680px] leading-relaxed">
          Diffie-Hellman, RSA, ElGamal, and DSA. Observe the duality of public and private keys—how encrypting with public keys creates identity-veiled secrecy, while encrypting with private keys proves identity through signatures.
        </p>
      </div>

      <div className="flex flex-col gap-12">
        <DiffieHellmanSolver />
        <RSASolver />
        <ElGamalSolver />
        <DSASolver />
      </div>
    </div>
  );
}
