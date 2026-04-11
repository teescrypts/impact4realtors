// app/api/send-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import fs from "fs";
import path from "path";
import Lead from "@/app/model/lead";
import apiResponse from "@/app/lib/api-response";
import getAdmin from "@/app/utils/get-admin";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdmin(req);
    if (!admin) return apiResponse("Admin Required", null, 401);

    const {
      to,
      subject,
      message,
      agent,
      firstName,
      lastName,
      email,
      buyerType,
      phone,
    } = await req.json();

    console.log({
      to,
      subject,
      message,
      agent,
      firstName,
      lastName,
      email,
      buyerType,
      phone,
    });

    const isAgent = agent ? true : false;

    // Validate required fields
    if (!to || !subject) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject" },
        { status: 400 },
      );
    }

    // Load the PDF from the public/pdf folder
    // Change "document.pdf" to your actual PDF filename
    const pdfFilename = "buyer-guide.pdf";
    const pdfPath = path.join(process.cwd(), "public", "pdf", pdfFilename);

    if (!fs.existsSync(pdfPath)) {
      return NextResponse.json(
        { error: `PDF not found at public/pdf/${pdfFilename}` },
        { status: 404 },
      );
    }

    const pdfBuffer = fs.readFileSync(pdfPath);

    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>", // Must be a verified domain in Resend
      to: Array.isArray(to) ? to : [to],
      subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>${subject}</h2>
          <p>${message ?? "Please find the attached PDF document."}</p>
          <p style="color: #888; font-size: 12px;">
            This email was sent via Resend.
          </p>
        </div>
      `,
      attachments: [
        {
          filename: pdfFilename,
          content: pdfBuffer,
        },
      ],
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const getBuyerProfile = (buyerType: string) => {
      switch (buyerType) {
        case "First-Time Buyers":
          return "First-Time Buyer";
          break;
        case "Relocating Buyers":
          return "Repeat Buyer";
          break;
        case "Investment Buyers":
          return "Investor";
          break;

        default:
          return null;
          break;
      }
    };

    const newLead = new Lead({
      admin,
      ...(isAgent && { agent }),
      category: "Buyer",
      intent: "Buyer Guide",
      buyerProfile: getBuyerProfile(buyerType),
      status: "new lead",
      firstName,
      lastName,
      email,
      phone,
      source: "website",
    });

    await newLead.save();

    return NextResponse.json(
      { success: true, emailId: data?.id, message: "Success" },
      { status: 200 },
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Optional: block non-POST methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
