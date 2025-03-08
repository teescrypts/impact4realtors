import { isValidObjectId } from "mongoose";
import { NextRequest } from "next/server";
import { connectToDB } from "../lib/mongoosejs";
import Admin from "../model/admin";

const getAdmin = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const adminId = searchParams.get("adminId");
  await connectToDB();

  let admin;
  if (adminId && isValidObjectId(adminId)) {
    admin = adminId;
    return admin;
  } else {
    const defaultAdmin = await Admin.findOne({
      email: "testing@gmail.com",
    }).select("_id");

    admin = defaultAdmin?._id || null;
    return admin;
  }
};

export default getAdmin;
