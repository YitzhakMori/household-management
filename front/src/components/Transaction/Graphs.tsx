import React, { useState, useEffect, useMemo } from 'react';
import { fetchTransactions } from '../../api/transactionsAPI';
import { fetchFixedPayments } from '../../api/Fixed';
import { fetchSavings } from '../../api/Saving';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, TooltipProps } from 'recharts';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ComposedChart
} from 'recharts';

// Interfaces
interface MonthlyData {
  name: string;
  הכנסות: number;
  הוצאות: number;
  מאזן: number;
  חסכונות: number;
}

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

interface AppState {
  transactions: Transaction[];
  fixedPayments: FixedPayment[];
  savings: Saving[];
}

interface SummaryCard {
  title: string;
  amount: number;
  color: string;
}

interface CircularChartData {
  name: string;
  value: number;
  color: string;
}
// Utility Functions
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Custom Tooltip Component
const CustomTooltipContent = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="backdrop-blur-sm bg-white/90 px-4 py-3 rounded-xl shadow-lg border border-gray-200/50">
        <p className="font-medium text-gray-600 mb-2">{label}</p>
        {payload.map((entry, index) => {
          const value = entry.value ?? 0;
          const name = entry.name ?? 'ללא שם';
          const color = entry.color ?? '#000000';

          return (
            <p key={index} className="flex items-center gap-2 font-semibold">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span>{name}:</span>
              <span style={{ color }}>
                {formatCurrency(value)}
              </span>
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};

const CircularChart: React.FC<{ monthlyData: MonthlyData[] }> = ({ monthlyData }) => {
  const RADIAN = Math.PI / 180;

  // קח את החודש האחרון (הנוכחי)
  const currentMonth = monthlyData[monthlyData.length - 1];

  // הכן נתונים לגרף
  const chartData: CircularChartData[] = [
    { 
      name: 'הכנסות', 
      value: currentMonth.הכנסות, 
      color: '#10B981' 
    },
    { 
      name: 'הוצאות', 
      value: currentMonth.הוצאות, 
      color: '#EF4444' 
    },
    { 
      name: 'חסכונות', 
      value: currentMonth.חסכונות, 
      color: '#6366F1' 
    }
  ];

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent
  }: {
    cx: number,
    cy: number,
    midAngle: number,
    innerRadius: number,
    outerRadius: number,
    percent: number
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="font-bold text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // אם אין נתונים, הוסף נתוני דמה
  const finalData = chartData.length > 0 ? chartData : [
    { name: 'הכנסות', value: 10000, color: '#10B981' },
    { name: 'הוצאות', value: 8000, color: '#EF4444' },
    { name: 'חסכונות', value: 2000, color: '#6366F1' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        סיכום החודש הנוכחי 
      </h2>

      <div className="flex flex-col md:flex-row items-center justify-center">
        <div className="h-[400px] md:w-1/2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={finalData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius="90%"
                innerRadius="50%"
                paddingAngle={3}
                dataKey="value"
              >
                {finalData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    className="transition-all duration-300 hover:opacity-80"
                  />
                ))}
              </Pie>
              <Tooltip content={CustomTooltipContent} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-7 md:mt-0 md:ml-8 md:w-1/2 flex flex-col items-center">
  {finalData.map((item, index) => (
    <div key={index} className="text-center mb-8">
      <div
        className="w-6 h-4 inline-block mr-3 rounded-full"
        style={{ backgroundColor: item.color }}
      />
      <span className="text-xl font-semibold text-gray-800">
        {item.name}: <span className="font-bold text-2xl">{`₪${item.value.toLocaleString()}`}</span>
      </span>
    </div>
  ))}
</div>

      </div>
    </div>
  );
};

const FinancialDashboard: React.FC = () => {
  const [data, setData] = useState<AppState>({
    transactions: [],
    fixedPayments: [],
    savings: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [transactions, fixedPayments, savings] = await Promise.all([
          fetchTransactions(),
          fetchFixedPayments(),
          fetchSavings()
        ]);
        setData({ transactions, fixedPayments, savings });
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const monthlyData = useMemo<MonthlyData[]>(() => {
    const months: Record<string, MonthlyData> = {};

    data.transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = date.toLocaleDateString('he-IL', { month: 'short', year: '2-digit' });

      if (!months[monthKey]) {
        months[monthKey] = {
          name: monthKey,
          הכנסות: 0,
          הוצאות: 0,
          מאזן: 0,
          חסכונות: 0
        };
      }

      if (transaction.type === 'income') {
        months[monthKey].הכנסות += transaction.amount;
      } else {
        months[monthKey].הוצאות += transaction.amount;
      }

      months[monthKey].מאזן = months[monthKey].הכנסות - months[monthKey].הוצאות;
    });

    data.savings.forEach(saving => {
      const date = new Date(saving.date);
      const monthKey = date.toLocaleDateString('he-IL', { month: 'short', year: '2-digit' });
      if (months[monthKey]) {
        months[monthKey].חסכונות += saving.amount;
      }
    });

    return Object.values(months);
  }, [data]);

  const totalNumbers = useMemo(() => {
    return {
      income: data.transactions.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum, 0),
      expenses: data.transactions.reduce((sum, t) => t.type !== 'income' ? sum + t.amount : sum, 0),
      savings: data.savings.reduce((sum, s) => sum + s.amount, 0)
    };
  }, [data]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      
     
      <div className="mt-6">
        <CircularChart monthlyData={monthlyData} />
      </div>
    </div>
  );
};



export default FinancialDashboard;
