import clientPromise from "@/lib/mongo";
import jwt from 'jsonwebtoken';
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function userReceipt() {
    try {
        const token = (await cookies()).get('token')?.value;
        if (!token) return NextResponse.json({ success: false, message: 'Not authenticated' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
        const client = await clientPromise;
        const db = client.db('E_Commerce');

        const usersCollection = db.collection('userData');
        const user = await usersCollection.findOne({ email: decoded.email });

        if (!user) return NextResponse.json({ success: false, message: 'User not found' });

        // Move items to history if needed
        if (user.cartItems.length) {
            await usersCollection.updateOne(
                { email: decoded.email },
                {
                    $set: { cartItems: [] },
                    $push: { history: user.cartItems }
                }
            );
            user.history.push(user.cartItems); // Update local user object
            user.cartItems = [];
        }
        const productsCollection = db.collection('productData');
        const latestHistory = user.history[user.history.length - 1] || [];

        const productData = await Promise.all(
            latestHistory.map(async (item: any) =>
                await productsCollection.findOne({ _id: new ObjectId(item.productId) })
            )
        );

        return NextResponse.json({
            success: true,
            message: "Receipt",
            data: { user: user, productData: productData }
        });
    } catch (error) {
        console.error("getReceipt error:", error);
        return NextResponse.json({ success: false, message: 'Server error' });
    }
}
