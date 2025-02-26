"use server";

import { cookies } from "next/headers";
import apiRequest from "../lib/api-request";
import { redirect } from "next/navigation";
import { format, parse } from "date-fns";
import { ActionStateType, BlogType, PropertyType } from "@/types";
import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

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
