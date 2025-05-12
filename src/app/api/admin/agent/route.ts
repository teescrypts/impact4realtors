import apiResponse from "@/app/lib/api-response";
import { connectToDB } from "@/app/lib/mongoosejs";
import Admin from "@/app/model/admin";
import Agent from "@/app/model/agent";
import AgentForm from "@/app/model/agent-form";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/lib/_middleware";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const body = await req.json();

    const {
      firstName,
      lastName,
      email,
      phone,
      licenseNumber,
      formId,
      password,
    } = body;

    const form = await AgentForm.findById(formId);

    if (!form) return apiResponse("Form not found", null, 404);

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !licenseNumber) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    // Check if agent already exists by email
    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      return NextResponse.json(
        { message: "An agent with this email already exists." },
        { status: 409 }
      );
    }

    const admin = await Admin.create({
      fname: firstName,
      lname: lastName,
      email,
      password,
      agent: { isAgent: true, admin: form.admin },
    });

    await Agent.create({
      admin: form.admin,
      owner: admin._id,
      firstName,
      lastName,
      email,
      phone,
      licenseNumber,
    });

    await AgentForm.findByIdAndDelete(form._id);
    const token = await admin.generateAuthToken();

    return apiResponse("Success", { token }, 200);
  } catch (e) {
    console.error("[AGENT_POST_ERROR]", e);
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}

export async function PATCH(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const admin = authResponse;
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();

    const {
      firstName,
      lastName,
      email,
      phone,
      licenseNumber,
      bio,
      profilePictureUrl,
      licensedStates,
    } = body;

    const updateData: Partial<{
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      licenseNumber: string;
      bio: string;
      profilePictureUrl: string;
      licensedStates: { contry: string; state: string; postalCode: string }[];
    }> = {
      firstName,
      lastName,
      email,
      phone,
      licenseNumber,
      bio,
      profilePictureUrl,
      licensedStates,
    };

    // Remove undefined fields
    Object.keys(updateData).forEach((key) => {
      if (updateData[key as keyof typeof updateData] === undefined) {
        delete updateData[key as keyof typeof updateData];
      }
    });

    const updatedAgent = await Agent.findOneAndUpdate(
      { owner: admin._id },
      updateData,
      {
        new: true,
      }
    );

    if (!updatedAgent) {
      return NextResponse.json(
        { message: "Agent not found." },
        { status: 404 }
      );
    }

    return apiResponse("Profile updated successfully.", null, 201);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const authResponse = await authMiddleware(req);
    if (authResponse instanceof NextResponse) return authResponse;

    const admin = authResponse;
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const agent = await Agent.findOne({ owner: admin._id }).lean();

    if (!agent) {
      return NextResponse.json(
        { message: "Agent not found." },
        { status: 404 }
      );
    }

    return apiResponse("Success", { agent }, 200);
  } catch (e) {
    console.error("[AGENT_FETCH_ERROR]", e);
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
