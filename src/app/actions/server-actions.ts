"use server";

import { cookies } from "next/headers";
import apiRequest from "../lib/api-request";
import { redirect } from "next/navigation";
import { format, parse } from "date-fns";
import {
  ActionStateType,
  AppointmentData,
  AppointmentRequestData,
  AppointmentResponse,
  Availability,
  BlogType,
  NotificationResType,
  PropertyType,
} from "@/types";
import { revalidateTag } from "next/cache";
import { LeadType } from "../(pages)/demo/(admin)/dashboard/lead/page";

const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response = await apiRequest<
      {
        message: string;
        data: { token: string };
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
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }

  redirect("/demo/dashboard/home");
}

export async function demoLogin(
  prevState: ActionStateType,
  formData: FormData
) {
  const email = formData.get("email") as string;

  try {
    const response = await apiRequest<
      {
        message: string;
        data: { token: string };
      },
      { email: string }
    >("public/sign-up", {
      method: "POST",
      data: { email },
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

export async function authenticate() {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  if (token) {
    try {
      const response = await apiRequest<{
        message: string;
        data: {
          user: { _id: string; fname: string; lname: string; email: string };
          unreadNotifictaionsCount: number;
        } | null;
      }>("admin/authenticate", { token });

      if (response.data)
        return {
          ok: true,
          user: response.data.user,
          unreadNotifictaionsCount: response.data.unreadNotifictaionsCount,
        };
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

    revalidateTag("fetchOpenings");
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
  availability: "available" | "unavailable"
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

    revalidateTag("fetchOpenings");
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
  }
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

    revalidateTag("fetchOpenings");
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

    revalidateTag("fetchBlogDraftImg");
    revalidateTag("fetchistingDraftImgs");
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

    revalidateTag("fetchBlogDraftImg");
    revalidateTag("fetchAdminBlogs");
    revalidateTag("fetchAdminBlog");
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

    revalidateTag("fetchistingDraftImgs");
    revalidateTag("fetchAdminProperty");
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

    revalidateTag("fetchistingDraftImgs");
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
  formData: FormData
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
      }
    );

    revalidateTag("fetchAdminProperties");
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
  formData: FormData
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
      }
    );

    revalidateTag("fetchAdminProperty");
    revalidateTag("fetchAdminProperties");
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
      }
    );

    revalidateTag("fetchAdminProperty");
    revalidateTag("fetchAdminProperties");
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
      }
    );

    revalidateTag("fetchAdminProperty");
    revalidateTag("fetchAdminProperties");
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
  formData: FormData
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
      }
    );

    revalidateTag("fetchBlogDraftImg");
    revalidateTag("fetchAdminBlogs");
    revalidateTag("fetchAdminBlog");
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
  formData: FormData
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
      }
    );

    revalidateTag("fetchAdminBlogs");
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

    revalidateTag("fetchAdminBlogs");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function fetchAvailabilty(type: string, adminId?: string) {
  try {
    const response = await apiRequest<{
      message: string;
      data: { availability: Availability[] };
    }>(`public/booking/availability?type=${type}&adminId=${adminId}`, {
      tag: "FetchPublicAvailability",
    });

    if (response.message === "Success") {
      const availability = response.data.availability;
      return { availability };
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
  formData: FormData
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
      }
    );

    revalidateTag("fetchAdminLead");
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

    revalidateTag("fetchAdminLead");
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
  status?: string
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

export async function fetchAdminAvailableDates(type: string) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest<{
      data: { availability: { date: string; slots: string[] }[] };
    }>(`admin/availability?type=${type}`, {
      token,
      tag: "fetchAdminAvailability",
    });

    return { data: response.data.availability };
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
  id: string
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

    revalidateTag("fetchAdminAppointments");
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
      }
    );

    revalidateTag("fetchAdminAppointments");
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
  formData: FormData
) {
  const email = formData.get("email") as string;

  try {
    const response = await apiRequest<{ message: string }, { email: string }>(
      "public/newsletter",
      {
        method: "POST",
        data: { email },
      }
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
      }
    );

    revalidateTag("fetchAdminNotification");
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
      }
    );

    revalidateTag("fetchAdminNotification");
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
      data: { leads: LeadType[]; hasMore: boolean; lastCreatedAt: Date | null };
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
