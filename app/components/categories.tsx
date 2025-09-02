import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { category } from '../indexType';

export default function Categories() {

    const [categoryData, setCategoryData] = useState<category[]>([]);

    async function fetchCategories() {
        const response = await axios.get("/api/category");
        const categories: category[] = response.data.data;
        setCategoryData([{ categoryName: "All", categoryShortName: "All" }, ...categories]);
    }

    useEffect(() => {
        fetchCategories();
    }, [])

    return (
        <div className=' p-3'>
            <div className='text-2xl mb-3'>
                Categories
            </div>
            <div className={`grid grid-cols-2 col-auto text-sm md:text-lg gap-2 md:grid-flow-col items-center justify-center`}>
                {
                    categoryData?.map((category: category, index) => {
                        return (
                            <div key={index}>
                                <div className='p-2 text-center border border-blue-500 text-blue-500 font-bold py-2 px-4 rounded hover:bg-blue-400 hover:text-white transition-all duration-100 transform hover:scale-103'>
                                    {category?.categoryName}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
