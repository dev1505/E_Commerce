'use client';
import CommonApiCall from '@/app/commonfunctions/CommonApiCall';
import { beauty, electronics, fashion, home } from '@/app/indexType';
import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

type Product = fashion | electronics | home | beauty;

interface SuggestedProductsProps {
  categoryId: string;
  currentProductId: string;
}

const SuggestedProducts: React.FC<SuggestedProductsProps> = ({ categoryId, currentProductId }) => {
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchSuggestedProducts = async () => {
      console.log(categoryId)
      const res = await CommonApiCall(`/api/products/suggestions`, {
        method: 'POST',
        data: { categoryId: categoryId },
      });

      if (res && res.data) {
        const filtered = res.data.filter(
          (product: Product) => product._id !== currentProductId
        );
        setSuggestedProducts(filtered);
      }
    };

    if (categoryId) {
      fetchSuggestedProducts();
    }
  }, [categoryId, currentProductId]);

  if (suggestedProducts.length === 0) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-center mb-8">Suggested Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {suggestedProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default SuggestedProducts;
