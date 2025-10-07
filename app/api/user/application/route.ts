import { users } from "@/app/indexType";
import clientPromise from "@/lib/mongo";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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
        if (!user?.hasApplied && !user?.isAdmin) {
            const appliedUserCollection = db.collection("appliedUserData");
            const addedUser = await appliedUserCollection.insertOne({ userId: user?._id });
            const updatedUser = await users.updateOne({ _id: user?._id }, { $set: { hasApplied: true } });
            if (addedUser.acknowledged && updatedUser.acknowledged) {
                return NextResponse.json({ message: "Application Sent Successfully, we'll get back to you soon", success: true }, { status: 200 });
            }
            else {
                return NextResponse.json({ message: "Some error occured", success: false }, { status: 400 });
            }
        }
        else {
            return NextResponse.json({ message: "Application already Successfully, please wait for approval", success: false }, { status: 200 });
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
