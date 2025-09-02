'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './products/ProductCard';
import { fashion, electronics, home, beauty } from '../indexType';

type Product = fashion | electronics | home | beauty;

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAndSetProducts = async (pageNum: number) => {
    try {
      const res = await axios.post('/api/products/', {
        page: pageNum,
        limit: 8,
        category: "All",
      });

      setProducts((prev) => (pageNum === 1 ? res.data.data : [...prev, ...res.data.data]));
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch products:', error);
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
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
