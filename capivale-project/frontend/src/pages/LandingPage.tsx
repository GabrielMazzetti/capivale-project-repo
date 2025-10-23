import React from 'react';
import { Link } from 'react-router-dom';
import { BlockchainTransactions } from '../components/BlockchainTransactions';
import FAQSection from '../components/FAQSection'; // Import FAQSection

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white font-sans">
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Capivale</h1>
        <nav className="space-x-4">
          <Link to="/login" className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition duration-300">Entrar</Link>
          <Link to="/register" className="border-2 border-white px-6 py-2 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition duration-300">Registrar-se</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <h2 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
          Capivale: A Moeda Digital de Juiz de Fora
        </h2>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Fomentando a economia solidária e promovendo a saúde na sua cidade.
        </p>
        <div className="space-x-4">
          <Link to="/login" className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-bold hover:bg-gray-100 transition duration-300">Começar Agora</Link>
          <Link to="/register" className="border-2 border-white px-8 py-3 rounded-full text-lg font-bold hover:bg-white hover:text-blue-600 transition duration-300">Saiba Mais</Link>
        </div>
      </section>

      {/* What is Capivale Section */}
      <section className="bg-white text-gray-800 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-8">O Que é o Capivale?</h3>
          <p className="text-lg leading-relaxed mb-6">
            Capivale é a moeda digital exclusiva de Juiz de Fora, criada para fortalecer o comércio local e incentivar hábitos saudáveis. Ao participar de ações de saúde, você ganha Capivales que podem ser usados para comprar produtos e serviços em estabelecimentos parceiros na cidade.
          </p>
          <p className="text-lg leading-relaxed">
            É uma forma inovadora de unir bem-estar, economia e comunidade, garantindo que o valor gerado circule dentro da nossa própria cidade.
          </p>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-gray-100 text-gray-800 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-8">Como Funciona?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="text-5xl mb-4">💪</div>
              <h4 className="text-2xl font-semibold mb-2">Para Cidadãos</h4>
              <p className="text-md">Participe de programas de saúde, consultas e atividades físicas para ganhar Capivales. Use-os para comprar em mercados, farmácias e outros comércios locais.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="text-5xl mb-4">🏪</div>
              <h4 className="text-2xl font-semibold mb-2">Para Comerciantes</h4>
              <p className="text-md">Cadastre seu negócio e aceite Capivales como forma de pagamento. Atraia novos clientes e faça parte de uma rede de economia solidária que valoriza o local.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white text-gray-800 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-8">Benefícios para Todos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-100 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-2">Saúde e Bem-Estar</h4>
              <p className="text-md">Incentivo direto à participação em atividades que promovem uma vida mais saudável.</p>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-2">Economia Local Forte</h4>
              <p className="text-md">O dinheiro circula dentro da cidade, fortalecendo negócios e gerando empregos locais.</p>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-2">Comunidade Conectada</h4>
              <p className="text-md">Cria uma rede de apoio e colaboração entre cidadãos e comerciantes de Juiz de Fora.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Blockchain Transactions Section */}
      <BlockchainTransactions />

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8 px-4 text-center">
        <p>&copy; {new Date().getFullYear()} Capivale. Todos os direitos reservados.</p>
        <p className="text-sm mt-2">Desenvolvido com ❤️ para Juiz de Fora.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
