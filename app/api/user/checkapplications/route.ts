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

        if (user?.isSuperuser) {
            const userCollection = db.collection("userData");

            const allUsers = await userCollection.aggregate([
                { $match: { hasApplied: true } },
                {
                    $lookup: {
                        from: "appliedUserData",
                        localField: "_id",
                        foreignField: "userId",
                        as: "appliedData"
                    }
                }
            ]).toArray();
            if (allUsers.length) {
                return NextResponse.json({ message: "User applications found", data: allUsers, success: true }, { status: 200 });
            }
            else {
                return NextResponse.json({ message: "No user applications", success: true, data: [] }, { status: 200 });
            }
        }
        else {
            return NextResponse.json({ message: "You do not have authority to check admin applications", success: false }, { status: 200 });
        }

    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
