import React from "react";
import AgentSignupForm from "../../components/agent-singup-form";
import apiRequest from "@/app/lib/api-request";

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const response = await apiRequest<{ data: { form: { email: string } } }>(
    `admin/agent/form/${id}`
  );

  const email = response.data.form.email;

  return (
    <div>
      <AgentSignupForm email={email} formId={id} />
    </div>
  );
}

export default Page;
