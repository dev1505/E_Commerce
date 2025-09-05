export const dynamic = 'force-dynamic'; // Force server-render on every request
import { getReceipt } from "@/app/api/receipt/route";
export default async function ReceiptPage() {
    const { data, message, success } = await getReceipt();

    if (!success) {
        return <div className="text-center py-10">{message}</div>;
    }

    const { user, productData } = data;
    const historyItems = user?.history[user.history.length - 1];

    if (!historyItems?.length) {
        return <div className="text-center py-10">No items in your last order.</div>;
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-10 font-sans">
            <h1 className="text-3xl font-bold mb-6 text-center">Order Receipt</h1>

            <div className="border rounded-lg p-6 shadow-md bg-white space-y-6">
                {historyItems.map((item: any, index: number) => {
                    const product = productData.find(
                        (p: any) => p._id.toString() === item.productId
                    );
                    if (!product) return null;

                    return (
                        <div key={index} className="flex flex-col sm:flex-row items-center gap-4 pb-3 border-b">
                            <img
                                src={product.image}
                                alt={product.title}
                                width={100}
                                height={100}
                                className="rounded object-cover"
                            />
                            <div className="flex-1 w-full">
                                <h2 className="text-lg font-semibold">{product.title}</h2>
                                {item.selectedSize && (
                                    <p className="text-sm text-gray-600">Size: {item.selectedSize}</p>
                                )}
                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                            </div>
                            <div className="text-right font-semibold whitespace-nowrap">
                                ${(product.discountedPrice * item.quantity).toFixed(2)}
                            </div>
                        </div>
                    );
                })}

                <div className="text-right">
                    <p className="text-lg font-bold">Total: ${user.totalAmount.toFixed(2)}</p>
                </div>
            </div>

            <p className="mt-6 text-center text-lg text-gray-900">
                Thank you for shopping with us!
            </p>
        </div>
    );
}
