'use client';

import { useEffect, useState } from 'react';
import { useProductStore } from '@/store/useProductStore';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/services/api';
import { Product } from '@/types/product';
import { EditProductForm } from '@/components/EditProductForm';
import { PencilIcon } from '@heroicons/react/24/outline';

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { products, toggleLike, updateProduct } = useProductStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await api.getProduct(id as string);
        const existingProduct = products.find(p => p.id === id);
        setProduct({
          ...data,
          isLiked: existingProduct?.isLiked || false,
        });
      } catch (error) {
        setError('Ошибка при загрузке продукта');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, products]);

  const handleEdit = (data: any) => {
    if (product) {
      updateProduct(product.id, data);
      setProduct({ ...product, ...data });
      setIsEditing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          <p className="text-xl mb-4">{error || 'Продукт не найден'}</p>
          <Link
            href="/products"
            className="text-blue-500 hover:text-blue-600"
          >
            Вернуться к списку продуктов
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-96 object-contain rounded-lg"
            />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-2xl font-bold mb-8">${product.price}</p>

          <div className="flex gap-4">
            <button
              onClick={() => toggleLike(product.id)}
              className={`px-4 py-2 rounded-lg ${
                product.isLiked
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {product.isLiked ? 'Убрать из избранного' : 'Добавить в избранное'}
            </button>

            <Link
              href="/products"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Вернуться к списку продуктов
            </Link>

            <button
              onClick={() => setIsEditing(true)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center gap-2"
            >
              <PencilIcon className="w-5 h-5" />
              Редактировать
            </button>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Редактировать продукт</h2>
            <EditProductForm
              product={product}
              onSubmit={handleEdit}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        </div>
      )}
    </>
  );
} 