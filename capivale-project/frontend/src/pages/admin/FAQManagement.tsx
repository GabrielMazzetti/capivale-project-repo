import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import api from '../../services/api';

interface FAQ {
  _id: string;
  question: string;
  answer: string;
}

const FAQManagement: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ question: string; answer: string }>({ question: '', answer: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await api.get('/faqs');
      setFaqs(response.data);
    } catch (err) {
      setError('Failed to fetch FAQs.');
      console.error(err);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/faqs/${editingId}`, formData);
      } else {
        await api.post('/faqs', formData);
      }
      setFormData({ question: '', answer: '' });
      setEditingId(null);
      fetchFaqs();
    } catch (err) {
      setError('Failed to save FAQ.');
      console.error(err);
    }
  };

  const handleEdit = (faq: FAQ) => {
    setFormData({ question: faq.question, answer: faq.answer });
    setEditingId(faq._id);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/faqs/${id}`);
      fetchFaqs();
    } catch (err) {
      setError('Failed to delete FAQ.');
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciamento de FAQ</h1>
      {error && <div className="text-red-500">{error}</div>}
      <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded shadow-sm">
        <h2 className="text-xl mb-2">{editingId ? 'Editar FAQ' : 'Adicionar FAQ'}</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Pergunta</label>
          <input
            type="text"
            name="question"
            value={formData.question}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Resposta</label>
          <textarea
            name="answer"
            value={formData.answer}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          {editingId ? 'Atualizar' : 'Adicionar'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => { setEditingId(null); setFormData({ question: '', answer: '' }); }}
            className="ml-2 text-gray-500"
          >
            Cancelar
          </button>
        )}
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">FAQs Existentes</h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq._id} className="p-4 border rounded shadow-sm">
              <h3 className="font-semibold">{faq.question}</h3>
              <p>{faq.answer}</p>
              <div className="mt-2 space-x-2">
                <button onClick={() => handleEdit(faq)} className="text-sm text-blue-500">Editar</button>
                <button onClick={() => handleDelete(faq._id)} className="text-sm text-red-500">Excluir</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQManagement;