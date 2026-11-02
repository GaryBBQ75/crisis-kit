import { get, set } from 'idb-keyval';
import { useEffect, useState } from 'react';

export type Profile = {
  adultes: number;
  enfants: number;
  animaux: number;
  medicaments: string;
  allergies: string;
};

export const defaultProfile: Profile = {
  adultes: 1,
  enfants: 0,
  animaux: 0,
  medicaments: '',
  allergies: '',
};

export type ItemState = { checked: boolean; peremption?: string };
export type Inventory = Record<string, ItemState>;

export type Family = { rdv: string; contacts: string };
export const defaultFamily: Family = { rdv: '', contacts: '' };

/** Valeur stockée dans IndexedDB, sur le téléphone, jamais envoyée en ligne. */
export function usePersisted<T>(key: string, initial: T): [T, (v: T) => void, boolean] {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    get(key)
      .then((stored) => {
        if (!active) return;
        if (stored !== undefined) setValue(stored as T);
        setReady(true);
      })
      .catch(() => active && setReady(true));
    return () => {
      active = false;
    };
  }, [key]);

  const save = (next: T) => {
    setValue(next);
    set(key, next).catch(() => {});
  };

  return [value, save, ready];
}
