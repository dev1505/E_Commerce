// /api/cart/route.ts
import clientPromise from '@/lib/mongo';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

interface CartItem {
    productId: string;
    quantity: number;
    selectedSize: string | null;
}

async function getUserFromToken(token: string) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { email: string };
        const client = await clientPromise;
        const db = client.db('E_Commerce');
        const users = db.collection('userData');
        return await users.findOne({ email: decoded.email });
    } catch (error: any) {
        console.error('JWT verification failed:', error.message);
        return null;
    }
}

export async function POST(request: NextRequest) {
    try {
        const { productId, quantity, selectedSize } = await request.json();

        if (
            !productId ||
            typeof productId !== 'string' ||
            typeof quantity !== 'number' ||
            quantity <= 0 ||
            (selectedSize !== null && typeof selectedSize !== 'string')
        ) {
            return NextResponse.json({ message: 'Invalid request data', success: false }, { status: 400 });
        }

        const token = (await cookies()).get('token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized', success: false }, { status: 401 });
        }

        const user = await getUserFromToken(token);
        if (!user) {
            return NextResponse.json({ message: 'Invalid token', success: false }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db('E_Commerce');
        const users = db.collection('userData');

        const cartItems: CartItem[] = user.cartItems || [];

        const itemIndex = cartItems.findIndex(
            (item) => item.productId === productId && item.selectedSize === selectedSize
        );

        if (itemIndex > -1) {
            cartItems[itemIndex].quantity += quantity;
        } else {
            cartItems.push({ productId, quantity, selectedSize });
        }

        const update = await users.updateOne({ email: user.email }, { $set: { cartItems } });

        if (!update.modifiedCount) {
            return NextResponse.json({ message: 'Failed to update cart', success: false }, { status: 500 });
        }

        return NextResponse.json({ message: 'Item added to user cart', success: true }, { status: 200 });

    } catch (error: any) {
        console.error('Server Error:', error.message);
        return NextResponse.json({ message: 'Internal Server Error', success: false }, { status: 500 });
    }
}
