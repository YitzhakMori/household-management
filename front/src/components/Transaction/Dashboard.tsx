import React, { useState, useEffect } from 'react';
import TransactionsTable from './TransactionTable';
import SavingsTable from './SavingsTable';
import FixedPaymentsTable from './FixedPaymentsTable';
import Graphs from './Graphs';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'transactions' | 'savings' | 'fixed' | 'graphs'>('transactions');
  const [financialData, setFinancialData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    totalSavings: 0,
    totalFixedPayments: 0,
  });

  useEffect(() => {
    const fetchFinancialData = async () => {
      const token = localStorage.getItem('token'); // נניח שהטוקן מאוחסן ב-localStorage

      try {
        const [incomeRes, expensesRes, savingsRes, fixedPaymentsRes] = await Promise.all([
          fetch('http://localhost:5001/api/transaction/total-income', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          }),
          fetch('http://localhost:5001/api/transaction/total-expenses', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          }),
          fetch('http://localhost:5001/api/savings/total-savings', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          }),
          fetch('http://localhost:5001/api/fixedPayments/total-fixed-payments', {
            method: 'GET',
            
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          })
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
      }
    };

    fetchFinancialData();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'transactions':
        return <TransactionsTable />;
      case 'savings':
        return <SavingsTable />;
      case 'fixed':
        return <FixedPaymentsTable />;
      case 'graphs':
        return <Graphs />;
      default:
        return <TransactionsTable />;
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
  onClick={() => window.location.href = '/home'}
  className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all"
>
  חזרה לדף הבית
</button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">ניהול פיננסי</h1>
            <p className="text-blue-100">ניהול והצגת המידע הפיננסי שלך במקום אחד</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-xl shadow-lg p-2 flex gap-2">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex-1 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'transactions'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="text-xl mb-1 block">💰</span>
            עסקאות
          </button>
          <button
            onClick={() => setActiveTab('savings')}
            className={`flex-1 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'savings'
                ? 'bg-green-600 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="text-xl mb-1 block">🏦</span>
            חסכונות
          </button>
          <button
            onClick={() => setActiveTab('fixed')}
            className={`flex-1 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'fixed'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="text-xl mb-1 block">⏰</span>
            תשלומים קבועים
          </button>
          <button
            onClick={() => setActiveTab('graphs')}
            className={`flex-1 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'graphs'
                ? 'bg-orange-600 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="text-xl mb-1 block">📊</span>
            גרפים
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow p-4 hover:shadow-md transition-shadow">
            <div className="text-sm text-gray-500 mb-1">סה"כ הכנסות החודש</div>
            <div className="text-2xl font-bold text-green-600">₪{financialData.totalIncome}</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 hover:shadow-md transition-shadow">
            <div className="text-sm text-gray-500 mb-1">סה"כ הוצאות החודש</div>
            <div className="text-2xl font-bold text-red-600">₪{financialData.totalExpenses}</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 hover:shadow-md transition-shadow">
            <div className="text-sm text-gray-500 mb-1">חסכונות</div>
            <div className="text-2xl font-bold text-blue-600">₪{financialData.totalSavings}</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 hover:shadow-md transition-shadow">
            <div className="text-sm text-gray-500 mb-1">תשלומים קבועים</div>
            <div className="text-2xl font-bold text-purple-600">₪{financialData.totalFixedPayments}</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
