import React, { useState, useEffect } from 'react';
import { merchantApi } from '../../services/api';

interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPriceBRL: number;
}

interface Sale {
  _id: string;
  totalAmountBRL: number;
  paymentMethod: 'external_cash' | 'external_pix' | 'external_card';
  createdAt: string;
  items: SaleItem[];
}

const SalesHistory: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    paymentMethod: '',
  });

  useEffect(() => {
    fetchSales();
  }, [filters]);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await merchantApi.getSalesHistory(filters);
      setSales(response.data);
    } catch (err: any) {
      console.error('Error fetching sales history:', err);
      setError(err.response?.data?.message || 'Failed to fetch sales history.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div className="text-center py-4">Carregando histórico de vendas...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Erro: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Histórico de Vendas</h1>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-3">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Data Inicial</label>
            <input
              type="date"
              name="startDate"
              id="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Data Final</label>
            <input
              type="date"
              name="endDate"
              id="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            />
          </div>
          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">Método de Pagamento</label>
            <select
              name="paymentMethod"
              id="paymentMethod"
              value={filters.paymentMethod}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            >
              <option value="">Todos</option>
              <option value="external_cash">Dinheiro</option>
              <option value="external_pix">PIX</option>
              <option value="external_card">Cartão</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">ID da Venda</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Data</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Método de Pagamento</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Total (R$)</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Itens</th>
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-4 px-4 text-center text-gray-500">Nenhuma venda encontrada com os filtros aplicados.</td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr key={sale._id} className="border-b border-gray-200 last:border-b-0">
                  <td className="py-3 px-4 text-sm text-gray-800">{sale._id.substring(0, 8)}...</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{new Date(sale.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-sm text-gray-800 capitalize">{sale.paymentMethod.replace('external_', '')}</td>
                  <td className="py-3 px-4 text-sm text-gray-800 font-bold">R$ {sale.totalAmountBRL.toFixed(2)}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    <ul className="list-disc list-inside">
                      {sale.items.map((item, index) => (
                        <li key={index}>{item.productName} (x{item.quantity}) - R$ {item.unitPriceBRL.toFixed(2)}</li>
                      ))}
                    </ul>
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

export default SalesHistory;
