import { useMemo, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import type { CreateOrderParams } from "./types";
import { uploadImageToCloudinary } from "@/lib/utils/cloudinary";

const MAX_ATTACHMENTS = 5;
const ORDER_ATTACHMENTS_FOLDER =
  process.env.EXPO_PUBLIC_CLOUDINARY_ORDERS_FOLDER?.trim() ||
  process.env.EXPO_PUBLIC_CLOUDINARY_FOLDER?.trim() ||
  "";

const parseAttachmentParam = (rawValue?: string) => {
  if (!rawValue?.trim()) return [] as string[];

  try {
    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) return [];

    const normalized = parsed
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    return Array.from(new Set(normalized)).slice(0, MAX_ATTACHMENTS);
  } catch {
    return [];
  }
};

export type CreateOrderAttachmentState = {
  attachmentUrls: string[];
  serializedAttachments: string;
  isUploadingAttachment: boolean;
  attachmentError: string | null;
  maxAttachments: number;
  pickAttachment: () => Promise<void>;
  removeAttachmentAt: (index: number) => void;
};

export function useCreateOrderAttachments(
  params: CreateOrderParams,
): CreateOrderAttachmentState {
  const [attachmentUrls, setAttachmentUrls] = useState<string[]>(() =>
    parseAttachmentParam(params.attachments),
  );
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);

  const serializedAttachments = useMemo(
    () => JSON.stringify(attachmentUrls),
    [attachmentUrls],
  );

  const pickAttachment = async () => {
    if (attachmentUrls.length >= MAX_ATTACHMENTS) {
      setAttachmentError(`Ихдээ ${MAX_ATTACHMENTS} зураг хавсаргана.`);
      return;
    }
    const remainingSlots = MAX_ATTACHMENTS - attachmentUrls.length;

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setAttachmentError("Gallery эрх зөвшөөрнө үү.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: remainingSlots,
      allowsEditing: false,
      quality: 0.8,
      exif: false,
    });

    if (result.canceled) return;

    const assets = (result.assets ?? [])
      .filter((asset): asset is ImagePicker.ImagePickerAsset => !!asset?.uri)
      .slice(0, remainingSlots);
    if (!assets.length) {
      setAttachmentError("Зураг сонгож чадсангүй. Дахин оролдоно уу.");
      return;
    }

    setIsUploadingAttachment(true);
    setAttachmentError(null);

    try {
      const uploadResults = await Promise.all(
        assets.map(async (asset) => {
          try {
            return await uploadImageToCloudinary({
              uri: asset.uri,
              mimeType: asset.mimeType,
              fileName: asset.fileName,
              folder: ORDER_ATTACHMENTS_FOLDER || undefined,
            });
          } catch {
            return null;
          }
        }),
      );

      const uploadedUrls = uploadResults.filter(
        (url): url is string => typeof url === "string" && url.length > 0,
      );

      if (uploadedUrls.length > 0) {
        setAttachmentUrls((prev) => {
          const merged = [...prev];
          const existing = new Set(prev);
          uploadedUrls.forEach((url) => {
            if (existing.has(url) || merged.length >= MAX_ATTACHMENTS) return;
            existing.add(url);
            merged.push(url);
          });
          return merged;
        });
      }

      const failedCount = assets.length - uploadedUrls.length;
      if (failedCount > 0) {
        setAttachmentError(
          `${failedCount} зураг upload хийх үед алдаа гарлаа. Дахин оролдоно уу.`,
        );
      }
    } catch (err) {
      setAttachmentError(
        err instanceof Error
          ? err.message
          : "Зураг upload хийх үед алдаа гарлаа.",
      );
    } finally {
      setIsUploadingAttachment(false);
    }
  };

  const removeAttachmentAt = (index: number) => {
    setAttachmentUrls((prev) => prev.filter((_value, idx) => idx !== index));
    setAttachmentError(null);
  };

  return {
    attachmentUrls,
    serializedAttachments,
    isUploadingAttachment,
    attachmentError,
    maxAttachments: MAX_ATTACHMENTS,
    pickAttachment,
    removeAttachmentAt,
  };
}
