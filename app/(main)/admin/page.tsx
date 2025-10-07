
"use client";
import withAdminAuth from "@/app/components/withAdminAuth";
import { fashion, users } from "@/app/indexType";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const AdminPage = ({ user }: users | unknown | any) => {
  const [products, setProducts] = useState<fashion[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    try {
      const response = await axios.post(`/api/admin/products?page=${currentPage}&limit=8`, {
        page: currentPage,
        limit: 8,
      });
      setProducts(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/products/delete/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="px-8 py-8">
        <div className="flex justify-between items-center mb-8 bg-white shadow-sm rounded-xl px-6 py-4 border border-gray-100">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            Admin <span className="text-indigo-600">Panel</span>
          </h1>
          <div className="flex flex-wrap gap-3">
            {user?.isSuperuser && (
              <Link
                href="/admin/checkapplication"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium px-5 py-2.5 rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
              >
                Check Applications
              </Link>
            )}

            {user?.isAdmin && (
              <Link
                href="/admin/add-product"
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium px-5 py-2.5 rounded-lg shadow hover:from-green-600 hover:to-emerald-700 transition-all duration-200"
              >
                Add Product
              </Link>
            )}
          </div>
        </div>

        {
          user?.isAdmin && (
            <div>
              <div className="flex flex-col w-full max-w-5xl mx-auto bg-gray-50 rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white text-center font-semibold flex items-center px-4 py-3 rounded-t-2xl">
                  <h2 className="w-2/5 text-left">Title</h2>
                  <p className="w-1/5">Price</p>
                  <p className="w-1/5">Stock</p>
                  <div className="flex justify-center w-1/5">Edit / Delete</div>
                </div>

                <div className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <div
                      key={product._id}
                      className="flex items-center text-center text-gray-800 bg-white hover:bg-blue-50 transition-all duration-200 p-4"
                    >
                      <h2 className="w-2/5 text-left font-medium text-gray-700">{product.title}</h2>
                      <p className="w-1/5 text-gray-600 font-semibold">${product.price}</p>
                      <p
                        className={`w-1/5 font-semibold ${product.stock > 5 ? "text-green-600" : "text-red-500"
                          }`}
                      >
                        {product.stock}
                      </p>
                      <div className="flex justify-center w-1/5 gap-6">
                        <Link href={`/admin/edit-product/${product._id}`}>
                          <FaEdit className="text-indigo-500 hover:text-indigo-700 transition-transform hover:scale-110 text-xl cursor-pointer" />
                        </Link>
                        <button onClick={() => handleDelete(product._id)}>
                          <FaTrash className="text-red-500 hover:text-red-700 transition-transform hover:scale-110 text-xl cursor-pointer" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>


              <div className="flex justify-center mt-8">
                {
                  Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 mx-1 rounded-md ${currentPage === page ? "bg-indigo-600 text-white" : "bg-gray-200"}`}>
                      {page}
                    </button>
                  ))
                }
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default withAdminAuth(AdminPage);
