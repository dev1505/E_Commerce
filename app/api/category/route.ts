import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function GET(request: any) {
    return await getCategory();
}

export async function getCategory() {
    try {
        const client = await clientPromise;
        const db = client.db('E_Commerce');
        const products = db.collection('categoryData');
        const result = await products.find().toArray();
        return NextResponse.json({
            message: 'Categories found',
            data: result,
        });
    } catch (error) {
        return NextResponse.json({ message: error });
    }
}