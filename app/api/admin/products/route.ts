import clientPromise from '@/lib/mongo';
import jwt from "jsonwebtoken";
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    return await getAdminProducts(request);
}

async function getAdminProducts(request: NextRequest) {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get("token")?.value;

        const client = await clientPromise;
        const db = client.db('E_Commerce');

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET ?? "");
        const email = decoded.email;

        const { page = 1, limit = 8 } = await request.json();

        const users = db.collection("userData");
        const user = await users.findOne({ email: email });

        const productsCollection = db.collection('productData');
        const skip = (page - 1) * limit;

        const filter = { userId: user?._id }
        const products = await productsCollection.find(filter).sort({ randomSeed: 1, _id: 1 }).skip(skip).limit(limit).toArray();
        const totalProducts = await productsCollection.countDocuments(filter);

        return NextResponse.json({
            message: 'Products found',
            data: products,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: page,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
