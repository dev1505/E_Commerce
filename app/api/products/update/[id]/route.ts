
import clientPromise from "@/lib/mongo";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string | ObjectId; }> }) {
  try {

    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET ?? "");
    const email = decoded.email;

    const client = await clientPromise;
    const db = client.db("E_Commerce");
    const users = db.collection("userData");

    const user = await users.findOne({ email: email });

    const { id } = await params;
    const product = await request.json();
    const productsCollection = db.collection("productData");
    const updatedProduct = await productsCollection.updateOne({ _id: new ObjectId(id) }, { $set: { ...product, userId: user?._id } });
    if (updatedProduct.acknowledged) {
      return NextResponse.json({ message: "Product updated successfully", success: true }, { status: 200 });
    }
    else {
      return NextResponse.json({ message: "Product not updated", success: false }, { status: 400 });
    }
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false, },
      { status: 500 }
    );
  }
}
