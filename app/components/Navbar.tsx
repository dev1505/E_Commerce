
'use client'
import { users } from "@/app/indexType";
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiShoppingCart } from "react-icons/fi";
import { GoHistory } from "react-icons/go";
import { IoLogOutOutline } from 'react-icons/io5';
import { RiAdminLine } from "react-icons/ri";
import CommonApiCall from '../commonfunctions/CommonApiCall';

export default function Navbar() {
  const [user, setUser] = useState<users | null>(null);

  const fetchUser = async () => {
    try {
      const response = await axios.get("/api/user");
      setUser(response.data.data);
    } catch (error) {
      // Not logged in
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  async function handleSellingApplication() {
    const response = await CommonApiCall('/api/user/application', { method: 'GET' });
    if (await response.success) {
      fetchUser();
    }
    alert(await response.message)
  }

  return (
    <nav className="bg-gray-800 text-white px-4 py-3 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-y-4 md:gap-y-0">
        <Link href="/" className="text-2xl font-bold">
          Shopification
        </Link>

        <div className="flex flex-col md:flex-row items-center gap-4 text-base md:text-lg">
          {user ? (
            <>
              <span className="text-gray-300">Welcome, {user.userName}</span>

              <div className="flex gap-4">
                <Link href="/cart" className="relative">
                  <button
                    className="bg-white text-black hover:bg-green-500 hover:text-white font-bold p-2 rounded-full text-2xl transition duration-200"
                    title="Go to Cart"
                  >
                    <FiShoppingCart />
                  </button>
                </Link>
                <Link href="/userhistory" className="relative">
                  <button
                    className="bg-white text-black hover:bg-blue-500 hover:text-white font-bold p-2 rounded-full text-2xl transition duration-200"
                    title="Go to History"
                  >
                    <GoHistory />
                  </button>
                </Link>

                <form action="/api/logout" method="POST">
                  <button
                    className="bg-white text-black hover:bg-red-500 hover:text-white font-bold p-2 rounded-full text-2xl transition duration-200"
                    title="Logout"
                  >
                    <IoLogOutOutline />
                  </button>
                </form>
                {
                  user.isAdmin || user.isSuperuser ? (
                    <Link href="/admin">
                      <button className="bg-white text-black hover:bg-cyan-500 hover:text-white font-bold p-2 rounded-full text-2xl transition duration-200"
                      title="Admin Page"
                      >
                        <RiAdminLine />
                      </button>
                    </Link>
                  ) : (
                    !user.hasApplied ?
                      < button onClick={handleSellingApplication} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200">
                        Want to Sell?
                      </button>
                      : ""
                  )
                }
              </div>
            </>
          ) : (
            <Link href="/login">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav >
  );
}

