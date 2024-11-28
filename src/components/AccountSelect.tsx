import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Account } from '../types/Account'

interface AccountSelectProps {
  accounts: Account[];
  selectedAccount: string;
  onChange: (accountId: string) => void;
  showAllOption?: boolean;
}

const AccountSelect = ({ accounts, selectedAccount, onChange, showAllOption = false }: AccountSelectProps) => {
  // Create options array with "All Accounts" option if showAllOption is true
  const options = showAllOption 
    ? [{ id: 'all', name: 'All Accounts', createdAt: '' }, ...accounts]
    : accounts;

  // Safely find the selected account, fallback to first option or a default option
  const selected = options.find(acc => acc.id === selectedAccount) || 
    options[0] || 
    { id: '', name: 'No accounts', createdAt: '' };

  return (
    <Listbox value={selectedAccount} onChange={onChange}>
      <div className="relative">
        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-gray-800 py-2 pl-3 pr-10 text-left text-white focus:outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300">
          <span className="block truncate">{selected.name}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronsUpDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
            {options.map((account) => (
              <Listbox.Option
                key={account.id}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-gray-700 text-white' : 'text-gray-300'
                  }`
                }
                value={account.id}
              >
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      {account.name}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-500">
                        <Check className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default AccountSelect;