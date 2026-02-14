import type { ProfileData, ProfileErrors } from "@/components/_tabsComponents/_profileComponents";
import { normalizeList } from "@/lib/utils/normalize";
import { normalizeWorkTypes } from "./profile-utils";

export const getProfileErrors = (profile: ProfileData): ProfileErrors => {
  const errors: ProfileErrors = {};
  const lastName = profile.lastName?.trim() ?? "";
  const firstName = profile.firstName?.trim() ?? "";
  if (!lastName) {
    errors.lastName = "Овог оруулна уу.";
  }
  if (!firstName) {
    errors.firstName = "Нэр оруулна уу.";
  }

  const email = profile.email?.trim() ?? "";
  if (!email) {
    errors.email = "Имэйл хаяг оруулна уу.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Имэйл хаяг буруу байна.";
  }

  const phone = profile.phone?.trim() ?? "";
  if (!phone) {
    errors.phone = "Утасны дугаар оруулна уу.";
  } else {
    const digits = phone.replace(/[^\d]/g, "");
    const valid =
      digits.length === 8 || (digits.length === 11 && digits.startsWith("976"));
    if (!valid) {
      errors.phone = "Утасны дугаар 8 оронтой байх ёстой.";
    }
  }

  return errors;
};

export const buildProfilePayload = (profile: ProfileData) => {
  const workTypes = normalizeList(profile.workTypes);
  const serviceAreas = normalizeList(profile.serviceAreas);
  const isWorker = workTypes.length > 0 || serviceAreas.length > 0;

  return {
    role: isWorker ? "worker" : "user",
    email: profile.email.trim(),
    phone_number: profile.phone.trim(),
    first_name: profile.firstName.trim(),
    last_name: profile.lastName.trim(),
    ...(isWorker ? { work_types: workTypes, service_area: serviceAreas } : {}),
  };
};

export const mergeProfileFromApi = (profile: ProfileData, data: any): ProfileData => ({
  ...profile,
  lastName: data.last_name ?? profile.lastName,
  firstName: data.first_name ?? profile.firstName,
  email: data.email ?? profile.email,
  phone: data.phone_number ?? profile.phone,
  workTypes: normalizeWorkTypes(data.work_types ?? profile.workTypes),
  serviceAreas: normalizeList(data.service_area ?? profile.serviceAreas),
});
