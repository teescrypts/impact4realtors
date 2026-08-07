// app/api/public/buyer-guide/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import fs from "fs";
import path from "path";
import Lead from "@/app/model/lead";
import apiResponse from "@/app/lib/api-response";
import getAdmin from "@/app/utils/get-admin";
import { handleTagAssignment } from "@/app/lib/execution-engine/entry-handler";

const resend = new Resend(process.env.RESEND_API_KEY);

const PDF_FILENAME = "buyer-guide.pdf";

const getBuyerProfile = (buyerType: string) => {
  switch (buyerType) {
    case "First-Time Buyers":
      return "First-Time Buyer";
    case "Relocating Buyers":
      return "Repeat Buyer";
    case "Investment Buyers":
      return "Investor";
    default:
      return null;
  }
};

export async function POST(req: NextRequest) {
  try {
    // Resolves to null when the id matches no account - which is what a stale
    // tab from a previous session sends.
    const admin = await getAdmin(req);
    if (!admin)
      return apiResponse(
        "This link is out of date. Please reload the page and try again.",
        null,
        400,
      );

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

    const isAgent = agent ? true : false;

    // Validate everything the email AND the lead need before doing any of it.
    // These are all required by the Lead schema, so catching them here is the
    // difference between a clear 400 and a failed save after the guide has
    // already gone out.
    const missing = Object.entries({
      to,
      subject,
      firstName,
      lastName,
      email,
      phone,
    })
      .filter(([, value]) => !value)
      .map(([key]) => key);

    if (missing.length > 0)
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 },
      );

    const pdfPath = path.join(process.cwd(), "public", "pdf", PDF_FILENAME);

    if (!fs.existsSync(pdfPath))
      return NextResponse.json(
        { error: `PDF not found at public/pdf/${PDF_FILENAME}` },
        { status: 404 },
      );

    const pdfBuffer = fs.readFileSync(pdfPath);

    // Save the lead FIRST.
    //
    // The guide used to be sent before this, which meant any failure here -
    // a validation error, an unresolved admin - left the visitor holding the
    // PDF with no record of them anywhere. A lead without its guide can be
    // followed up manually; a guide without its lead is lost business.
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

    const { data, error } = await resend.emails.send({
      from: "Buyer Guide <support@realtyillustration.com>", // Must be a verified domain in Resend
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
          filename: PDF_FILENAME,
          content: pdfBuffer,
        },
      ],
    });

    // The lead is already captured, so a send failure is reported without
    // discarding it.
    if (error)
      console.error(`Resend error for lead ${newLead._id}:`, error);

    // Automation failures must not fail the capture either.
    try {
      await handleTagAssignment(newLead._id, newLead.status);
    } catch (tagError) {
      console.error(
        `Tag assignment failed for lead ${newLead._id}:`,
        tagError,
      );
    }

    return NextResponse.json(
      {
        success: true,
        emailId: data?.id,
        emailSent: !error,
        message: error
          ? "We saved your details, but the guide could not be emailed. We'll be in touch."
          : "Success",
      },
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
