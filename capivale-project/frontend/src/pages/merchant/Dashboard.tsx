import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';

interface SalesSummary {
  today: number;
  thisWeek: number;
  thisMonth: number;
}

interface DashboardData {
  balance: number;
  salesSummary: SalesSummary;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  createdAt: string;
  senderId: string | null;
  receiverId: string;
  description: string | null;
}

export const MerchantDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [salesHistory, setSalesHistory] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardRes, salesRes] = await Promise.all([
          api.get<DashboardData>('/merchants/dashboard'),
          api.get<Transaction[]>('/merchants/sales'),
        ]);
        setDashboardData(dashboardRes.data);
        setSalesHistory(salesRes.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch merchant data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGeneratePaymentRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setQrCodeData(null);
    try {
      const amount = parseFloat(paymentAmount);
      if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount.');
        return;
      }
      const response = await api.post('/merchants/payment-request', { amount });
      setQrCodeData(response.data.qrCodeData);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to generate payment request.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <div className="text-center p-8">Loading merchant dashboard...</div>;
  if (error) return <div className="text-center p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Merchant Dashboard</h1>
          <div className="flex space-x-4"> {/* Added a div to group buttons */}
            <NavLink
              to="/merchant/products"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center"
            >
              Gerenciar Produtos
            </NavLink>
            <NavLink
              to="/merchant/pos"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center"
            >
              Ponto de Venda
            </NavLink>
            <NavLink
              to="/merchant/history"
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center"
            >
              Histórico de Vendas
            </NavLink>
            <NavLink
              to="/merchant/profile" // New NavLink for Profile
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center"
            >
              Meu Perfil
            </NavLink>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Balance Card */}
          <div className="bg-white p-6 rounded-lg shadow-md col-span-1">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">My Balance</h2>
            <p className="text-4xl font-bold text-green-500">C$ {dashboardData?.balance.toFixed(2) || '0.00'}</p>
            <p className="text-sm text-gray-500">1 Capivale (C$) = 1 BRL</p>
          </div>

          {/* Sales Overview Card */}
          <div className="bg-white p-6 rounded-lg shadow-md col-span-2 grid grid-cols-3 gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Sales Today</h2>
              <p className="text-2xl font-bold">C$ {dashboardData?.salesSummary.today.toFixed(2) || '0.00'}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Sales This Week</h2>
              <p className="text-2xl font-bold">C$ {dashboardData?.salesSummary.thisWeek.toFixed(2) || '0.00'}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Sales This Month</h2>
              <p className="text-2xl font-bold">C$ {dashboardData?.salesSummary.thisMonth.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        </div>

        {/* Receive Payment Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Receive Payment</h2>
          <form onSubmit={handleGeneratePaymentRequest} className="flex items-end space-x-4">
            <div className="flex-grow">
              <label htmlFor="paymentAmount" className="block text-sm font-medium text-gray-700">Amount (C$)</label>
              <input
                type="number"
                id="paymentAmount"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                step="0.01"
                min="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                placeholder="e.g., 10.50"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
            >
              Generate QR Code
            </button>
          </form>
          {qrCodeData && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <p className="font-semibold">QR Code Data:</p>
              <p className="break-all text-sm text-gray-700">{qrCodeData}</p>
              <p className="text-xs text-gray-500 mt-2">In a real app, this would be a visual QR code image.</p>
            </div>
          )}
        </div>

        
      </div>
    </div>
  );
};


export default MerchantDashboard;
