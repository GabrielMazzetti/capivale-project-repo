import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api'; // Assuming adminApi will handle category management
import CategoryForm from '../../components/CategoryForm';

interface Category {
  _id: string;
  name: string;
  description?: string;
}

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      // Assuming adminApi will have getCategories
      const response = await adminApi.getCategories();
      setCategories(response.data);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setError(err.response?.data?.message || 'Failed to fetch categories.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(undefined);
    setShowFormModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowFormModal(true);
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        // Assuming adminApi will have deleteCategory
        await adminApi.deleteCategory(id);
        fetchCategories();
      } catch (err: any) {
        console.error('Error deleting category:', err);
        setError(err.response?.data?.message || 'Failed to delete category.');
      }
    }
  };

  const handleFormSuccess = () => {
    setShowFormModal(false);
    fetchCategories();
  };

  const handleFormCancel = () => {
    setShowFormModal(false);
  };

  if (loading) {
    return <div className="text-center py-4">Carregando categorias...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Erro: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciamento de Categorias</h1>
      <button
        onClick={handleAddCategory}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mb-4"
      >
        Adicionar Nova Categoria
      </button>

      {showFormModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">{editingCategory ? 'Editar Categoria' : 'Adicionar Categoria'}</h2>
            <CategoryForm
              initialData={editingCategory}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Nome</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Descrição</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Ações</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-4 px-4 text-center text-gray-500">Nenhuma categoria cadastrada.</td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category._id} className="border-b border-gray-200 last:border-b-0">
                  <td className="py-3 px-4 text-sm text-gray-800">{category.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{category.description || '-'}</td>
                  <td className="py-3 px-4 text-sm">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="text-blue-600 hover:text-blue-900 mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryManagement;
