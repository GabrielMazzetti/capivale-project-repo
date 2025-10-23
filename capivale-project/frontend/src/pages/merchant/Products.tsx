import React, { useState, useEffect } from 'react';
import { merchantApi } from '../../services/api';
import ProductForm from '../../components/ProductForm';

interface Product {
  _id: string;
  name: string;
  description?: string;
  priceBRL: number;
  categoryId: string; // Changed to categoryId
  categoryName?: string; // Added for display
  type: 'product' | 'service';
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await merchantApi.getProducts();
      // Map the response to include categoryName for display
      const productsWithCategoryNames = response.data.map((product: any) => ({
        ...product,
        categoryId: product.categoryId ? product.categoryId._id : '', // Ensure categoryId is the ID, handle null/undefined
        categoryName: product.categoryId ? product.categoryId.name : 'N/A', // Assuming categoryId is populated
      }));
      setProducts(productsWithCategoryNames);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.response?.data?.message || 'Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setShowFormModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowFormModal(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await merchantApi.deleteProduct(id);
        fetchProducts();
      } catch (err: any) {
        console.error('Error deleting product:', err);
        setError(err.response?.data?.message || 'Failed to delete product.');
      }
    }
  };

  const handleFormSuccess = () => {
    setShowFormModal(false);
    fetchProducts();
  };

  const handleFormCancel = () => {
    setShowFormModal(false);
  };

  if (loading) {
    return <div className="text-center py-4">Carregando produtos...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Erro: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestão de Produtos</h1>
      <button
        onClick={handleAddProduct}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mb-4"
      >
        Adicionar Novo Produto
      </button>

      {showFormModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">{editingProduct ? 'Editar Produto' : 'Adicionar Produto'}</h2>
            <ProductForm
              initialData={editingProduct}
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
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Categoria</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Tipo</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Preço (R$)</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-4 px-4 text-center text-gray-500">Nenhum produto cadastrado.</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} className="border-b border-gray-200 last:border-b-0">
                  <td className="py-3 px-4 text-sm text-gray-800">{product.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{product.description || '-'}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{product.categoryName}</td> {/* Display categoryName */}
                  <td className="py-3 px-4 text-sm text-gray-800 capitalize">{product.type}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">R$ {product.priceBRL.toFixed(2)}</td>
                  <td className="py-3 px-4 text-sm">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="text-blue-600 hover:text-blue-900 mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
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

export default Products;