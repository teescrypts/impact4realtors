import React from "react";
import AdminAgentManagement from "../components/admin-agent-mgt";
import { cookies } from "next/headers";
import apiRequest from "@/app/lib/api-request";

export type AgentTableType = {
  id: string;
  name: string;
  email: string;
  availability: string;
  leads: number;
  activeAppointments: number;
};

async function Page() {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const response = await apiRequest<{
    data: { result: AgentTableType[]; pendingForms: number };
  }>(`admin/agent/admin`, {
    token,
    tag: "fetchAdminAgents",
  });

  return (
    <div>
      <AdminAgentManagement
        agents={response.data.result}
        pendingForms={response.data.pendingForms}
      />
    </div>
  );
}

export default Page;
