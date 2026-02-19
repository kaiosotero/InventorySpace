
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { MovementType } from '../types';
import Spinner from '../components/Spinner';

const Reports: React.FC = () => {
  const { movements, products, loading } = useAppContext();
  const [filterProduct, setFilterProduct] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');

  const getProductName = (productId: string) => {
    return products.find(p => p.id === productId)?.nome || 'Produto Desconhecido';
  };
  
  const filteredMovements = useMemo(() => {
    return movements.filter(m => {
        const productMatch = filterProduct ? m.produto_id === filterProduct : true;
        const typeMatch = filterType ? m.tipo === filterType : true;
        return productMatch && typeMatch;
    });
  }, [movements, filterProduct, filterType]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md h-96 flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-neutral-800 mb-4">Relatório de Movimentação</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 p-4 bg-neutral-50 rounded-md border">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Produto</label>
          <div className="w-full h-48 overflow-y-auto border border-gray-300 bg-white rounded-md shadow-sm focus-within:ring-1 focus-within:ring-primary focus-within:border-primary">
              <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setFilterProduct('')}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setFilterProduct('')}}
                  className={`p-3 cursor-pointer border-b border-gray-200 font-semibold ${
                      filterProduct === ''
                      ? 'bg-primary-light text-neutral-900 ring-2 ring-inset ring-primary'
                      : 'hover:bg-neutral-50 text-neutral-600'
                  }`}
              >
                  Todos os Produtos
              </div>
              {products.map(p => (
                  <div
                      key={p.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setFilterProduct(p.id)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setFilterProduct(p.id)}}
                      className={`p-3 cursor-pointer border-b border-gray-200 last:border-b-0 outline-none ${
                          filterProduct === p.id
                          ? 'bg-primary-light text-neutral-900 ring-2 ring-inset ring-primary'
                          : 'hover:bg-neutral-50'
                      }`}
                  >
                      <div className="flex justify-between items-start">
                          <span className="font-semibold text-neutral-800">{p.nome}</span>
                          <span className="text-xs text-neutral-600 bg-neutral-200 px-2 py-1 rounded-full">
                              Estoque: <span className="font-bold">{p.quantidade}</span>
                          </span>
                      </div>
                      <p className="text-sm text-neutral-500 mt-1 truncate">{p.descricao}</p>
                  </div>
              ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Tipo</label>
           <div className="flex flex-col space-y-2">
                <button
                    type="button"
                    onClick={() => setFilterType('')}
                    className={`w-full px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
                        filterType === '' ? 'bg-primary text-white shadow' : 'bg-white hover:bg-neutral-100 border text-neutral-800'
                    }`}
                >
                    Todos os Tipos
                </button>
                 <button
                    type="button"
                    onClick={() => setFilterType(MovementType.IN)}
                    className={`w-full px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
                        filterType === MovementType.IN ? 'bg-primary text-white shadow' : 'bg-white hover:bg-neutral-100 border text-neutral-800'
                    }`}
                >
                    Entrada
                </button>
                <button
                    type="button"
                    onClick={() => setFilterType(MovementType.OUT)}
                    className={`w-full px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
                        filterType === MovementType.OUT ? 'bg-primary text-white shadow' : 'bg-white hover:bg-neutral-100 border text-neutral-800'
                    }`}
                >
                    Saída
                </button>
            </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMovements.length > 0 ? filteredMovements.map((movement) => (
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
            )) : (
                <tr>
                    <td colSpan={3} className="text-center py-10 text-gray-500">Nenhum resultado encontrado para os filtros aplicados.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
