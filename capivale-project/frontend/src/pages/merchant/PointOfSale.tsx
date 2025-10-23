import React, { useState, useEffect } from 'react';
import { merchantApi } from '../../services/api';
import { Product } from './Products'; // Re-using the Product interface from Products.tsx

interface CartItem extends Product {
  quantity: number;
}

const PointOfSale: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'external_cash' | 'external_pix' | 'external_card' | ''>('');
  const [saleSuccessMessage, setSaleSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await merchantApi.getProducts();
        setProducts(response.data);
      } catch (err: any) {
        console.error('Error fetching products:', err);
        setError(err.response?.data?.message || 'Failed to fetch products.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.priceBRL * item.quantity, 0);
  };

  const handleRegisterSale = () => {
    if (cart.length === 0) {
      alert('O carrinho está vazio. Adicione produtos para registrar uma venda.');
      return;
    }
    setShowPaymentModal(true);
    setSaleSuccessMessage(null); // Clear previous success message
  };

  const handleConfirmSale = async () => {
    if (!paymentMethod) {
      alert('Por favor, selecione um método de pagamento.');
      return;
    }

    try {
      const saleItems = cart.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
      }));

      await merchantApi.registerSale({
        items: saleItems,
        paymentMethod: paymentMethod as 'external_cash' | 'external_pix' | 'external_card',
      });

      setSaleSuccessMessage('Venda registrada com sucesso!');
      setCart([]); // Clear cart after successful sale
      setPaymentMethod('');
      setShowPaymentModal(false);
    } catch (err: any) {
      console.error('Error registering sale:', err);
      setError(err.response?.data?.message || 'Falha ao registrar a venda.');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Carregando produtos...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Erro: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 flex flex-col lg:flex-row gap-4">
      {/* Product Catalog */}
      <div className="lg:w-2/3 bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Catálogo de Produtos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product._id} className="border p-4 rounded-lg shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-gray-600 text-sm">{product.description}</p>
                <p className="text-blue-600 font-bold mt-2">R$ {product.priceBRL.toFixed(2)}</p>
              </div>
              <button
                onClick={() => addToCart(product)}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Adicionar ao Carrinho
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Shopping Cart */}
      <div className="lg:w-1/3 bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Carrinho de Compras</h1>
        {cart.length === 0 ? (
          <p className="text-gray-500">Carrinho vazio.</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item._id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600">R$ {item.priceBRL.toFixed(2)} x {item.quantity}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateCartQuantity(item._id, parseInt(e.target.value))}
                    className="w-16 p-1 border rounded"
                  />
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
            <div className="text-xl font-bold mt-4">Total: R$ {calculateTotal().toFixed(2)}</div>
            <button
              onClick={handleRegisterSale}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mt-4"
            >
              Registrar Venda
            </button>
          </div>
        )}

        {saleSuccessMessage && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
            {saleSuccessMessage}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-4">Confirmar Venda</h2>
            <p className="text-lg mb-4">Total a pagar: <span className="font-bold">R$ {calculateTotal().toFixed(2)}</span></p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Método de Pagamento (Recebido Externamente)</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as 'external_cash' | 'external_pix' | 'external_card')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              >
                <option value="">Selecione...</option>
                <option value="external_cash">Dinheiro</option>
                <option value="external_pix">PIX</option>
                <option value="external_card">Cartão</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmSale}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Confirmar Venda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PointOfSale;
