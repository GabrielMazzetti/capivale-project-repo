import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface FAQ {
  _id: string;
  question: string;
  answer: string;
}

const FAQSection: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await api.get('/faqs');
        setFaqs(response.data);
      } catch (err) {
        setError('Failed to fetch FAQs.');
        console.error(err);
      }
    };

    fetchFaqs();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">FAQ</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Perguntas Frequentes
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Encontre respostas para as perguntas mais comuns sobre nossa plataforma.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {faqs.map((faq) => (
              <div key={faq._id} className="relative">
                <dt>
                  <p className="text-lg leading-6 font-medium text-gray-900">{faq.question}</p>
                </dt>
                <dd className="mt-2 text-base text-gray-500">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;