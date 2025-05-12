import React from "react";
import OurAgentsPage from "../components/our-agents";
import apiRequest from "@/app/lib/api-request";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

interface ILicensedState {
  country: string;
  state: string;
  postalCode?: string;
}

export interface AgentType {
  owner: string;
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  bio?: string;
  profilePictureUrl?: string;
  licensedStates?: ILicensedState[];
}

async function Page({ searchParams }: Props) {
  const adminId = (await searchParams).admin as string | undefined;
  const url = adminId ? `public/agent?adminId=${adminId}` : `public/aagent`;
  const response = await apiRequest<{
    data: {
      agents: AgentType[];
      total: number;
      currentPage: number;
      totalPages: number;
    };
  }>(url, { tag: "fetchCustomerAgent" });

  const agents = response.data.agents;
  const total = response.data.total;
  const currentPage = response.data.currentPage;
  const totalPages = response.data.totalPages;

  return (
    <div>
      <OurAgentsPage
        adminId={adminId}
        agents={agents}
        total={total}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
}

export default Page;
