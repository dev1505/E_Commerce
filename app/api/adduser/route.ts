import { users } from '@/app/indexType';
import clientPromise from '@/lib/mongo';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { userLogin } from '../userlogin/route';

export async function POST(request: Request) {
    return await addUsers(request);
}

export async function addUsers(request: Request) {
    try {
        const body: users = await request.json();

        const client = await clientPromise;
        const db = client.db('E_Commerce');
        const usersCollection = db.collection('userData');

        const existingUser = await usersCollection.findOne({ email: body.email });

        if (existingUser) {
            if (existingUser.isDeleted) {
                // Restore deleted user
                await usersCollection.updateOne(
                    { _id: existingUser._id },
                    {
                        $set: {
                            ...body,
                            password: await bcrypt.hash(body.password, 10),
                            isDeleted: false,
                            isLoggedIn: false,
                            cartItems: [],
                            history: [],
                            totalAmount: 0,
                        },
                    }
                );

                return NextResponse.json({
                    message: 'Deleted user restored',
                    restoredId: existingUser._id,
                    success: true,
                });
            }

            return NextResponse.json({
                message: 'User already exists',
                userId: existingUser._id,
                success: false,
            });
        }

        // Create new user
        const hashedPassword = await bcrypt.hash(body.password, 10);

        const newUser = {
            ...body,
            password: hashedPassword,
            isDeleted: false,
            isLoggedIn: false,
            cartItems: [],
            history: [],
            totalAmount: 0,
        };

        const result = await usersCollection.insertOne(newUser);

        // After insert
        if (result.insertedId) {
            return await userLogin(body);
        } else {
            return NextResponse.json({
                message: "Something went wrong",
                success: false,
            });
        }


    } catch (error: any) {
        console.error('Error in addUsers:', error);
        return NextResponse.json({
            message: 'Error adding user',
            error: error.message,
            success: false,
        }, { status: 500 });
    }
}
