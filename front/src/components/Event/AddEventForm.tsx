import React, { useState } from 'react';

interface AddEventFormProps {
  fetchEvents: () => void;
}

const AddEventForm: React.FC<AddEventFormProps> = ({ fetchEvents }) => {
  const [eventDescription, setEventDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');

  const handleAddEvent = async () => {
    if (!eventDescription.trim() || !date.trim()) return;

    try {
      const response = await fetch('http://localhost:5001/api/events/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ date, description: eventDescription }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error adding event:', errorData);
        alert('Error adding event: ' + errorData.message);
        return;
      }

      const data = await response.json();
      alert('Event added successfully: ' + data.message);
      fetchEvents(); // Refresh events list
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Error adding event');
    }
  };

  return (
    <div>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <input
        type="text"
        placeholder="Event description"
        value={eventDescription}
        onChange={(e) => setEventDescription(e.target.value)}
      />
      <button onClick={handleAddEvent}>Add Event</button>
    </div>
  );
};

export default AddEventForm;

