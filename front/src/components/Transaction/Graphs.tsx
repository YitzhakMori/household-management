import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { fetchTransactions } from '../../api/transactionsAPI';
import { fetchFixedPayments } from '../../api/Fixed';
import { fetchSavings } from '../../api/Saving';

interface Transaction {
  _id: string;
  type: string;
  amount: number;
  category: string;
  date: string;
}

interface FixedPayment {
  _id: string;
  amount: number;
  description: string;
  date: string;
}

interface Saving {
  _id: string;
  amount: number;
  description: string;
  date: string;
}


const Graphs: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [fixedPayments, setFixedPayments] = useState<FixedPayment[]>([]);
  const [savings, setSavings] = useState<Saving[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [transactionsData, fixedData, savingsData] = await Promise.all([
        fetchTransactions(),
        fetchFixedPayments(),
        fetchSavings()
      ]);
      setTransactions(transactionsData);
      setFixedPayments(fixedData);
      setSavings(savingsData);
    } catch (error) {
      setError('שגיאה בטעינת הנתונים');
    } finally {
      setLoading(false);
    }
  };

  // הכנת נתונים להכנסות והוצאות לאורך זמן
  const incomeExpenseData = useMemo(() => {
    const grouped = transactions.reduce((acc: any, curr) => {
      const date = new Date(curr.date);
      const key = date.toLocaleDateString('he-IL', { month: 'short', year: 'numeric' });
      if (!acc[key]) {
        acc[key] = { name: key, income: 0, expenses: 0 };
      }
      if (curr.type === 'income') {
        acc[key].income += curr.amount;
      } else {
        acc[key].expenses += curr.amount;
      }
      return acc;
    }, {});
    return Object.values(grouped);
  }, [transactions]);

  // הכנת נתונים להתפלגות קטגוריות
  const categoryData = useMemo(() => {
    const grouped = transactions.reduce((acc: any, curr) => {
      if (!acc[curr.category]) {
        acc[curr.category] = 0;
      }
      acc[curr.category] += curr.amount;
      return acc;
    }, {});
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center">
          <div className="text-white">
            <h1 className="text-2xl font-bold mb-1">ניתוח פיננסי</h1>
            <p className="text-blue-100">תובנות מהנתונים הפיננסיים שלך</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedPeriod('week')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedPeriod === 'week' 
                  ? 'bg-white text-blue-600' 
                  : 'bg-blue-500 text-white'
              }`}
            >
              שבוע
            </button>
            <button
              onClick={() => setSelectedPeriod('month')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedPeriod === 'month' 
                  ? 'bg-white text-blue-600' 
                  : 'bg-blue-500 text-white'
              }`}
            >
              חודש
            </button>
            <button
              onClick={() => setSelectedPeriod('year')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedPeriod === 'year' 
                  ? 'bg-white text-blue-600' 
                  : 'bg-blue-500 text-white'
              }`}
            >
              שנה
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center p-4">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-r-4 border-red-500 p-4 mb-6 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">❌</div>
            <div className="mr-3">{error}</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* הכנסות והוצאות לאורך זמן */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold mb-4">הכנסות והוצאות לאורך זמן</h2>
          <div className="h-[400px] w-full">
            <LineChart
              width={600}
              height={400}
              data={incomeExpenseData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#00C49F" name="הכנסות" />
              <Line type="monotone" dataKey="expenses" stroke="#FF8042" name="הוצאות" />
            </LineChart>
          </div>
        </div>

        {/* התפלגות לפי קטגוריות */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold mb-4">התפלגות לפי קטגוריות</h2>
          <div className="h-[400px] w-full">
            <PieChart width={400} height={400}>
              <Pie
                data={categoryData}
                cx={200}
                cy={200}
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>

        {/* חסכונות לאורך זמן */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold mb-4">חסכונות לאורך זמן</h2>
          <div className="h-[400px] w-full">
            <BarChart
              width={600}
              height={400}
              data={savings}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#8884d8" name="חסכונות" />
            </BarChart>
          </div>
        </div>

        {/* תשלומים קבועים */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold mb-4">תשלומים קבועים</h2>
          <div className="h-[400px] w-full">
            <BarChart
              width={600}
              height={400}
              data={fixedPayments}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="description" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#00C49F" name="סכום" />
            </BarChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Graphs;