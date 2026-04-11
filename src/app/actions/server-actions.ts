"use server";

import { cookies } from "next/headers";
import apiRequest from "../lib/api-request";
import { redirect } from "next/navigation";
import { format, parse } from "date-fns";
import {
  ActionStateType,
  AgentReq,
  AppointmentData,
  AppointmentRequestData,
  AppointmentResponse,
  Availability,
  BlogType,
  NotificationResType,
  PropertyType,
} from "@/types";
import { revalidateTag } from "next/cache";
// import { AgentType } from "../(pages)/demo/(admin)/agent/dashboard/account/page";
import {
  CreateTagPayload,
  ReorderTagsPayload,
  UpdateTagPayload,
} from "../(pages)/demo/(admin)/dashboard/components/tag/types/tag";
import {
  CreateJourneyPayload,
  UpdateJourneyPayload,
} from "../(pages)/demo/(admin)/dashboard/components/journey/types/api";
import { Progress } from "../(pages)/demo/(admin)/dashboard/components/lead/lead-detail-panel";
import { IScheduledAction } from "../model/journey/ScheduledAction";
import { ILead } from "../model/lead";

const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

export async function sendBuyerPdf(prev: ActionStateType, formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const buyerType = formData.get("buyerType") as string;
  const phone = formData.get("phone") as string;
  const admin = formData.get("admin") as string;

  try {
    const response = await apiRequest<
      { message: string },
      {
        to: string;
        subject: string;
        message: string;
        firstName: string;
        lastName: string;
        email: string;
        buyerType: string;
        phone: string;
      }
    >(`public/buyer-guide?adminId=${admin}`, {
      method: "POST",
      data: {
        to: email,
        subject: "Buyer Guide from realty illustration",
        message: "Here is your Buyer Guide",
        firstName,
        lastName,
        email,
        buyerType,
        phone,
      },
    });

    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  let isAgent;

  try {
    const response = await apiRequest<
      {
        message: string;
        data: { token: string; isAgent: boolean };
      },
      { email: string; password: string }
    >("public/login", {
      method: "POST",
      data: { email, password },
    });

    const cookieStore = cookies();
    (await cookieStore).set({
      name: "session-token",
      value: response.data.token,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: ONE_WEEK_IN_SECONDS,
    });

    isAgent = response.data.isAgent;
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }

  if (isAgent) {
    redirect("/demo/agent/dashboard/lead");
  } else {
    redirect("/demo/dashboard/home");
  }
}

export async function demoLogin(
  prevState: ActionStateType,
  formData: FormData,
) {
  const email = formData.get("email") as string;
  const type = formData.get("type") as string;

  try {
    const response = await apiRequest<
      {
        message: string;
        data: { token: string; isBroker: boolean };
      },
      { email: string; type: string }
    >("public/sign-up", {
      method: "POST",
      data: { email, type },
    });

    if (response.message === "success") {
      const cookieStore = cookies();
      (await cookieStore).set({
        name: "session-token",
        value: response.data.token,
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: ONE_WEEK_IN_SECONDS,
      });
    } else {
      throw new Error(response.message);
    }
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }

  redirect("/demo/dashboard/home");
  return { message: "Success" };
}

export async function authenticateAgent() {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  if (token) {
    try {
      const response = await apiRequest<{
        message: string;
        data: {
          user: {
            _id: string;
            fname: string;
            lname: string;
            email: string;
            isBroker: boolean;
            agent: { isAgent: boolean; admin: string };
            google: {
              calendarSyncEnabled: boolean;
            };
          };
          unreadNotifictaionsCount: number;
        } | null;
      }>("admin/authenticate", { token });

      if (response.data) {
        const user = response.data.user;
        const unreadNotifictaionsCount = response.data.unreadNotifictaionsCount;

        if (!user.agent.isAgent) throw new Error("Please login as an Agent");

        return {
          ok: true,
          user,
          unreadNotifictaionsCount,
        };
      }
    } catch (e) {
      if (e instanceof Error) {
        return { error: e.message };
      } else {
        return { error: "An unknown error occurred" };
      }
    }
  }
}

export async function authenticate() {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  if (token) {
    try {
      const response = await apiRequest<{
        message: string;
        data: {
          user: {
            _id: string;
            fname: string;
            lname: string;
            email: string;
            isBroker: boolean;
            agent: { isAgent: boolean };
            google: {
              calendarSyncEnabled: boolean;
            };
          };
          unreadNotifictaionsCount: number;
        } | null;
      }>("admin/authenticate", { token });

      if (response.data) {
        const user = response.data.user;
        const unreadNotifictaionsCount = response.data.unreadNotifictaionsCount;

        if (user.agent.isAgent) throw new Error("Please login as the admin");

        return {
          ok: true,
          user,
          unreadNotifictaionsCount,
        };
      }
    } catch (e) {
      if (e instanceof Error) {
        return { error: e.message };
      } else {
        return { error: "An unknown error occurred" };
      }
    }
  }
}

export async function addHour(prev: ActionStateType, formData: FormData) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const to = formData.get("to") as string;
  const from = formData.get("from") as string;

  if (!to && !from) return { error: "Ensure start and end time are selected" };

  const parsedFrom = parse(from, "hh:mm a", new Date());
  const parsedTo = parse(to, "hh:mm a", new Date());

  const data = {
    day: formData.get("day") as string,
    from: format(parsedFrom, "HH:mm"),
    to: format(parsedTo, "HH:mm"),
  };

  try {
    const response = await apiRequest<
      { message: string },
      { day: string; to: string; from: string }
    >("admin/openings", {
      method: "POST",
      data,
      token,
    });

    revalidateTag("fetchOpenings", "max");
    return { ok: true, message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function updateAvailability(
  availability: "available" | "unavailable",
) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const data = { availability };

  try {
    const response = await apiRequest<
      { message: string },
      { availability: string }
    >("admin/openings", {
      method: "PATCH",
      data,
      token,
    });

    revalidateTag("fetchOpenings", "max");
    return { ok: true, message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function deleteTimeSlot(
  day: string,
  timeSlot: {
    from: string;
    to: string;
  },
) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const data = {
    day,
    timeSlot,
  };

  try {
    const response = await apiRequest<
      { message: string },
      { day: string; timeSlot: { from: string; to: string } }
    >("admin/openings", {
      method: "DELETE",
      data,
      token,
    });

    revalidateTag("fetchOpenings", "max");
    return { ok: true, message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function uploadImage(formData: FormData) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest<
      { message: string },
      { formData: FormData }
    >("admin/image", {
      method: "POST",
      token,
      contentType: "multipart/form-data",
      data: formData,
    });

    revalidateTag("fetchBlogDraftImg", "max");
    revalidateTag("fetchistingDraftImgs", "max");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function deleteBlogImage(id: string, blogId?: string) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const url = blogId ? `admin/${id}/image?blog=${blogId}` : `admin/${id}/image`;

  try {
    const response = await apiRequest<{ message: string }>(url, {
      method: "DELETE",
      token,
    });

    revalidateTag("fetchBlogDraftImg", "max");
    revalidateTag("fetchAdminBlogs", "max");
    revalidateTag("fetchAdminBlog", "max");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function deleteImage(id: string, propertyId?: string) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const url = propertyId
    ? `admin/${id}/image?property=${propertyId}`
    : `admin/${id}/image`;

  try {
    const response = await apiRequest<{ message: string }>(url, {
      method: "DELETE",
      token,
    });

    revalidateTag("fetchistingDraftImgs", "max");
    revalidateTag("fetchAdminProperty", "max");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function deleteImages(ids: string[]) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest<
      { message: string },
      { imageIds: string[] }
    >("admin/image", {
      method: "DELETE",
      token,
      data: { imageIds: ids },
    });

    revalidateTag("fetchistingDraftImgs", "max");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function listProperty(
  features: string[],
  draftImages: { url: string; imageId: string; fileName: string }[],
  prev: ActionStateType,
  formData: FormData,
) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  if (features.length === 0)
    return { error: "Esure to include at least one feature." };
  if (draftImages.length === 0)
    return { error: "Ensure to include at least one image" };

  const data = {
    features,
    images: draftImages,
    propertyTitle: formData.get("propertyTitle") as string,
    price: Number(formData.get("price")) as number,
    bedrooms: Number(formData.get("bedrooms")) as number,
    bathrooms: Number(formData.get("bathrooms")) as number,
    squareMeters: Number(formData.get("squareMeters")) as number,
    description: formData.get("description") as string,
    category: formData.get("category") as "For Sale" | "For Rent",
    propertyType: formData.get("propertyType") as
      | "House"
      | "Apartment"
      | "Condo",
    status: formData.get("status") as "Active" | "Pending" | "Sold",
    location: {
      addressLine1: formData.get("line1") as string,
      addressLine2: formData.get("line2") as string,
      countryName: formData.get("countryName") as string,
      countryCode: formData.get("countryCode") as string,
      stateName: formData.get("stateName") as string,
      stateCode: formData.get("stateCode") as string,
      cityName: formData.get("cityName") as string,
      cityCode: formData.get("cityCode") as string,
      postalCode: formData.get("postalCode") as string,
    },
  };

  try {
    const response = await apiRequest<{ message: string }, PropertyType>(
      "admin/listing",
      {
        method: "POST",
        token,
        data,
      },
    );

    revalidateTag("fetchAdminProperties", "max");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function updateProperty(
  features: string[],
  draftImages: { url: string; imageId: string; fileName: string }[],
  prev: ActionStateType,
  formData: FormData,
) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  if (features.length === 0)
    return { error: "Esure to include at least one feature." };
  if (draftImages.length === 0)
    return { error: "Ensure to include at least one image" };

  const data = {
    features,
    images: draftImages,
    propertyTitle: formData.get("propertyTitle") as string,
    price: Number(formData.get("price")) as number,
    bedrooms: Number(formData.get("bedrooms")) as number,
    bathrooms: Number(formData.get("bathrooms")) as number,
    squareMeters: Number(formData.get("squareMeters")) as number,
    description: formData.get("description") as string,
    category: formData.get("category") as "For Sale" | "For Rent",
    propertyType: formData.get("propertyType") as
      | "House"
      | "Apartment"
      | "Condo",
    status: formData.get("status") as "Active" | "Pending" | "Sold",
    location: {
      addressLine1: formData.get("line1") as string,
      addressLine2: formData.get("line2") as string,
      countryName: formData.get("countryName") as string,
      countryCode: formData.get("countryCode") as string,
      stateName: formData.get("stateName") as string,
      stateCode: formData.get("stateCode") as string,
      cityName: formData.get("cityName") as string,
      cityCode: formData.get("cityCode") as string,
      postalCode: formData.get("postalCode") as string,
    },
  };

  try {
    const response = await apiRequest<{ message: string }, PropertyType>(
      `admin/listing/${formData.get("id")}`,
      {
        method: "PATCH",
        token,
        data,
      },
    );

    revalidateTag("fetchAdminProperty", "max");
    revalidateTag("fetchAdminProperties", "max");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function updatePropertyStatus(id: string, status: string) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest<{ message: string }, { status: string }>(
      `admin/listing/${id}`,
      {
        method: "PATCH",
        token,
        data: { status },
      },
    );

    revalidateTag("fetchAdminProperty", "max");
    revalidateTag("fetchAdminProperties", "max");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function deleteProperty(id: string) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest<{ message: string }>(
      `admin/listing/${id}`,
      {
        method: "DELETE",
        token,
      },
    );

    revalidateTag("fetchAdminProperty", "max");
    revalidateTag("fetchAdminProperties", "max");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function updateBlog(
  cover: { url: string; imageId: string; fileName: string } | null,
  status: "Draft" | "Published",
  prevState: ActionStateType,
  formData: FormData,
) {
  if (!cover) {
    return { error: "Please add a blog image" };
  }

  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const data = {
    title: formData.get("title") as string,
    shortDescription: formData.get("shortDescription") as string,
    author: formData.get("author") as string,
    content: formData.get("content") as string,
    estReadTime: Number(formData.get("estReadTime")) as number,
    cover,
    status,
  };

  try {
    const response = await apiRequest<{ message: string }, BlogType>(
      `admin/blog/${formData.get("id")}`,
      {
        method: "PATCH",
        token,
        data,
      },
    );

    revalidateTag("fetchBlogDraftImg", "max");
    revalidateTag("fetchAdminBlogs", "max");
    revalidateTag("fetchAdminBlog", "max");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function uploadBlog(
  cover: { url: string; imageId: string; fileName: string } | null,
  status: "Draft" | "Published",
  prevState: ActionStateType,
  formData: FormData,
) {
  if (!cover) {
    return { error: "Please add a blog image" };
  }

  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const data = {
    title: formData.get("title") as string,
    shortDescription: formData.get("shortDescription") as string,
    author: formData.get("author") as string,
    content: formData.get("content") as string,
    estReadTime: Number(formData.get("estReadTime")) as number,
    cover,
    status,
  };

  try {
    const response = await apiRequest<{ message: string }, BlogType>(
      "admin/blog",
      {
        method: "POST",
        token,
        data,
      },
    );

    revalidateTag("fetchAdminBlogs", "max");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function deleteBlog(id: string) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest<{ message: string }>(`admin/blog/${id}`, {
      method: "DELETE",
      token,
    });

    revalidateTag("fetchAdminBlogs", "max");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function fetchAvailabilty(
  type: string,
  startDate: string | undefined,
  adminId?: string,
  agent?: string,
) {
  const url = agent
    ? `public/booking/availability?type=${type}&adminId=${adminId}&agent=${agent}&startDate=${
        startDate ? startDate : undefined
      }`
    : `public/booking/availability?type=${type}&adminId=${adminId}&startDate=${
        startDate ? startDate : undefined
      }`;

  try {
    const response = await apiRequest<{
      message: string;
      data: {
        availability: Availability[];
        timeZone: string;
        nextStartDate: string;
      };
    }>(url, {
      tag: "FetchPublicAvailability",
    });

    if (response.message === "Success") {
      const availability = response.data.availability;
      const timeZone = response.data.timeZone;
      const nextStartDate = response.data.nextStartDate;

      return { availability, timeZone, nextStartDate };
    } else {
      return { message: response.message };
    }
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function bookAppointment(
  adminId: string | undefined,
  appointmentData: AppointmentData,
  prevState: ActionStateType,
  formData: FormData,
) {
  const data = {
    ...appointmentData,
    customer: {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phoneNumber") as string,
    },
    ...(formData.get("propertyTypeToSell") && {
      propertyTypeToSell: formData.get("propertyTypeToSell") as string,
    }),
    ...(formData.get("agent") && { agent: formData.get("agent") as string }),
  };

  try {
    const response = await apiRequest<
      { message: string },
      AppointmentRequestData
    >(`public/booking?adminId=${adminId}`, {
      method: "POST",
      data,
    });

    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function updateLeadStatus(status: string, id: string) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest<{ message: string }, { status: string }>(
      `admin/lead/${id}`,
      {
        method: "PATCH",
        token,
        data: { status },
      },
    );

    revalidateTag("fetchAdminLead", "max");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function deleteLead(id: string) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest<{ message: string }>(`admin/lead/${id}`, {
      method: "DELETE",
      token,
    });

    revalidateTag("fetchAdminLead", "max");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function fetchMoreAppointments(
  lastCreatedAt: Date,
  status?: string,
) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const url = status
    ? `admin/appointment?lastCreatedAt=${lastCreatedAt}&status=${status}`
    : `admin/appointment?lastCreatedAt=${lastCreatedAt}`;

  try {
    const response = await apiRequest<{
      data: {
        appointments: AppointmentResponse[];
        hasMore: boolean;
        lastCreatedAt: Date;
      };
    }>(url, { token });

    return { data: response.data };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function fetchAdminAvailableDates(
  type: string,
  nextStartDate?: string,
) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const url = nextStartDate
    ? `admin/availability?type=${type}&startDate=${nextStartDate}`
    : `admin/availability?type=${type}`;

  try {
    const response = await apiRequest<{
      data: {
        availability: Availability[];
        timeZone: string;
        nextStartDate: string;
      };
    }>(url, {
      token,
      tag: "fetchAdminAvailability",
    });

    const availability = response.data.availability;
    const timeZone = response.data.timeZone;
    const nextStartDate = response.data.nextStartDate;

    return { data: { availability, timeZone, nextStartDate } };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function rescheduleApt(
  date: string,
  from: string,
  to: string,
  id: string,
) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const data = {
    newDate: date,
    newBookedTime: {
      from,
      to,
    },
  };

  try {
    const response = await apiRequest<
      { message: string },
      { newDate: string; newBookedTime: { from: string; to: string } }
    >(`admin/appointment/reschedule/${id}`, {
      method: "PUT",
      token,
      data,
    });

    revalidateTag("fetchAdminAppointments", "max");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function updateAptStatus(status: string, id: string) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest<{ message: string }, { status: string }>(
      `admin/appointment/${id}`,
      {
        method: "PATCH",
        token,
        data: { status },
      },
    );

    revalidateTag("fetchAdminAppointments", "max");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function addNewsLetter(
  prevState: ActionStateType,
  formData: FormData,
) {
  const email = formData.get("email") as string;
  const admin = formData.get("admin") as string;

  try {
    const response = await apiRequest<{ message: string }, { email: string }>(
      `public/newsletter?adminId=${admin}`,
      {
        method: "POST",
        data: { email },
      },
    );

    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function fetchNotifications(lastCreatedAt?: Date) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const url = lastCreatedAt
    ? `admin/notification?lastCreatedAt=${lastCreatedAt}`
    : `admin/notification`;

  try {
    const response = await apiRequest<{
      data: {
        notifications: NotificationResType[];
        hasMore: boolean;
        lastCreatedAt: Date | null;
      };
    }>(url, { token, tag: "fetchAdminNotification" });

    return { data: response.data };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function markNotificationAsRead(id: string) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest<{ message: string }>(
      `admin/notification/${id}`,
      {
        method: "PATCH",
        token,
      },
    );

    revalidateTag("fetchAdminNotification", "max");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function deleteNotification(id: string) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest<{ message: string }>(
      `admin/notification/${id}`,
      {
        method: "DELETE",
        token,
      },
    );

    revalidateTag("fetchAdminNotification", "max");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function fetchMoreLeads(type: string, lastCreatedAt: Date | null) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const url = lastCreatedAt
    ? `admin/lead?lastCreatedAt=${lastCreatedAt}&type=${type}`
    : `admin/lead?type=${type}`;

  try {
    const response = await apiRequest<{
      data: { leads: ILead[]; hasMore: boolean; lastCreatedAt: Date | null };
    }>(url, { token });

    return { data: response.data };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function sendAgentForm(email: string) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest<{ message: string }, { email: string }>(
      "admin/agent/form",
      {
        method: "POST",
        token,
        data: { email },
      },
    );

    revalidateTag("fetchAdminAgents", "max");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function deleteForm(id: string) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest<{ message: string }>(
      `admin/agent/form?id=${id}`,
      {
        method: "DELETE",
        token,
      },
    );

    revalidateTag("fetchPendingForms", "max");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function deleteAgent(id: string) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest<{ message: string }>(
      `admin/agent/admin/${id}`,
      {
        method: "DELETE",
        token,
      },
    );

    revalidateTag("fetchPendingForms", "max");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function agentSignUp(
  prevState: ActionStateType,
  formData: FormData,
) {
  let success;
  if (formData.get("password") !== formData.get("cPassword")) {
    return { error: "Password does not match" };
  }

  const data = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    licenseNumber: formData.get("licenseNumber") as string,
    formId: formData.get("formId") as string,
    password: formData.get("password") as string,
  };

  try {
    const response = await apiRequest<{ data: { token: string } }, AgentReq>(
      "admin/agent",
      { method: "POST", data },
    );

    success = true;
    const cookieStore = cookies();
    (await cookieStore).set({
      name: "session-token",
      value: response.data.token,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: ONE_WEEK_IN_SECONDS,
    });
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }

  if (success) redirect("/demo/agent/dashboard/lead");
  return { message: "Success" };
}

export async function uploadProfilePic(formData: FormData) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest<
      { message: string },
      { formData: FormData }
    >("admin/agent/profile-pic", {
      method: "POST",
      token,
      contentType: "multipart/form-data",
      data: formData,
    });

    revalidateTag("fetchAgentData", "max");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

// export async function updateAgentProfile(data: AgentType) {
//   const cookieStore = await cookies();
//   const tokenObj = cookieStore.get("session-token");
//   const token = tokenObj?.value;

//   try {
//     const response = await apiRequest<{ message: string }, AgentType>(
//       "admin/agent",
//       {
//         method: "PATCH",
//         token,
//         data,
//       },
//     );

//     return { message: response.message };
//   } catch (e) {
//     if (e instanceof Error) {
//       return { error: e.message };
//     } else {
//       return { error: "An unknown error occurred" };
//     }
//   }
// }

export async function sendSellRequest(
  prevState: ActionStateType,
  formData: FormData,
) {
  const data = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    state: formData.get("state") as string,
    zipCode: formData.get("zipCode") as string,
  };

  const adminId = formData.get("admin") as string | undefined;
  const url = adminId ? `public/connect?adminId=${adminId}` : `public/connect`;

  try {
    const response = await apiRequest<
      { message: string },
      {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        state: string;
        zipCode: string;
      }
    >(url, { method: "POST", data });

    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function valuationRequest(
  adminId: string | undefined,
  data: {
    address: string;
    bedrooms?: string;
    bathrooms?: string;
    yearBuilt?: string;
    squareFootage?: string;
    purpose: string;
    firstName: string;
    lastName: string;
    email: string;
    zipCode: string;
    state: string;
    phone: string;
  },
  // prevState: ActionStateType
) {
  const iData = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    address: data.address,
    purpose: data.purpose,
    bedrooms: Number(data.bedrooms) as number,
    bathrooms: Number(data.bathrooms) as number,
    squareFootage: Number(data.squareFootage) as number,
    yearBuilt: Number(data.yearBuilt) as number,
    zipCode: data.zipCode,
    state: data.state,
    type: "homeValuation",
  };

  const url = adminId ? `public/connect?adminId=${adminId}` : `public/connect`;

  try {
    const response = await apiRequest<
      { message: string },
      {
        address: string;
        bedrooms?: number;
        bathrooms?: number;
        yearBuilt?: number;
        squareFootage?: number;
        purpose: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
      }
    >(url, {
      method: "POST",
      data: iData,
    });

    revalidateTag("fetchAdminValuation", "max");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function sendEvaluationReq(
  adminId: string | undefined,
  data: {
    address: string;
    bedrooms?: string;
    bathrooms?: string;
    yearBuilt?: string;
    squareFootage?: string;
    purpose: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  },
  // prevState: ActionStateType
) {
  const iData = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    address: data.address,
    purpose: data.purpose,
    bedrooms: Number(data.bedrooms) as number,
    bathrooms: Number(data.bathrooms) as number,
    squareFootage: Number(data.squareFootage) as number,
    yearBuilt: Number(data.yearBuilt) as number,
  };

  const url = adminId
    ? `public/valuation?adminId=${adminId}`
    : `public/valuation`;

  try {
    const response = await apiRequest<
      { message: string },
      {
        address: string;
        bedrooms?: number;
        bathrooms?: number;
        yearBuilt?: number;
        squareFootage?: number;
        purpose: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
      }
    >(url, {
      method: "POST",
      data: iData,
    });

    revalidateTag("fetchAdminValuation", "max");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function acceptSellerReq(id: string) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest<{ message: string }>(
      `admin/connect/${id}`,
      {
        method: "PATCH",
        token,
      },
    );

    revalidateTag("fetchAdminConnect", "max");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function syncCalendar(origin?: string) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest<{
      message: string;
      data: {
        redirected: boolean;
        url: string;
      };
    }>(`admin/google?origin=${encodeURIComponent(origin || "")}`, {
      method: "GET",
      token,
    });

    if (response.data.redirected) {
      return { url: response.data.url };
    } else {
      return { error: response.message };
    }
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function updateValuationReq(id: string, status: string) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest<{ message: string }, { status: string }>(
      `admin/valuation/${id}`,
      {
        method: "PATCH",
        token,
        data: { status },
      },
    );

    revalidateTag("fetchAdminValuation", "max");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function searchProperties(query: string, broker?: boolean) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const url = broker
    ? `admin/lead/property-search?query=${query}&status=${"yourListings"}`
    : `admin/lead/property-search?query=${query}`;

  try {
    const response = await apiRequest<{
      data: {
        properties: { _id: string; propertyTitle: string; location: string }[];
      };
    }>(url, { token });

    return { message: response.data.properties };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function addLead(
  data: {
    type:
      | "House Tour Leads"
      | "Home Seller Leads"
      | "Mortgage Inquiry Leads"
      | "General Inquiry Leads";
    status: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    property?: string;
    source?: string;
    notes?: string;
  },
  // prev: ActionStateType,
  // formData: FormData
) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest<
      { message: string },
      {
        type:
          | "House Tour Leads"
          | "Home Seller Leads"
          | "Mortgage Inquiry Leads"
          | "General Inquiry Leads";
        status: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        property?: string;
        source?: string;
        notes?: string;
      }
    >("admin/lead", {
      method: "POST",
      data,
      token,
    });

    revalidateTag("fetchAdminLead", "max");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function listJourneys(url: string) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest(url, {
      method: "GET",
      token,
      tag: "fetchAdminJourneys",
    });

    return response;
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function listJourney(url: string) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest(url, {
      method: "GET",
      token,
      tag: "fetchAdminJourney",
    });

    return response;
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function createJourney(
  url: string,
  payload: CreateJourneyPayload,
) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest(url, {
      method: "POST",
      data: payload,
      token,
    });

    return response;
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function updateJourney(
  url: string,
  payload: UpdateJourneyPayload,
) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest(url, {
      method: "PATCH",
      data: payload,
      token,
    });

    return response;
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function deleteJourney(url: string) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest(url, {
      method: "DELETE",
      token,
    });

    return response;
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function activateJourney(url: string) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest(url, {
      method: "POST",
      token,
    });

    return response;
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function deactivateJourney(url: string) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest(url, {
      method: "POST",
      token,
    });

    return response;
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function duplicateJourney(url: string, name?: string) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest(url, {
      method: "POST",
      ...(name && { data: { name } }),
      token,
    });

    return response;
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function geJourneytStats(url: string) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest(url, {
      method: "GET",
      token,
    });

    return response;
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function listTags(url: string) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest(url, {
      method: "GET",
      token,
    });

    return response;
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function getTag(url: string) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest(url, {
      method: "GET",
      token,
    });

    return response;
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function createTag(url: string, payload: CreateTagPayload) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest(url, {
      method: "POST",
      data: payload,
      token,
    });

    return response;
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function updateTag(url: string, payload: UpdateTagPayload) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest(url, {
      method: "PATCH",
      data: payload,
      token,
    });

    return response;
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function deleteTag(url: string) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest(url, {
      method: "DELETE",
      token,
    });

    return response;
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function reorderTags(url: string, payload: ReorderTagsPayload) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest(url, {
      method: "PATCH",
      data: payload,
      token,
    });

    return response;
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function fetchLeadProgress(leadId: string) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest<{
      message: string;
      data: {
        progress: Progress | null;
        nextScheduledAction: IScheduledAction | null;
      };
    }>(`/admin/progress?leadId=${leadId}`, {
      method: "GET",
      token,
      tag: "fetchAdminProgress",
    });

    return { message: response.data };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}
