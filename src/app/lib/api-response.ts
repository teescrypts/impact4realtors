export default function apiResponse<T>(
  message: string,
  data: T | null = null,
  status: number = 200,
  contentType: string = "application/json"
): Response {
  return new Response(JSON.stringify({ message, data }), {
    status,
    headers: { "Content-Type": contentType },
  });
}
