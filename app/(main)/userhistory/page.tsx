import { userHistory } from '@/app/api/userhistory/route';
import CommonApiCall from '@/app/commonfunctions/CommonApiCall';
import { cookies } from 'next/headers';
import Link from 'next/link';

async function getUserHistory() {
    const token = (await cookies()).get('token')?.value;
    if (!token) {
        return { history: [] };
    }

    const res = (await userHistory()).json();
    const data = await res;
    return data.data;
}

const UserHistoryPage = async () => {
    const { history = [] } = await getUserHistory();

    if (history.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-4">User History</h1>
                <p className="text-center text-gray-600">No history found.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">User Purchase History</h1>

            <div className="space-y-10">
                {history.map((order: any[], index: number) => {
                    // Calculate total for this order
                    const orderTotal = order.reduce(
                        (sum, item) => sum + (item.price * item.quantity),
                        0
                    );

                    return (
                        <div
                            key={index}
                            className="border rounded-lg shadow-md p-6 bg-white"
                        >
                            <h2 className="text-xl font-semibold mb-4">
                                Order: {index + 1} - Total: ${orderTotal.toFixed(2)}
                            </h2>

                            <div className="flex flex-col space-y-6">
                                {order.map((item, i) => (
                                    <Link key={i} href={`/product/${item.productId}`}>
                                        <div
                                            key={i}
                                            className="flex flex-col sm:flex-row items-center gap-4"
                                        >
                                            <img
                                                src={item.product?.image}
                                                alt={item.product?.title}
                                                className="w-24 h-24 object-cover rounded"
                                            />

                                            <div className="flex-1 w-full">
                                                <h3 className="text-lg font-semibold">
                                                    {item.product?.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm">
                                                    Size: {item.selectedSize || "N/A"}
                                                </p>
                                                <p className="text-gray-600 text-sm">
                                                    Quantity: {item.quantity}
                                                </p>
                                            </div>

                                            <div className="font-semibold whitespace-nowrap text-right">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div >
    );
};

export default UserHistoryPage;
