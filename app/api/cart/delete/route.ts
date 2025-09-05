import { CartItems } from '@/app/indexType';
import clientPromise from '@/lib/mongo';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const token = (await cookies()).get('token')?.value;
        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Not authenticated' },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { email: string };
        const { productId, selectedSize } = await req.json();

        if (!productId) {
            return NextResponse.json(
                { success: false, message: 'Invalid input: productId required' },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db('E_Commerce');
        const usersCollection = db.collection('userData');
        const pullCondition = { productId: new ObjectId(productId), selectedSize: selectedSize }
        const user = await usersCollection.findOne({ email: decoded.email });
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found after update' },
                { status: 404 }
            );
        }

        const cartItems = user.cartItems.filter((cartItem: CartItems) => (pullCondition.productId != new ObjectId(cartItem.productId) && cartItem.selectedSize != pullCondition.selectedSize));

        const totalAmount = (user.cartItems || []).reduce(
            (sum: number, item: any) => sum + (item.price * item.quantity),
            0
        );
        await usersCollection.updateOne(
            { email: decoded.email },
            { $set: { totalAmount, cartItems: cartItems } }
        );

        return NextResponse.json(
            {
                success: true,
                message: 'Item removed from cart',
                cartItems: cartItems || [],
                totalAmount,
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Error removing cart item:', error.message);
        return NextResponse.json(
            { success: false, message: 'Failed to remove item' },
            { status: 500 }
        );
    }
}
