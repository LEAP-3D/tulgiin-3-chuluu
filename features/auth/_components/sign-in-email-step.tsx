import { Link } from "expo-router";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../sign-in.styles";

type SignInEmailStepProps = {
  emailAddress: string;
  isSubmitting: boolean;
  errorMessage: string | null;
  showSuccess: boolean;
  onChangeEmail: (email: string) => void;
  onSubmit: () => void;
};

export function SignInEmailStep({
  emailAddress,
  isSubmitting,
  errorMessage,
  showSuccess,
  onChangeEmail,
  onSubmit,
}: SignInEmailStepProps) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Нэвтрэх</Text>
        <Text style={styles.subtitle}>Та и-мэйл хаягаа оруулна уу</Text>
        <Text style={styles.helper}>
          Бүртгэлээ баталгаажуулахын тулд и-мэйл хаягаа оруулна уу.
        </Text>
        {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            value={emailAddress}
            placeholder="И-мэйл хаяг"
            placeholderTextColor="#9B9B9B"
            onChangeText={onChangeEmail}
            keyboardType="email-address"
          />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            (!emailAddress || isSubmitting) && styles.buttonDisabled,
            pressed && styles.buttonPressed,
          ]}
          onPress={onSubmit}
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
