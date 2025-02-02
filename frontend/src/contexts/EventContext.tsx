import React, { createContext, useState, ReactNode } from "react";
import { EventType } from "../pages/EventDetailsPage";

interface Location {
  id: number | null;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

interface User {
  id: number | null;
  name: string;
  email: string;
}

export interface Event {
  id: number | null;
  title: string;
  date: string;
  category: string;
  location_id: Location;
  created_by: User;
  description: string;
}

interface EventContextType {
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
}

export const EventContext = createContext<EventContextType | undefined>(undefined);

interface EventProviderProps {
  children: ReactNode;
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);

  return (
    <EventContext.Provider value={{ events, setEvents }}>
      {children}
    </EventContext.Provider>
  );
};
