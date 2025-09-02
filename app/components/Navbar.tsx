import Link from 'next/link';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export default function Navbar() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  let user = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { email: string, userName: string };
      user = decoded;
    } catch (error) {
      // Invalid token, ignore
    }
  }

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Shopification
        </Link>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">Welcome, {user?.userName}</span>
              <form action="/api/logout" method="POST">
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                  Logout
                </button>
              </form>
            </div>
          ) : (
            <Link href="/login">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
