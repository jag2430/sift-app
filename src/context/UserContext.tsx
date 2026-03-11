"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  GoingEvent,
  SavedEvent,
  SiftStorage,
  UserProfile,
} from "@/types/user";
import {
  DEFAULT_LISTS,
  initialStorage,
  STORAGE_KEY,
} from "@/types/user";

function loadStorage(): SiftStorage {
  if (typeof window === "undefined") return initialStorage;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialStorage;
    const parsed = JSON.parse(raw) as Partial<SiftStorage>;
    return {
      ...initialStorage,
      ...parsed,
      savedEvents: parsed.savedEvents ?? initialStorage.savedEvents,
      goingEvents: parsed.goingEvents ?? initialStorage.goingEvents,
      customLists: parsed.customLists ?? initialStorage.customLists,
    };
  } catch {
    return initialStorage;
  }
}

function saveStorage(data: SiftStorage) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

interface UserContextValue extends SiftStorage {
  setAuth: (
    isLoggedIn: boolean,
    userEmail: string,
    userDisplayName?: string
  ) => void;
  setUserProfile: (profile: UserProfile) => void;
  addSavedEvent: (eventId: string, listName: string) => void;
  removeSavedEvent: (eventId: string) => void;
  getSavedListForEvent: (eventId: string) => string | null;
  toggleGoing: (event: {
    eventId: string;
    eventTitle: string;
    eventDate: string;
  }) => boolean;
  isGoing: (eventId: string) => boolean;
  addCustomList: (listName: string) => void;
  getAllListNames: () => string[];
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [storage, setStorage] = useState<SiftStorage>(initialStorage);

  useEffect(() => {
    setStorage(loadStorage());
  }, []);

  const persist = useCallback((next: SiftStorage) => {
    setStorage(next);
    saveStorage(next);
  }, []);

  const setAuth = useCallback(
    (
      isLoggedIn: boolean,
      userEmail: string,
      userDisplayName?: string
    ) => {
      persist({
        ...storage,
        isLoggedIn,
        userEmail,
        userDisplayName:
          userDisplayName !== undefined
            ? userDisplayName
            : storage.userDisplayName,
        createdAt:
          isLoggedIn && !storage.createdAt
            ? new Date().toISOString()
            : storage.createdAt,
      });
    },
    [storage, persist]
  );

  const setUserProfile = useCallback(
    (userProfile: UserProfile) => {
      persist({ ...storage, userProfile });
    },
    [storage, persist]
  );

  const addSavedEvent = useCallback(
    (eventId: string, listName: string) => {
      const savedAt = new Date().toISOString();
      const savedEvents = [
        ...storage.savedEvents.filter((s) => s.eventId !== eventId),
        { eventId, listName, savedAt },
      ];
      persist({ ...storage, savedEvents });
    },
    [storage, persist]
  );

  const removeSavedEvent = useCallback(
    (eventId: string) => {
      const savedEvents = storage.savedEvents.filter((s) => s.eventId !== eventId);
      persist({ ...storage, savedEvents });
    },
    [storage, persist]
  );

  const getSavedListForEvent = useCallback(
    (eventId: string): string | null => {
      const s = storage.savedEvents.find((e) => e.eventId === eventId);
      return s ? s.listName : null;
    },
    [storage.savedEvents]
  );

  const toggleGoing = useCallback(
    (event: {
      eventId: string;
      eventTitle: string;
      eventDate: string;
    }): boolean => {
      const exists = storage.goingEvents.some(
        (e) => e.eventId === event.eventId
      );
      const markedAt = new Date().toISOString();
      let goingEvents: GoingEvent[];
      if (exists) {
        goingEvents = storage.goingEvents.filter(
          (e) => e.eventId !== event.eventId
        );
      } else {
        goingEvents = [
          ...storage.goingEvents,
          {
            eventId: event.eventId,
            eventTitle: event.eventTitle,
            eventDate: event.eventDate,
            markedAt,
          },
        ];
      }
      persist({ ...storage, goingEvents });
      return !exists;
    },
    [storage, persist]
  );

  const isGoing = useCallback(
    (eventId: string) =>
      storage.goingEvents.some((e) => e.eventId === eventId),
    [storage.goingEvents]
  );

  const addCustomList = useCallback(
    (listName: string) => {
      const trimmed = listName.trim();
      if (!trimmed || storage.customLists.includes(trimmed)) return;
      persist({
        ...storage,
        customLists: [...storage.customLists, trimmed],
      });
    },
    [storage, persist]
  );

  const getAllListNames = useCallback(() => {
    return [...DEFAULT_LISTS, ...storage.customLists];
  }, [storage.customLists]);

  const value = useMemo<UserContextValue>(
    () => ({
      ...storage,
      setAuth,
      setUserProfile,
      addSavedEvent,
      removeSavedEvent,
      getSavedListForEvent,
      toggleGoing,
      isGoing,
      addCustomList,
      getAllListNames,
    }),
    [
      storage,
      setAuth,
      setUserProfile,
      addSavedEvent,
      removeSavedEvent,
      getSavedListForEvent,
      toggleGoing,
      isGoing,
      addCustomList,
      getAllListNames,
    ]
  );

  return (
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
