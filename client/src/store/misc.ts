import { atom } from 'jotai';
import { TAttachment } from 'librechat-data-provider';
import { atomWithLocalStorage } from './utils';
import { BadgeItem } from '~/common';

const hideBannerHint = atomWithLocalStorage('hideBannerHint', [] as string[]);
const messageAttachmentsMap = atom<Record<string, TAttachment[] | undefined>>({});
const queriesEnabled = atom<boolean>(true);
const isEditingBadges = atom<boolean>(false);
const chatBadges = atomWithLocalStorage<Pick<BadgeItem, 'id'>[]>('chatBadges', [
  // When adding new badges, make sure to add them to useChatBadges.ts as well and add them as last item
  // DO NOT CHANGE THE ORDER OF THE BADGES ALREADY IN THE ARRAY
  { id: '1' },
  // { id: '2' },
]);

export default {
  hideBannerHint,
  messageAttachmentsMap,
  queriesEnabled,
  isEditingBadges,
  chatBadges,
} as const;
