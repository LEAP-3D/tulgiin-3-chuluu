import { useRouter } from "expo-router";
import * as React from "react";
import { TextInput } from "react-native";
import { supabase } from "@/lib/supabase";
import { useSupabaseAuth } from "@/lib/supabase-auth";
import { SignInCodeStep } from "@/features/auth/_components/sign-in-code-step";
import { SignInEmailStep } from "@/features/auth/_components/sign-in-email-step";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toFriendlyAuthError(err: unknown, fallback: string): string {
  const e = err as {
    status?: number;
    name?: string;
    message?: string;
    __isAuthError?: boolean;
  };

  const message = (e?.message ?? "").toLowerCase();
  const isNetworkError =
    e?.status === 0 ||
    e?.name === "AuthRetryableFetchError" ||
    message.includes("network request failed");

  if (e?.status === 429) {
    return "Хэт олон хүсэлт илгээгдсэн байна. Түр хүлээгээд дахин оролдоно уу.";
  }
  if (isNetworkError) {
    return "Сүлжээний алдаа гарлаа. Интернэтээ шалгаад дахин оролдоно уу.";
  }
  return e?.message ?? fallback;
}

export default function Page() {
  const { isSignedIn, isLoaded } = useSupabaseAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [code, setCode] = React.useState("");
  const [showEmailCode, setShowEmailCode] = React.useState(false);
  const codeInputRef = React.useRef<TextInput>(null);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const startEmailCodeSignIn = React.useCallback(async () => {
    if (!isLoaded) return;
    // Retry once for transient network failures (status: 0).
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const { error } = await supabase.auth.signInWithOtp({
        email: emailAddress.trim(),
      });
      if (!error) {
        setShowEmailCode(true);
        return;
      }
      const errObj = error as { status?: number; name?: string; message?: string };
      const networkLike =
        errObj?.status === 0 ||
        errObj?.name === "AuthRetryableFetchError" ||
        (errObj?.message ?? "").toLowerCase().includes("network request failed");
      if (!networkLike || attempt === 1) {
        throw error;
      }
      await wait(500);
    }
  }, [emailAddress, isLoaded]);

  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded || isSubmitting) return;

    if (isSignedIn) {
      router.replace("/(tabs)/service");
      return;
    }

    try {
      setErrorMessage(null);
      setIsSubmitting(true);
      await startEmailCodeSignIn();
    } catch (err) {
      console.error("signInWithOtp error:", err);
      setErrorMessage(toFriendlyAuthError(err, "Нэвтрэх үед алдаа гарлаа."));
    } finally {
      setIsSubmitting(false);
    }
  }, [isLoaded, isSubmitting, isSignedIn, startEmailCodeSignIn, router]);

  const onVerifyPress = React.useCallback(async () => {
    if (!isLoaded) return;
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: emailAddress.trim(),
        token: code,
        type: "email",
      });

      if (error) throw error;
      if (!data.session) {
        throw new Error("Session үүссэнгүй.");
      }
      setShowSuccess(true);
      setTimeout(() => router.replace("/(tabs)/service"), 900);
    } catch (err) {
      console.error("verifyOtp error:", err);
      setErrorMessage(toFriendlyAuthError(err, "Баталгаажуулах үед алдаа гарлаа."));
    }
  }, [emailAddress, code, isLoaded, router]);

  if (showEmailCode) {
    return (
      <SignInCodeStep
        code={code}
        showSuccess={showSuccess}
        onChangeCode={(value) => setCode(value.replace(/\D/g, ""))}
        onBack={() => setShowEmailCode(false)}
        onVerify={onVerifyPress}
        codeInputRef={codeInputRef}
      />
    );
  }

  return (
    <SignInEmailStep
      emailAddress={emailAddress}
      isSubmitting={isSubmitting}
      errorMessage={errorMessage}
      showSuccess={showSuccess}
      onChangeEmail={setEmailAddress}
      onSubmit={onSignInPress}
    />
  );
}
