'use client';
import CommonApiCall from '@/app/commonfunctions/CommonApiCall';
import { PaymentFunction } from '@/app/commonfunctions/PaymentFunction';
import { AllCategories } from '@/app/indexType';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const CartPage = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      const res = await CommonApiCall('/api/cart', { method: 'GET' });
      if (res?.data) setCartItems(res.data);
      setLoading(false);
    };

    fetchCartItems();
  }, []);

  const updateQuantity = async (productId: string, newQuantity: number, selectedSize: string) => {
    if (newQuantity < 1) return;

    setUpdating(true);
    const res = await CommonApiCall('/api/cart/update', {
      method: 'POST',
      data: { productId, quantity: newQuantity, selectedSize },
    });

    if (res?.success) {
      setCartItems((prev) =>
        prev.map((item) =>
          item._id === productId && item.selectedSize === selectedSize
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } else {
      alert('Failed to update quantity');
    }

    setUpdating(false);
  };

  const deleteItem = async (productId: string, selectedSize: string) => {
    if (!confirm('Remove this item from your cart?')) return;

    setUpdating(true);
    const res = await CommonApiCall('/api/cart/delete', {
      method: 'POST',
      data: { productId, selectedSize },
    });

    if (res?.success) {
      setCartItems((prev) =>
        prev.filter((item) => !(item._id === productId && item.selectedSize === selectedSize))
      );
    } else {
      alert('Failed to remove item');
    }

    setUpdating(false);
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handlePayment = () => {
    PaymentFunction(cartItems);
  };

  if (loading) {
    return <div className="text-center py-10">Loading your cart...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold mb-8">Your Cart</h1>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="py-10 bg-zinc-100 min-h-screen px-4 md:px-10 lg:px-20">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-8 text-center md:text-left">Your Cart</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="md:col-span-2 space-y-6">
          {cartItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col w-full sm:flex-row gap-3 bg-white p-4 rounded-xl shadow-md"
            >
              <Link href={`product/${item._id}`}>
                <div className='overflow-hidden flex justify-center items-center'>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="max-w-40 md:max-w-40 rounded-lg object-contain"
                  />
                </div>
              </Link>
              <div className="flex flex-col flex-grow justify-between">
                <Link href={`product/${item._id}`}>
                  <div>
                    <h2 className="text-2xl font-bold">{item.title}</h2>
                    <p className="text-gray-500 text-lg line-clamp-2">{item.description}</p>
                    {item.selectedSize && (
                      <p className="text-sm text-gray-400 mt-1">Size: {item.selectedSize}</p>
                    )}
                  </div>
                </Link>
                <div className="flex items-center gap-4 mt-2">
                  <button
                    disabled={updating}
                    onClick={() => updateQuantity(item._id, item.quantity - 1, item.selectedSize)}
                    className="bg-gray-200 px-2 rounded hover:bg-gray-300 disabled:opacity-50 cursor-pointer"
                  >
                    −
                  </button>
                  <span className="text-sm">{item.quantity}</span>
                  <button
                    disabled={updating}
                    onClick={() => updateQuantity(item._id, item.quantity + 1, item.selectedSize)}
                    className="bg-gray-200 px-2 rounded hover:bg-gray-300 disabled:opacity-50 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <p className="text-lg font-bold">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  disabled={updating}
                  onClick={() => deleteItem(item._id, item.selectedSize)}
                  className="text-red-500 hover:text-red-700 text-sm mt-2 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-xl shadow-md h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2 text-sm">
            <p>Subtotal</p>
            <p>${totalPrice.toFixed(2)}</p>
          </div>
          <div className="flex justify-between mb-2 text-sm">
            <p>Shipping</p>
            <p>$5.00</p>
          </div>
          <div className="flex justify-between mb-4 font-semibold text-lg">
            <p>Total</p>
            <p>${(totalPrice + 5).toFixed(2)}</p>
          </div>
          <button
            onClick={handlePayment}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
          >
            Checkout
          </button>
        </div>
      </div>
    </div >
  );
};

export default CartPage;
