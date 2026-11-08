import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';

import { SAMPLE_EVENTS } from '../../data/sample-events';

type SavedEventsContextValue = {
  savedEventIds: string[];
  savedEvents: typeof SAMPLE_EVENTS;
  toggleSaved: (eventId: string) => void;
};

const SavedEventsContext = createContext<SavedEventsContextValue | null>(null);

export function SavedEventsProvider({ children }: PropsWithChildren) {
  const [savedEventIds, setSavedEventIds] = useState(SAMPLE_EVENTS.map((event) => event.id));
  const value = useMemo(
    () => ({
      savedEventIds,
      savedEvents: SAMPLE_EVENTS.filter((event) => savedEventIds.includes(event.id)),
      toggleSaved: (eventId: string) =>
        setSavedEventIds((ids) =>
          ids.includes(eventId) ? ids.filter((id) => id !== eventId) : [...ids, eventId],
        ),
    }),
    [savedEventIds],
  );

  return <SavedEventsContext.Provider value={value}>{children}</SavedEventsContext.Provider>;
}

export function useSavedEvents() {
  const context = useContext(SavedEventsContext);
  if (!context) throw new Error('useSavedEvents must be used inside SavedEventsProvider');
  return context;
}
