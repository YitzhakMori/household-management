import React, { useState, useEffect } from 'react';
import styles from './SavingsTable.module.css';
import { fetchSavings, addSaving, editSaving, deleteSaving } from '../../api/Saving';
import { Saving } from '../../interfaces/SavingModel';

const SavingsTable: React.FC = () => {
  const [savings, setSavings] = useState<Saving[]>([]);
  const [newSaving, setNewSaving] = useState<Omit<Saving, '_id'>>({ amount: 0, description: '', date: '' });
  const [editingSaving, setEditingSaving] = useState<Saving | null>(null);

  useEffect(() => {
    fetchSavingsData();
  }, []);

  const fetchSavingsData = async () => {
    try {
      const data = await fetchSavings();
      setSavings(data);
    } catch (error) {
      console.error('Error fetching savings:', error);
    }
  };

  const handleAddSaving = async () => {
    try {
      await addSaving(newSaving);
      fetchSavingsData();
      setNewSaving({ amount: 0, description: '', date: '' });
    } catch (error) {
      console.error('Error adding saving:', error);
    }
  };

  const handleEditSaving = async (id: string) => {
    try {
      if (editingSaving) {
        await editSaving(editingSaving);
        fetchSavingsData();
        setEditingSaving(null);
      }
    } catch (error) {
      console.error('Error editing saving:', error);
    }
  };

  const handleDeleteSaving = async (id: string) => {
    try {
      await deleteSaving(id);
      fetchSavingsData();
    } catch (error) {
      console.error('Error deleting saving:', error);
    }
  };

  const isValidDate = (date: any): boolean => {
    return !isNaN(new Date(date).getTime());
  };

  return (
    <div className={styles['savings-container']}>
      <h2>Savings</h2>
      <button onClick={() => setEditingSaving({ _id: '', amount: 0, description: '', date: '' })}>
        Add Saving
      </button>
      <table>
        <thead>
          <tr>
            <th>Amount</th>
            <th>Description</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {savings.map(saving => (
            <tr key={saving._id}>
              <td>{saving.amount}</td>
              <td>{saving.description}</td>
              <td>{isValidDate(saving.date) ? new Date(saving.date).toLocaleDateString() : 'Invalid date'}</td>
              <td className={styles.actions}>
                <button onClick={() => setEditingSaving(saving)}>Edit</button>
                <button onClick={() => handleDeleteSaving(saving._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingSaving && (
        <div>
          <h3>{editingSaving._id ? 'Edit Saving' : 'Add Saving'}</h3>
          <form
            onSubmit={e => {
              e.preventDefault();
              if (editingSaving._id) {
                handleEditSaving(editingSaving._id);
              } else {
                handleAddSaving();
              }
            }}
          >
            <label>
              Amount:
              <input
                type="number"
                value={editingSaving.amount}
                onChange={e => setEditingSaving({ ...editingSaving, amount: +e.target.value })}
              />
            </label>
            <label>
              Description:
              <input
                type="text"
                value={editingSaving.description}
                onChange={e => setEditingSaving({ ...editingSaving, description: e.target.value })}
              />
            </label>
            <label>
              Date:
              <input
                type="date"
                value={isValidDate(editingSaving.date) ? new Date(editingSaving.date).toISOString().split('T')[0] : ''}
                onChange={e => setEditingSaving({ ...editingSaving, date: e.target.value })}
              />
            </label>
            <button type="submit">{editingSaving._id ? 'Update' : 'Add'}</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SavingsTable;
