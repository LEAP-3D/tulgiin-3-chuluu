import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import * as React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LeftArrowIcon from "@/components/icons/_serviceIcons/leftarrowIcon";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [code, setCode] = React.useState("");
  const [showEmailCode, setShowEmailCode] = React.useState(false);
  const codeInputRef = React.useRef<TextInput>(null);

  // Start passwordless sign-in: send email code
  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({ identifier: emailAddress });

      if (signInAttempt.status === "complete") {
        await setActive({
          session: signInAttempt.createdSessionId,
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
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, [isLoaded, signIn, setActive, router, emailAddress]);

  // Handle the submission of the email verification code
  const onVerifyPress = React.useCallback(async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code,
      });

      if (signInAttempt.status === "complete") {
        await setActive({
          session: signInAttempt.createdSessionId,
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
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, [isLoaded, signIn, setActive, router, code]);

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
            !emailAddress && styles.buttonDisabled,
            pressed && styles.buttonPressed,
          ]}
          onPress={onSignInPress}
          disabled={!emailAddress}
        >
          <Text style={styles.buttonText}>Үргэлжлүүлэх</Text>
        </Pressable>

        <View style={styles.linkContainer}>
          <Text style={styles.linkMuted}>Бүртгэлгүй юу?</Text>
          <Link href="/sign-up">
            <Text style={styles.linkAccent}>Бүртгүүлэх</Text>
          </Link>
        </View>
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
});
