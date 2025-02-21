"use server";

import { cookies } from "next/headers";
import apiRequest from "../lib/api-request";
import { redirect } from "next/navigation";

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
  } catch (e: any) {
    return { error: e.message };
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
    } catch (e: any) {
      return { error: e.message };
    }
  }
}

export async function addHour(prev: any, formData: FormData) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const test = {
    day: formData.get("day") as string,
    from: formData.get("from") as string,
    to: formData.get("to") as string,
  };

  try {
    const response = await apiRequest("admin/openings", {
      method: "POST",
      data: test,
      token,
    });
    console.log(response);
  } catch (e) {
    return null;
  }
}
