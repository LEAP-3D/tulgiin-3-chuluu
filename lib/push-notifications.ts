import { useEffect } from "react";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { useSupabaseAuth } from "@/lib/supabase-auth";

type PushPlatform = "ios" | "android" | "web";

const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
const registerPushEndpoint = `${apiBaseUrl}/push/register`;
const androidChannelId = "default";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const getPushPlatform = (): PushPlatform => {
  if (Platform.OS === "ios") return "ios";
  if (Platform.OS === "android") return "android";
  return "web";
};

const resolveProjectId = () => {
  const projectId =
    Constants.easConfig?.projectId ??
    Constants.expoConfig?.extra?.eas?.projectId ??
    process.env.EXPO_PUBLIC_EAS_PROJECT_ID;

  if (!projectId || typeof projectId !== "string") {
    throw new Error(
      "EAS projectId олдсонгүй. EXPO_PUBLIC_EAS_PROJECT_ID тохируул эсвэл EAS project-г холбоно уу.",
    );
  }

  return projectId;
};

const ensureAndroidChannel = async () => {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync(androidChannelId, {
    name: "default",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#FF8A1E",
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
  });
};

const getExpoPushToken = async (): Promise<string | null> => {
  if (Platform.OS === "web") return null;
  if (!Device.isDevice) {
    console.warn("Push notification зөвхөн real device дээр ажиллана.");
    return null;
  }

  await ensureAndroidChannel();

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.warn("Push notification permission авагдсангүй.");
    return null;
  }

  const projectId = resolveProjectId();
  const token = await Notifications.getExpoPushTokenAsync({ projectId });
  return token.data;
};

const parseErrorMessage = async (response: Response) => {
  const payload = await response.json().catch(() => null);
  return payload?.error || payload?.message || `HTTP ${response.status}`;
};

const registerPushToken = async ({
  accessToken,
  token,
}: {
  accessToken: string;
  token: string;
}) => {
  const response = await fetch(registerPushEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      token,
      platform: getPushPlatform(),
    }),
  });

  if (!response.ok) {
    const message = await parseErrorMessage(response);
    throw new Error(message);
  }
};

export function usePushNotifications() {
  const { isLoaded, isSignedIn, session } = useSupabaseAuth();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !session?.access_token) return;

    let cancelled = false;
    let pushTokenSubscription: ReturnType<typeof Notifications.addPushTokenListener> | null = null;

    const syncToken = async (token: string) => {
      try {
        await registerPushToken({
          accessToken: session.access_token,
          token,
        });
      } catch (error) {
        console.warn(
          "Push token backend рүү хадгалах үед алдаа:",
          error instanceof Error ? error.message : error,
        );
      }
    };

    const bootstrap = async () => {
      try {
        const token = await getExpoPushToken();
        if (cancelled || !token) return;

        await syncToken(token);
      } catch (error) {
        console.warn(
          "Push notification setup үед алдаа:",
          error instanceof Error ? error.message : error,
        );
      }

      if (cancelled) return;
      pushTokenSubscription = Notifications.addPushTokenListener((nextToken) => {
        void syncToken(nextToken.data);
      });
    };

    void bootstrap();

    return () => {
      cancelled = true;
      pushTokenSubscription?.remove();
    };
  }, [isLoaded, isSignedIn, session?.access_token]);
}
