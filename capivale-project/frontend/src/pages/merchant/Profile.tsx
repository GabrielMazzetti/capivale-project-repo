import React, { useState, useEffect } from 'react';
import { merchantApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface UserProfile {
  name: string;
  email: string;
  cpf: string;
  cnpj?: string;
  companyName?: string;
  phone?: string;
  address?: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({} as UserProfile);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await merchantApi.getProfile();
      setProfileData(response.data);
      setFormData(response.data); // Initialize form with current profile data
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.message || 'Failed to fetch profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await merchantApi.updateProfile(formData);
      setIsEditing(false);
      fetchProfile(); // Refresh profile data after update
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Carregando perfil...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Erro: {error}</div>;
  }

  if (!profileData) {
    return <div className="text-center py-4">Nenhum dado de perfil encontrado.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Meu Perfil</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {!isEditing ? (
          <div>
            <p className="mb-2"><span className="font-semibold">Nome:</span> {profileData.name}</p>
            <p className="mb-2"><span className="font-semibold">Email:</span> {profileData.email}</p>
            <p className="mb-2"><span className="font-semibold">CPF:</span> {profileData.cpf}</p>
            {profileData.cnpj && <p className="mb-2"><span className="font-semibold">CNPJ:</span> {profileData.cnpj}</p>}
            {profileData.companyName && <p className="mb-2"><span className="font-semibold">Nome da Empresa:</span> {profileData.companyName}</p>}
            {profileData.phone && <p className="mb-2"><span className="font-semibold">Telefone:</span> {profileData.phone}</p>}
            {profileData.address && <p className="mb-2"><span className="font-semibold">Endereço:</span> {profileData.address}</p>}
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Editar Perfil
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
            </div>
            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">CPF</label>
              <input type="text" name="cpf" id="cpf" value={formData.cpf} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required disabled />
            </div>
            <div>
              <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">CNPJ</label>
              <input type="text" name="cnpj" id="cnpj" value={formData.cnpj || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Nome da Empresa</label>
              <input type="text" name="companyName" id="companyName" value={formData.companyName || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone</label>
              <input type="text" name="phone" id="phone" value={formData.phone || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Endereço</label>
              <input type="text" name="address" id="address" value={formData.address || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData(profileData as UserProfile); // Reset form data if cancelled
                }}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
