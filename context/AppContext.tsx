
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product, Movement, User, UserRole, MovementType } from '../types';
import { supabase } from '../lib/supabaseClient';

interface AppContextType {
  currentUser: User;
  products: Product[];
  movements: Movement[];
  loading: boolean;
  addProduct: (product: Omit<Product, 'id' | 'data_criacao'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  addMovement: (movement: Omit<Movement, 'id' | 'data_movimentacao' | 'usuario_id'>) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const mockUser: User = {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', // Replace with a real user UUID from your Supabase auth.users table if needed
    nome: 'Admin User',
    email: 'admin@inventoryspace.com',
    perfil: UserRole.ADMIN,
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .order('nome', { ascending: true });
        if (productsError) throw productsError;
        setProducts(productsData || []);

        const { data: movementsData, error: movementsError } = await supabase
          .from('movements')
          .select('*')
          .order('data_movimentacao', { ascending: false });
        if (movementsError) throw movementsError;
        setMovements(movementsData || []);

      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();

    const productChannel = supabase.channel('public:products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
        console.log('Product change received!', payload);
        fetchInitialData(); // Refetch all data to ensure consistency
      })
      .subscribe();

    const movementChannel = supabase.channel('public:movements')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'movements' }, (payload) => {
        console.log('Movement change received!', payload);
        fetchInitialData(); // Refetch all data to ensure consistency
      })
      .subscribe();
      
    return () => {
        supabase.removeChannel(productChannel);
        supabase.removeChannel(movementChannel);
    };
  }, []);

  const addProduct = async (productData: Omit<Product, 'id' | 'data_criacao'>) => {
    const { error } = await supabase.from('products').insert(productData);
    if (error) console.error("Error adding product:", error);
  };

  const updateProduct = async (updatedProduct: Omit<Product, 'data_criacao'>) => {
    const { error } = await supabase
      .from('products')
      .update({ nome: updatedProduct.nome, descricao: updatedProduct.descricao })
      .eq('id', updatedProduct.id);
    if (error) console.error("Error updating product:", error);
  };
  
  const deleteProduct = async (productId: string) => {
     if (mockUser.perfil !== UserRole.ADMIN) {
        alert("Apenas administradores podem excluir produtos.");
        return;
     }
     const { error } = await supabase.from('products').delete().eq('id', productId);
     if (error) console.error("Error deleting product:", error);
  };

  const addMovement = async (movementData: Omit<Movement, 'id' | 'data_movimentacao' | 'usuario_id'>): Promise<boolean> => {
    try {
        const { error } = await supabase.rpc('handle_movement', {
            produto_id_in: movementData.produto_id,
            tipo_in: movementData.tipo,
            quantidade_in: movementData.quantidade,
            usuario_id_in: mockUser.id,
        });

        if (error) {
            console.error('Error adding movement:', error);
            const isRlsError = error.message.includes('violates row-level security policy');
            const userFriendlyMessage = isRlsError
              ? "Erro de Permissão no Banco de Dados: A operação falhou. Isso geralmente ocorre porque a função (handle_movement) precisa de permissões elevadas para modificar o estoque. Peça ao administrador do banco de dados para definir a função como 'SECURITY DEFINER' no Supabase."
              : `Erro ao registrar movimentação: ${error.message}`;
            alert(userFriendlyMessage);
            return false;
        }
        return true;

    } catch (error: any) {
        console.error('An unexpected error occurred:', error);
        alert('Ocorreu um erro inesperado.');
        return false;
    }
  };

  const value = {
    currentUser: mockUser,
    products,
    movements,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    addMovement,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
