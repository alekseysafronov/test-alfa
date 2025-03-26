import { create } from 'zustand';
import { Product } from '@/types/product';
import { api } from '@/services/api';

interface ProductStore {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'isLiked'>) => void;
  removeProduct: (id: string) => void;
  toggleLike: (id: string) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
}

const STORAGE_KEY = 'product-store';
const LOCAL_PRODUCTS_KEY = 'local-products';

const loadLocalProducts = (): Product[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const serializedState = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    return serializedState ? JSON.parse(serializedState) : [];
  } catch (error) {
    console.error('Error loading local products:', error);
    return [];
  }
};

const saveLocalProducts = (products: Product[]) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Error saving local products:', error);
  }
};

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const apiProducts = await api.getProducts();
      const localProducts = loadLocalProducts();
      
      // Объединяем API продукты с локальными, сохраняя состояние лайков
      const mergedProducts = apiProducts.map(apiProduct => {
        const localProduct = localProducts.find(p => p.id === apiProduct.id);
        return localProduct ? { ...apiProduct, isLiked: localProduct.isLiked } : apiProduct;
      });

      // Добавляем локальные продукты, которых нет в API
      const newLocalProducts = localProducts.filter(
        localProduct => !apiProducts.some(apiProduct => apiProduct.id === localProduct.id)
      );

      const allProducts = [...mergedProducts, ...newLocalProducts];
      set({ products: allProducts, isLoading: false });
    } catch (error) {
      set({ error: 'Ошибка при загрузке продуктов', isLoading: false });
    }
  },

  addProduct: (product) =>
    set((state) => {
      const newProduct = {
        ...product,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        isLiked: false,
      };
      
      const newState = {
        products: [...state.products, newProduct],
      };
      
      // Сохраняем новый продукт в локальном хранилище
      const localProducts = loadLocalProducts();
      saveLocalProducts([...localProducts, newProduct]);
      
      return newState;
    }),

  removeProduct: (id) =>
    set((state) => {
      const newState = {
        products: state.products.filter((product) => product.id !== id),
      };
      
      // Удаляем продукт из локального хранилища
      const localProducts = loadLocalProducts();
      saveLocalProducts(localProducts.filter(p => p.id !== id));
      
      return newState;
    }),

  toggleLike: (id) =>
    set((state) => {
      const newState = {
        products: state.products.map((product) =>
          product.id === id ? { ...product, isLiked: !product.isLiked } : product
        ),
      };
      
      // Обновляем состояние лайка в локальном хранилище
      const localProducts = loadLocalProducts();
      saveLocalProducts(
        localProducts.map(product =>
          product.id === id ? { ...product, isLiked: !product.isLiked } : product
        )
      );
      
      return newState;
    }),

  updateProduct: (id, updatedProduct) =>
    set((state) => {
      const newState = {
        products: state.products.map((product) =>
          product.id === id ? { ...product, ...updatedProduct } : product
        ),
      };
      
      // Обновляем продукт в локальном хранилище
      const localProducts = loadLocalProducts();
      saveLocalProducts(
        localProducts.map(product =>
          product.id === id ? { ...product, ...updatedProduct } : product
        )
      );
      
      return newState;
    }),
})); 