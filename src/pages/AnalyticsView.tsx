import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { Line, Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import { Trade } from '../types/Trade';
import { Account } from '../types/Account';
import AccountSelect from '../components/AccountSelect';
import TradingInsights from '../components/TradingInsights';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const AnalyticsView = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');

  useEffect(() => {
    const storedAccounts = localStorage.getItem('accounts');
    if (storedAccounts) {
      const parsedAccounts = JSON.parse(storedAccounts);
      setAccounts(parsedAccounts);
      if (parsedAccounts.length > 0) {
        setSelectedAccount(parsedAccounts[0].id);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      const storedTrades = localStorage.getItem(`trades_${selectedAccount}`);
      if (storedTrades) {
        setTrades(JSON.parse(storedTrades));
      } else {
        setTrades([]);
      }
    }
  }, [selectedAccount]);

  // Calculate main stats
  const totalPnl = trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
  const winningTrades = trades.filter((trade) => trade.pnl > 0);
  const losingTrades = trades.filter((trade) => trade.pnl < 0);
  const winRate = trades.length ? (winningTrades.length / trades.length) * 100 : 0;

  // Prepare daily PNL and trade count data
  const dailyStats = trades.reduce((acc: { [key: string]: { pnl: number; count: number } }, trade) => {
    const date = trade.boughtTimestamp.split(' ')[0];
    if (!acc[date]) {
      acc[date] = { pnl: 0, count: 0 };
    }
    acc[date].pnl += trade.pnl;
    acc[date].count += 1;
    return acc;
  }, {});

  const sortedDates = Object.keys(dailyStats).sort();
  
  // PNL Chart Data
  const pnlChartData = {
    labels: sortedDates.map(date => format(parseISO(date.replace(/\//g, '-')), 'MMM dd')),
    datasets: [
      {
        label: 'Daily P&L',
        data: sortedDates.map(date => dailyStats[date].pnl),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.1,
      },
    ],
  };

  // Trade Count Chart Data with color correlation
  const tradeCountChartData = {
    labels: sortedDates.map(date => format(parseISO(date.replace(/\//g, '-')), 'MMM dd')),
    datasets: [
      {
        label: 'Number of Trades',
        data: sortedDates.map(date => dailyStats[date].count),
        backgroundColor: sortedDates.map(date => 
          dailyStats[date].pnl >= 0 
            ? 'rgba(34, 197, 94, 0.8)'  // Green for profitable days
            : 'rgba(239, 68, 68, 0.8)'  // Red for losing days
        ),
      },
    ],
  };

  // Symbol distribution data
  const symbolStats = trades.reduce((acc: { [key: string]: number }, trade) => {
    acc[trade.symbol] = (acc[trade.symbol] || 0) + 1;
    return acc;
  }, {});

  const symbolChartData = {
    labels: Object.keys(symbolStats),
    datasets: [
      {
        data: Object.values(symbolStats),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
      },
    ],
  };

  // Win/loss distribution data
  const winLossData = {
    labels: ['Winning Trades', 'Losing Trades'],
    datasets: [
      {
        data: [winningTrades.length, losingTrades.length],
        backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(239, 68, 68, 0.8)'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(209, 213, 219)',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            if (context.dataset.label === 'Number of Trades') {
              const date = context.label;
              const stats = dailyStats[sortedDates[context.dataIndex]];
              return [
                `Trades: ${stats.count}`,
                `P&L: $${stats.pnl.toFixed(2)}`,
              ];
            }
            return context.dataset.label + ': ' + context.formattedValue;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          color: 'rgb(209, 213, 219)',
        },
      },
      y: {
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          color: 'rgb(209, 213, 219)',
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <div className="w-64">
          <AccountSelect
            accounts={accounts}
            selectedAccount={selectedAccount}
            onChange={setSelectedAccount}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-gray-900 p-6 rounded-xl">
          <h3 className="text-gray-400 text-sm">Total P&L</h3>
          <p className={`text-2xl font-bold ${
            totalPnl >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            ${totalPnl.toFixed(2)}
          </p>
        </div>
        
        <div className="bg-gray-900 p-6 rounded-xl">
          <h3 className="text-gray-400 text-sm">Total Trades</h3>
          <p className="text-2xl font-bold text-white">{trades.length}</p>
        </div>
        
        <div className="bg-gray-900 p-6 rounded-xl">
          <h3 className="text-gray-400 text-sm">Win Rate</h3>
          <p className="text-2xl font-bold text-white">{winRate.toFixed(1)}%</p>
        </div>
      </div>

      <TradingInsights trades={trades} />

      <div className="grid grid-cols-2 gap-6">
        {/* Daily PNL Chart */}
        <div className="bg-gray-900 p-6 rounded-xl">
          <h3 className="text-gray-400 text-sm mb-4">Daily P&L Performance</h3>
          <Line data={pnlChartData} options={chartOptions} />
        </div>

        {/* Trade Count Chart */}
        <div className="bg-gray-900 p-6 rounded-xl">
          <h3 className="text-gray-400 text-sm mb-4">Daily Trade Count (Green = Profitable Day)</h3>
          <Bar data={tradeCountChartData} options={chartOptions} />
        </div>

        {/* Symbol Distribution */}
        <div className="bg-gray-900 p-6 rounded-xl">
          <h3 className="text-gray-400 text-sm mb-4">Trades by Symbol</h3>
          <Pie 
            data={symbolChartData} 
            options={{
              plugins: {
                legend: {
                  position: 'right',
                  labels: {
                    color: 'rgb(209, 213, 219)',
                  },
                },
              },
            }} 
          />
        </div>

        {/* Win/Loss Distribution */}
        <div className="bg-gray-900 p-6 rounded-xl">
          <h3 className="text-gray-400 text-sm mb-4">Win/Loss Distribution</h3>
          <Bar 
            data={winLossData} 
            options={{
              ...chartOptions,
              indexAxis: 'y' as const,
            }} 
          />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;