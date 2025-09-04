// components/Pagination.tsx

'use client';

import Link from 'next/link';

interface PaginationProps {
    page: number;
    totalPages: number;
    categoryId: string;
}

const Pagination = ({ page, totalPages, categoryId }: PaginationProps) => {
    const createPageLink = (pageNum: number) => {
        return `/product/page/${pageNum}?categoryId=${categoryId}`;
    };

    return (
        <div className="flex justify-center items-center space-x-4 mt-8">
            {page > 1 && (
                <Link
                    href={createPageLink(page - 1)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                    Prev
                </Link>
            )}

            <span className="text-lg font-medium">
                Page {page} of {totalPages}
            </span>

            {page < totalPages && (
                <Link
                    href={createPageLink(page + 1)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                    Next
                </Link>
            )}
        </div>
    );
};

export default Pagination;
