import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Event } from '../../interfaces/Event';
import { fetchEvents } from '../../api/eventsApi';

interface EventsContextProps {
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  loadEvents: () => void;
  getUpcomingWeekEventsCount: () => number;
}

const EventsContext = createContext<EventsContextProps | undefined>(undefined);

export const EventsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);

  const loadEvents = async () => {
    const eventsData = await fetchEvents();
    setEvents(eventsData);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const getUpcomingWeekEventsCount = () => {
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= new Date() && eventDate <= oneWeekFromNow;
    }).length;
  };

  return (
    <EventsContext.Provider value={{ events, setEvents, loadEvents, getUpcomingWeekEventsCount }}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};
