import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  saveCalculation,
  getCalculations,
  deleteCalculation,
  clearCalculations,
  StorageError,
  StorageLimitError,
} from '../../src/services/storage';
import { SavedCalculation } from '../../src/types/saved';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

const STORAGE_KEY = 'propcalc:calculations';

function makeCalc(overrides?: Partial<SavedCalculation>): SavedCalculation {
  return {
    id: 'test-id',
    type: 'mortgage',
    inputs: { loanAmount: 300000, interestRate: 6.5, loanTermYears: 30 },
    result: { monthlyPayment: 1896.2, totalInterest: 382631.2, totalCost: 682631.2, amortizationSchedule: [] },
    createdAt: Date.now(),
    ...overrides,
  };
}

describe('storage service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCalculations', () => {
    it('returns empty array when nothing stored', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      const result = await getCalculations();
      expect(result).toEqual([]);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY);
    });

    it('returns parsed calculations from storage', async () => {
      const calcs = [makeCalc({ id: 'a' }), makeCalc({ id: 'b', type: 'roi' })];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(calcs));
      const result = await getCalculations();
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('a');
      expect(result[1].type).toBe('roi');
    });

    it('throws StorageError on AsyncStorage failure', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('disk full'));
      await expect(getCalculations()).rejects.toBeInstanceOf(StorageError);
      await expect(getCalculations()).rejects.toThrow('disk full');
    });

    it('handles non-array parsed data gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify({ not: 'array' }));
      const result = await getCalculations();
      expect(result).toEqual([]);
    });
  });

  describe('saveCalculation', () => {
    it('saves a new calculation to empty storage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
      const calc = makeCalc();
      await saveCalculation(calc);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        expect.any(String)
      );
      const saved = JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[0][1]);
      expect(saved).toHaveLength(1);
      expect(saved[0].id).toBe('test-id');
    });

    it('prepends new calculation to existing list', async () => {
      const existing = [makeCalc({ id: 'old' })];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(existing));
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
      const calc = makeCalc({ id: 'new' });
      await saveCalculation(calc);
      const saved = JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[0][1]);
      expect(saved).toHaveLength(2);
      expect(saved[0].id).toBe('new');
      expect(saved[1].id).toBe('old');
    });

    it('throws StorageLimitError when free tier limit is reached', async () => {
      const existing = Array.from({ length: 5 }, (_, i) => makeCalc({ id: `calc-${i}` }));
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(existing));
      await expect(saveCalculation(makeCalc({ id: 'overflow' }))).rejects.toBeInstanceOf(
        StorageLimitError
      );
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });

    it('allows saving when under the limit', async () => {
      const existing = Array.from({ length: 4 }, (_, i) => makeCalc({ id: `calc-${i}` }));
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(existing));
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
      await saveCalculation(makeCalc({ id: 'fifth' }));
      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
    });

    it('throws StorageError on AsyncStorage failure', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('write failed'));
      await expect(saveCalculation(makeCalc())).rejects.toBeInstanceOf(StorageError);
    });
  });

  describe('deleteCalculation', () => {
    it('removes calculation by id', async () => {
      const calcs = [makeCalc({ id: 'a' }), makeCalc({ id: 'b' }), makeCalc({ id: 'c' })];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(calcs));
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
      await deleteCalculation('b');
      const saved = JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[0][1]);
      expect(saved).toHaveLength(2);
      expect(saved.map((c: SavedCalculation) => c.id)).toEqual(['a', 'c']);
    });

    it('does nothing when id not found', async () => {
      const calcs = [makeCalc({ id: 'a' })];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(calcs));
      await deleteCalculation('missing');
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });

    it('throws StorageError on AsyncStorage failure', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('read failed'));
      await expect(deleteCalculation('x')).rejects.toBeInstanceOf(StorageError);
    });
  });

  describe('clearCalculations', () => {
    it('removes storage key entirely', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);
      await clearCalculations();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
    });

    it('throws StorageError on AsyncStorage failure', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValue(new Error('remove failed'));
      await expect(clearCalculations()).rejects.toBeInstanceOf(StorageError);
    });
  });
});
