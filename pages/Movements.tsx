
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { MovementType } from '../types';
import Button from '../components/Button';
import Spinner from '../components/Spinner';

const Movements: React.FC = () => {
  const { products, movements, addMovement, loading } = useAppContext();
  const [formData, setFormData] = useState({
    produto_id: '',
    tipo: MovementType.IN,
    quantidade: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'quantidade' ? parseInt(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.produto_id || formData.quantidade <= 0) {
        alert("Por favor, selecione um produto e insira uma quantidade válida.");
        return;
    }
    setIsSubmitting(true);
    const success = await addMovement(formData);
    if(success) {
        setFormData({ produto_id: '', tipo: MovementType.IN, quantidade: 1 });
    }
    setIsSubmitting(false);
  };

  const getProductName = (productId: string) => {
    return products.find(p => p.id === productId)?.nome || 'Produto Desconhecido';
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Spinner /></div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md self-start">
        <h2 className="text-xl font-bold text-neutral-800 mb-6">Registrar Movimentação</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Produto</label>
            <input type="hidden" name="produto_id" value={formData.produto_id} required />
            <div className="w-full h-48 overflow-y-auto border border-gray-300 bg-white rounded-md shadow-sm focus-within:ring-1 focus-within:ring-primary focus-within:border-primary">
                {products.length === 0 && <p className="p-3 text-center text-neutral-500">Nenhum produto cadastrado.</p>}
                {products.map(p => (
                    <div
                        key={p.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setFormData(prev => ({ ...prev, produto_id: p.id }))}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setFormData(prev => ({ ...prev, produto_id: p.id }))}}
                        className={`p-3 cursor-pointer border-b border-gray-200 last:border-b-0 outline-none ${
                            formData.produto_id === p.id
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Movimentação</label>
            <div className="flex space-x-2">
                <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, tipo: MovementType.IN }))}
                    className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
                        formData.tipo === MovementType.IN ? 'bg-primary text-white shadow' : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-800'
                    }`}
                >
                    Entrada
                </button>
                <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, tipo: MovementType.OUT }))}
                    className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
                        formData.tipo === MovementType.OUT ? 'bg-primary text-white shadow' : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-800'
                    }`}
                >
                    Saída
                </button>
            </div>
          </div>
          <div>
            <label htmlFor="quantidade" className="block text-sm font-medium text-gray-700">Quantidade</label>
            <input type="number" name="quantidade" id="quantidade" value={formData.quantidade} onChange={handleInputChange} required min="1" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? 'Registrando...' : 'Registrar'}</Button>
        </form>
      </div>

      <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-neutral-800 mb-6">Histórico de Movimentações</h2>
        <div className="overflow-y-auto max-h-[60vh]">
          <table className="min-w-full divide-y divide-gray-200">
             <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {movements.map((movement) => (
                <tr key={movement.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{getProductName(movement.produto_id)}</div>
                    <div className="text-xs text-gray-500">{new Date(movement.data_movimentacao).toLocaleString('pt-BR')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${movement.tipo === MovementType.IN ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{movement.tipo === MovementType.IN ? 'Entrada' : 'Saída'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{movement.quantidade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Movements;
