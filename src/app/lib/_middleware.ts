import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDB } from "./mongoosejs";
import Admin, { IAdmin, IAdminModel } from "../model/admin";

export async function authMiddleware(
  req: NextRequest
): Promise<IAdmin | NextResponse> {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      _id: string;
    };

    await connectToDB();
    const user = await Admin.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return user;
  } catch (error) {
    return NextResponse.json(
      { error: "Please authenticate." },
      { status: 401 }
    );
  }
}
