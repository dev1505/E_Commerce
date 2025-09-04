// app/api/page/[page]/route.ts
import clientPromise from "@/lib/mongo";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { page: string } }) {
    try {
        const { categoryId = "All", limit = 8 } = await request.json();
        const page = parseInt((await params).page) || 1;

        const client = await clientPromise;
        const db = client.db("E_Commerce");
        const productsCollection = db.collection("productData");

        const skip = (page - 1) * limit;
        const filter = categoryId === "All" ? {} : { categoryId: new ObjectId(categoryId) };

        const products = await productsCollection
            .find(filter)
            .sort({ randomSeed: 1, _id: 1 })
            .skip(skip)
            .limit(limit)
            .toArray();

        const totalProducts = await productsCollection.countDocuments(filter);

        return NextResponse.json({
            message: "Products fetched successfully",
            data: products,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: page,
            success: true,
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(
            {
                message: "Internal Server Error",
                success: false,
            },
            { status: 500 }
        );
    }
}
