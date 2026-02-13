import { Link } from "expo-router";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../sign-up.styles";

type SignUpFormStepProps = {
  firstName: string;
  lastName: string;
  emailAddress: string;
  errorMessage: string | null;
  debugInfo: string | null;
  showSuccess: boolean;
  onChangeFirstName: (value: string) => void;
  onChangeLastName: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onSubmit: () => void;
};

export function SignUpFormStep({
  firstName,
  lastName,
  emailAddress,
  errorMessage,
  debugInfo,
  showSuccess,
  onChangeFirstName,
  onChangeLastName,
  onChangeEmail,
  onSubmit,
}: SignUpFormStepProps) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Бүртгүүлэх</Text>
        {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
        {!!debugInfo && __DEV__ && <Text style={styles.debugText}>{debugInfo}</Text>}

        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            autoCapitalize="words"
            value={firstName}
            placeholder="Нэр"
            placeholderTextColor="#9B9B9B"
            onChangeText={onChangeFirstName}
          />
        </View>

        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            autoCapitalize="words"
            value={lastName}
            placeholder="Овог"
            placeholderTextColor="#9B9B9B"
            onChangeText={onChangeLastName}
          />
        </View>

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
            (!firstName || !lastName || !emailAddress) && styles.buttonDisabled,
            pressed && styles.buttonPressed,
          ]}
          onPress={onSubmit}
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
