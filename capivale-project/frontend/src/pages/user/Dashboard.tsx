import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export const UserDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            Logout
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Balance Card */}
          <div className="bg-white p-6 rounded-lg shadow-md col-span-1">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">My Balance</h2>
            <p className="text-4xl font-bold text-green-500">C$ 1,234.56</p>
            <p className="text-sm text-gray-500">1 Capivale (C$) = 1 BRL</p>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white p-6 rounded-lg shadow-md col-span-2">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h2>
            <div className="flex space-x-4">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg">Send Money</button>
              <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg">Pay with QR Code</button>
              <Link to="/mining" className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center">Mine Capivale</Link>
            </div>
          </div>
        </div>

        {/* Transactions History */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Transaction History</h2>
          {/* Add table or list of transactions here */}
          <p className="text-gray-500">Transaction list will be displayed here. GET /api/wallet/transactions</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
