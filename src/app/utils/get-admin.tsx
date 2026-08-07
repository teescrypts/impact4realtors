import { isValidObjectId } from "mongoose";
import { NextRequest } from "next/server";
import { connectToDB } from "../lib/mongoosejs";
import Admin from "../model/admin";

const DEFAULT_ADMIN_EMAIL = "admin@realtyillustrations.live";

/**
 * Resolve the admin a public request belongs to, from its `adminId` query
 * param, falling back to the default demo account.
 *
 * Returns the id only when it resolves to an account that actually exists.
 * A well-formed ObjectId is not proof of one - a browser tab left open from
 * an earlier session will happily send the id of an admin that has since been
 * removed, and `isValidObjectId` accepts any 12-character string besides.
 * Trusting the id unchecked silently attaches leads to an account nobody can
 * see, so an unknown id resolves to null and the caller rejects the request.
 *
 * Deliberately does NOT fall back to the default admin when the supplied id
 * is unknown: quietly filing someone else's lead is the same bug wearing a
 * different hat.
 */
const getAdmin = async (req: NextRequest): Promise<string | null> => {
  const searchParams = req.nextUrl.searchParams;
  const adminId = searchParams.get("adminId");
  await connectToDB();

  if (adminId && isValidObjectId(adminId)) {
    const existing = await Admin.findById(adminId).select("_id").lean();

    if (existing) return adminId;

    console.warn(
      `getAdmin: adminId "${adminId}" is well-formed but matches no admin - request will be rejected`,
    );
    return null;
  }

  const defaultAdmin = await Admin.findOne({
    email: DEFAULT_ADMIN_EMAIL,
  }).select("_id");

  return (defaultAdmin?._id as string) || null;
};

export default getAdmin;
