import clientPromise from '@/lib/mongo';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

async function findProductById(productId: string) {
    const client = await clientPromise;
    const db = client.db('E_Commerce');
    const collection = db.collection("productData");
    return await collection.findOne({ _id: new ObjectId(productId) });
}

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
        const product = await findProductById(productId);
        if (!product) {
            return NextResponse.json(
                { success: false, message: 'Product not found' },
                { status: 404 }
            );
        }

        const price = product.discountedPrice || product.price || 0;
        const totalPrice = price * quantity;
        const client = await clientPromise;
        const db = client.db('E_Commerce');
        const usersCollection = db.collection('userData');
        const updateResult = await usersCollection.updateOne(
            {
                email: decoded.email,
                cartItems: {
                    $elemMatch: {
                        productId,
                        selectedSize: selectedSize ?? "",
                    },
                },
            },
            {
                $set: {
                    'cartItems.$.quantity': quantity,
                    'cartItems.$.price': price,
                    'cartItems.$.totalPrice': totalPrice,
                },
            }
        );

        if (updateResult.matchedCount === 0) {
            return NextResponse.json(
                { success: false, message: 'Cart item with given productId and size not found' },
                { status: 404 }
            );
        }
        const updatedUser = await usersCollection.findOne({ email: decoded.email });

        let totalAmount = 0;
        if (updatedUser?.cartItems && updatedUser.cartItems.length > 0) {
            totalAmount = updatedUser.cartItems.reduce((sum: number, item: any) => {
                return sum + (item.price * item.quantity);
            }, 0);
        }
        await usersCollection.updateOne(
            { email: decoded.email },
            { $set: { totalAmount } }
        );

        return NextResponse.json({ success: true, totalAmount }, { status: 200 });
    } catch (error: any) {
        console.error('Error updating cart quantity:', error.message);
        return NextResponse.json(
            { success: false, message: 'Failed to update quantity' },
            { status: 500 }
        );
    }
}
