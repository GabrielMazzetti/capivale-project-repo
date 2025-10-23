import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout = () => {
  const { logout } = useAuth();
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-2 rounded-md ${isActive ? 'bg-blue-600 text-white' : 'text-gray-200 hover:bg-blue-800'}`;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-blue-800">
          Capivale Admin
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavLink to="/admin" end className={linkClass}>Dashboard</NavLink>
          <NavLink to="/admin/users" className={linkClass}>User Management</NavLink>
          <NavLink to="/admin/transactions" className={linkClass}>Transactions</NavLink>
          <NavLink to="/admin/faq" className={linkClass}>FAQ Management</NavLink>
          <NavLink to="/admin/categories" className={linkClass}>Category Management</NavLink> {/* Added this NavLink */}
          <NavLink to="/admin/activities" className={linkClass}>Activity Management</NavLink>
        </nav>
        <div className="p-4 border-t border-blue-800">
          <button onClick={logout} className="w-full text-left text-gray-200 hover:bg-blue-800 px-4 py-2 rounded-md">Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;