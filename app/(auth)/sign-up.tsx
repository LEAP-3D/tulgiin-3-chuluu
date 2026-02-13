import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import * as React from "react";
import { TextInput } from "react-native";
import { SignUpFormStep } from "./_components/sign-up-form-step";
import { SignUpVerifyStep } from "./_components/sign-up-verify-step";

function getClerkErrorMessage(err: unknown, fallback: string): string {
  if (typeof err === "string") return err;
  if (!err || typeof err !== "object") return fallback;

  const maybeErr = err as {
    message?: string;
    errors?: { longMessage?: string; message?: string }[];
  };

  if (Array.isArray(maybeErr.errors) && maybeErr.errors.length > 0) {
    const joined = maybeErr.errors
      .map((e) => e.longMessage ?? e.message)
      .filter(Boolean)
      .join("\n");
    if (joined) return joined;
  }

  if (typeof maybeErr.message === "string") return maybeErr.message;
  return fallback;
}

export default function Page() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const apiBaseUrl =
    process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

  const [emailAddress, setEmailAddress] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [userType, setUserType] = React.useState<"user" | "worker" | null>(null);
  const [workTypes, setWorkTypes] = React.useState<string[]>([]);
  const [serviceAreas, setServiceAreas] = React.useState<string[]>([]);
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [debugInfo, setDebugInfo] = React.useState<string | null>(null);
  const codeInputRef = React.useRef<TextInput>(null);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [formStep, setFormStep] = React.useState<
    "role" | "details" | "area" | "personal"
  >("role");

  const createProfile = React.useCallback(async () => {
    const response = await fetch(`${apiBaseUrl}/profiles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role: userType ?? "user",
        email: emailAddress.trim(),
        phone_number: phoneNumber.trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        work_types:
          userType === "worker" && workTypes.length > 0 ? workTypes : undefined,
        service_area:
          userType === "worker" && serviceAreas.length > 0
            ? serviceAreas
            : undefined,
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
  }, [
    apiBaseUrl,
    emailAddress,
    phoneNumber,
    firstName,
    lastName,
    userType,
    workTypes,
    serviceAreas,
  ]);

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setErrorMessage(null);
    setDebugInfo(null);

    try {
      await signUp.create({
        emailAddress: emailAddress.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        unsafeMetadata: {
          role: userType ?? undefined,
          phoneNumber: phoneNumber.trim() || undefined,
          workTypes: userType === "worker" ? workTypes : undefined,
          serviceAreas: userType === "worker" ? serviceAreas : undefined,
        },
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      setErrorMessage(getClerkErrorMessage(err, "Sign up хийх үед алдаа гарлаа."));
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
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: code.trim(),
      });

      if (signUpAttempt.status === "complete") {
        try {
          await createProfile();
        } catch (err) {
          console.error("Create profile failed:", err);
          setErrorMessage(
            getClerkErrorMessage(
              err,
              "Database рүү хадгалах үед алдаа гарлаа.",
            ),
          );
          return;
        }
        setShowSuccess(true);
        await setActive({ session: signUpAttempt.createdSessionId });
        setTimeout(() => router.replace("/(tabs)/service"), 900);
        return;
      }

      console.error(JSON.stringify(signUpAttempt, null, 2));
      setErrorMessage(
        getClerkErrorMessage(
          signUpAttempt,
          "Баталгаажуулалт дуусаагүй байна. Кодоо шалгаад дахин оролдоно уу.",
        ),
      );
      if (__DEV__) {
        try {
          setDebugInfo(JSON.stringify(signUpAttempt, null, 2));
        } catch {
          setDebugInfo("debugInfo stringify failed");
        }
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      setErrorMessage(
        getClerkErrorMessage(err, "Код баталгаажуулах үед алдаа гарлаа."),
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

  if (pendingVerification) {
    return (
      <SignUpVerifyStep
        code={code}
        errorMessage={errorMessage}
        debugInfo={debugInfo}
        showSuccess={showSuccess}
        onBack={() => setPendingVerification(false)}
        onChangeCode={(value) => setCode(value.replace(/\D/g, ""))}
        onVerify={onVerifyPress}
        codeInputRef={codeInputRef}
      />
    );
  }

  return (
    <SignUpFormStep
      step={formStep}
      firstName={firstName}
      lastName={lastName}
      emailAddress={emailAddress}
      phoneNumber={phoneNumber}
      userType={userType}
      workTypes={workTypes}
      serviceAreas={serviceAreas}
      errorMessage={errorMessage}
      debugInfo={debugInfo}
      showSuccess={showSuccess}
      onBackStep={() =>
        setFormStep((prev) => {
          if (prev === "personal") return "area";
          if (prev === "area") return "details";
          return "role";
        })
      }
      onNextStep={() =>
        setFormStep((prev) => {
          if (prev === "role") return "details";
          if (prev === "details" && userType === "worker") return "area";
          if (prev === "area") return "personal";
          return prev;
        })
      }
      onChangeUserType={(value) => {
        setUserType(value);
        if (value !== "worker") {
          setWorkTypes([]);
          setServiceAreas([]);
        }
      }}
      onToggleWorkType={(value) =>
        setWorkTypes((prev) =>
          prev.includes(value)
            ? prev.filter((item) => item !== value)
            : [...prev, value],
        )
      }
      onToggleServiceArea={(value) =>
        setServiceAreas((prev) =>
          prev.includes(value)
            ? prev.filter((item) => item !== value)
            : [...prev, value],
        )
      }
      onChangeFirstName={setFirstName}
      onChangeLastName={setLastName}
      onChangePhone={(value) => setPhoneNumber(value.replace(/\D/g, ""))}
      onChangeEmail={setEmailAddress}
      onSubmit={onSignUpPress}
    />
  );
}
