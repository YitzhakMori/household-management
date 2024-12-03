import { FixedPayment } from "../interfaces/FixedModel";
const API_URL = 'http://localhost:5001/api/fixedPayments';

const getToken = () => localStorage.getItem('token');

export const fetchFixedPayments = async (): Promise<FixedPayment[]> => {
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

export const addFixedPayment = async (fixedPayment: Omit<FixedPayment, '_id'>): Promise<FixedPayment> => {
  const token = getToken();
  const response = await fetch(`${API_URL}/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(fixedPayment),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const editFixedPayment = async (fixedPayment: FixedPayment): Promise<FixedPayment> => {
  if (!fixedPayment._id) {
    throw new Error('FixedPayment ID is undefined');
  }

  const token = getToken();
  const response = await fetch(`${API_URL}/${fixedPayment._id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(fixedPayment),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const deleteFixedPayment = async (fixedPaymentId: string): Promise<void> => {
  const token = getToken();
  const response = await fetch(`${API_URL}/${fixedPaymentId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
};
