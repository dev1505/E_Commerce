'use client';
import { beauty, electronics, fashion, home } from '@/app/indexType';
import axios from 'axios';
import { use, useEffect, useState } from 'react';

type Product = fashion | electronics | home | beauty;

const ProductDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = use(params);
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            const fetchProduct = async () => {
                try {
                    setLoading(true);
                    const res = await axios.post(`/api/getproduct/`, { _id: id });
                    setProduct(res.data.data);
                    if (res.data.data.size && res.data.data.size.length > 0) {
                        setSelectedSize(res.data.data.size[0]);
                    }
                } catch (error) {
                    console.error('Failed to fetch product:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchProduct();
        }
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            const cartItem = {
                ...product,
                quantity,
                selectedSize,
            };
            // In a real app, you'd add this to a global state (like Redux or Context API) or send it to a server.
            // For now, we'll just log it to the console.
            console.log('Added to cart:', cartItem);
            alert(`${product.title} has been added to your cart!`);
        }
    };

    if (loading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    if (!product) {
        return <div className="text-center py-10">Product not found</div>;
    }

    const renderProductDetails = () => {
        const renderCommonDetails = (p: Product) => (
            <>
                <p className="text-gray-500 text-sm">Brand: {p.brand}</p>
                <p className="text-gray-500 text-sm">Stock: {p.stock}</p>
                <div className="flex items-center mt-2">
                    <span className="text-yellow-500">{'★'.repeat(Math.round(p.rating))}{'☆'.repeat(5 - Math.round(p.rating))}</span>
                    <span className="text-gray-600 ml-2">({p.rating} stars)</span>
                </div>
            </>
        );

        if ('gender' in product) { // Fashion
            return (
                <>
                    {renderCommonDetails(product)}
                    <p className="text-gray-500 text-sm">Gender: {product.gender}</p>
                </>
            );
        }
        if ('model' in product) { // Electronics
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
        if ('material' in product) { // Home
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
        if ('ingredients' in product) { // Beauty
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
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <img src={product.image} alt={product.title} className="w-full rounded-lg shadow-lg" />
                </div>
                <div className="flex flex-col">
                    <h1 className="text-5xl font-extrabold mb-2">{product.title}</h1>
                    <p className="text-gray-600 mb-4 text-3xl">{product.description}</p>

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

                    {'size' in product && product.size && (
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
                        <button onClick={handleAddToCart} className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;