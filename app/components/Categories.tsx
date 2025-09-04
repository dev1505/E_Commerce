// components/Categories.tsx
import Link from 'next/link';
import { category } from '@/app/indexType';

interface CategoriesProps {
    categories: category[];
    currentCategory: string;
}

const Categories = ({ categories, currentCategory }: CategoriesProps) => {
    return (
        <div className="flex flex-wrap justify-center gap-4 mb-6">
            {categories.map((cat) => (
                <Link
                    key={cat._id}
                    href={`/product/page/1?categoryId=${cat._id}`}
                    className={`px-4 py-2 border border-blue-500 hover:bg-blue-500 hover:text-white rounded ${currentCategory === cat._id ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
                >
                    {cat.categoryName}
                </Link>
            ))}
        </div>
    );
};

export default Categories;
