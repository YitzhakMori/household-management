import React, { useEffect, useState } from 'react';
import EventForm from '../EventForm/EventForm';
import { Event } from '../../../interfaces/Event';
import { fetchEvents, addEvent, updateEvent, deleteEvent } from '../../../api/eventsApi';
import styles from './EventTable.module.css';

const EventTable = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await fetchEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleAddEvent = async (event: Event) => {
    try {
      const newEvent = await addEvent(event);
      setEvents([...events, newEvent]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleUpdateEvent = async (event: Event) => {
    try {
      const updatedEvent = await updateEvent(event);
      setEvents(events.map((e) => (e._id === event._id ? updatedEvent : e)));
      setSelectedEvent(undefined);
      setIsModalOpen(false);
      
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
      setEvents(events.filter((e) => e._id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const openAddEventModal = () => {
    setSelectedEvent(undefined);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getUpcomingWeekEvents = () => {
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= new Date() && eventDate <= oneWeekFromNow;
    });
  };

  const upcomingWeekEvents = getUpcomingWeekEvents();

  const filteredEvents = events.filter(event => 
    event.title && event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>רשימת אירועים</h1>
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="חיפוש"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <button className={styles.addButton} onClick={openAddEventModal}>הוספת אירוע</button>
      </div>
      <div className={styles.mainContent}>
        {filteredEvents.length > 0 ? (
          <table className={styles.eventTable}>
            <thead>
              <tr>
                <th>פעולות</th>
                <th>תאריך</th>
                <th>אירוע</th>
                <th>כותרת</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr key={event._id}>
                  <td>
                    <button className={styles.button} onClick={() => { setSelectedEvent(event); setIsModalOpen(true); }}>עריכה</button>
                    <button className={styles.button} onClick={() => handleDeleteEvent(event._id || '')}>מחיקה</button>
                  </td>
                  <td>{event.date}</td>
                  <td>{event.description}</td>
                  <td>{event.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={styles.noEventsMessage}>אין אירועים להצגה</p>
        )}
        {upcomingWeekEvents.length > 0 && (
          <div className={styles.sidebar}>
            <h2 className={styles.sidebarHeading}>אירועים של השבוע</h2>
            <table className={styles.sidebarTable}>
              <thead>
                <tr>
                  <th>תאריך</th>
                  <th>כותרת</th>
                </tr>
              </thead>
              <tbody>
                {upcomingWeekEvents.map((event) => (
                  <tr key={event._id}>
                    <td>{event.date}</td>
                    <td>{event.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.close} onClick={closeModal}>&times;</span>
            <EventForm onAddEvent={handleAddEvent} onUpdateEvent={handleUpdateEvent} event={selectedEvent} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EventTable;