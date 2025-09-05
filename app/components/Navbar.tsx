import Link from 'next/link';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { IoLogOutOutline } from 'react-icons/io5';
import { FiShoppingCart } from "react-icons/fi";
import { GoHistory } from "react-icons/go";

const JWT_SECRET = process.env.JWT_SECRET!;

export default async function Navbar() {
  const cookieStore = cookies();
  const token = (await cookieStore).get('token')?.value;

  let user = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { email: string; userName: string };
      user = decoded;
    } catch (error) {
      // Invalid token
    }
  }

  return (
    <nav className="bg-gray-800 text-white px-4 py-3 shadow-md">
      <div className="container mx-auto flex flex-wrap justify-between items-center gap-y-4">
        <Link href="/" className="text-2xl font-bold">
          Shopification
        </Link>

        <div className="flex flex-wrap items-center gap-4 text-base md:text-lg">
          {user ? (
            <>
              <span className="text-gray-300">Welcome, {user.userName}</span>

              <Link href="/cart" className="relative">
                <button
                  className="bg-white text-black hover:bg-green-500 hover:text-white font-bold p-2 rounded-full text-2xl transition duration-200"
                  title="Go to Cart"
                >
                  <FiShoppingCart />
                </button>
              </Link>
              <Link href="/cart" className="relative">
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
    </nav>
  );
}
