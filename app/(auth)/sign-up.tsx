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

  const [emailAddress, setEmailAddress] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [debugInfo, setDebugInfo] = React.useState<string | null>(null);
  const codeInputRef = React.useRef<TextInput>(null);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setErrorMessage(null);
    setDebugInfo(null);

    try {
      await signUp.create({
        emailAddress: emailAddress.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
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
      firstName={firstName}
      lastName={lastName}
      emailAddress={emailAddress}
      errorMessage={errorMessage}
      debugInfo={debugInfo}
      showSuccess={showSuccess}
      onChangeFirstName={setFirstName}
      onChangeLastName={setLastName}
      onChangeEmail={setEmailAddress}
      onSubmit={onSignUpPress}
    />
  );
}
