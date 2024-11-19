import React from 'react';
import AddEventForm from '../../components/Event/AddEventForm';
import EventList from '../../components/Event/EventList';

const EventsPage: React.FC = () => {
  const fetchEvents = async () => {
    // Add fetch events logic here
  };

  return (
    <div>
      <h1>Events</h1>
      <AddEventForm fetchEvents={fetchEvents} />
      <EventList />
    </div>
  );
};

export default EventsPage;
