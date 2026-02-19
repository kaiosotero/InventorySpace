
import { createClient } from '@supabase/supabase-js';
import { Product, Movement } from '../types';

// IMPORTANT: Replace with your actual Supabase URL and Anon Key
const supabaseUrl = 'https://ktnhufoxkrbawdxntoog.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0bmh1Zm94a3JiYXdkeG50b29nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4OTc0OTUsImV4cCI6MjA4NjQ3MzQ5NX0.a0jHS58UXpQZOkaAbMKTKXsG-cm_q5bX1Kyi9jD6ybQ';

// Define a type for your database schema
export type Database = {
  public: {
    Tables: {
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'data_criacao'>;
        Update: Partial<Omit<Product, 'id' | 'data_criacao'>>;
      };
      movements: {
        Row: Movement;
        Insert: Omit<Movement, 'id' | 'data_movimentacao'>;
        Update: never;
      };
    };
    Functions: {
        handle_movement: {
            Args: {
                produto_id_in: string;
                tipo_in: string;
                quantidade_in: number;
                usuario_id_in: string;
            };
            Returns: void;
        };
    };
  };
};


export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
