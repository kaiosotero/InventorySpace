
import React from 'react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/Card';
import { ProductsIcon, MovementsIcon } from '../components/icons/Icon';
import { MovementType } from '../types';
import Spinner from '../components/Spinner';

const Dashboard: React.FC = () => {
  const { products, movements, loading } = useAppContext();

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Spinner /></div>;
  }

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, product) => sum + product.quantidade, 0);

  const recentMovements = movements.slice(0, 5);
  const getProductName = (productId: string) => {
    return products.find(p => p.id === productId)?.nome || 'Produto Desconhecido';
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card
          title="Produtos Cadastrados"
          value={totalProducts}
          icon={<ProductsIcon className="w-8 h-8 text-white" />}
          color="bg-blue-500"
        />
        <Card
          title="Itens em Estoque"
          value={totalStock}
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>}
          color="bg-green-500"
        />
        <Card
          title="Movimentações (Entrada)"
          value={movements.filter(m => m.tipo === MovementType.IN).length}
          icon={<MovementsIcon className="w-8 h-8 text-white" />}
          color="bg-purple-500"
        />
         <Card
          title="Movimentações (Saída)"
          value={movements.filter(m => m.tipo === MovementType.OUT).length}
          icon={<MovementsIcon className="w-8 h-8 text-white transform scale-x-[-1]" />}
          color="bg-orange-500"
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-neutral-800 mb-4">Últimas Movimentações</h2>
        {recentMovements.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentMovements.map((movement) => (
                  <tr key={movement.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{getProductName(movement.produto_id)}</div>
                      <div className="text-xs text-gray-500">{new Date(movement.data_movimentacao).toLocaleString('pt-BR')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${movement.tipo === MovementType.IN ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {movement.tipo === MovementType.IN ? 'Entrada' : 'Saída'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{movement.quantidade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-neutral-500 text-center py-4">Nenhuma movimentação registrada ainda.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
