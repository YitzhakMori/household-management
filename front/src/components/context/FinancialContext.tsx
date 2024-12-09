import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface FinancialData {
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  totalFixedPayments: number;
}

interface FinancialContextProps {
  financialData: FinancialData;
}

const FinancialContext = createContext<FinancialContextProps | undefined>(undefined);

export const FinancialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [financialData, setFinancialData] = useState<FinancialData>({
    totalIncome: 0,
    totalExpenses: 0,
    totalSavings: 0,
    totalFixedPayments: 0,
  });

  const fetchFinancialData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const [incomeRes, expensesRes, savingsRes, fixedPaymentsRes] = await Promise.all([
        fetch('http://localhost:5001/api/transaction/total-income', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }),
        fetch('http://localhost:5001/api/transaction/total-expenses', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }),
        fetch('http://localhost:5001/api/savings/total-savings', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }),
        fetch('http://localhost:5001/api/fixedPayments/total-fixed-payments', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }),
      ]);

      if (!incomeRes.ok || !expensesRes.ok || !savingsRes.ok || !fixedPaymentsRes.ok) {
        throw new Error('Failed to fetch financial data');
      }

      const incomeData = await incomeRes.json();
      const expensesData = await expensesRes.json();
      const savingsData = await savingsRes.json();
      const fixedPaymentsData = await fixedPaymentsRes.json();

      setFinancialData({
        totalIncome: incomeData.totalIncome,
        totalExpenses: expensesData.totalExpenses,
        totalSavings: savingsData.totalSavings,
        totalFixedPayments: fixedPaymentsData.totalFixedPayments,
      });
    } catch (error) {
      console.error('Error fetching financial data:', error);
      setFinancialData({
        totalIncome: 0,
        totalExpenses: 0,
        totalSavings: 0,
        totalFixedPayments: 0,
      });
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchFinancialData();
    } else {
      setFinancialData({
        totalIncome: 0,
        totalExpenses: 0,
        totalSavings: 0,
        totalFixedPayments: 0,
      });
    }
  }, [isLoggedIn]);

  return (
    <FinancialContext.Provider value={{ financialData }}>
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancialContext = () => {
  const context = useContext(FinancialContext);
  if (context === undefined) {
    throw new Error('useFinancialContext must be used within a FinancialProvider');
  }
  return context;
};