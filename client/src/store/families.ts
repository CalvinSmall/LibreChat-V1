import { useEffect } from 'react';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { atomWithDefault, atomFamily } from 'jotai/utils';
import { LocalStorageKeys, Constants } from 'librechat-data-provider';
import type { TMessage, TPreset, TConversation, TSubmission } from 'librechat-data-provider';
import type { TOptionSettings, ExtendedFile } from '~/common';
import { useSetConvoContext } from '~/Providers/SetConvoContext';
import { storeEndpointSettings, logger, createChatSearchParams } from '~/utils';
import { createSearchParams } from 'react-router-dom';

// Basic atoms
const latestMessageKeysAtom = atom<(string | number)[]>([]);
const submissionKeysAtom = atom<(string | number)[]>([]);
const conversationKeysAtom = atom<(string | number)[]>([]);

// Atom families with logging
const createFamilyWithLogger = <T>(defaultValue: T, name: string) => {
  return atomFamily((key: string | number) => {
    const baseAtom = atomWithDefault<T>((get) => {
      const value = get(baseAtom);
      logger.log(`Jotai: Getting ${name}`, { key, value });
      return value ?? defaultValue;
    });
    return atom(
      (get) => get(baseAtom),
      (get, set, update: T) => {
        logger.log(`Jotai: Setting ${name}`, { key, update });
        set(baseAtom, update);
      },
    );
  });
};

// Atom families
const latestMessageFamily = createFamilyWithLogger<TMessage | null>(null, 'latestMessage');
const submissionByIndex = createFamilyWithLogger<TSubmission | null>(null, 'submission');
const conversationByIndex = createFamilyWithLogger<TConversation | null>(null, 'conversation');
const filesByIndex = createFamilyWithLogger<Map<string, ExtendedFile>>(new Map(), 'files');
const presetByIndex = createFamilyWithLogger<TPreset | null>(null, 'preset');
const textByIndex = createFamilyWithLogger<string>('', 'text');
const showStopButtonByIndex = createFamilyWithLogger<boolean>(false, 'showStopButton');
const abortScrollFamily = createFamilyWithLogger<boolean>(false, 'abortScroll');
const isSubmittingFamily = createFamilyWithLogger<boolean>(false, 'isSubmitting');
const optionSettingsFamily = createFamilyWithLogger<TOptionSettings>({}, 'optionSettings');
const showAgentSettingsFamily = createFamilyWithLogger<boolean>(false, 'showAgentSettings');
const showPopoverFamily = createFamilyWithLogger<boolean>(false, 'showPopover');
const activePromptByIndex = createFamilyWithLogger<string | undefined>(undefined, 'activePrompt');
const showMentionPopoverFamily = createFamilyWithLogger<boolean>(false, 'showMentionPopover');
const showPlusPopoverFamily = createFamilyWithLogger<boolean>(false, 'showPlusPopover');
const showPromptsPopoverFamily = createFamilyWithLogger<boolean>(false, 'showPromptsPopover');
const globalAudioURLFamily = createFamilyWithLogger<string | null>(null, 'globalAudioURL');
const globalAudioFetchingFamily = createFamilyWithLogger<boolean>(false, 'globalAudioFetching');
const globalAudioPlayingFamily = createFamilyWithLogger<boolean>(false, 'globalAudioPlaying');
const activeRunFamily = createFamilyWithLogger<string | null>(null, 'activeRun');
const audioRunFamily = createFamilyWithLogger<string | null>(null, 'audioRun');
const messagesSiblingIdxFamily = createFamilyWithLogger<number>(0, 'messagesSiblingIdx');

// Derived atoms (selectors)
const latestMessageKeysSelector = atom(
  (get) => {
    const keys = get(conversationKeysAtom);
    return keys.filter((key) => get(latestMessageFamily(key)) !== null);
  },
  (get, set, newKeys: (string | number)[]) => {
    logger.log('Jotai: Setting latestMessageKeys', { newKeys });
    set(latestMessageKeysAtom, newKeys);
  },
);

const submissionKeysSelector = atom(
  (get) => {
    const keys = get(conversationKeysAtom);
    return keys.filter((key) => get(submissionByIndex(key)) !== null);
  },
  (get, set, newKeys: (string | number)[]) => {
    logger.log('Jotai: Setting submissionKeys', { newKeys });
    set(submissionKeysAtom, newKeys);
  },
);

const allConversationsSelector = atom((get) => {
  const keys = get(conversationKeysAtom);
  return keys.map((key) => get(conversationByIndex(key))).filter(Boolean);
});

// Custom hooks
function useCreateConversationAtom(key: string | number) {
  const hasSetConversation = useSetConvoContext();
  const [keys, setKeys] = useAtom(conversationKeysAtom);
  const [conversation, setConversation] = useAtom(conversationByIndex(key));

  useEffect(() => {
    if (!keys.includes(key)) {
      setKeys([...keys, key]);
    }
  }, [key, keys, setKeys]);

  return { hasSetConversation, conversation, setConversation };
}

function useClearConvoState() {
  const clearAllConversations = () => {
    // Implementation needed
  };
  return clearAllConversations;
}

function useClearSubmissionState() {
  const clearAllSubmissions = () => {
    // Implementation needed
  };
  return clearAllSubmissions;
}

function useClearLatestMessages(context?: string) {
  const clearAllLatestMessages = () => {
    // Implementation needed
  };
  return clearAllLatestMessages;
}

export default {
  conversationKeysAtom,
  conversationByIndex,
  filesByIndex,
  presetByIndex,
  submissionByIndex,
  textByIndex,
  showStopButtonByIndex,
  abortScrollFamily,
  isSubmittingFamily,
  optionSettingsFamily,
  showAgentSettingsFamily,
  showPopoverFamily,
  latestMessageFamily,
  messagesSiblingIdxFamily,
  allConversationsSelector,
  useClearConvoState,
  useCreateConversationAtom,
  showMentionPopoverFamily,
  globalAudioURLFamily,
  activeRunFamily,
  audioRunFamily,
  globalAudioPlayingFamily,
  globalAudioFetchingFamily,
  showPlusPopoverFamily,
  activePromptByIndex,
  useClearSubmissionState,
  useClearLatestMessages,
  showPromptsPopoverFamily,
};
