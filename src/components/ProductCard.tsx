import { useState } from 'react';
import { HeartIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { Product } from '@/types/product';
import { useProductStore } from '@/store/useProductStore';
import Link from 'next/link';
import { EditProductForm } from './EditProductForm';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { toggleLike, removeProduct, updateProduct } = useProductStore();
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = (data: any) => {
    updateProduct(product.id, data);
    setIsEditing(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden relative group max-w-[350px] mx-auto w-full">
        <Link href={`/products/${product.id}`} className="block">
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={product.image}
              alt={product.title}
              className="object-contain w-full h-48"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2 line-clamp-2">{product.title}</h3>
            <p className="text-gray-600 line-clamp-3">{product.description}</p>
            <p className="text-lg font-bold mt-2">${product.price}</p>
          </div>
        </Link>
        
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsEditing(true);
            }}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
          >
            <PencilIcon className="w-6 h-6 text-gray-600" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleLike(product.id);
            }}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
          >
            {product.isLiked ? (
              <HeartIconSolid className="w-6 h-6 text-red-500" />
            ) : (
              <HeartIcon className="w-6 h-6 text-gray-600" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              removeProduct(product.id);
            }}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
          >
            <TrashIcon className="w-6 h-6 text-gray-600" />
          </button>
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
}; 