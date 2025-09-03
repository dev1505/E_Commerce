import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export const PaymentFunction = async (cartItems: any[]) => {
    try {
        const res = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: cartItems }),
        });

        const data = await res.json();

        if (!data.id) {
            alert('Failed to create checkout session');
            return;
        }

        const stripe = await stripePromise;
        await stripe?.redirectToCheckout({ sessionId: data.id });
    } catch (err) {
        console.error('Checkout error:', err);
        alert('Payment failed.');
    }
};
