import React from "react";
import AgentProfilePage from "../../components/agent-profile";
import apiRequest from "@/app/lib/api-request";
import { AgentType } from "../page";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function Page({ params, searchParams }: Props) {
  const agentId = (await params).id;
  const type = (await searchParams)?.type as "general" | "mortgage" | undefined;
  const adminId = (await searchParams).admin as string;

  const response = await apiRequest<{ data: { agent: AgentType } }>(
    `public/agent/${agentId}`,
    {
      tag: "fetchCustomerAgent",
    }
  );

  const agent = response.data.agent;

  return (
    <div>
      <AgentProfilePage
        adminId={adminId}
        agent={agent}
        type={type as "general" | "mortgage"}
      />
    </div>
  );
}

export default Page;
