type UploadImageParams = {
  uri: string;
  mimeType?: string | null;
  fileName?: string | null;
  folder?: string | null;
};

type CloudinaryUploadResponse = {
  secure_url?: unknown;
  error?: {
    message?: unknown;
  };
};

const getCloudinaryCloudName = () => {
  const value = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!value?.trim()) {
    throw new Error("EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME тохируулаагүй байна.");
  }
  return value.trim();
};

const getCloudinaryUploadPreset = () => {
  const value = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!value?.trim()) {
    throw new Error("EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET тохируулаагүй байна.");
  }
  return value.trim();
};

const toSafeFileName = (value?: string | null) => {
  if (!value?.trim()) {
    return `attachment-${Date.now()}.jpg`;
  }
  return value.replace(/[^a-zA-Z0-9._-]/g, "_");
};

type ReactNativeUploadFile = Blob & {
  uri: string;
  name: string;
  type: string;
};

export async function uploadImageToCloudinary({
  uri,
  mimeType,
  fileName,
  folder,
}: UploadImageParams): Promise<string> {
  const cloudName = getCloudinaryCloudName();
  const uploadPreset = getCloudinaryUploadPreset();
  const resolvedFolder = folder?.trim() || process.env.EXPO_PUBLIC_CLOUDINARY_FOLDER?.trim();

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const formData = new FormData();
  formData.append(
    "file",
    {
      uri,
      type: mimeType?.trim() || "image/jpeg",
      name: toSafeFileName(fileName),
    } as ReactNativeUploadFile,
  );
  formData.append("upload_preset", uploadPreset);
  if (resolvedFolder) {
    formData.append("folder", resolvedFolder);
  }

  const response = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });

  const parsed = (await response.json().catch(() => null)) as
    | CloudinaryUploadResponse
    | null;

  if (!response.ok) {
    const errorMessage =
      typeof parsed?.error?.message === "string"
        ? parsed.error.message
        : `Cloudinary upload failed: HTTP ${response.status}`;
    throw new Error(errorMessage);
  }

  const secureUrl =
    typeof parsed?.secure_url === "string" ? parsed.secure_url : "";
  if (!secureUrl) {
    throw new Error("Cloudinary-с буцаасан secure_url олдсонгүй.");
  }

  return secureUrl;
}
