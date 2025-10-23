import React from 'react';
// import { Link } from 'react-router-dom'; // Removed
// import { useAuth } from '../../context/AuthContext'; // Removed

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // const { isAuthenticated, logout } = useAuth(); // Removed

  return (
    <div>
      <h1>Main Layout Test</h1> {/* Added simple text */}
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;