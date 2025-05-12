import React from "react";
import AgentAccountPage from "../../components/agent-account-page";
import { cookies } from "next/headers";
import apiRequest from "@/app/lib/api-request";

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
    "admin/agent",
    {
      token,
      tag: "fetchAgentData",
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
