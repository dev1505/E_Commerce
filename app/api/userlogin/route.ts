import { users } from "@/app/indexType";
import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function POST(request: any) {
    return await userLogin(request);
}

export async function userLogin(request: any) {
    try {
        const body: users = await request.json();
        const { email, password } = body;

        const client = await clientPromise;
        const db = client.db('E_Commerce');
        const users = db.collection('userData');

        const user = await users.findOne({ email, password });

        if (!user) {
            return NextResponse.json({
                message: 'Invalid email or password',
                success: false,
            }, { status: 401 });
        }

        if (user.isDeleted) {
            return NextResponse.json({
                message: 'Account is deleted. Contact support to restore it.',
                success: false,
            }, { status: 403 });
        }

        await users.updateOne(
            { _id: user._id },
            { $set: { isLoggedIn: true } }
        );

        const { password: _, ...safeUser } = user;

        return NextResponse.json({
            message: 'Login successful',
            success: true,
            data: safeUser,
        });

    } catch (error: any) {
        console.error('Login Error:', error);
        return NextResponse.json({
            message: 'Server error',
            error: error.message,
            success: false,
        }, { status: 500 });
    }
}
