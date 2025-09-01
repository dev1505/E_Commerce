import { users } from '@/app/indexType';
import clientPromise from '@/lib/mongo'; // or '../../lib/mongo' if no alias set
import { NextResponse } from 'next/server';

export async function POST(request: any) {
    return await addUsers(request);
}

export async function addUsers(request: any) {
    try {
        let body: users = await request.json();

        const client = await clientPromise;
        const db = client.db('E_Commerce');
        const users = db.collection('userData');

        // Use unique identifier like email (adjust field as needed)
        const existingUser = await users.findOne({ email: body.email });

        if (existingUser) {
            if (existingUser.isDeleted) {
                // Restore deleted user
                await users.updateOne(
                    { _id: existingUser._id },
                    { $set: { ...body, isDeleted: false, isLoggedIn: false, cartItems: [], history: [], totalAmount: 0 }, }
                );

                return NextResponse.json({ message: 'Deleted user restored', restoredId: existingUser._id });
            } else {
                // User already exists and is active
                return NextResponse.json({ message: 'User already exists', userId: existingUser._id });
            }
        }

        // Insert new user

        const newUser = { ...body, isDeleted: false, isLoggedIn: false, cartItems: [], history: [], totalAmount: 0 };

        const result = await users.insertOne(newUser);

        return NextResponse.json({
            message: 'User inserted',
            insertedId: result.insertedId,
        });

    } catch (error: any) {
        console.error('Error in addUsers:', error);
        return NextResponse.json({ message: 'Error adding user', error: error.message });
    }
}

