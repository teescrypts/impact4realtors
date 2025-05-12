import React from "react";
import PendingFormsPage from "../../components/pendig-forms";
import { cookies } from "next/headers";
import apiRequest from "@/app/lib/api-request";

async function Page() {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const response = await apiRequest<{
    data: { forms: { _id: string; email: string; createdAt: string }[] };
  }>("admin/agent/form", {
    token,
    tag: "fetchPendingForms"
  });

  const forms = response.data.forms;

  return (
    <div>
      <PendingFormsPage forms={forms} />
    </div>
  );
}

export default Page;
