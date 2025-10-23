import React from 'react';

// Mock transaction data
const transactions = [
  { id: 'txn_1', type: 'admin_mint', from: '-', to: 'Alice', amount: 100.00, date: '2023-10-27' },
  { id: 'txn_2', type: 'transfer', from: 'Alice', to: 'Charlie', amount: 25.50, date: '2023-10-27' },
  { id: 'txn_3', type: 'payment', from: 'Charlie', to: "Bob's Burgers", amount: 15.00, date: '2023-10-26' },
  { id: 'txn_4', type: 'health_reward', from: '-', to: 'Diana', amount: 10.00, date: '2023-10-25' },
];

export const PlatformTransactions = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Platform Transactions</h1>
      
      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex items-center space-x-4">
        <input type="text" placeholder="Search by User ID, Txn ID..." className="flex-grow p-2 border rounded-md" />
        <select className="p-2 border rounded-md">
          <option value="">All Types</option>
          <option value="transfer">Transfer</option>
          <option value="payment">Payment</option>
          <option value="health_reward">Health Reward</option>
          <option value="admin_mint">Admin Mint</option>
        </select>
        <input type="date" className="p-2 border rounded-md" />
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Transaction ID</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">From</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">To</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(txn => (
              <tr key={txn.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-900 whitespace-no-wrap">{txn.id}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-900 whitespace-no-wrap">{txn.date}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-900 whitespace-no-wrap capitalize">{txn.type.replace('_', ' ')}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-900 whitespace-no-wrap">{txn.from}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-900 whitespace-no-wrap">{txn.to}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right font-semibold">C$ {txn.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlatformTransactions;
