import React from "react";
import { cookies } from "next/headers";
import apiRequest from "@/app/lib/api-request";
import EvaluationList from "../components/home-valuaton";

export interface ValuationRequest {
  _id: string;
  address: string;
  bedrooms?: number;
  bathrooms?: number;
  yearBuilt?: number;
  squareFootage?: number;
  purpose:
    | "selling"
    | "buying"
    | "refinancing"
    | "investment"
    | "curiosity"
    | "other";
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: "Pending" | "Done";
  createdAt: Date;
}

async function Page() {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const response = await apiRequest<{ data: { requests: ValuationRequest[] } }>(
    "admin/valuation",
    {
      token,
      tag: "fetchAdminValuation",
    }
  );

  return (
    <div>
      <EvaluationList requests={response.data.requests} />
    </div>
  );
}

export default Page;
