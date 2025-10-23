import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data for the chart
const data = [
  { name: 'Jan', volume: 4000 },
  { name: 'Feb', volume: 3000 },
  { name: 'Mar', volume: 5000 },
  { name: 'Apr', volume: 4500 },
  { name: 'May', volume: 6000 },
  { name: 'Jun', volume: 5500 },
];

export const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md"> 
            <h3 className="text-gray-600 font-semibold">Total Users</h3>
            <p className="text-3xl font-bold">1,150</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md"> 
            <h3 className="text-gray-600 font-semibold">Total Merchants</h3>
            <p className="text-3xl font-bold">150</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md"> 
            <h3 className="text-gray-600 font-semibold">Capivales in Circulation</h3>
            <p className="text-3xl font-bold">C$ 500,000</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md"> 
            <h3 className="text-gray-600 font-semibold">Volume (Last 30 Days)</h3>
            <p className="text-3xl font-bold">C$ 75,000</p>
        </div>
      </div>

      {/* Transaction Volume Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Transaction Volume</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
