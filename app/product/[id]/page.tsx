'use client';
import { beauty, electronics, fashion, home } from '@/app/indexType';
import axios from 'axios';
import { useEffect, useState } from 'react';

type Product = fashion | electronics | home | beauty;

const ProductDetailPage = ({ params }: any) => {
    const id = params.id;
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            const fetchProduct = async () => {
                try {
                    setLoading(true);
                    const res = await axios.post(`/api/getproduct/`, { _id: id });
                    setProduct(res.data.data);
                } catch (error) {
                    console.error('Failed to fetch product:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchProduct();
        }
    }, [id]);

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
                    {product.size ? <p className="text-gray-500 text-sm">Sizes: {product.size.join(', ')}</p> : ""}
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
                    <h1 className="text-4xl font-extrabold mb-2">{product.title}</h1>
                    <p className="text-gray-600 mb-4">{product.description}</p>

                    <div className="flex items-baseline mb-4">
                        <p className="text-3xl font-bold text-blue-600">${product.price}</p>
                        {product.oldPrice > product.price && (
                            <p className="text-xl text-gray-500 line-through ml-4">${product.oldPrice}</p>
                        )}
                    </div>

                    <div className="mb-6">{renderProductDetails()}</div>

                    <div className="mt-auto">
                        <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
