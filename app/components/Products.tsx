// app/products/page/[page]/page.tsx

import { category, fashion, electronics, home, beauty } from '@/app/indexType';
import CommonApiCall from '@/app/commonfunctions/CommonApiCall';
import Categories from '@/app/components/Categories';
import ProductCard from '@/app/components/products/ProductCard';
import Pagination from '@/app/components/Pagination';

type Product = fashion | electronics | home | beauty;

type PageProps = {
  params: { page: string };
  searchParams: { categoryId?: string };
};

const Products = async ({ params, searchParams }: PageProps) => {
  const currentPage = parseInt(params?.page) || 1;
  const categoryId = searchParams?.categoryId || 'All';
  const limit = 8;

  const defaultCategory: category = {
    categoryName: 'All',
    categoryShortName: 'All',
    _id: 'All',
    productIds: [],
  };

  // Fetch categories
  let categories: category[] = [defaultCategory];
  try {
    const categoryRes = await CommonApiCall('/api/category', { method: 'GET' });
    if (categoryRes?.data) {
      categories = [defaultCategory, ...categoryRes.data];
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }

  // Find the currentCategory object from categories list
  const currentCategory =
    categories.find((cat) => cat._id === categoryId) || defaultCategory;

  // Fetch products
  let productData: Product[] = [];
  let totalPages = 1;

  try {
    const productRes = await CommonApiCall(`/api/page/${currentPage}`, {
      method: 'POST',
      data: {
        categoryId,
        limit,
      },
    });

    if (productRes?.data) {
      productData = productRes.data;
      totalPages = productRes.totalPages || 1;
    }
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }

  return (
    <div className="px-4 py-8 bg-zinc-100 flex flex-col justify-center items-center self-center">
      <Categories categories={categories} currentCategory={currentCategory._id} />

      <h1 className="text-3xl font-bold text-center mb-8">Our Products</h1>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-fit gap-8">
        {productData.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination page={currentPage} totalPages={totalPages} categoryId={categoryId} />
      )}
    </div>
  );
};

export default Products;
