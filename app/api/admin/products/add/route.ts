import clientPromise from "@/lib/mongo";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get("token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET ?? "");
        const email = decoded.email;
        const product = await request.json();
        const client = await clientPromise;
        const db = client.db("E_Commerce");
        const users = db.collection("userData");
        const userData = await users.findOne({ email: email })

        const categories = db.collection("categoryData");
        const categoryData = await categories.findOne({ categoryShortName: product?.category })

        // const productsCollection = db.collection("productData");
        // await productsCollection.insertOne({ ...product, userId: userData?._id, categoryId: categoryData?._id });

        return NextResponse.json({ message: "Product added successfully" });
    } catch (error) {
        console.error("Error adding product:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
