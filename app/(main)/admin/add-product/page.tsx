"use client";
import CommonApiCall from "@/app/commonfunctions/CommonApiCall";
import withAdminAuth from "@/app/components/withAdminAuth";
import { beauty, electronics, fashion, home } from "@/app/indexType";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ProductMap = {
  fashion: fashion;
  electronics: electronics;
  home: home;
  beauty: beauty;
};

const categoryFields: Record<keyof ProductMap, Array<keyof any>> = {
  fashion: ["title", "price", "oldPrice", "discountedPrice", "description", "stock", "brand", "image", "size", "gender", "type"],
  electronics: ["title", "price", "oldPrice", "discountedPrice", "description", "stock", "brand", "image", "type", "model", "warranty", "features"],
  home: ["title", "price", "oldPrice", "discountedPrice", "description", "stock", "brand", "image", "type", "material", "dimensions", "warranty", "features"],
  beauty: ["title", "price", "oldPrice", "discountedPrice", "description", "stock", "brand", "image", "type", "size", "ingredients", "features", "expirationDate"],
};

const AddProductPage = () => {
  const [category, setCategory] = useState<keyof ProductMap>("fashion");

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-100 p-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-8 text-center">
          ➕ Add <span className="text-indigo-600">Product</span>
        </h1>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as keyof ProductMap)}
          className="mb-8 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-700 font-medium"
        >
          <option value="fashion">Fashion</option>
          <option value="electronics">Electronics</option>
          <option value="home">Home</option>
          <option value="beauty">Beauty</option>
        </select>

        <AddProductForm category={category} />
      </div>
    </div>
  );
};

type Props<T extends keyof ProductMap> = {
  category: T;
};

function AddProductForm<T extends keyof ProductMap>({ category }: Props<T>) {
  const [formData, setFormData] = useState<Partial<ProductMap[T]>>({});
  const [imagePreview, setImagePreview] = useState<string>("");
  const router = useRouter();

  const handleChange = (key: keyof ProductMap[T], value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (key === "image") setImagePreview(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await CommonApiCall(`/api/admin/products/add`, { method: "post", data: { ...formData, category: category } });
      alert(await response.message);
      router.push("/admin");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {categoryFields[category].map((field, index) => (
        <div key={index}>
          <label className="block text-gray-700 font-semibold mb-2 capitalize">{field.toString()}</label>

          {field === "description" ? (
            <textarea
              value={formData[field as keyof ProductMap[T]] as string || ""}
              onChange={(e) => handleChange(field as keyof ProductMap[T], e.target.value)}
              rows={4}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
            />
          ) : (
            <input
              type={field === "price" || field === "oldPrice" || field === "discountedPrice" || field === "stock" ? "number" : "text"}
              value={formData[field as keyof ProductMap[T]] as string || ""}
              onChange={(e) => handleChange(field as keyof ProductMap[T], e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          )}

          {/* Image preview */}
          {field === "image" && imagePreview && (
            <div className="mt-3">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-48 h-48 object-cover rounded-lg shadow-md border border-gray-200"
              />
            </div>
          )}
        </div>
      ))}

      <div className="text-center pt-4">
        <button
          type="submit"
          className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold px-8 py-3 rounded-xl shadow-md hover:from-indigo-600 hover:to-blue-700 transition-all duration-200 text-lg"
        >
          Add Product
        </button>
      </div>
    </form>
  );
}

export default withAdminAuth(AddProductPage);
