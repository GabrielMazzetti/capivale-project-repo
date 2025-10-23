import React, { useState, useEffect } from 'react';

interface Transaction {
  id: string;
  sender: string;
  receiver: string;
  amount: number;
  timestamp: string;
}

const generateRandomId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const getInitials = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const generateRandomTransaction = (): Transaction => {
  const senders = ['Alice', 'Bob', 'Charlie', 'David', 'Eve'];
  const receivers = ['Frank', 'Grace', 'Heidi', 'Ivan', 'Judy'];
  const randomSender = senders[Math.floor(Math.random() * senders.length)];
  const randomReceiver = receivers[Math.floor(Math.random() * receivers.length)];
  const randomAmount = parseFloat((Math.random() * 100 + 1).toFixed(2));
  const randomTimestamp = new Date().toLocaleString();

  return {
    id: generateRandomId(),
    sender: randomSender,
    receiver: randomReceiver,
    amount: randomAmount,
    timestamp: randomTimestamp,
  };
};

export const BlockchainTransactions: React.FC = () => {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]); // Store all transactions
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]); // Transactions to display

  const [filterId, setFilterId] = useState<string>('');
  const [filterStartDate, setFilterStartDate] = useState<string>('');
  const [filterEndDate, setFilterEndDate] = useState<string>('');

  useEffect(() => {
    // Simulate fetching initial transactions
    const initialTransactions = Array.from({ length: 20 }).map(() => generateRandomTransaction()); // More initial transactions
    setAllTransactions(initialTransactions);

    // Simulate new transactions appearing over time
    const interval = setInterval(() => {
      setAllTransactions((prevTransactions) => {
        const newTransaction = generateRandomTransaction();
        return [newTransaction, ...prevTransactions]; // Add new transactions without slicing
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let currentFilteredTransactions = allTransactions;

    // Filter by ID
    if (filterId) {
      currentFilteredTransactions = currentFilteredTransactions.filter(tx =>
        tx.id.includes(filterId)
      );
    }

    // Filter by Date
    if (filterStartDate) {
      const start = new Date(filterStartDate).getTime();
      currentFilteredTransactions = currentFilteredTransactions.filter(tx =>
        new Date(tx.timestamp).getTime() >= start
      );
    }
    if (filterEndDate) {
      const end = new Date(filterEndDate).getTime();
      currentFilteredTransactions = currentFilteredTransactions.filter(tx =>
        new Date(tx.timestamp).getTime() <= end
      );
    }

    setFilteredTransactions(currentFilteredTransactions.slice(0, 10)); // Display latest 10 filtered transactions
  }, [allTransactions, filterId, filterStartDate, filterEndDate]); // Re-filter when these change

  return (
    <section className="py-16 px-4 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h3 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Transações Recentes - CAPIChain
        </h3>
        <p className="text-lg leading-relaxed mb-8 opacity-80">
          Visualize a autenticidade e confiabilidade de cada transação em nossa plataforma.
        </p>

        {/* Filter Section */}
        <div className="mb-8 p-6 bg-gray-800 bg-opacity-70 rounded-lg shadow-lg border border-gray-700">
          <h4 className="text-2xl font-bold mb-4">Filtrar Transações</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="filterId" className="block text-sm font-medium text-gray-300">
                Filtrar por ID:
              </label>
              <input
                type="text"
                id="filterId"
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={filterId}
                onChange={(e) => setFilterId(e.target.value)}
                placeholder="Digite o ID da transação"
              />
            </div>
            <div>
              <label htmlFor="filterStartDate" className="block text-sm font-medium text-gray-300">
                Data Inicial:
              </label>
              <input
                type="date"
                id="filterStartDate"
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="filterEndDate" className="block text-sm font-medium text-gray-300">
                Data Final:
              </label>
              <input
                type="date"
                id="filterEndDate"
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-gray-800 bg-opacity-70 p-6 rounded-lg shadow-lg border border-gray-700 flex flex-col md:flex-row justify-between items-center transform transition-all duration-500 hover:scale-105 hover:bg-opacity-90"
            >
              <div className="text-left md:w-1/3 mb-2 md:mb-0">
                <p className="text-sm opacity-60">ID da Transação:</p>
                <p className="font-mono text-blue-400 break-all">{tx.id.substring(0, 20)}...</p>
              </div>
              <div className="text-center md:w-1/3 mb-2 md:mb-0">
                <p className="text-sm opacity-60">De:</p>
                <p className="font-semibold">{getInitials(tx.sender)}</p>
              </div>
              <div className="text-center md:w-1/3 mb-2 md:mb-0">
                <p className="text-sm opacity-60">Para:</p>
                <p className="font-semibold">{getInitials(tx.receiver)}</p>
              </div>
              <div className="text-right md:w-1/3">
                <p className="text-sm opacity-60">Valor:</p>
                <p className="text-green-400 font-bold">C$ {tx.amount.toFixed(2)}</p>
                <p className="text-xs opacity-50 mt-1">{tx.timestamp}</p>
              </div>
            </div>
          ))}
          {filteredTransactions.length === 0 && (
            <p className="text-gray-400 text-lg mt-8">Nenhuma transação encontrada com os filtros aplicados.</p>
          )}
        </div>
      </div>
    </section>
  );
};
