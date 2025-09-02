import clientPromise from '@/lib/mongo'; // or '../../lib/mongo' if no alias set
import { NextResponse } from 'next/server';

// export async function POST(request: any) {
//     try {
//         const body = await request.json();
//         const client = await clientPromise;
//         const db = client.db('E_Commerce');
//         const users = db.collection('productData');
//         const result = await users.insertOne(body);
//         return NextResponse.json({
//             message: 'Product Inserted',
//             insertedId: result.insertedId,
//         });
//     } catch (error) {
//         console.error(error);
//         return;
//     }
// }

export async function POST(request: any) {
    return await getProducts(request);
}

export async function getProducts(request: any) {
    try {
        const { skip } = await request.json();
        const client = await clientPromise;
        const db = client.db('E_Commerce');
        const products = db.collection('productData');
        const res = await products.find({}).limit(20).skip(skip).toArray();
        return NextResponse.json({
            message: 'Products found',
            data: res,
        });
    } catch (error) {
        return NextResponse.json({ message: error });
    }
}