// src/interfaces/Event.ts
export interface Event {
  _id?: string;
  title: string;
  date: string;
  description: string;
}

export interface EventFormProps {
  onAddEvent: (event: Event) => Promise<void>;
  onUpdateEvent: (event: Event) => Promise<void>;
  event: Event | undefined;
}