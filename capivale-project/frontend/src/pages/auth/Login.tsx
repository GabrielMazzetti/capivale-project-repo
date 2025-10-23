import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Adicionado useNavigate
import { useAuth } from '../../context/AuthContext';

export const Login: React.FC = () => { // Changed to named export
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // Added error state
  const { login, user } = useAuth(); // Added user to destructuring
  const navigate = useNavigate(); // Inicializado useNavigate

  useEffect(() => {
    if (user) {
      // User is now logged in, perform navigation
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'merchant') {
        navigate('/merchant/dashboard');
      } else {
        navigate('/user/dashboard'); // Default for 'citizen' or other roles
      }
    }
  }, [user, navigate]); // Depend on user and navigate

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password); // Call login from AuthContext
      // Redirection will now be handled by useEffect in Login.tsx
    } catch (err: any) {
      console.error('Erro ao fazer login:', err);
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-800">
            &larr; Voltar
          </button>
          <Link to="/" className="text-blue-500 hover:underline">
            Home
          </Link>
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Entrar</h2>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              // disabled={loading} // Removed loading for now, as it's not defined
            >
              Sign In
            </button>
            <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="/forgot-password">
              Forgot Password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
