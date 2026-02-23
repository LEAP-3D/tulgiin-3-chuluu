import { useRef, useState, type Dispatch, type RefObject, type SetStateAction } from "react";
import { TextInput } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useSupabaseAuth } from "@/lib/supabase-auth";
import { getAuthErrorMessage } from "./utils";
import { createProfile } from "./profile-api";

export type SignUpController = {
  emailAddress: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  userType: "user" | "worker" | null;
  workTypes: string[];
  serviceAreas: string[];
  pendingVerification: boolean;
  code: string;
  errorMessage: string | null;
  debugInfo: string | null;
  showSuccess: boolean;
  formStep: "role" | "details" | "area" | "personal";
  codeInputRef: RefObject<TextInput | null>;
  setCode: (value: string) => void;
  setFormStep: Dispatch<SetStateAction<"role" | "details" | "area" | "personal">>;
  setUserType: Dispatch<SetStateAction<"user" | "worker" | null>>;
  setWorkTypes: Dispatch<SetStateAction<string[]>>;
  setServiceAreas: Dispatch<SetStateAction<string[]>>;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setPhoneNumber: (value: string) => void;
  setEmailAddress: (value: string) => void;
  onSignUpPress: () => Promise<void>;
  onVerifyPress: () => Promise<void>;
  onBackVerification: () => void;
};

export function useSignUpController(): SignUpController {
  const { isLoaded } = useSupabaseAuth();
  const router = useRouter();
  const apiBaseUrl =
    process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

  const [emailAddress, setEmailAddress] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userType, setUserType] = useState<"user" | "worker" | null>(null);
  const [workTypes, setWorkTypes] = useState<string[]>([]);
  const [serviceAreas, setServiceAreas] = useState<string[]>([]);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const codeInputRef = useRef<TextInput>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formStep, setFormStep] = useState<
    "role" | "details" | "area" | "personal"
  >("role");


  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setErrorMessage(null);
    setDebugInfo(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: emailAddress.trim(),
      });
      if (error) throw error;
      setPendingVerification(true);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      setErrorMessage(getAuthErrorMessage(err, "Sign up хийх үед алдаа гарлаа."));
      if (__DEV__) {
        try {
          setDebugInfo(JSON.stringify(err, null, 2));
        } catch {
          setDebugInfo("debugInfo stringify failed");
        }
      }
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;
    setErrorMessage(null);
    setDebugInfo(null);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: emailAddress.trim(),
        token: code.trim(),
        type: "email",
      });

      if (error) throw error;
      const accessToken = data?.session?.access_token ?? null;
      const profileId = data?.session?.user?.id ?? null;
      try {
        await createProfile({
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
        });
      } catch (err) {
        console.error("Create profile failed:", err);
        setErrorMessage(
          getAuthErrorMessage(err, "Database рүү хадгалах үед алдаа гарлаа."),
        );
        return;
      }
      setShowSuccess(true);
      setTimeout(() => router.replace("/(tabs)/service"), 900);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      setErrorMessage(
        getAuthErrorMessage(err, "Код баталгаажуулах үед алдаа гарлаа."),
      );
      if (__DEV__) {
        try {
          setDebugInfo(JSON.stringify(err, null, 2));
        } catch {
          setDebugInfo("debugInfo stringify failed");
        }
      }
    }
  };

  return {
    emailAddress,
    firstName,
    lastName,
    phoneNumber,
    userType,
    workTypes,
    serviceAreas,
    pendingVerification,
    code,
    errorMessage,
    debugInfo,
    showSuccess,
    formStep,
    codeInputRef,
    setCode,
    setFormStep,
    setUserType,
    setWorkTypes,
    setServiceAreas,
    setFirstName,
    setLastName,
    setPhoneNumber,
    setEmailAddress,
    onSignUpPress,
    onVerifyPress,
    onBackVerification: () => setPendingVerification(false),
  };
}
