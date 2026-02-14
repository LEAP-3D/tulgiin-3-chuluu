export async function createProfile({
  apiBaseUrl,
  accessToken,
  profileId,
  userType,
  emailAddress,
  phoneNumber,
  firstName,
  lastName,
  workTypes,
  serviceAreas,
}: {
  apiBaseUrl: string;
  accessToken?: string | null;
  profileId?: string | null;
  userType: "user" | "worker" | null;
  emailAddress: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  workTypes: string[];
  serviceAreas: string[];
}) {
  const response = await fetch(`${apiBaseUrl}/profiles`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify({
      ...(profileId ? { id: profileId } : {}),
      role: userType ?? "user",
      email: emailAddress.trim(),
      phone_number: phoneNumber.trim(),
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      work_types: userType === "worker" && workTypes.length > 0 ? workTypes : undefined,
      service_area:
        userType === "worker" && serviceAreas.length > 0 ? serviceAreas : undefined,
    }),
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type") ?? "";
    const payload = contentType.includes("application/json")
      ? await response.json().catch(() => null)
      : await response.text().catch(() => "");
    const message =
      (typeof payload === "string" && payload.trim()) ||
      payload?.error ||
      `HTTP ${response.status}`;
    throw new Error(message);
  }
}
