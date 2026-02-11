import { useAuth, useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import * as React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LeftArrowIcon from "@/components/icons/_serviceIcons/leftarrowIcon";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { isSignedIn, signOut, isLoaded: isAuthLoaded } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isAuthLoaded) return;
    console.log("[AuthState] isSignedIn:", isSignedIn);
  }, [isAuthLoaded, isSignedIn]);

  const [emailAddress, setEmailAddress] = React.useState("");
  const [code, setCode] = React.useState("");
  const [showEmailCode, setShowEmailCode] = React.useState(false);
  const codeInputRef = React.useRef<TextInput>(null);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const startEmailCodeSignIn = React.useCallback(async () => {
    const signInAttempt = await signIn.create({
      identifier: emailAddress.trim(),
    });

    if (signInAttempt.status === "complete") {
      console.log(
        "[SignIn] complete. createdSessionId:",
        signInAttempt.createdSessionId,
      );
      setShowSuccess(true);
      await setActive({
        session: signInAttempt.createdSessionId,
      });
      console.log("[SignIn] setActive done");
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
  }, [signIn, emailAddress, setActive, router]);

  // Start passwordless sign-in: send email code
  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded || !isAuthLoaded) return;
    if (isSubmitting) return;

    if (isSignedIn) {
      router.replace("/(tabs)/service");
      return;
    }

    try {
      setErrorMessage(null);
      setIsSubmitting(true);
      await startEmailCodeSignIn();
    } catch (err) {
      const clerkCode = (err as { errors?: Array<{ code?: string }> })
        ?.errors?.[0]?.code;
      const errObj = err as {
        status?: number;
        retryAfter?: number;
        errors?: Array<{ code?: string; message?: string }>;
      };
      if (
        errObj?.status === 429 ||
        errObj?.errors?.[0]?.code === "too_many_requests"
      ) {
        setErrorMessage("Хэт олон хүсэлт илгээгдсэн байна. Түр хүлээгээд дахин оролдоно уу.");
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
      const message =
        errObj?.errors?.[0]?.message ?? "Нэвтрэх үед алдаа гарлаа.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isLoaded,
    isAuthLoaded,
    isSignedIn,
    isSubmitting,
    signOut,
    startEmailCodeSignIn,
    router,
  ]);

  // Handle the submission of the email verification code
  const onVerifyPress = React.useCallback(async () => {
    if (!isLoaded || !isAuthLoaded) return;
    if (isSignedIn) {
      await signOut();
    }

    try {
      const { createdSessionId } = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code,
      });

      console.log("[Verify] createdSessionId:", createdSessionId);

      if (createdSessionId) {
        setShowSuccess(true);
        await setActive({
          session: createdSessionId,
        });
        console.log("[Verify] setActive done");
        setTimeout(() => router.replace("/(tabs)/service"), 900);
      } else {
        console.error("No session created");
      }

      // if (signInAttempt.status === "complete") {
      //   setShowSuccess(true);
      //   await setActive({
      //     session: signInAttempt.createdSessionId,
      //   });
      //   setTimeout(() => router.replace("/(tabs)/service"), 900);
      // } else {
      //   console.error(JSON.stringify(signInAttempt, null, 2));
      // }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, [
    isLoaded,
    isAuthLoaded,
    isSignedIn,
    signOut,
    signIn,
    setActive,
    router,
    code,
  ]);

  // Display email code verification form
  if (showEmailCode) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <Pressable
            style={styles.backButton}
            onPress={() => setShowEmailCode(false)}
            hitSlop={10}
          >
            <LeftArrowIcon width={20} height={20} />
          </Pressable>

          <Text style={styles.title}>Нэвтрэх</Text>
          <Text style={styles.subtitle}>OTP оруулна уу</Text>
          <Text style={styles.helper}>
            И-мэйл хаягт ирсэн 6 оронтой баталгаажуулах кодыг оруулна уу.
          </Text>

          <Pressable
            style={styles.otpRow}
            onPress={() => codeInputRef.current?.focus()}
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <View
                key={`otp-${index}`}
                style={[
                  styles.otpBox,
                  code[index] ? styles.otpBoxActive : null,
                ]}
              >
                <Text style={styles.otpText}>{code[index] ?? ""}</Text>
              </View>
            ))}
          </Pressable>

          <TextInput
            ref={codeInputRef}
            style={styles.hiddenInput}
            value={code}
            onChangeText={(value) => setCode(value.replace(/\D/g, ""))}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            maxLength={6}
            autoFocus
          />

          <Pressable
            style={({ pressed }) => [
              styles.button,
              code.length !== 6 && styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}
            onPress={onVerifyPress}
            disabled={code.length !== 6}
          >
            <Text style={styles.buttonText}>Үргэлжлүүлэх</Text>
          </Pressable>

          {showSuccess && (
            <View style={styles.successOverlay}>
              <View style={styles.successCard}>
                <View style={styles.successIcon}>
                  <Text style={styles.successIconText}>✓</Text>
                </View>
                <Text style={styles.successText}>Амжилттай нэвтэрлээ!</Text>
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Нэвтрэх</Text>
        <Text style={styles.subtitle}>Та и-мэйл хаягаа оруулна уу</Text>
        <Text style={styles.helper}>
          Бүртгэлээ баталгаажуулахын тулд и-мэйл хаягаа оруулна уу.
        </Text>
        {!!errorMessage && (
          <Text style={styles.errorText}>{errorMessage}</Text>
        )}

        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            value={emailAddress}
            placeholder="И-мэйл хаяг"
            placeholderTextColor="#9B9B9B"
            onChangeText={(email) => setEmailAddress(email)}
            keyboardType="email-address"
          />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            (!emailAddress || isSubmitting) && styles.buttonDisabled,
            pressed && styles.buttonPressed,
          ]}
          onPress={onSignInPress}
          disabled={!emailAddress || isSubmitting}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? "Илгээж байна..." : "Үргэлжлүүлэх"}
          </Text>
        </Pressable>

        <View style={styles.linkContainer}>
          <Text style={styles.linkMuted}>Бүртгэлгүй юу?</Text>
          <Link href="/sign-up">
            <Text style={styles.linkAccent}>Бүртгүүлэх</Text>
          </Link>
        </View>

        {showSuccess && (
          <View style={styles.successOverlay}>
            <View style={styles.successCard}>
              <View style={styles.successIcon}>
                <Text style={styles.successIconText}>✓</Text>
              </View>
              <Text style={styles.successText}>Амжилттай нэвтэрлээ!</Text>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F1F1F",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F1F1F",
    marginBottom: 6,
  },
  helper: {
    fontSize: 12,
    color: "#8E8E8E",
    lineHeight: 16,
    marginBottom: 14,
  },
  errorText: {
    fontSize: 12,
    color: "#DC2626",
    marginBottom: 8,
  },
  inputWrap: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 44,
    justifyContent: "center",
  },
  input: {
    fontSize: 16,
    color: "#1F1F1F",
  },
  button: {
    backgroundColor: "#F59E0B",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  linkContainer: {
    flexDirection: "row",
    gap: 4,
    marginTop: 12,
    alignItems: "center",
  },
  linkMuted: {
    color: "#8E8E8E",
  },
  linkAccent: {
    color: "#F59E0B",
    fontWeight: "600",
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 8,
  },
  otpBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    alignItems: "center",
    justifyContent: "center",
  },
  otpBoxActive: {
    borderColor: "#F59E0B",
  },
  otpText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F1F1F",
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    height: 0,
    width: 0,
  },
  successOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  successCard: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
    minWidth: 220,
  },
  successIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#F59E0B",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  successIconText: {
    fontSize: 20,
    color: "#F59E0B",
    fontWeight: "700",
  },
  successText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F1F1F",
  },
});
