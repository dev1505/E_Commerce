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

        // Build the $pull condition dynamically
        const pullCondition = selectedSize
            ? { productId: productId, selectedSize: selectedSize }
            : { productId: productId };

        const result = await usersCollection.updateOne(
            { email: decoded.email },
            { $pull: { cartItems: pullCondition } }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json(
                { success: false, message: 'No matching cart item found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        console.error('Error removing cart item:', error.message);
        return NextResponse.json(
            { success: false, message: 'Failed to remove item' },
            { status: 500 }
        );
    }
}

