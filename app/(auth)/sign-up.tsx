import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import * as React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LeftArrowIcon from "@/components/icons/_serviceIcons/leftarrowIcon";

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

  const getClerkErrorMessage = (
    err: unknown,
    fallback: string,
  ): string => {
    if (typeof err === "string") return err;
    if (!err || typeof err !== "object") return fallback;

    const maybeErr = err as {
      message?: string;
      errors?: Array<{ longMessage?: string; message?: string }>;
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
  };

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setErrorMessage(null);
    setDebugInfo(null);

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress: emailAddress.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture code
      setPendingVerification(true);
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
      setErrorMessage(
        getClerkErrorMessage(err, "Sign up хийх үед алдаа гарлаа."),
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

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;
    setErrorMessage(null);
    setDebugInfo(null);

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: code.trim(),
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        setShowSuccess(true);
        await setActive({
          session: signUpAttempt.createdSessionId,
        });
        setTimeout(() => router.replace("/(tabs)/service"), 900);
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
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
      }
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
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
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <Pressable
            style={styles.backButton}
            onPress={() => setPendingVerification(false)}
            hitSlop={10}
          >
            <LeftArrowIcon width={20} height={20} />
          </Pressable>
          <Text style={styles.title}>Баталгаажуулах</Text>
          <Text style={styles.subtitle}>OTP оруулна уу</Text>
          <Text style={styles.helper}>
            И-мэйл хаягт ирсэн 6 оронтой баталгаажуулах кодыг оруулна уу.
          </Text>
        {!!errorMessage && (
          <Text style={styles.errorText}>{errorMessage}</Text>
        )}
        {!!debugInfo && __DEV__ && (
          <Text style={styles.debugText}>{debugInfo}</Text>
        )}

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
        <Text style={styles.title}>Бүртгүүлэх</Text>
      {!!errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
      {!!debugInfo && __DEV__ && (
        <Text style={styles.debugText}>{debugInfo}</Text>
      )}

        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            autoCapitalize="words"
            value={firstName}
            placeholder="Нэр"
            placeholderTextColor="#9B9B9B"
            onChangeText={(value) => setFirstName(value)}
          />
        </View>

        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            autoCapitalize="words"
            value={lastName}
            placeholder="Овог"
            placeholderTextColor="#9B9B9B"
            onChangeText={(value) => setLastName(value)}
          />
        </View>

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
            (!firstName || !lastName || !emailAddress) && styles.buttonDisabled,
            pressed && styles.buttonPressed,
          ]}
          onPress={onSignUpPress}
          disabled={!firstName || !lastName || !emailAddress}
        >
          <Text style={styles.buttonText}>Үргэлжлүүлэх</Text>
        </Pressable>

        <View style={styles.linkContainer}>
          <Text style={styles.linkMuted}>Бүртгэлтэй юу?</Text>
          <Link href="/sign-in">
            <Text style={styles.linkAccent}>Нэвтрэх</Text>
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
  inputWrap: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 44,
    justifyContent: "center",
    marginBottom: 12,
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
    marginTop: 8,
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
  errorText: {
    color: "#D32F2F",
    fontSize: 13,
  },
  debugText: {
    color: "#555",
    fontSize: 11,
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
