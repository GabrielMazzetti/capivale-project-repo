import React from 'react';

// Mock user data
const users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'citizen', status: 'active' },
  { id: 2, name: "Bob's Burgers", email: "bob@burgers.com", role: "merchant", status: "active" },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'citizen', status: 'inactive' },
  { id: 4, name: 'Diana Prince', email: 'diana@example.com', role: 'admin', status: 'active' },
];

export const UserManagement = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">User Management</h1>
      
      {/* Search and Filter Controls */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex items-center space-x-4">
        <input type="text" placeholder="Search by name, email, CPF..." className="flex-grow p-2 border rounded-md" />
        <select className="p-2 border rounded-md">
          <option value="">All Roles</option>
          <option value="citizen">Citizen</option>
          <option value="merchant">Merchant</option>
          <option value="admin">Admin</option>
        </select>
        <select className="p-2 border rounded-md">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending_verification">Pending</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{user.name}</p>
                    <p className="text-gray-600 whitespace-no-wrap">{user.email}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap capitalize">{user.role}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${user.status === 'active' ? 'text-green-900' : 'text-red-900'}`}>
                    <span aria-hidden className={`absolute inset-0 ${user.status === 'active' ? 'bg-green-200' : 'bg-red-200'} opacity-50 rounded-full`}></span>
                    <span className="relative capitalize">{user.status}</span>
                  </span>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                  <button className="text-red-600 hover:text-red-900 ml-4">{user.status === 'active' ? 'Deactivate' : 'Activate'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
