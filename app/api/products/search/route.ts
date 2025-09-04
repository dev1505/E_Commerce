import clientPromise from "@/lib/mongo";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    return await getSearchedProducts(request)
}

export async function getSearchedProducts(request: NextRequest) {
    try {
        const client = await clientPromise;
        const body = await request.json();
        const { title } = body;
        const db = client.db('E_Commerce');
        const productData = db.collection('productData');
        const searchedProducts = await productData.find({ title: title }).toArray();
        if (searchedProducts) {
            return NextResponse.json({
                message: "Some Error Occured",
                success: false,
            })
        }
        else {
            return NextResponse.json({
                message: "Searched Products found",
                success: true,
                data: searchedProducts,
            })
        }
    } catch (error) {
        return NextResponse.json({
            message: error,
            success: false,
        })
    }
}