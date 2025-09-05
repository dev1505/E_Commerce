import clientPromise from '@/lib/mongo';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const token = (await cookies()).get('token')?.value;
        if (!token) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { email: string };
        const { productId, quantity, selectedSize } = await req.json();

        if (!productId) {
            return NextResponse.json({ success: false, message: 'Invalid input' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('E_Commerce');
        const users = db.collection('userData');
        const product = await db.collection("productData").findOne({ _id: new ObjectId(productId) });

        if (!product) {
            return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
        }

        const price = product.discountedPrice || product.price || 0;

        const user = await users.findOne({ email: decoded.email });
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        const cartItems = user.cartItems || [];

        const existingIndex = cartItems.findIndex(
            (item: any) => item.productId === productId && item.selectedSize === selectedSize
        );

        if (existingIndex !== -1) {
            cartItems[existingIndex].quantity += quantity;
            cartItems[existingIndex].price = price; // Update price in case it changed
        } else {
            cartItems.push({ productId, quantity, selectedSize, price });
        }

        // Recalculate totalAmount
        const totalAmount = cartItems.reduce((sum: any, item: any) => sum + (item.price * item.quantity), 0);

        const updateResult = await users.updateOne(
            { email: decoded.email },
            { $set: { cartItems, totalAmount } }
        );

        if (!updateResult.modifiedCount) {
            return NextResponse.json({ success: false, message: 'Failed to update cart' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Item added to cart', totalAmount }, { status: 200 });

    } catch (error: any) {
        console.error('Error:', error.message);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
