import clientPromise from "@/lib/mongo";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
    _id: string;
}

export async function POST(request: NextRequest) {

    const body: RequestBody = await request.json();
    const { _id } = body;

    // Validate ObjectId format
    if (!_id || !ObjectId.isValid(_id)) {
        return NextResponse.json(
            {
                message: "Invalid or missing product ID",
                success: false
            }
        );
    }
    return await getProduct(_id)
}

export async function getProduct(_id: string) {
    try {
        const client = await clientPromise;
        const db = client.db("E_Commerce");
        const productsCollection = db.collection("productData");
        const product = await productsCollection.findOne({ _id: new ObjectId(_id) });
        console.log(product, "sldfnsdlfnkd")
        if (!product) {
            return NextResponse.json(
                {
                    message: "Product not found",
                    success: false
                }
            );
        }

        return NextResponse.json({
            message: "Product found",
            data: product,
            success: true,
        });
    } catch (error) {
        console.error("Error in getProductById:", error);
        return NextResponse.json(
            {
                message: "Internal Server Error",
                success: false
            }
        );
    }
} 
