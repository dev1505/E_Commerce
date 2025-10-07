import { beauty, electronics, fashion, home } from '@/app/indexType';
import Link from 'next/link';

type Product = fashion | electronics | home | beauty;

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const imageSrc = product.image || '/product_alt_image.avif';
  return (
    <Link href={`/product/${product._id}`}>
      <div className="rounded-lg p-4 bg-white shadow-xl hover:scale-105 duration-100 flex flex-col justify-between h-full cursor-pointer">
        <div className="h-64 w-full overflow-hidden mb-4 flex items-center justify-center">
          <img
            src={imageSrc}
            alt={product.title}
            className="max-w-full max-h-full rounded object-contain"
          />
        </div>
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
