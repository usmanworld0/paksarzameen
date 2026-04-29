export async function parseJsonResponse(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    const text = await response.text();
    const snippet = text.trim().slice(0, 400);
    throw new Error(`Unexpected non-JSON response (status ${response.status}): ${snippet}`);
  }

  try {
    return await response.json();
  } catch (err) {
    const text = await response.text();
    throw new Error(`Failed to parse JSON response (status ${response.status}): ${String(err)} -- body: ${text.slice(0,400)}`);
  }
}
