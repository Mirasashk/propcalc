import { useState, useEffect, useCallback } from 'react';
import {
  getCalculations,
  saveCalculation,
  deleteCalculation,
  clearCalculations,
  StorageError,
  StorageLimitError,
} from '../services/storage';
import { SavedCalculation } from '../types/saved';
import { FREE_TIER } from '../constants/limits';

interface UseSavedCalculationsReturn {
  calculations: SavedCalculation[];
  isLoading: boolean;
  error: string | null;
  canSave: boolean;
  save: (calculation: SavedCalculation) => Promise<void>;
  delete: (id: string) => Promise<void>;
  clear: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useSavedCalculations(): UseSavedCalculationsReturn {
  const [calculations, setCalculations] = useState<SavedCalculation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCalculations();
      setCalculations(data);
    } catch (err) {
      const message = err instanceof StorageError ? err.message : 'Failed to load saved calculations';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const save = useCallback(
    async (calculation: SavedCalculation): Promise<void> => {
      setError(null);
      try {
        await saveCalculation(calculation);
        await refresh();
      } catch (err) {
        const message =
          err instanceof StorageLimitError
            ? err.message
            : err instanceof StorageError
              ? err.message
              : 'Failed to save calculation';
        setError(message);
        throw err;
      }
    },
    [refresh]
  );

  const deleteCalc = useCallback(
    async (id: string): Promise<void> => {
      setError(null);
      try {
        await deleteCalculation(id);
        setCalculations((prev) => prev.filter((c) => c.id !== id));
      } catch (err) {
        const message =
          err instanceof StorageError ? err.message : 'Failed to delete calculation';
        setError(message);
        throw err;
      }
    },
    []
  );

  const clear = useCallback(async (): Promise<void> => {
    setError(null);
    try {
      await clearCalculations();
      setCalculations([]);
    } catch (err) {
      const message =
        err instanceof StorageError ? err.message : 'Failed to clear calculations';
      setError(message);
      throw err;
    }
  }, []);

  const canSave = calculations.length < FREE_TIER.MAX_SAVED_CALCULATIONS;

  return {
    calculations,
    isLoading,
    error,
    canSave,
    save,
    delete: deleteCalc,
    clear,
    refresh,
  };
}
