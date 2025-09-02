'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './products/ProductCard';
import { fashion, electronics, home, beauty } from '../indexType';

type Product = fashion | electronics | home | beauty;

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.post('/api/products', { productList: 20, skip: 0 });
        setProducts(res.data.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="px-2 pt-8">
      <h1 className="text-3xl font-bold text-center mb-8">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 px-4 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      <div className='m-4 rounded text-center text-2xl p-2 cursor-pointer hover:bg-black hover:text-white duration-150 border border-black'>
        More...
      </div>
    </div>
  );
};

export default Products;
