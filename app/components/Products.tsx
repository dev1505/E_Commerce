'use client';
import { useEffect, useState } from 'react';
import CommonApiCall from '../commonfunctions/CommonApiCall';
import { beauty, category, electronics, fashion, home } from '../indexType';
import Categories from './Categories';
import ProductCard from './products/ProductCard';

type Product = fashion | electronics | home | beauty;

export type ProductData = {
  products: Product[];
  page: number;
  totalPages: number;
  currentCategory: category;
  categories: category[];
}

const Products = () => {
  const [productData, setProductData] = useState<ProductData>({
    products: [],
    page: 1,
    totalPages: 1,
    categories: [],
    currentCategory: { categoryName: "All", categoryShortName: "All", _id: "All", productIds: [] }
  });

  useEffect(() => {
    async function fetchCategories() {
      const res = await CommonApiCall('/api/category', { method: 'GET' });
      if (res?.data) {
        setProductData(prev => ({
          ...prev,
          categories: [{ categoryName: "All", categoryShortName: "All", _id: "All", productIds: [] }, ...res.data]
        }));
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchAndSetProducts(1, productData.currentCategory._id);
  }, [productData.currentCategory]);

  const fetchAndSetProducts = async (pageNum: number = 1, categoryId: string = "All") => {
    try {
      const response = await CommonApiCall('/api/products', {
        method: 'POST',
        data: {
          page: pageNum,
          limit: 8,
          categoryId: categoryId,
        },
      });

      if (response && response.data) {
        setProductData(prev => ({
          ...prev,
          totalPages: response.totalPages || 1,
          products: pageNum === 1 ? response.data : [...prev.products, ...response.data],
          page: pageNum
        }));
      } else {
        console.error('Failed to fetch products or response malformed');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const handleLoadMore = () => {
    const nextPage = productData.page + 1;
    if (nextPage <= productData.totalPages) {
      fetchAndSetProducts(nextPage, productData.currentCategory._id);
    }
  };

  return (
    <div className="px-4 py-8 bg-zinc-100 flex flex-col justify-center items-center self-center">
      <Categories categoryData={productData} setCategoryData={setProductData} />
      <h1 className="text-3xl font-bold text-center mb-8">Our Products</h1>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-fit gap-8">
        {productData.products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* Load More */}
      {productData.page < productData.totalPages && (
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
