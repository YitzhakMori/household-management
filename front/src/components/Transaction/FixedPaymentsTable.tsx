import React, { useState, useEffect } from 'react';
import styles from './FixedPaymentsTable.module.css';
import { fetchFixedPayments, addFixedPayment, editFixedPayment, deleteFixedPayment } from '../../api/Fixed';
import { FixedPayment } from '../../interfaces/FixedModel';

const FixedPaymentsTable: React.FC = () => {
  const [fixedPayments, setFixedPayments] = useState<FixedPayment[]>([]);
  const [newFixedPayment, setNewFixedPayment] = useState<Omit<FixedPayment, '_id'>>({ amount: 0, description: '', date: '' });
  const [editingFixedPayment, setEditingFixedPayment] = useState<FixedPayment | null>(null);

  useEffect(() => {
    fetchFixedPaymentsData();
  }, []);

  const fetchFixedPaymentsData = async () => {
    try {
      const data = await fetchFixedPayments();
      setFixedPayments(data);
    } catch (error) {
      console.error('Error fetching fixed payments:', error);
    }
  };

  const handleAddFixedPayment = async () => {
    try {
      await addFixedPayment(newFixedPayment);
      fetchFixedPaymentsData();
      setNewFixedPayment({ amount: 0, description: '', date: '' });
    } catch (error) {
      console.error('Error adding fixed payment:', error);
    }
  };

  const handleEditFixedPayment = async (id: string) => {
    try {
      if (editingFixedPayment) {
        await editFixedPayment(editingFixedPayment);
        fetchFixedPaymentsData();
        setEditingFixedPayment(null);
      }
    } catch (error) {
      console.error('Error editing fixed payment:', error);
    }
  };

  const handleDeleteFixedPayment = async (id: string) => {
    try {
      await deleteFixedPayment(id);
      fetchFixedPaymentsData();
    } catch (error) {
      console.error('Error deleting fixed payment:', error);
    }
  };

  const isValidDate = (date: any): boolean => {
    return !isNaN(new Date(date).getTime());
  };

  return (
    <div className={styles['fixed-payments-container']}>
      <h2>Fixed Payments</h2>
      <button onClick={() => setEditingFixedPayment({ _id: '', amount: 0, description: '', date: '' })}>
        Add Fixed Payment
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
          {fixedPayments.map(fixedPayment => (
            <tr key={fixedPayment._id}>
              <td>{fixedPayment.amount}</td>
              <td>{fixedPayment.description}</td>
              <td>{isValidDate(fixedPayment.date) ? new Date(fixedPayment.date).toLocaleDateString() : 'Invalid date'}</td>
              <td className={styles.actions}>
                <button onClick={() => setEditingFixedPayment(fixedPayment)}>Edit</button>
                <button onClick={() => handleDeleteFixedPayment(fixedPayment._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingFixedPayment && (
        <div>
          <h3>{editingFixedPayment._id ? 'Edit Fixed Payment' : 'Add Fixed Payment'}</h3>
          <form
            onSubmit={e => {
              e.preventDefault();
              if (editingFixedPayment._id) {
                handleEditFixedPayment(editingFixedPayment._id);
              } else {
                handleAddFixedPayment();
              }
            }}
          >
            <label>
              Amount:
              <input
                type="number"
                value={editingFixedPayment.amount}
                onChange={e => setEditingFixedPayment({ ...editingFixedPayment, amount: +e.target.value })}
              />
            </label>
            <label>
              Description:
              <input
                type="text"
                value={editingFixedPayment.description}
                onChange={e => setEditingFixedPayment({ ...editingFixedPayment, description: e.target.value })}
              />
            </label>
            <label>
              Date:
              <input
                type="date"
                value={isValidDate(editingFixedPayment.date) ? new Date(editingFixedPayment.date).toISOString().split('T')[0] : ''}
                onChange={e => setEditingFixedPayment({ ...editingFixedPayment, date: e.target.value })}
              />
            </label>
            <button type="submit">{editingFixedPayment._id ? 'Update' : 'Add'}</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default FixedPaymentsTable;
