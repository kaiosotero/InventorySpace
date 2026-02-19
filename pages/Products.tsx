
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Modal from '../components/Modal';
import Button from '../components/Button';
import { PlusIcon, PencilIcon, TrashIcon } from '../components/icons/Icon';
import { Product } from '../types';
import Spinner from '../components/Spinner';

const Products: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, currentUser, loading } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ nome: '', descricao: '', quantidade: 0 });

  const openModalForNew = () => {
    setEditingProduct(null);
    setFormData({ nome: '', descricao: '', quantidade: 0 });
    setIsModalOpen(true);
  };

  const openModalForEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({ 
        nome: product.nome, 
        descricao: product.descricao || '', 
        quantidade: product.quantidade 
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'quantidade' ? parseInt(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
        // Do not update quantity from this form
        const { quantidade, ...rest } = formData;
        await updateProduct({ ...editingProduct, ...rest });
    } else {
        await addProduct(formData);
    }
    closeModal();
  };
  
  const handleDelete = async (productId: string) => {
    if (confirm('Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.')) {
      await deleteProduct(productId);
    }
  }

  if (loading) {
    return (
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md relative h-96 flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-neutral-800">Lista de Produtos</h2>
      </div>

      {/* Card View for Mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {products.map((product) => (
          <div key={product.id} className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-neutral-800 truncate">{product.nome}</h3>
              <p className="text-sm text-neutral-600 mt-1 h-10 overflow-hidden">{product.descricao}</p>
            </div>
            <div className="flex justify-between items-center mt-4 pt-2 border-t border-neutral-200">
              <div className="text-sm">
                <span className="text-neutral-500">Estoque: </span>
                <span className="font-bold text-lg text-primary">{product.quantidade}</span>
              </div>
              <div className="flex items-center space-x-3">
                <button onClick={() => openModalForEdit(product)} className="text-primary hover:text-primary-dark"><PencilIcon /></button>
                {currentUser.perfil === 'admin' && (
                  <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800"><TrashIcon /></button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>


      {/* Table View for Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.nome}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">{product.descricao}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-bold">{product.quantidade}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button onClick={() => openModalForEdit(product)} className="text-primary hover:text-primary-dark"><PencilIcon /></button>
                  {currentUser.perfil === 'admin' && (
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800"><TrashIcon /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={openModalForNew}
        className="group fixed bottom-8 right-8 bg-primary text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-primary-hover transition-all duration-300 ease-in-out transform hover:scale-105 z-20"
        aria-label="Adicionar Novo Produto"
      >
        <PlusIcon className="w-8 h-8" />
        <span className="absolute right-full mr-4 px-3 py-1.5 bg-neutral-800 text-white text-sm rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Adicionar Produto
        </span>
      </button>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingProduct ? 'Editar Produto' : 'Adicionar Produto'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome do Produto</label>
            <input type="text" name="nome" id="nome" value={formData.nome} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
          </div>
          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea name="descricao" id="descricao" value={formData.descricao} onChange={handleInputChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
          </div>
          <div>
            <label htmlFor="quantidade" className="block text-sm font-medium text-gray-700">{editingProduct ? 'Quantidade em Estoque' : 'Quantidade Inicial'}</label>
            <input 
              type="number" 
              name="quantidade" 
              id="quantidade" 
              value={formData.quantidade} 
              onChange={handleInputChange} 
              required 
              min="0" 
              disabled={!!editingProduct}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-neutral-100 disabled:cursor-not-allowed" 
            />
            {editingProduct && <p className="text-xs text-neutral-500 mt-1">A quantidade só pode ser alterada através da página de movimentações.</p>}
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="light" onClick={closeModal}>Cancelar</Button>
            <Button type="submit">{editingProduct ? 'Salvar Alterações' : 'Adicionar Produto'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Products;
