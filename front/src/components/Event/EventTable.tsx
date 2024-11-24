import React, { useEffect, useState } from 'react';
import EventForm from './EventForm'; // ייבוא נכון של EventForm
import { Event } from '../../interfaces/Event';
import styles from './EventTable.module.css'; // ייבוא של CSS Modules

const EventTable = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(undefined);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token'); // Assume token is stored in localStorage
      const response = await fetch('http://localhost:5001/api/events', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleAddEvent = async (event: Event) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/events/add', {
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
      const newEvent = await response.json();
      setEvents([...events, newEvent]);
      console.log("event:", event)
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleUpdateEvent = async (event: Event) => {
    try {
      if (!event._id) {
        throw new Error('Event ID is undefined');
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/events/${event._id}`, {
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
      const updatedEvent = await response.json();
      setEvents(events.map((e) => (e._id === event._id ? updatedEvent : e)));
      setSelectedEvent(undefined); // Unselect the event after update
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5001/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setEvents(events.filter((e) => e._id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Event List</h1>
      <EventForm onAddEvent={handleAddEvent} onUpdateEvent={handleUpdateEvent} event={selectedEvent} />
      <ul className={styles.eventList}>
        {events.map((event) => (
          <li key={event._id} className={styles.eventItem}>
            <h3 className={styles.eventTitle}>{event.title}</h3>
            <p className={styles.eventDate}>{event.date}</p>
            <p className={styles.eventDescription}>{event.description}</p>
            <button className={styles.button} onClick={() => setSelectedEvent(event)}>Edit</button>
            <button className={styles.button} onClick={() => handleDeleteEvent(event._id || '')}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventTable;
