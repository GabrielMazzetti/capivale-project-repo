import React, { useState, useEffect } from 'react'; // Ensure React is imported
import { merchantApi, adminApi } from '../services/api';

interface Category {
  _id: string;
  name: string;
}

interface ProductFormProps {
  initialData?: { _id?: string; name: string; description?: string; priceBRL: number; categoryId: string; type: 'product' | 'service' };
  onSuccess: () => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    priceBRL: initialData?.priceBRL || 0,
    categoryId: initialData?.categoryId || '',
    type: initialData?.type || 'product',
  });
  const [capivaleRate, setCapivaleRate] = useState<number | null>(null);
  const [loadingRate, setLoadingRate] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchRateAndCategories = async () => {
      try {
        setLoadingRate(true);
        const rateResponse = await merchantApi.getCapivaleBRLRate();
        setCapivaleRate(rateResponse.data.rate);
      } catch (err) {
        console.error('Error fetching Capivale-BRL rate:', err);
        setError('Failed to load Capivale conversion rate.');
      } finally {
        setLoadingRate(false);
      }

      try {
        setLoadingCategories(true);
        const categoriesResponse = await adminApi.getCategories();
        setCategories(categoriesResponse.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories.');
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchRateAndCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'priceBRL' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (initialData?._id) {
        await merchantApi.updateProduct(initialData._id, formData);
      } else {
        await merchantApi.createProduct(formData);
      }
      onSuccess();
    } catch (err: any) {
      console.error('Error saving product:', err);
      setError(err.response?.data?.message || 'Failed to save product.');
    }
  };

  const capivaleValue = capivaleRate !== null ? (formData.priceBRL / capivaleRate).toFixed(2) : 'Calculando...';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Produto</label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
        <textarea
          name="description"
          id="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        ></textarea>
      </div>
      <div>
        <label htmlFor="priceBRL" className="block text-sm font-medium text-gray-700">Valor em R$</label>
        <input
          type="number"
          name="priceBRL"
          id="priceBRL"
          value={formData.priceBRL}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          step="0.01"
          required
        />
      </div>
      {/* Category Dropdown */}
      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Categoria</label>
        <select
          name="categoryId"
          id="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          required
          disabled={loadingCategories}
        >
          <option value="">{loadingCategories ? 'Carregando categorias...' : 'Selecione uma categoria'}</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      {/* Type Field */}
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Tipo</label>
        <select
          name="type"
          id="type"
          value={formData.type}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          required
        >
          <option value="product">Produto</option>
          <option value="service">Serviço</option>
        </select>
      </div>
      <div>
        <label htmlFor="capivaleValue" className="block text-sm font-medium text-gray-700">Valor de Referência em Capivale</label>
        <input
          type="text"
          id="capivaleValue"
          value={loadingRate ? 'Carregando...' : capivaleValue}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 sm:text-sm cursor-not-allowed"
          disabled
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {initialData?._id ? 'Atualizar Produto' : 'Adicionar Produto'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;