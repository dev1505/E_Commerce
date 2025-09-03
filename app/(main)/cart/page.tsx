'use client';
import CommonApiCall from '@/app/commonfunctions/CommonApiCall';
import { PaymentFunction } from '@/app/commonfunctions/PaymentFunction';
import { AllCategories } from '@/app/indexType';
import { useEffect, useState } from 'react';

const CartPage = () => {
  const [cartItems, setCartItems] = useState<AllCategories[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false); // disable buttons during update

  const fetchCartItems = async () => {
    setLoading(true);
    const res = await CommonApiCall('/api/cart', {
      method: 'GET',
    });

    if (res && res.data) {
      setCartItems(res.data);
    } else {
      setCartItems([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const updateQuantity = async (productId: string, newQuantity: number, selectedSize: string) => {
    if (newQuantity < 1) return; // Minimum 1 quantity

    setUpdating(true);
    const res = await CommonApiCall('/api/cart/update', {
      method: 'POST',
      data: {
        productId: productId,
        quantity: newQuantity,
        selectedSize: selectedSize
      },
    });

    if (res?.success) {
      // Update locally without refetching all
      setCartItems((prev) =>
        prev.map((item) =>
          item._id === productId && item.selectedSize === selectedSize ? { ...item, quantity: newQuantity } : item
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
      data: { productId: productId, selectedSize: selectedSize }
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

  function handlePayment() {
    PaymentFunction(cartItems);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold mb-8">Your Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex flex-col md:flex-row gap-3 py-4 px-2 mb-4 shadow-xl/15 rounded-2xl"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-3/12 object-cover rounded-lg mr-4"
              />
              <div className="flex-grow">
                <h2 className="text-xl font-bold">{item.title}</h2>
                <h2 className="text-md">{item.description}</h2>
                {item.selectedSize && (
                  <p className="text-gray-500">Size: {item.selectedSize}</p>
                )}
                <div className="flex items-center space-x-4 mt-1">
                  <button
                    disabled={updating}
                    onClick={() => updateQuantity(item._id, item.quantity - 1, item.selectedSize)}
                    className="bg-gray-200 px-2 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    disabled={updating}
                    onClick={() => updateQuantity(item._id, item.quantity + 1, item.selectedSize)}
                    className="bg-gray-200 px-2 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <p className="text-xl font-bold">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  disabled={updating}
                  onClick={() => deleteItem(item._id, item.selectedSize)}
                  className="text-red-600 hover:text-red-800 font-semibold"
                >
                  Remove
                </button>
              </div>
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
          <button
            onClick={handlePayment}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg mt-6 transition-colors duration-300">
            Checkout
          </button>
        </div>
      </div>
    </div >
  );
};

export default CartPage;
