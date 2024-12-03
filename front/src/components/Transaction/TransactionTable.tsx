import React, { useState, useEffect } from 'react';
import styles from './TransactionsTable.module.css';
import { fetchTransactions, addTransaction, editTransaction, deleteTransaction } from '../../api/transactionsAPI';

interface Transaction {
  _id: string;
  type: string;
  amount: number;
  description: string;
  category: string;
  date: string;
}

const TransactionsTable: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newTransaction, setNewTransaction] = useState({
    type: 'income',
    amount: 0,
    description: '',
    category: 'general',
    date: '',
  });
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    fetchTransactions()
      .then(setTransactions)
      .catch(error => console.error('Error fetching transactions:', error));
  }, []);

  const handleAddTransaction = () => {
    addTransaction(newTransaction)
      .then(() => {
        fetchTransactions().then(setTransactions);
        setNewTransaction({ type: 'income', amount: 0, description: '', category: 'general', date: '' });
      })
      .catch(error => console.error('Error adding transaction:', error));
  };

  const handleEditTransaction = (id: string) => {
    if (editingTransaction) {
      editTransaction(editingTransaction)
        .then(() => {
          fetchTransactions().then(setTransactions);
          setEditingTransaction(null);
        })
        .catch(error => console.error('Error editing transaction:', error));
    }
  };

  const handleDeleteTransaction = (id: string) => {
    deleteTransaction(id)
      .then(() => fetchTransactions().then(setTransactions))
      .catch(error => console.error('Error deleting transaction:', error));
  };

  return (
    <div className={styles['transactions-container']}>
      <h2>Transactions</h2>
      <button onClick={() => setEditingTransaction({ _id: '', type: 'income', amount: 0, description: '', category: 'general', date: '' })}>
        Add Transaction
      </button>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Category</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction._id}>
              <td>{transaction.type}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.description}</td>
              <td>{transaction.category}</td>
              <td>{new Date(transaction.date).toLocaleDateString()}</td>
              <td className={styles.actions}>
                <button onClick={() => setEditingTransaction(transaction)}>Edit</button>
                <button onClick={() => handleDeleteTransaction(transaction._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingTransaction && (
        <div>
          <h3>{editingTransaction._id ? 'Edit Transaction' : 'Add Transaction'}</h3>
          <form
            onSubmit={e => {
              e.preventDefault();
              if (editingTransaction._id) {
                handleEditTransaction(editingTransaction._id);
              } else {
                handleAddTransaction();
              }
            }}
          >
            <label>
              Type:
              <select
                value={editingTransaction.type}
                onChange={e => setEditingTransaction({ ...editingTransaction, type: e.target.value })}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </label>
            <label>
              Amount:
              <input
                type="number"
                value={editingTransaction.amount}
                onChange={e => setEditingTransaction({ ...editingTransaction, amount: +e.target.value })}
              />
            </label>
            <label>
              Description:
              <input
                type="text"
                value={editingTransaction.description}
                onChange={e => setEditingTransaction({ ...editingTransaction, description: e.target.value })}
              />
            </label>
            <label>
              Category:
              <select
                value={editingTransaction.category}
                onChange={e => setEditingTransaction({ ...editingTransaction, category: e.target.value })}
              >
                <option value="general">General</option>
                <option value="fixed">Fixed</option>
                <option value="savings">Savings</option>
              </select>
            </label>
            <label>
              Date:
              <input
                type="date"
                value={editingTransaction.date ? new Date(editingTransaction.date).toISOString().split('T')[0] : ''}
                onChange={e => setEditingTransaction({ ...editingTransaction, date: e.target.value })}
              />
            </label>
            <button type="submit">{editingTransaction._id ? 'Update' : 'Add'}</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TransactionsTable;
