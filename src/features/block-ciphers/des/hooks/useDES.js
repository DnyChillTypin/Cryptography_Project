import { useState, useMemo } from 'react';
import { runDES } from '../utils/desLogic';

export function useDES() {
  const [hexMessage, setHexMessage] = useState('FF1C9CA3596B7D48');
  const [hexKey, setHexKey] = useState('3FF81CDA5F417784');
  const [selectedRound, setSelectedRound] = useState(1);

  const { result, error } = useMemo(() => {
    try {
      const cleanM = hexMessage.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
      const cleanK = hexKey.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
      if (cleanM.length !== 16 || cleanK.length !== 16) {
        return { error: 'Message and Key must be exactly 16 hex characters (64 bits).' };
      }
      return { result: runDES(cleanM, cleanK), error: null };
    } catch (e) {
      return { error: e.message };
    }
  }, [hexMessage, hexKey]);

  return { hexMessage, setHexMessage, hexKey, setHexKey, selectedRound, setSelectedRound, result, error };
}
