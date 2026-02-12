import * as React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LeftArrowIcon from "@/components/icons/_serviceIcons/leftarrowIcon";
import { styles } from "../sign-up.styles";

type SignUpVerifyStepProps = {
  code: string;
  errorMessage: string | null;
  debugInfo: string | null;
  showSuccess: boolean;
  onBack: () => void;
  onChangeCode: (value: string) => void;
  onVerify: () => void;
  codeInputRef: React.RefObject<TextInput | null>;
};

export function SignUpVerifyStep({
  code,
  errorMessage,
  debugInfo,
  showSuccess,
  onBack,
  onChangeCode,
  onVerify,
  codeInputRef,
}: SignUpVerifyStepProps) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Pressable style={styles.backButton} onPress={onBack} hitSlop={10}>
          <LeftArrowIcon width={20} height={20} />
        </Pressable>
        <Text style={styles.title}>Баталгаажуулах</Text>
        <Text style={styles.subtitle}>OTP оруулна уу</Text>
        <Text style={styles.helper}>
          И-мэйл хаягт ирсэн 6 оронтой баталгаажуулах кодыг оруулна уу.
        </Text>
        {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
        {!!debugInfo && __DEV__ && <Text style={styles.debugText}>{debugInfo}</Text>}

        <Pressable
          style={styles.otpRow}
          onPress={() => codeInputRef.current?.focus()}
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <View
              key={`otp-${index}`}
              style={[styles.otpBox, code[index] ? styles.otpBoxActive : null]}
            >
              <Text style={styles.otpText}>{code[index] ?? ""}</Text>
            </View>
          ))}
        </Pressable>

        <TextInput
          ref={codeInputRef}
          style={styles.hiddenInput}
          value={code}
          onChangeText={onChangeCode}
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
          onPress={onVerify}
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
