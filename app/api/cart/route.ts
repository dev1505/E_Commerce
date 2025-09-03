import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongo';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';

export type CartItems = { productId: string; quantity: number; selectedSize: string[] };

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
        const productsCollection = db.collection('productData');

        // Find user by email
        const user = await usersCollection.findOne({ email: decoded.email });

        if (!user || !user.cartItems || user.cartItems.length === 0) {
            return NextResponse.json({ success: true, data: [] }, { status: 200 });
        }

        // Extract productIds from cartItems
        const productIds = user.cartItems.map(item => new ObjectId(item.productId));

        // Find all products in cart by their ObjectIds
        const products = await productsCollection
            .find({ _id: { $in: productIds } })
            .toArray();

        // Combine cart items with product details
        const cartWithDetails = user.cartItems.map(cartItem => {
            const product = products.find(p => p._id.toString() === cartItem.productId);
            if (!product) return null;

            return {
                ...product,
                _id: cartItem.productId,
                quantity: cartItem.quantity,
                selectedSize: cartItem.selectedSize ?? "",
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
