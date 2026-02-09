import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import * as React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LeftArrowIcon from "@/components/icons/_serviceIcons/leftarrowIcon";
import Logo from "@/components/icons/logo";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [code, setCode] = React.useState("");
  const [step, setStep] = React.useState<"intro" | "role" | "email" | "otp">(
    "intro",
  );
  const [selectedRole, setSelectedRole] = React.useState<
    "customer" | "repairman" | null
  >(null);
  const codeInputRef = React.useRef<TextInput>(null);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [resendTimer, setResendTimer] = React.useState(30);
  const [emailAddressId, setEmailAddressId] = React.useState<string | null>(
    null,
  );

  React.useEffect(() => {
    if (step !== "otp") return;
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer((value) => (value > 0 ? value - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  React.useEffect(() => {
    if (step === "otp") {
      codeInputRef.current?.focus();
    }
  }, [step]);

  // Start passwordless sign-in: send email code
  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) return;

    try {
      const trimmedEmail = emailAddress.trim();
      if (!trimmedEmail) return;
      const signInAttempt = await signIn.create({
        identifier: trimmedEmail,
      });

      if (signInAttempt.status === "complete") {
        setShowSuccess(true);
        await setActive({
          session: signInAttempt.createdSessionId,
        });
        setTimeout(() => router.replace("/"), 900);
      } else {
        const emailCodeFactor = signInAttempt.supportedFirstFactors?.find(
          (factor) => factor.strategy === "email_code",
        );

        if (!emailCodeFactor) {
          console.error(JSON.stringify(signInAttempt, null, 2));
          return;
        }

        setEmailAddressId(emailCodeFactor.emailAddressId);
        await signIn.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId: emailCodeFactor.emailAddressId,
        });
        setStep("otp");
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
        setShowSuccess(true);
        await setActive({
          session: signInAttempt.createdSessionId,
        });
        setTimeout(() => router.replace("/"), 900);
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, [isLoaded, signIn, setActive, router, code]);

  const onResendPress = React.useCallback(async () => {
    if (!isLoaded || !emailAddressId || resendTimer > 0) return;
    try {
      await signIn.prepareFirstFactor({
        strategy: "email_code",
        emailAddressId,
      });
      setResendTimer(30);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, [isLoaded, signIn, emailAddressId, resendTimer]);

  const renderSuccessOverlay = () =>
    showSuccess ? (
      <View style={styles.successOverlay}>
        <View style={styles.successCard}>
          <View style={styles.successIcon}>
            <Text style={styles.successIconText}>✓</Text>
          </View>
          <Text style={styles.successText}>Амжилттай нэвтэрлээ!</Text>
        </View>
      </View>
    ) : null;

  if (step === "intro") {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={[styles.screen, styles.introScreen]}>
          <View style={styles.logoWrap}>
            <Logo width={140} height={44} />
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => setStep("role")}
          >
            <Text style={styles.buttonText}>Үргэлжлүүлэх</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (step === "role") {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.screen}>
          <View>
            <Text style={styles.title}>Нэвтрэх</Text>
            <Text style={styles.subtitle}>Та аль хэрэглэгч вэ?</Text>
            <Text style={styles.helper}>
              Та өөрийн хэрэгцээнд тохирох төрлийг сонгоно уу
            </Text>
            <View style={styles.roleGroup}>
              <Pressable
                style={[
                  styles.roleButton,
                  selectedRole === "customer" && styles.roleButtonActive,
                ]}
                onPress={() => setSelectedRole("customer")}
              >
                <Text
                  style={[
                    styles.roleText,
                    selectedRole === "customer" && styles.roleTextActive,
                  ]}
                >
                  Захиалагч
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.roleButton,
                  selectedRole === "repairman" && styles.roleButtonActive,
                ]}
                onPress={() => setSelectedRole("repairman")}
              >
                <Text
                  style={[
                    styles.roleText,
                    selectedRole === "repairman" && styles.roleTextActive,
                  ]}
                >
                  Засварчин
                </Text>
              </Pressable>
            </View>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              !selectedRole && styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}
            disabled={!selectedRole}
            onPress={() => setStep("email")}
          >
            <Text style={styles.buttonText}>Үргэлжлүүлэх</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (step === "otp") {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.screen}>
          <View>
            <Pressable
              style={styles.backButton}
              onPress={() => {
                setCode("");
                setStep("email");
              }}
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
              onPress={onResendPress}
              disabled={resendTimer > 0}
              style={styles.resendWrap}
            >
              <Text
                style={[
                  styles.resendText,
                  resendTimer > 0 && styles.resendDisabled,
                ]}
              >
                Дахин код авах 00:{String(resendTimer).padStart(2, "0")}
              </Text>
            </Pressable>
          </View>

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

          {renderSuccessOverlay()}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>
        <View>
          <Pressable
            style={styles.backButton}
            onPress={() => setStep("role")}
            hitSlop={10}
          >
            <LeftArrowIcon width={20} height={20} />
          </Pressable>

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
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            !emailAddress.trim() && styles.buttonDisabled,
            pressed && styles.buttonPressed,
          ]}
          onPress={onSignInPress}
          disabled={!emailAddress.trim()}
        >
          <Text style={styles.buttonText}>Үргэлжлүүлэх</Text>
        </Pressable>

        {renderSuccessOverlay()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  screen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    justifyContent: "space-between",
  },
  introScreen: {
    justifyContent: "space-between",
  },
  logoWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
  roleGroup: {
    marginTop: 8,
  },
  roleButton: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  roleButtonActive: {
    borderColor: "#F59E0B",
    backgroundColor: "rgba(245, 158, 11, 0.08)",
  },
  roleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E8E",
  },
  roleTextActive: {
    color: "#F59E0B",
    fontWeight: "700",
  },
  inputWrap: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 44,
    justifyContent: "center",
    marginTop: 4,
  },
  input: {
    fontSize: 16,
    color: "#1F1F1F",
  },
  button: {
    backgroundColor: "#F59E0B",
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonDisabled: {
    backgroundColor: "#F7C57E",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
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
  resendWrap: {
    alignItems: "center",
  },
  resendText: {
    fontSize: 12,
    color: "#F59E0B",
    marginTop: 6,
    marginBottom: 6,
  },
  resendDisabled: {
    color: "#BDBDBD",
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
