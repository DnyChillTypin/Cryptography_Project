import React from 'react';
import {
  PrimitiveRootSolver, DiscreteLogSolver, BasicModuloSolver, ModularOrbitSolver
} from './components/NumberTheoryComponents';

export default function NumberTheoryPage() {
  return (
    <div className="pt-2 pl-[40px] max-w-[1200px]">
      <div className="mb-10">
        <div className="text-[12px] text-text-muted mb-2 flex items-center gap-1.5">
          <span>Cryptography</span><span className="opacity-50">›</span><span>Modules</span><span className="opacity-50">›</span><span className="text-neon-cyan font-semibold">Number Theory</span>
        </div>
        <h1 className="text-[32px] font-extrabold tracking-tight bg-gradient-to-br from-text-primary to-neon-cyan text-transparent bg-clip-text leading-tight mb-2">
          Number Theory & Math
        </h1>
        <p className="text-[15px] text-text-secondary max-w-[680px] leading-relaxed">
          The mathematical foundation of modern cryptography. Explore how primes, modular arithmetic, groups, and congruences form the basis of RSA, DH, and ECC. Computations scale safely using precision BigInt mechanics.
        </p>
      </div>

      <div className="flex flex-col gap-12">
        <FastPoweringSolver />
        <ExtendedEuclideanSolver />
        <FermatLittleSolver />
        <TotientSolver />
        <EulersTheoremSolver />
        <CRTExpSolver />
        <CRTSystemSolver />
        <PrimitiveRootSolver />
        <DiscreteLogSolver />
        <BasicModuloSolver />
        <ModularOrbitSolver />
      </div>
    </div>
  );
}
