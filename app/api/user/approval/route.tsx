import clientPromise from "@/lib/mongo";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
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
        if (!user || !user.isSuperuser) {
            return NextResponse.json({ message: "You do not have authority to approve this application" }, { status: 403 });
        }

        const { userId, approved } = await request.json();

        if (!userId) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }

        const userToApprove = await users.findOne({ _id: new ObjectId(userId) });
        if (!userToApprove) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const appliedUserCollection = db.collection("appliedUserData");

        const deleteResult = await appliedUserCollection.deleteOne({ userId: new ObjectId(userId) });
        let updateResult;

        if (approved) {
            updateResult = await users.updateOne({ _id: new ObjectId(userId) }, { $set: { isAdmin: true, hasApplied: false } });
            return NextResponse.json({ message: "Application approved Successfully", success: true }, { status: 200 });
        }
        else {
            updateResult = await users.updateOne({ _id: new ObjectId(userId) }, { $set: { hasApplied: false } });
            return NextResponse.json({ message: "Application declined Successfully", success: true }, { status: 200 });
        }


    } catch (error) {
        console.error("Error approving application:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}