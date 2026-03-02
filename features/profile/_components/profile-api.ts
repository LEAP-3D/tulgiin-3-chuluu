type JsonObject = Record<string, unknown>;

const parseResponse = async (response: Response) => {
  const parsed = await response.json().catch(() => null);
  if (!response.ok) {
    const detailMessage =
      Array.isArray(parsed?.details) && parsed.details.length > 0
        ? String(parsed.details[0]?.message ?? "")
        : "";
    const baseMessage = parsed?.error || parsed?.message || "";
    const message =
      baseMessage === "Validation failed" && detailMessage
        ? `${baseMessage}: ${detailMessage}`
        : baseMessage || detailMessage || `HTTP ${response.status}`;
    throw new Error(message);
  }
  return parsed;
};

export const updateProfileRequest = async (
  apiBaseUrl: string,
  body: JsonObject,
) => {
  const response = await fetch(`${apiBaseUrl}/profiles`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseResponse(response);
};

export const switchProfileRoleRequest = async (
  apiBaseUrl: string,
  body: JsonObject,
) => {
  const response = await fetch(`${apiBaseUrl}/profiles`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseResponse(response);
};
