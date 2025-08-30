import { put } from '@vercel/blob';
import axios from 'axios';
import { NextResponse } from 'next/server';

const BLOB_URL = process.env.BLOB_URL ?? "";

export async function POST(req: Request) {
    try {
        const newUser = await req.json();

        if (!newUser || !newUser.name || !newUser.password) {
            return NextResponse.json({ error: 'Invalid user data' }, { status: 400 });
        }

        // Fetch existing users from the blob
        const existingUsers = await fetchUsers();

        // Append the new user to the array
        const updatedUsers = [...existingUsers, { ...newUser, userId: existingUsers?.length + 1 }];

        // Overwrite the blob with the updated list
        const blob = await put('users/userData.json', Buffer.from(JSON.stringify(updatedUsers, null, 2)), {
            access: 'public',
            contentType: 'application/json',
            allowOverwrite: true,
            cacheControlMaxAge: 0, // attempt to bust CDN cache (still not instant)
        });

        return NextResponse.json({ url: blob.url, users: updatedUsers });
    } catch (error) {
        console.error('Upload Error:', error);
        return NextResponse.json({ error: 'Failed to update users in blob' }, { status: 500 });
    }
}

// Fetches and parses existing user data
async function fetchUsers(): Promise<Array<{ name: string; password: string, userId: number }>> {
    try {
        const res = await axios.get(BLOB_URL, {
            headers: { 'Cache-Control': 'no-cache' }, // request fresh version
        });

        if (Array.isArray(res.data)) {
            return res.data;
        } else {
            console.warn('Unexpected blob content, resetting to empty array.');
            return [];
        }
    } catch (error) {
        console.warn('Failed to fetch existing users. Starting fresh.');
        return []; // If blob doesn't exist or is invalid, start with empty array
    }
}
