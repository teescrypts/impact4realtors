import React from "react";
import { Metadata } from "next/types";
import { cookies } from "next/headers";
import apiRequest from "@/app/lib/api-request";
import { AppointmentResponse } from "@/types";
import AppointmentView, {
  AppointmentEventCaledar,
} from "../components/appointment-view";
import { getDateRange } from "@/app/utils/get-date-range";
import { DateTime } from "luxon";

/* ----------------------------- Page Metadata ----------------------------- */
export const metadata: Metadata = {
  title: "Appointment | Innovative Real Estate Solutions",
  description:
    "Explore our live demo website showcasing cutting-edge tools for independent realtors. Our platform offers creative solutions for listing, buying, and renting properties—designed to elevate your real estate business.",
  keywords:
    "realtor demo, real estate solutions, independent realtor, property listing, modern real estate website, innovative real estate, property management",
  icons: {
    icon: "/images/logo.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Realtor Demo | Innovative Real Estate Solutions",
    description:
      "Discover a modern, creative platform designed for independent realtors. Elevate your business with our innovative tools and user-friendly interface.",
    url: "https://realtyillustrations.live",
    type: "website",
    images: [
      {
        url: "https://realtyillustrations.live/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Realtor Demo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Realtor Demo | Innovative Real Estate Solutions",
    description:
      "Explore our live demo website showcasing modern tools for independent realtors.",
    images: ["https://realtyillustrations.live/images/logo.png"],
  },
};

/* ------------------------------- Types ------------------------------- */
export type AppointmentEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  service: string;
  client: { fname: string; lname: string };
  note?: string;
  status: "pending" | "completed" | "cancelled";
};

/* -------------------------- Helper Functions -------------------------- */
async function fetchCalendarAppointments(
  token: string | undefined,
  params: Record<string, string | string[] | undefined>
) {
  const timeZone = "America/New_York";
  const today = DateTime.now().setZone(timeZone).startOf("day").toJSDate();
  const { start, end } = getDateRange("timeGridWeek", today);

  const queryStart = params.start as string | undefined;
  const queryEnd = params.end as string | undefined;

  const url = `admin/appointment?viewType=calendar&start=${encodeURIComponent(
    queryStart || start
  )}&end=${encodeURIComponent(queryEnd || end)}`;

  const response = await apiRequest<{
    data: { appointments: AppointmentEventCaledar[] };
  }>(url, { token, tag: "fetchAdminApt" });

  return response.data.appointments;
}

async function fetchListAppointments(
  token: string | undefined,
  params: Record<string, string | string[] | undefined>
) {
  const queryParams = new URLSearchParams();
  if (params.lastCreatedAt)
    queryParams.append("lastCreatedAt", params.lastCreatedAt as string);
  if (params.status) queryParams.append("status", params.status as string);

  const url = `admin/appointment${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  const response = await apiRequest<{
    data: {
      appointments: AppointmentResponse[];
      hasMore: boolean;
      lastCreatedAt: Date;
    };
  }>(url, { token, tag: "fetchAdminAppointments" });

  return response.data;
}

/* ------------------------------- Page ------------------------------- */
async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session-token")?.value;

  const params = await searchParams;
  const calendarView = params.view === "calendar";

  if (calendarView) {
    const appointments = await fetchCalendarAppointments(token, params);
    return <AppointmentView view="calendar" calendarEvents={appointments} />;
  }

  const { appointments, hasMore, lastCreatedAt } = await fetchListAppointments(
    token,
    params
  );
  
  return (
    <AppointmentView
      view="list"
      appointmentInfo={{ appointments, hasMore, lastCreatedAt }}
    />
  );
}

export default Page;
