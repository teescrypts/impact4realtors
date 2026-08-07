import { ObjectId } from "mongoose";
import { IAdmin } from "../model/admin";
import { IAppointment } from "../model/appointment";
import Property, { IProperty } from "../model/property";
import { convertToAmPmFormat } from "./convert-to-am-pm";
import { formatCreatedAt } from "./format-created-at";

/**
 * Replace template variables in email content
 * Supports: {{firstName}}, {{lastName}}, {{email}}, {{phone}}, {{agentName}}, etc.
 */
export default async function replaceTemplateVariables(
  agentDetails: IAdmin,
  template: string,
  lead: any,
  progress: any,
  valuation?: any,
  appointmentDetails?: {
    propertyId?: IProperty;
    date: string;
    bookedTime: { from: string; to: string };
  },
): Promise<string> {
  let result = template;

  let propertyAddress;

  if (valuation) {
    propertyAddress = valuation.address;
  } else if (appointmentDetails) {
    const bookedProperty = appointmentDetails?.propertyId;

    if (bookedProperty)
      propertyAddress = `${bookedProperty.location.addressLine1}, ${bookedProperty.location.cityName}, ${bookedProperty.location.stateName}, ${bookedProperty.location.countryName}`;
  }

  console.log("Address", propertyAddress);

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

    propertyAddress,
  };

  // Agent variables (if agent exists)
  // const agent = progress.agent;
  const agentVars = {
    agentName: `${agentDetails.fname} ${agentDetails.lname}`,
    agentEmail: agentDetails.email,
    // Falls back to an empty string rather than a placeholder number: an empty
    // line reads better than a fake one that a lead might actually dial.
    agentPhone: agentDetails.emailBranding?.phone || "",
    companyName: agentDetails.emailBranding?.companyName || "",
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
