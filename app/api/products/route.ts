import clientPromise from '@/lib/mongo';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    return await getProducts(request);
}

async function getProducts(request: NextRequest) {
    try {
        const { page = 1, limit = 8, category = "All" } = await request.json();
        const client = await clientPromise;
        const db = client.db('E_Commerce');
        const productsCollection = db.collection('productData');
        const skip = (page - 1) * limit;
        const filter = category === "All" ? {} : { category };
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
