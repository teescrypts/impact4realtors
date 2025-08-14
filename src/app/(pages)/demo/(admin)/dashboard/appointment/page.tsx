import React from "react";
import { Metadata } from "next/types";
import { cookies } from "next/headers";
import apiRequest from "@/app/lib/api-request";
import { AppointmentResponse } from "@/types";
import AppointmentView, { AppointmentEventCaledar } from "../components/appointment-view";
import { getDateRange } from "@/app/utils/get-date-range";
import { DateTime } from "luxon";

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
    url: "https://realtyillustrations.live", // Replace with your actual domain
    type: "website",
    images: [
      {
        url: "https://realtyillustrations.live/images/logo.png", // Replace with your actual OG image URL
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
    images: ["https://realtyillustrations.live/images/logo.png"], // Replace accordingly
  },
};

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

async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const params = await searchParams;
  const calendarView = params.view === "calendar" ? true : false;

  if (calendarView) {
    const timeZone = "America/New_York";
    const today = DateTime.now().setZone(timeZone).startOf("day").toJSDate();
    const { start, end } = getDateRange("timeGridWeek", today);

    const queryStart = (await searchParams)?.start as string | undefined;
    const queryEnd = (await searchParams)?.end as string | undefined;

    const url = `admin/appointment?viewType=calendar&start=${encodeURIComponent(
      queryStart || start
    )}&end=${encodeURIComponent(queryEnd || end)}`;

    const response = await apiRequest<{
      data: { appointments: AppointmentEventCaledar[] };
    }>(url, {
      token,
      tag: "fetchAdminApt",
    });

    const appointments = response.data.appointments;

    return <AppointmentView view="calendar" calendarEvents={appointments} />;
  } else {
    const lastCreatedAtQuery = params.lastCreatedAt as string | undefined;
    const status = params.status as string | undefined;

    // Build the API request URL dynamically
    const queryParams = new URLSearchParams();
    if (lastCreatedAtQuery)
      queryParams.append("lastCreatedAt", lastCreatedAtQuery);
    if (status) queryParams.append("status", status);

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

    const appointments = response.data.appointments;
    const hasMore = response.data.hasMore;
    const lastCreatedAt = response.data.lastCreatedAt;

    const appt = { appointments, hasMore, lastCreatedAt };

    return <AppointmentView view="list" appointmentInfo={appt} />;
  }
}

export default Page;
