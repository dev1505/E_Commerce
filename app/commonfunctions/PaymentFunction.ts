import { loadStripe } from '@stripe/stripe-js';
import CommonApiCall from './CommonApiCall';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export const PaymentFunction = async (cartItems: any[]) => {
    try {
        const res = await CommonApiCall('/api/checkout', {
            method: 'POST',
            data: { items: cartItems },
        });

        if (!res.id) {
            alert('Failed to create checkout session');
            return;
        }

        const stripe = await stripePromise;
        await stripe?.redirectToCheckout({ sessionId: res.id });
    } catch (err) {
        console.error('Checkout error:', err);
        alert('Payment failed.');
    }
};
