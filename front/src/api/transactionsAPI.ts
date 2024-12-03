import { Transaction } from "../interfaces/TransactionModel";
const API_URL = 'http://localhost:5001/api/transaction';

const getToken = () => localStorage.getItem('token');

export const fetchTransactions = async (): Promise<Transaction[]> => {
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

export const addTransaction = async (transaction: Omit<Transaction, '_id'>): Promise<Transaction> => {
  const token = getToken();
  const response = await fetch(`${API_URL}/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(transaction),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const editTransaction = async (transaction: Transaction): Promise<Transaction> => {
  if (!transaction._id) {
    throw new Error('Transaction ID is undefined');
  }

  const token = getToken();
  const response = await fetch(`${API_URL}/${transaction._id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(transaction),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const deleteTransaction = async (transactionId: string): Promise<void> => {
  const token = getToken();
  const response = await fetch(`${API_URL}/${transactionId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
};
