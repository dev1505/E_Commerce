'use client';
import { useEffect, useState } from 'react';
import CommonApiCall from '../commonfunctions/CommonApiCall';
import { beauty, electronics, fashion, home } from '../indexType';
import ProductCard from './products/ProductCard';

type Product = fashion | electronics | home | beauty;

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  type Product = fashion | electronics | home | beauty;

  const fetchAndSetProducts = async (
    pageNum: number,
  ) => {
    const response = await CommonApiCall('/api/products', {
      method: 'POST',
      data: {
        page: pageNum,
        limit: 8,
        category: 'All',
      },
    });

    if (response && response.data) {
      setProducts((prev) =>
        pageNum === 1 ? response.data : [...prev, ...response.data]
      );
      setTotalPages(response.totalPages || 1);
    } else {
      console.error('Failed to fetch products or response malformed');
    }
  };

  useEffect(() => {
    fetchAndSetProducts(1);
    setPage(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    if (nextPage <= totalPages) {
      setPage(nextPage);
      fetchAndSetProducts(nextPage);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Our Products</h1>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* Load More */}
      {page < totalPages && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            More
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;
