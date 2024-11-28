import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, parseISO } from 'date-fns';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Trade, TradeDay } from '../types/Trade';
import { Account } from '../types/Account';
import AccountSelect from '../components/AccountSelect';

const CalendarView = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('all');

  useEffect(() => {
    const storedAccounts = localStorage.getItem('accounts');
    if (storedAccounts) {
      const parsedAccounts = JSON.parse(storedAccounts);
      setAccounts(parsedAccounts);
    }
  }, []);

  useEffect(() => {
    if (selectedAccount === 'all') {
      // Combine trades from all accounts
      const allTrades = accounts.reduce((acc: Trade[], account) => {
        const accountTrades = localStorage.getItem(`trades_${account.id}`);
        if (accountTrades) {
          return [...acc, ...JSON.parse(accountTrades)];
        }
        return acc;
      }, []);
      setTrades(allTrades);
    } else {
      // Load trades for selected account
      const accountTrades = localStorage.getItem(`trades_${selectedAccount}`);
      if (accountTrades) {
        setTrades(JSON.parse(accountTrades));
      } else {
        setTrades([]);
      }
    }
  }, [selectedAccount, accounts]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const tradeDays = daysInMonth.map(date => {
    const dayTrades = trades.filter(trade => {
      try {
        const tradeDate = parseISO(trade.boughtTimestamp.split(' ')[0].replace(/\//g, '-'));
        return format(tradeDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
      } catch (error) {
        console.error('Error parsing date:', error);
        return false;
      }
    });

    const totalPnl = dayTrades.reduce((sum, trade) => {
      return sum + (trade.pnl || 0);
    }, 0);

    return {
      date,
      trades: dayTrades,
      totalPnl
    } as TradeDay;
  });

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(current => addMonths(current, direction === 'next' ? 1 : -1));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Trading Calendar</h1>
        <div className="flex items-center space-x-4">
          <div className="w-64">
            <AccountSelect
              accounts={accounts}
              selectedAccount={selectedAccount}
              onChange={setSelectedAccount}
              showAllOption={true}
            />
          </div>
          
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-800 rounded-lg"
            >
              <ChevronLeft className="text-gray-400" />
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-800 rounded-lg"
            >
              <ChevronRight className="text-gray-400" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-gray-400 font-medium py-2">
              {day}
            </div>
          ))}
          
          {tradeDays.map((day, index) => (
            <div
              key={index}
              className={`min-h-[100px] p-2 rounded-lg ${
                isToday(day.date)
                  ? 'bg-blue-900/20 border border-blue-500'
                  : isSameMonth(day.date, currentDate)
                  ? 'bg-gray-800'
                  : 'bg-gray-800/50'
              }`}
            >
              <div className="text-sm text-gray-400 mb-1">
                {format(day.date, 'd')}
              </div>
              {day.trades.length > 0 && (
                <div className="space-y-2">
                  <div className={`text-sm font-medium ${
                    day.totalPnl >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    ${Math.abs(day.totalPnl).toFixed(2)}
                    {day.totalPnl < 0 ? ' L' : ' W'}
                  </div>
                  <div className="text-xs text-gray-400">
                    {day.trades.length} trade{day.trades.length !== 1 ? 's' : ''}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;