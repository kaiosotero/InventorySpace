
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'gerente',
  STOCKIST = 'estoquista',
}

export enum MovementType {
  IN = 'entrada',
  OUT = 'saida',
}

export interface User {
  id: string;
  nome: string;
  email: string;
  perfil: UserRole;
}

export interface Product {
  id: string;
  nome: string;
  descricao?: string;
  quantidade: number;
  data_criacao: string;
}

export interface Movement {
  id: string;
  produto_id: string;
  usuario_id: string;
  tipo: MovementType;
  quantidade: number;
  data_movimentacao: string;
}

export type Page = 'dashboard' | 'products' | 'movements' | 'reports';
