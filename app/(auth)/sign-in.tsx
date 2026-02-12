import { useAuth, useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import * as React from "react";
import { TextInput } from "react-native";
import { SignInCodeStep } from "./_components/sign-in-code-step";
import { SignInEmailStep } from "./_components/sign-in-email-step";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { isSignedIn, signOut, isLoaded: isAuthLoaded } = useAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [code, setCode] = React.useState("");
  const [showEmailCode, setShowEmailCode] = React.useState(false);
  const codeInputRef = React.useRef<TextInput>(null);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const startEmailCodeSignIn = React.useCallback(async () => {
    if (!isLoaded || !signIn) return;

    const signInAttempt = await signIn.create({
      identifier: emailAddress.trim(),
    });

    if (signInAttempt.status === "complete") {
      setShowSuccess(true);
      await setActive({ session: signInAttempt.createdSessionId });
      setTimeout(() => router.replace("/(tabs)/service"), 900);
      return;
    }

    const emailCodeFactor = signInAttempt.supportedFirstFactors?.find(
      (factor) => factor.strategy === "email_code",
    );

    if (!emailCodeFactor) {
      console.error(JSON.stringify(signInAttempt, null, 2));
      return;
    }

    await signIn.prepareFirstFactor({
      strategy: "email_code",
      emailAddressId: emailCodeFactor.emailAddressId,
    });
    setShowEmailCode(true);
  }, [isLoaded, signIn, emailAddress, setActive, router]);

  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded || !isAuthLoaded || isSubmitting) return;

    if (isSignedIn) {
      router.replace("/(tabs)/service");
      return;
    }

    try {
      setErrorMessage(null);
      setIsSubmitting(true);
      await startEmailCodeSignIn();
    } catch (err) {
      const clerkCode = (err as { errors?: { code?: string }[] })?.errors?.[0]
        ?.code;
      const errObj = err as {
        status?: number;
        errors?: { code?: string; message?: string }[];
      };

      if (
        errObj?.status === 429 ||
        errObj?.errors?.[0]?.code === "too_many_requests"
      ) {
        setErrorMessage(
          "Хэт олон хүсэлт илгээгдсэн байна. Түр хүлээгээд дахин оролдоно уу.",
        );
        return;
      }

      if (clerkCode === "session_exists") {
        try {
          await signOut();
          await startEmailCodeSignIn();
          return;
        } catch (retryErr) {
          console.error(JSON.stringify(retryErr, null, 2));
          return;
        }
      }

      console.error(JSON.stringify(err, null, 2));
      setErrorMessage(errObj?.errors?.[0]?.message ?? "Нэвтрэх үед алдаа гарлаа.");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isLoaded,
    isAuthLoaded,
    isSubmitting,
    isSignedIn,
    signOut,
    startEmailCodeSignIn,
    router,
  ]);

  const onVerifyPress = React.useCallback(async () => {
    if (!isLoaded || !isAuthLoaded || !signIn) return;
    if (isSignedIn) await signOut();

    try {
      const { createdSessionId } = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code,
      });

      if (!createdSessionId) {
        console.error("No session created");
        return;
      }

      setShowSuccess(true);
      await setActive({ session: createdSessionId });
      setTimeout(() => router.replace("/(tabs)/service"), 900);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, [isLoaded, isAuthLoaded, signIn, isSignedIn, signOut, code, setActive, router]);

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
