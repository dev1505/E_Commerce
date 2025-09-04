import { users } from "@/app/indexType";
import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(request: any) {
    const body: users = await request.json();
    return await userLogin(body);
}

export async function userLogin(body: users) {
    try {
        const { email, password } = body;

        const client = await clientPromise;

        const db = client.db('E_Commerce');
        const users = db.collection('userData');

        const user = await users.findOne({ email: email });

        if (!user) {
            return NextResponse.json({
                message: 'Invalid email or password',
                success: false,
            });
        }

        if (user?.isDeleted) {
            return NextResponse.json({
                message: 'Account is deleted. Contact support to restore it.',
                success: false,
            });
        }

        const isMatch = await bcrypt.compare(password, user?.password);

        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid credentials' });
        }

        await users.updateOne(
            { _id: user._id },
            { $set: { isLoggedIn: true } }
        );

        const { password: _, ...safeUser } = user;

        // Create JWT token
        const token = jwt.sign({ userName: user?.userName, email: user?.email }, process.env.JWT_SECRET);

        // Set cookie
        (await cookies()).set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 7
        });

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
