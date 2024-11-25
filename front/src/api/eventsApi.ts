// api/eventService.ts

import { Event } from '../interfaces/Event';

const API_URL = 'http://localhost:5001/api/events';

const getToken = () => localStorage.getItem('token');

export const fetchEvents = async (): Promise<Event[]> => {
  const token = getToken();
  const response = await fetch(API_URL, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const addEvent = async (event: Event): Promise<Event> => {
  const token = getToken();
  const response = await fetch(`${API_URL}/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(event),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const updateEvent = async (event: Event): Promise<Event> => {
  if (!event._id) {
    throw new Error('Event ID is undefined');
  }

  const token = getToken();
  const response = await fetch(`${API_URL}/${event._id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(event),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  const token = getToken();
  await fetch(`${API_URL}/${eventId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};
