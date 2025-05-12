import React from "react";
import { cookies } from "next/headers";
import apiRequest from "@/app/lib/api-request";
import AgentAccountPage from "../components/agent-account-page";

interface LicensedState {
  country: string;
  state: string;
  postalCode?: string;
}

export interface AgentType {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  bio?: string;
  profilePictureUrl?: string;
  licensedStates?: LicensedState[];
}

async function Page() {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const response = await apiRequest<{ data: { agent: AgentType } }>(
    "admin/profile",
    {
      token,
      tag: "fetchAgentDataAdmin",
    }
  );

  const agent = response.data.agent;

  return (
    <div>
      <AgentAccountPage agent={agent} />
    </div>
  );
}

export default Page;
