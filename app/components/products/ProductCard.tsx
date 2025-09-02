import React from 'react';
import Link from 'next/link';
import { fashion, electronics, home, beauty } from '@/app/indexType';

type Product = fashion | electronics | home | beauty;

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/product_alt_image.avif';
  };

  return (
    <Link href={`/product/${product._id}`}>
      <div className="border rounded-lg p-4 shadow-md flex flex-col justify-between h-full cursor-pointer">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-cover mb-4"
          onError={handleImageError}
        />
        <div>
          <h2 className="text-lg font-semibold">{product.title}</h2>
          <p className="text-gray-600 text-sm mt-1 truncate">{product.description}</p>
          <div className="flex justify-between items-center mt-4">
            <p className="text-lg font-bold">${product.price}</p>
            {product.oldPrice > product.price && (
              <p className="text-sm text-gray-500 line-through">${product.oldPrice}</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
