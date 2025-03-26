import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Product } from '@/types/product';

const productSchema = z.object({
  title: z.string().min(3, 'Название должно содержать минимум 3 символа'),
  description: z.string().min(10, 'Описание должно содержать минимум 10 символов'),
  price: z.number().min(0, 'Цена должна быть положительным числом'),
  image: z.string().url('Введите корректный URL изображения'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface EditProductFormProps {
  product: Product;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
}

export const EditProductForm = ({ product, onSubmit, onCancel }: EditProductFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: product.title,
      description: product.description,
      price: product.price,
      image: product.image,
    },
  });

  return (
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

      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          Сохранить
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}; 