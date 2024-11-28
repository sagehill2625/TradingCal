import { useState, useEffect } from 'react';
import { Upload, Trash2, Plus, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Trade } from '../types/Trade';
import { Account } from '../types/Account';
import Modal from '../components/Modal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import AccountSelect from '../components/AccountSelect';

const UploadView = () => {
  const [dragActive, setDragActive] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [uploadResult, setUploadResult] = useState({ count: 0 });
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [newAccountName, setNewAccountName] = useState('');
  const [showNewAccountInput, setShowNewAccountInput] = useState(false);

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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const parseExcelTimestamp = (timestamp: string): string => {
    if (timestamp.includes('/')) {
      const parts = timestamp.split(' ');
      const datePart = parts[0];
      const timePart = parts[1];
      const [month, day, year] = datePart.split('/');
      const formattedDate = `${year}/${month.padStart(2, '0')}/${day.padStart(2, '0')}`;
      return `${formattedDate} ${timePart}`;
    }
    return timestamp;
  };

  const parsePnl = (pnlValue: any): number => {
    if (!pnlValue) return 0;
    const pnlString = pnlValue.toString();
    let cleanValue = pnlString.replace(/[$\s]/g, '');
    const isNegative = cleanValue.startsWith('(') && cleanValue.endsWith(')');
    cleanValue = cleanValue.replace(/[()]/g, '');
    const numericValue = parseFloat(cleanValue);
    return isNegative ? -numericValue : numericValue;
  };

  const processFile = (file: File) => {
    if (!selectedAccount) {
      alert('Please select an account first');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      const trades: Trade[] = jsonData.map((row: any) => ({
        id: crypto.randomUUID(),
        symbol: row.symbol,
        priceFormat: Number(row.priceFormat),
        priceFormatType: Number(row._priceFormatTyp),
        tickSize: Number(row._tickSize),
        buyFillId: String(row.buyFillId),
        sellFillId: String(row.sellFillId),
        qty: Number(row.qty),
        buyPrice: Number(row.buyPrice),
        sellPrice: Number(row.sellPrice),
        pnl: parsePnl(row.pnl),
        boughtTimestamp: parseExcelTimestamp(row.boughtTimestamp),
        soldTimestamp: parseExcelTimestamp(row.soldTimestamp),
        duration: row.duration
      }));

      // Store trades for the selected account
      const accountKey = `trades_${selectedAccount}`;
      localStorage.setItem(accountKey, JSON.stringify(trades));
      setUploadResult({ count: trades.length });
      setShowModal(true);
    };
    reader.readAsBinaryString(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDeleteAccount = () => {
    if (!selectedAccount) return;

    const updatedAccounts = accounts.filter(acc => acc.id !== selectedAccount);
    localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
    localStorage.removeItem(`trades_${selectedAccount}`);
    
    setAccounts(updatedAccounts);
    if (updatedAccounts.length > 0) {
      setSelectedAccount(updatedAccounts[0].id);
    } else {
      setSelectedAccount('');
    }
    
    setShowDeleteModal(false);
    setUploadResult({ count: 0 });
    setShowModal(true);
  };

  const handleAddAccount = () => {
    if (!newAccountName.trim()) return;

    const newAccount: Account = {
      id: crypto.randomUUID(),
      name: newAccountName.trim(),
      createdAt: new Date().toISOString()
    };

    const updatedAccounts = [...accounts, newAccount];
    localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
    setAccounts(updatedAccounts);
    setSelectedAccount(newAccount.id);
    setNewAccountName('');
    setShowNewAccountInput(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Upload Trades</h1>
      
      <div className="bg-gray-900 p-6 rounded-xl">
        <h2 className="text-lg font-medium text-white mb-4">Account Management</h2>
        <div className="space-y-4">
          {accounts.length > 0 && (
            <div className="flex items-center space-x-4">
              <div className="w-64">
                <AccountSelect
                  accounts={accounts}
                  selectedAccount={selectedAccount}
                  onChange={setSelectedAccount}
                />
              </div>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
                <span>Delete Account</span>
              </button>
            </div>
          )}

          {showNewAccountInput ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newAccountName}
                onChange={(e) => setNewAccountName(e.target.value)}
                placeholder="Enter account name"
                className="flex-1 bg-gray-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddAccount}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => setShowNewAccountInput(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowNewAccountInput(true)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={20} />
              <span>New Account</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-gray-900 p-6 rounded-xl mb-6">
        <h2 className="text-lg font-medium text-white mb-2">Expected Format</h2>
        <p className="text-gray-400 text-sm">
          The file should contain the following columns:
        </p>
        <ul className="list-disc list-inside text-gray-400 text-sm mt-2">
          <li>symbol (e.g., MNQZ4)</li>
          <li>qty (quantity)</li>
          <li>buyPrice and sellPrice</li>
          <li>pnl (profit/loss, negative values in parentheses)</li>
          <li>boughtTimestamp and soldTimestamp</li>
          <li>duration</li>
        </ul>
      </div>
      
      <div
        className={`border-2 border-dashed rounded-xl p-12 text-center ${
          dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 bg-gray-900'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {selectedAccount ? (
          <>
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-lg text-gray-300">
              Drag and drop your Excel file here
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Supports .xlsx and .xls files
            </p>
          </>
        ) : (
          <p className="text-lg text-gray-300">
            Please create or select an account first
          </p>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={uploadResult.count > 0 ? "Upload Successful" : "Account Deleted"}
        message={
          uploadResult.count > 0
            ? `Successfully imported ${uploadResult.count} trades to the selected account! The calendar view will now be updated with your trading data.`
            : "The account and all its trading data has been successfully deleted."
        }
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
};

export default UploadView;