
import clientPromise from "@/lib/mongo";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
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

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { password, ...safeUser } = user;

    return NextResponse.json({ data: safeUser });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
