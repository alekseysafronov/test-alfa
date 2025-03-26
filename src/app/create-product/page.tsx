'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProductStore } from '@/store/useProductStore';
import { useRouter } from 'next/navigation';

const productSchema = z.object({
  title: z.string().min(3, 'Название должно содержать минимум 3 символа'),
  description: z.string().min(10, 'Описание должно содержать минимум 10 символов'),
  price: z.number().min(0, 'Цена должна быть положительным числом'),
  image: z.string().url('Введите корректный URL изображения'),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function CreateProductPage() {
  const router = useRouter();
  const { addProduct } = useProductStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = (data: ProductFormData) => {
    addProduct(data);
    router.push('/products');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Создание продукта</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Название</label>
          <input
            {...register('title')}
            className="w-full px-4 py-2 border rounded-lg"
            type="text"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Описание</label>
          <textarea
            {...register('description')}
            className="w-full px-4 py-2 border rounded-lg"
            rows={4}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Цена</label>
          <input
            {...register('price', { valueAsNumber: true })}
            className="w-full px-4 py-2 border rounded-lg"
            type="number"
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">URL изображения</label>
          <input
            {...register('image')}
            className="w-full px-4 py-2 border rounded-lg"
            type="url"
          />
          {errors.image && (
            <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          Создать продукт
        </button>
      </form>
    </div>
  );
} 