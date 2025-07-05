import { atom } from 'jotai';
import type { TUser, TPlugin } from 'librechat-data-provider';
import type { Atom } from 'jotai';

export const userAtom = atom<TUser | undefined>(undefined);
export const availableToolsAtom = atom<Record<string, TPlugin>>({});

export default {
  user: userAtom,
  availableTools: availableToolsAtom,
} as const;
