
import clientPromise from "@/lib/mongo";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const product = await request.json();
    const client = await clientPromise;
    const db = client.db("E_Commerce");
    const productsCollection = db.collection("productData");
    await productsCollection.insertOne(product);
    return NextResponse.json({ message: "Product added successfully" });
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
