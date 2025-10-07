
import clientPromise from "@/lib/mongo";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string; }> }) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("E_Commerce");
    const productsCollection = db.collection("productData");
    await productsCollection.deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
