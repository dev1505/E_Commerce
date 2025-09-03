import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2023-08-16',
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        if (!body.items || !Array.isArray(body.items)) {
            return NextResponse.json({ error: 'Invalid cart data' }, { status: 400 });
        }

        const line_items = body.items.map((item: any) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: `${item.title}${item.selectedSize ? ` (Size: ${item.selectedSize})` : ''}`,
                },
                unit_amount: Math.round(item.discountedPrice * 100),
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items,
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
        });

        return NextResponse.json({ id: session.id });
    } catch (err: any) {
        console.error('Stripe Checkout Error:', err.message);
        return NextResponse.json({ error: 'Stripe checkout failed' }, { status: 500 });
    }
}
