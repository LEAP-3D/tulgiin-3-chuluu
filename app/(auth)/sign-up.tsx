import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import * as React from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

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
        await setActive({
          session: signUpAttempt.createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              // Check for tasks and navigate to custom UI to help users resolve them
              // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
              console.log(session?.currentTask);
              return;
            }

            router.replace("/");
          },
        });
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
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Verify your email
        </ThemedText>
        <ThemedText style={styles.description}>
          A verification code has been sent to your email.
        </ThemedText>
        {!!errorMessage && (
          <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>
        )}
        {!!debugInfo && __DEV__ && (
          <ThemedText style={styles.debugText}>{debugInfo}</ThemedText>
        )}
        <TextInput
          style={styles.input}
          value={code}
          placeholder="Enter your verification code"
          placeholderTextColor="#666666"
          onChangeText={(code) => setCode(code)}
          keyboardType="numeric"
        />
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={onVerifyPress}
        >
          <ThemedText style={styles.buttonText}>Verify</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Sign up
      </ThemedText>
      {!!errorMessage && (
        <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>
      )}
      {!!debugInfo && __DEV__ && (
        <ThemedText style={styles.debugText}>{debugInfo}</ThemedText>
      )}
      <ThemedText style={styles.label}>First name</ThemedText>
      <TextInput
        style={styles.input}
        autoCapitalize="words"
        value={firstName}
        placeholder="Enter first name"
        placeholderTextColor="#666666"
        onChangeText={(value) => setFirstName(value)}
      />
      <ThemedText style={styles.label}>Last name</ThemedText>
      <TextInput
        style={styles.input}
        autoCapitalize="words"
        value={lastName}
        placeholder="Enter last name"
        placeholderTextColor="#666666"
        onChangeText={(value) => setLastName(value)}
      />
      <ThemedText style={styles.label}>Email address</ThemedText>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        placeholderTextColor="#666666"
        onChangeText={(email) => setEmailAddress(email)}
        keyboardType="email-address"
      />
      <Pressable
        style={({ pressed }) => [
          styles.button,
          (!firstName || !lastName || !emailAddress) && styles.buttonDisabled,
          pressed && styles.buttonPressed,
        ]}
        onPress={onSignUpPress}
        disabled={!firstName || !lastName || !emailAddress}
      >
        <ThemedText style={styles.buttonText}>Continue</ThemedText>
      </Pressable>
      <View style={styles.linkContainer}>
        <ThemedText>Have an account? </ThemedText>
        <Link href="/sign-in">
          <ThemedText type="link">Sign in</ThemedText>
        </Link>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
  },
  title: {
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
    opacity: 0.8,
  },
  label: {
    fontWeight: "600",
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#0a7ea4",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
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
    color: "#fff",
    fontWeight: "600",
  },
  linkContainer: {
    flexDirection: "row",
    gap: 4,
    marginTop: 12,
    alignItems: "center",
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 13,
  },
  debugText: {
    color: "#555",
    fontSize: 11,
  },
});
