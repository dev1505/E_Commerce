import clientPromise from '@/lib/mongo';
import jwt from 'jsonwebtoken';
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
        const { productId, quantity, selectedSize } = await req.json();

        if (!productId || typeof quantity !== 'number' || quantity < 1 || typeof selectedSize === 'number') {
            return NextResponse.json(
                { success: false, message: 'Invalid input' },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db('E_Commerce');
        const usersCollection = db.collection('userData');

        const updateResult = await usersCollection.updateOne(
            {
                email: decoded.email,
                cartItems: {
                    $elemMatch: {
                        productId: productId,
                        selectedSize: selectedSize ?? "",  // string value here
                    },
                },
            },
            {
                $set: { 'cartItems.$.quantity': quantity },
            }
        );

        if (updateResult.matchedCount === 0) {
            return NextResponse.json(
                { success: false, message: 'Cart item with given productId and size not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        console.error('Error updating cart quantity:', error.message);
        return NextResponse.json(
            { success: false, message: 'Failed to update quantity' },
            { status: 500 }
        );
    }
}
