'use client';

import { useState, useEffect } from 'react';

// This is a mock cart item type. In a real application, you would import this from a shared types file.
interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  selectedSize: string | null;
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // In a real app, you would fetch the cart items from a global state (like Redux or Context API) or an API.
    // For now, we'll use some mock data.
    const mockCartItems: CartItem[] = [
      {
        id: '1',
        title: 'Classic T-Shirt',
        price: 25,
        quantity: 2,
        image: 'https://via.placeholder.com/150',
        selectedSize: 'M',
      },
      {
        id: '2',
        title: 'Stylish Jeans',
        price: 75,
        quantity: 1,
        image: 'https://via.placeholder.com/150',
        selectedSize: '32/32',
      },
    ];
    setCartItems(mockCartItems);
  }, []);

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold mb-8">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center border-b pb-4 mb-4">
                <img src={item.image} alt={item.title} className="w-24 h-24 object-cover rounded-lg mr-4" />
                <div className="flex-grow">
                  <h2 className="text-xl font-bold">{item.title}</h2>
                  {item.selectedSize && <p className="text-gray-500">Size: {item.selectedSize}</p>}
                  <p className="text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <p className="text-xl font-bold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="bg-gray-100 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <p>Subtotal</p>
              <p>${totalPrice.toFixed(2)}</p>
            </div>
            <div className="flex justify-between mb-2">
              <p>Shipping</p>
              <p>$5.00</p>
            </div>
            <div className="flex justify-between font-bold text-xl">
              <p>Total</p>
              <p>${(totalPrice + 5).toFixed(2)}</p>
            </div>
            <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg mt-6 transition-colors duration-300">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
