import { useState, useMemo } from 'react';
import { runAES } from '../utils/aesLogic';

export function useAES() {
  const [hexMessage, setHexMessage] = useState('18DC9095F9149EDB7323F20E4E462D92');
  const [hexKey, setHexKey] = useState('CFD61D489E7C48BC46C9F875C1F04E1B');
  const [selectedRound, setSelectedRound] = useState(1);

  const { result, error } = useMemo(() => {
    try {
      const cleanM = hexMessage.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
      const cleanK = hexKey.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
      if (cleanM.length !== 32 || cleanK.length !== 32) {
        return { error: 'Message and Key must be exactly 32 hex characters (128 bits).' };
      }
      return { result: runAES(cleanM, cleanK), error: null };
    } catch (e) {
      return { error: e.message };
    }
  }, [hexMessage, hexKey]);

  return { hexMessage, setHexMessage, hexKey, setHexKey, selectedRound, setSelectedRound, result, error };
}
