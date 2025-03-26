import { Product } from '@/types/product';

const API_URL = 'https://fakestoreapi.com';

export const api = {
  async getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_URL}/products`);
    const data = await response.json();
    
    return data.map((item: any) => ({
      id: item.id.toString(),
      title: item.title,
      description: item.description,
      price: item.price,
      image: item.image,
      isLiked: false,
      createdAt: new Date().toISOString(),
    }));
  },

  async getProduct(id: string): Promise<Product> {
    const response = await fetch(`${API_URL}/products/${id}`);
    const data = await response.json();
    
    return {
      id: data.id.toString(),
      title: data.title,
      description: data.description,
      price: data.price,
      image: data.image,
      isLiked: false,
      createdAt: new Date().toISOString(),
    };
  },
}; 