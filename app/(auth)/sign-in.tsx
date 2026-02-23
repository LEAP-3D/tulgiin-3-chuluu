import { useRouter } from "expo-router";
import * as React from "react";
import { TextInput } from "react-native";
import { supabase } from "@/lib/supabase";
import { useSupabaseAuth } from "@/lib/supabase-auth";
import { SignInCodeStep } from "@/features/auth/_components/sign-in-code-step";
import { SignInEmailStep } from "@/features/auth/_components/sign-in-email-step";

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
    const { error } = await supabase.auth.signInWithOtp({
      email: emailAddress.trim(),
    });
    if (error) {
      throw error;
    }
    setShowEmailCode(true);
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
      const errObj = err as { status?: number; message?: string };
      if (errObj?.status === 429) {
        setErrorMessage(
          "Хэт олон хүсэлт илгээгдсэн байна. Түр хүлээгээд дахин оролдоно уу.",
        );
        return;
      }
      console.error(JSON.stringify(err, null, 2));
      setErrorMessage(errObj?.message ?? "Нэвтрэх үед алдаа гарлаа.");
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
      console.error(JSON.stringify(err, null, 2));
      setErrorMessage(
        (err as { message?: string })?.message ??
          "Баталгаажуулах үед алдаа гарлаа.",
      );
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
