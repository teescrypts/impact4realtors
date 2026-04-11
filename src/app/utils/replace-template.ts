import { IAdmin } from "../model/admin";
import { IAppointment } from "../model/appointment";
import { convertToAmPmFormat } from "./convert-to-am-pm";
import { formatCreatedAt } from "./format-created-at";

/**
 * Replace template variables in email content
 * Supports: {{firstName}}, {{lastName}}, {{email}}, {{phone}}, {{agentName}}, etc.
 */
export default function replaceTemplateVariables(
  agentDetails: IAdmin,
  appointmentDetails: IAppointment | null,
  template: string,
  lead: any,
  progress: any,
  valuation?: any,
): string {
  let result = template;
  const property = appointmentDetails?.propertyId as any;

  // Lead variables
  const leadVars = {
    firstName: lead.firstName || "",
    lastName: lead.lastName || "",
    // fullName: `${lead.firstName || ""} ${lead.lastName || ""}`.trim(),
    email: lead.email || "",
    phone: lead.phone || "",
    // category: lead.category || "",
    // intent: lead.intent || "",
    // status: lead.status || "",
    // buyerProfile: lead.buyerProfile || "",

    ...(appointmentDetails && {
      appointmentDate: formatCreatedAt(appointmentDetails.date),
    }),
    ...(appointmentDetails && {
      appointmentTime: convertToAmPmFormat(appointmentDetails.bookedTime.from),
    }),

    propertyAddress: valuation
      ? valuation.address
      : `${property.location.addressLine1}, {property.location.cityName}, {property.location.stateName}, {property.location.countryName}`,
  };

  // Agent variables (if agent exists)
  // const agent = progress.agent;
  const agentVars = {
    agentName: `${agentDetails.fname} ${agentDetails.lname}`,
    agentEmail: agentDetails.email,
    agentPhone: "(555)-123-1234",
  };

  // Journey variables
  const journeyVars = {
    journeyName: progress.journey?.name || "",
  };

  // Combine all variables
  const allVars = {
    ...leadVars,
    ...agentVars,
    ...journeyVars,
  };

  // Replace all {{variable}} patterns
  Object.entries(allVars).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, "gi");
    result = result.replace(regex, value);
  });

  return result;
}
