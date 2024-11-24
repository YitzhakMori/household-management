import React, { useState, useEffect } from 'react';
import styles from './EventForm.module.css';

interface EventFormProps {
  onAddEvent: (event: Event) => Promise<void>;
  onUpdateEvent: (event: Event) => Promise<void>;
  event: Event | undefined;
}

interface Event {
  _id?: string;
  title: string;
  date: string;
  description: string;
}

const EventForm: React.FC<EventFormProps> = ({ onAddEvent, onUpdateEvent, event }) => {
  const [formState, setFormState] = useState<Event>({
    title: '',
    date: '',
    description: ''
  });

  useEffect(() => {
    if (event) {
      setFormState(event);
    }
  }, [event]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formState._id) {
      await onUpdateEvent(formState);
    } else {
      await onAddEvent(formState);
    }
    setFormState({ title: '', date: '', description: '' });
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="title">Title</label>
        <input
          className={styles.input}
          type="text"
          id="title"
          name="title"
          value={formState.title}
          onChange={handleChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="date">Date</label>
        <input
          className={styles.input}
          type="date"
          id="date"
          name="date"
          value={formState.date}
          onChange={handleChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="description">Description</label>
        <textarea
          className={styles.input}
          id="description"
          name="description"
          value={formState.description}
          onChange={handleChange}
        />
      </div>
      <button className={styles.button} type="submit">{formState._id ? 'Update' : 'Add'} Event</button>
    </form>
  );
};

export default EventForm;
