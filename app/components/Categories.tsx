'use client'
import { useEffect, useState } from 'react';
import CommonApiCall from '../commonfunctions/CommonApiCall';
import { category } from '../indexType';

export default function Categories() {

    const [categoryData, setCategoryData] = useState<category[]>([]);

    async function fetchCategories() {
        const response = await CommonApiCall('/api/category', { method: 'GET' });

        if (response && Array.isArray(response.data)) {
            const categories: category[] = response.data;
            setCategoryData([{ categoryName: 'All', categoryShortName: 'All' }, ...categories]);
        } else {
            console.error('Failed to fetch categories or invalid format.');
        }
    }
    useEffect(() => {
        fetchCategories();
    }, [])

    return (
        <div className=' p-3'>
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
