'use client';
import CommonApiCall from '@/app/commonfunctions/CommonApiCall';
import SuggestedProducts from '@/app/components/products/SuggestedProducts';
import { AllCategories } from '@/app/indexType';
import { use, useEffect, useState } from 'react';

const ProductDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = use(params);
    const [product, setProduct] = useState<AllCategories | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState<string>("");

    useEffect(() => {
        if (id) {
            const fetchProduct = async () => {
                setLoading(true);
                const data = await CommonApiCall('/api/getproduct', {
                    method: 'POST',
                    data: { _id: id },
                });
                if (data) {
                    setProduct(data.data);
                    if (data.data.size && data.data.size.length > 0) {
                        setSelectedSize(data.data.size[0]);
                    }
                }
                setLoading(false);
            };
            fetchProduct();
        }
    }, [id]);

    const handleAddToCart = async () => {
        if (!product) return;

        const payload = {
            productId: product._id,
            quantity,
            selectedSize: selectedSize ?? "",
        };

        const response = await CommonApiCall('/api/cart/add', {
            method: 'POST',
            data: payload,
        });

        if (!response) return;

        if (response.success) {
            alert(`${product.title} has been added to your cart!`);
        } else {
            alert(`Error: ${response.message}`);
        }
    };


    if (loading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    if (!product) {
        return <div className="text-center py-10">Product not found</div>;
    }

    const renderProductDetails = () => {
        const renderCommonDetails = (p: AllCategories) => (
            <>
                <p className="text-gray-500 text-sm">Brand: {p.brand}</p>
                <p className="text-gray-500 text-sm">Stock: {p.stock}</p>
                <div className="flex items-center mt-2">
                    <span className="text-yellow-500">{'★'.repeat(Math.round(p.rating))}{'☆'.repeat(5 - Math.round(p.rating))}</span>
                    <span className="text-gray-600 ml-2">({p.rating} stars)</span>
                </div>
            </>
        );

        if ('gender' in product) {
            return (
                <>
                    {renderCommonDetails(product)}
                    <p className="text-gray-500 text-sm">Gender: {product.gender}</p>
                </>
            );
        }
        if ('model' in product) {
            return (
                <>
                    {renderCommonDetails(product)}
                    <p className="text-gray-500 text-sm">Model: {product.model}</p>
                    <p className="text-gray-500 text-sm">Warranty: {product.warranty}</p>
                    <h3 className="font-semibold mt-4">Features:</h3>
                    <ul className="list-disc list-inside">
                        {product.features.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                </>
            );
        }
        if ('material' in product) {
            return (
                <>
                    {renderCommonDetails(product)}
                    {product.material && <p className="text-gray-500 text-sm">Material: {product.material}</p>}
                    {product.dimensions && <p className="text-gray-500 text-sm">Dimensions: {product.dimensions}</p>}
                    {product.warranty && <p className="text-gray-500 text-sm">Warranty: {product.warranty}</p>}
                    <h3 className="font-semibold mt-4">Features:</h3>
                    <ul className="list-disc list-inside">
                        {product.features.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                </>
            );
        }
        if ('ingredients' in product) {
            return (
                <>
                    {renderCommonDetails(product)}
                    {product.size && <p className="text-gray-500 text-sm">Size: {product.size}</p>}
                    {product.expirationDate && <p className="text-gray-500 text-sm">Expires: {new Date(product.expirationDate).toLocaleDateString()}</p>}
                    {product.ingredients && (
                        <>
                            <h3 className="font-semibold mt-4">Ingredients:</h3>
                            <p className="text-sm">{product.ingredients.join(', ')}</p>
                        </>
                    )}
                    <h3 className="font-semibold mt-4">Features:</h3>
                    <ul className="list-disc list-inside">
                        {product.features.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                </>
            );
        }
        return null;
    };

    return (
        <div className="px-4 md:px-20 py-8 bg-zinc-50">
            <div className="grid grid-cols-1 items-center lg:grid-cols-2 gap-8">
                <div className="flex justify-center items-center overflow-hidden rounded w-full aspect-[4/3]">
                    <img
                        src={product.image}
                        alt={product.title}
                        className="max-h-full max-w-full rounded-lg object-contain"
                    />
                </div>
                <div className="flex flex-col">
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-2">{product.title}</h1>
                    <p className="text-gray-600 mb-4 text-xl md:text-3xl">{product.description}</p>

                    <div className="flex items-baseline mb-4">
                        <p className="text-3xl font-bold text-blue-600">${product.price}</p>
                        {product.oldPrice > product.price && (
                            <p className="text-xl text-gray-500 line-through ml-4">${product.oldPrice}</p>
                        )}
                    </div>
                    <div className="mb-6">{renderProductDetails()}</div>
                    <div className="flex items-center mb-6">
                        <label htmlFor="quantity" className="font-semibold mr-4">Quantity:</label>
                        <div className="flex items-center">
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-3 py-1 rounded-l">-</button>
                            <input min={1} type="number" id="quantity" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} className="text-center w-12" />
                            <button onClick={() => setQuantity(q => q + 1)} className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-3 py-1 rounded-r">+</button>
                        </div>
                    </div>
                    {'size' in product && typeof (product.size) === 'object' && product.size && (
                        <div className="flex items-center mb-6">
                            <label htmlFor="size" className="font-semibold mr-4">Size:</label>
                            <select id="size" value={selectedSize || ''} onChange={(e) => setSelectedSize(e.target.value)} className="border rounded p-2">
                                {product.size.map((s: string) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="mt-auto">
                        <button onClick={() => handleAddToCart()} className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300">
                            Add to Cart - ${product.price * quantity}
                        </button>
                    </div>
                </div>
            </div>
            {product &&
                <SuggestedProducts categoryId={product.categoryId} currentProductId={product._id} />
            }
        </div>
    );
};

export default ProductDetailPage;