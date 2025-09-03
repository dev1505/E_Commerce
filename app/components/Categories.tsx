import { category } from '../indexType';
import { ProductData } from './Products';
import { Dispatch, SetStateAction } from 'react';

type categoryType = {
    categoryData: ProductData;
    setCategoryData: Dispatch<SetStateAction<ProductData>>;
}

export default function Categories({ categoryData, setCategoryData }: categoryType) {

    function handleCurrentCategory(category: category) {
        console.log(category);
        setCategoryData({ ...categoryData, currentCategory: category });
    }

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
                {categoryData.categories?.map((category: category, index: number) => (
                    <button
                        key={index}
                        onClick={() => handleCurrentCategory(category)}
                        className={`w-full cursor-pointer text-center border border-blue-500 font-semibold py-2 px-3 rounded-lg hover:bg-blue-500 hover:text-white transition duration-200 ${category.categoryName === categoryData.currentCategory.categoryName && "bg-blue-500 text-white"}`}
                    >
                        {category?.categoryName}
                    </button>
                ))}
            </div>
        </div>
    );
}
