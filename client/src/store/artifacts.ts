import { atom } from 'jotai';
import { logger } from '~/utils';
import type { Artifact } from '~/common';

const withLogger = <T>(initialValue: T, name: string) => {
  const baseAtom = atom<T>(initialValue);
  return atom(
    (get) => get(baseAtom),
    (get, set, update: T) => {
      logger.log('artifacts', `Jotai: Setting ${name}`, {
        newValue: update,
      });
      set(baseAtom, update);
    },
  );
};

export const artifactsState = withLogger<Record<string, Artifact | undefined> | null>(
  null,
  'artifactsState',
);
export const currentArtifactId = withLogger<string | null>(null, 'currentArtifactId');
export const artifactsVisibility = withLogger<boolean>(true, 'artifactsVisibility');
export const visibleArtifacts = withLogger<Record<string, Artifact | undefined> | null>(
  null,
  'visibleArtifacts',
);
