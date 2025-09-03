import clientPromise from '@/lib/mongo';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { categoryId } = body;
        if (!categoryId) {
            return NextResponse.json(
                {
                    message: 'Invalid category',
                    success: false,
                },
                { status: 400 }
            );
        }
        const client = await clientPromise;
        const db = client.db('E_Commerce');
        const collection = db.collection('productData');
        const products = await collection.find({ categoryId: new ObjectId(categoryId) }).toArray();
        console.log(products)
        return NextResponse.json(
            {
                data: products,
                success: true,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error fetching suggested products:', error.message);
        return NextResponse.json(
            {
                message: 'Internal server error',
                success: false,
            },
            { status: 500 }
        );
    }
}