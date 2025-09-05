import clientPromise from '@/lib/mongo';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export type CartItems = {
    productId: string;
    quantity: number;
    selectedSize: string;
};

export type users = {
    userName: string;
    email: string;
    password: string;
    cartItems?: CartItems[];
    history?: object[];
    totalAmount?: number | string;
    isDeleted?: boolean;
    isLoggedIn: boolean;
};

export async function GET(req: NextRequest) {
    try {
        const token = (await cookies()).get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Not authenticated' },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { email: string };

        const client = await clientPromise;
        const db = client.db('E_Commerce');

        const usersCollection = db.collection<users>('userData');
        const user = await usersCollection.findOne({ email: decoded.email });

        if (!user || !user.cartItems || user.cartItems.length === 0) {
            return NextResponse.json({ success: true, data: [] }, { status: 200 });
        }
        const productIds = user.cartItems.map(item => item.productId);

        const collection = db.collection("productData");
        const products = await collection.find({ _id: { $in: productIds.map(id => new ObjectId(id)) } }).toArray();
        const cartWithDetails = user.cartItems.map(cartItem => {
            const product = products.find(p => p._id.toString() === cartItem.productId);
            if (!product) return null;
            const price = product.discountedPrice || product.price;
            const totalPrice = price * cartItem.quantity;

            return {
                ...product,
                _id: cartItem.productId,
                quantity: cartItem.quantity,
                selectedSize: cartItem.selectedSize,
                price,
                totalPrice,
            };
        }).filter(Boolean);

        return NextResponse.json({ success: true, data: cartWithDetails }, { status: 200 });

    } catch (error: any) {
        console.error('Error fetching cart items:', error.message);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch cart items' },
            { status: 500 }
        );
    }
}
