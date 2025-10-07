"use client";
import CommonApiCall from "@/app/commonfunctions/CommonApiCall";
import withAdminAuth from "@/app/components/withAdminAuth";
import { fashion } from "@/app/indexType";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const EditProductPage = () => {
  const [product, setProduct] = useState<fashion | null>(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [stock, setStock] = useState("");
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await CommonApiCall(`/api/products/${id}`, { method: "get" });
          const data = response.data;
          setProduct(data);
          setTitle(data.title);
          setPrice(data.price.toString());
          setDescription(data.description);
          setImage(data.image);
          setStock(data.stock.toString());
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await CommonApiCall(`/api/products/update/${id}`, {
        method: "put",
        data: {
          title,
          price: parseFloat(price),
          description,
          image,
          stock: parseInt(stock),
        }
      });
      alert(await response.message);
      router.push("/admin");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-lg text-gray-500 animate-pulse">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-100 p-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-8 text-center">
          ✏️ Edit <span className="text-indigo-600">Product</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-gray-700 font-semibold mb-2">Price</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">Description</label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
              required
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-gray-700 font-semibold mb-2">Image URL</label>
            <input
              type="text"
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              required
            />
            {image && (
              <div className="mt-4 flex justify-center">
                <img
                  src={image}
                  alt="Preview"
                  className="w-48 h-48 object-cover rounded-lg shadow-md border border-gray-200"
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="stock" className="block text-gray-700 font-semibold mb-2">Stock</label>
            <input
              type="number"
              id="stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              required
            />
          </div>

          <div className="text-center pt-6">
            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold px-8 py-3 rounded-xl shadow-md hover:from-indigo-600 hover:to-blue-700 transition-all duration-200 text-lg"
            >
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withAdminAuth(EditProductPage);
