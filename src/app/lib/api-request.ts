interface RequestOptions<D> {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  data?: D | FormData;
  token?: string;
  contentType?: string;
  tag?: string;
}

async function apiRequest<T, D = undefined>(
  endpoint: string,
  {
    method = "GET",
    data,
    token,
    contentType = "application/json",
    tag,
  }: RequestOptions<D> = {}
): Promise<T> {
  const headers: HeadersInit = {};

  if (contentType === "application/json") {
    headers["Content-Type"] = contentType;
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
    credentials: "include",
    ...(tag && { next: { tags: [tag] } }),
  };

  if (data instanceof FormData) {
    options.body = data;
    delete headers["Content-Type"];
  } else if (data) {
    options.body = JSON.stringify(data);
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${apiBaseUrl}/api/${endpoint}`, options);

    if (!response.ok) {
      const errResult: { message?: string; status: number } =
        await response.json();

      if (errResult?.message) {
        throw new Error(`${errResult.message}`);
      } else {
        throw new Error(`Http error status: ${errResult.status}`);
      }
    }

    const result: T = await response.json();
    return result;
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`${e.message}`);
    } else {
      throw new Error(`API request error`);
    }
  }
}

export default apiRequest;
