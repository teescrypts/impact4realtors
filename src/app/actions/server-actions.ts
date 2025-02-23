"use server";

import { cookies } from "next/headers";
import apiRequest from "../lib/api-request";
import { redirect } from "next/navigation";
import { format, parse } from "date-fns";
import { ActionStateType } from "@/types";
import { revalidateTag } from "next/cache";

const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

export async function demoLogin(
  prevState: { error?: string } | null,
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
      return e.message;
    } else {
      return "An unknown error occurred";
    }
  }

  redirect("/demo/dashboard/home");
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
        } | null;
      }>("admin/authenticate", { token });

      if (response.data) return { ok: true, user: response.data.user };
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

  const to = formData.get("from") as string;
  const from = formData.get("to") as string;

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
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function deleteImages() {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest<{ message: string }>("admin/image", {
      method: "DELETE",
      token,
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
