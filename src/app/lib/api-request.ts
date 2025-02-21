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
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result: T = await response.json();
    return result;
  } catch (error: any) {
    throw new Error(`API request error: ${error.message}`);
  }
}

export default apiRequest;
