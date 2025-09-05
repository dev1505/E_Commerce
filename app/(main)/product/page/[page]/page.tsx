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

const ProductsPage = async ({ params, searchParams }: PageProps) => {
    const currentPage = parseInt((await params).page) || 1;
    const categoryId = (await searchParams).categoryId || 'All';
    const limit = 8;

    const defaultCategory: category = {
        categoryName: 'All',
        categoryShortName: 'All',
        _id: 'All',
        productIds: [],
    };

    // Fetch categories

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const categoryRes = await CommonApiCall(`${baseUrl}api/category`, { method: 'GET' });

    const productRes = await CommonApiCall(`${baseUrl}api/products/page/${currentPage}`, {
        method: 'POST',
        data: { categoryId, limit },
    });

    const categories: category[] = categoryRes?.data
        ? [defaultCategory, ...categoryRes.data]
        : [defaultCategory];

    // Fetch products
    const productData: Product[] = productRes?.data || [];
    const totalPages = productRes?.totalPages || 1;

    return (
        <div className="px-10 md:px-15 py-8 bg-zinc-100 flex flex-col justify-center items-center self-center">
            <Categories
                categories={categories}
                currentCategory={categoryId}
            />

            <h1 className="text-3xl font-bold text-center mb-8">Our Products</h1>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-fit gap-8">
                {productData.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination
                    page={currentPage}
                    totalPages={totalPages}
                    categoryId={categoryId}
                />
            )}
        </div>
    );
};

export default ProductsPage;
