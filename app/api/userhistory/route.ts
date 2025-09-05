import clientPromise from "@/lib/mongo";
import jwt from 'jsonwebtoken';
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";

export async function userHistory() {
    try {
        const token = (await cookies()).get('token')?.value;
        if (!token) return { success: false, message: 'Not authenticated' };

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
        const client = await clientPromise;
        const db = client.db('E_Commerce');

        const usersCollection = db.collection('userData');
        const user = await usersCollection.findOne({ email: decoded.email });

        if (!user) return {
            success: false,
            message: 'User not found',
        };

        const productsCollection = db.collection('productData');

        const fullHistoryWithDetails = await Promise.all(
            user.history.map(async (order: any[]) => {
                const orderWithProductDetails = await Promise.all(
                    order.map(async (item: any) => {
                        const product = await productsCollection.findOne({ _id: new ObjectId(item.productId) });
                        return {
                            ...item,
                            product: product || null
                        };
                    })
                );

                return orderWithProductDetails;
            })
        );

        return {
            success: true,
            message: "Full purchase history",
            data: {
                user: {
                    email: user.email,
                    userName: user.userName,
                    totalAmount: user.totalAmount,
                },
                history: fullHistoryWithDetails
            }
        };
    } catch (error) {
        console.error("userHistory error:", error);
        return {
            success: false,
            message: 'Server error'
        };
    }
}
