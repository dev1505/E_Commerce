import clientPromise from '@/lib/mongo';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { category: string } }) {
    try {
        const { category } = params;
        const client = await clientPromise;
        const db = client.db('E_Commerce');
        const productsCollection = db.collection('productData');

        const products = await productsCollection.find({ category }).limit(4).toArray();

        return NextResponse.json({
            message: 'Products found',
            data: products,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
