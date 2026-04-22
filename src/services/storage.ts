import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedCalculation } from '../types/saved';
import { FREE_TIER } from '../constants/limits';

const STORAGE_KEY = 'propcalc:calculations';

export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageError';
  }
}

export class StorageLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageLimitError';
  }
}

/**
 * Save a calculation to AsyncStorage.
 * Enforces free tier limit of MAX_SAVED_CALCULATIONS.
 */
export async function saveCalculation(calculation: SavedCalculation): Promise<void> {
  try {
    const existing = await getCalculations();

    if (existing.length >= FREE_TIER.MAX_SAVED_CALCULATIONS) {
      throw new StorageLimitError(
        `Free tier limit reached. You can save up to ${FREE_TIER.MAX_SAVED_CALCULATIONS} calculations. Upgrade to Pro for unlimited saves.`
      );
    }

    const updated = [calculation, ...existing];
    const serialized = JSON.stringify(updated, (_key, value) => {
      if (typeof value === 'number' && !Number.isFinite(value)) {
        return { __type: 'number', value: String(value) };
      }
      return value;
    });

    await AsyncStorage.setItem(STORAGE_KEY, serialized);
  } catch (err) {
    if (err instanceof StorageLimitError) {
      throw err;
    }
    throw new StorageError(
      `Failed to save calculation: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}

/**
 * Retrieve all saved calculations, newest first.
 */
export async function getCalculations(): Promise<SavedCalculation[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw, (_key, value) => {
      if (value && typeof value === 'object' && value.__type === 'number') {
        return Number(value.value);
      }
      return value;
    }) as SavedCalculation[];

    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    throw new StorageError(
      `Failed to load calculations: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}

/**
 * Delete a single saved calculation by id.
 */
export async function deleteCalculation(id: string): Promise<void> {
  try {
    const existing = await getCalculations();
    const filtered = existing.filter((c) => c.id !== id);

    if (filtered.length === existing.length) {
      return; // nothing to delete
    }

    const serialized = JSON.stringify(filtered);
    await AsyncStorage.setItem(STORAGE_KEY, serialized);
  } catch (err) {
    throw new StorageError(
      `Failed to delete calculation: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}

/**
 * Clear all saved calculations.
 */
export async function clearCalculations(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    throw new StorageError(
      `Failed to clear calculations: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}
