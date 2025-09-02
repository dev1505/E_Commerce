import { ReactElement } from "react";

// components/SkeletonCard.jsx (or .tsx)
export default function Skeleton({ cards = 4 }): ReactElement {
    // const cardArray = 
    return (
        <div className={`grid `}>
            <div className="w-full max-w-sm rounded-lg p-4 shadow animate-pulse dark:border-gray-700">
                <div className="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                </div>
                <div className="h-4 bg-gray-300 rounded dark:bg-gray-700 mb-2.5"></div>
                <div className="h-4 bg-gray-300 rounded dark:bg-gray-700 mb-2.5 w-2/3"></div>
                <div className="h-3 bg-gray-200 rounded dark:bg-gray-600 mb-2 w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded dark:bg-gray-600 w-1/2"></div>
                <div className="flex items-center mt-4 space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full dark:bg-gray-700"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-300 rounded dark:bg-gray-700 w-3/4"></div>
                        <div className="h-3 bg-gray-300 rounded dark:bg-gray-700 w-1/2"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
