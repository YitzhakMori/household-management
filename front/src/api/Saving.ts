import { Saving } from "../interfaces/SavingModel";
const API_URL = 'http://localhost:5001/api/savings';

const getToken = () => localStorage.getItem('token');

export const fetchSavings = async (): Promise<Saving[]> => {
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

export const addSaving = async (saving: Omit<Saving, '_id'>): Promise<Saving> => {
  const token = getToken();
  const response = await fetch(`${API_URL}/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(saving),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const editSaving = async (saving: Saving): Promise<Saving> => {
  if (!saving._id) {
    throw new Error('Saving ID is undefined');
  }

  const token = getToken();
  const response = await fetch(`${API_URL}/${saving._id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(saving),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const deleteSaving = async (savingId: string): Promise<void> => {
  const token = getToken();
  const response = await fetch(`${API_URL}/${savingId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
};
