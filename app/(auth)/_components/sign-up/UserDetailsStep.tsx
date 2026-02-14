import { Pressable, Text, TextInput, View } from "react-native";
import { styles } from "../../sign-up.styles";

type Props = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  onChangeFirstName: (value: string) => void;
  onChangeLastName: (value: string) => void;
  onChangePhone: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onSubmit: () => void;
  canContinue: boolean;
};

export function UserDetailsStep({
  firstName,
  lastName,
  phoneNumber,
  emailAddress,
  onChangeFirstName,
  onChangeLastName,
  onChangePhone,
  onChangeEmail,
  onSubmit,
  canContinue,
}: Props) {
  return (
    <>
      <Text style={styles.fieldLabel}>Овог</Text>
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

      <Text style={styles.fieldLabel}>Нэр</Text>
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

      <Text style={styles.fieldLabel}>Утасны дугаар</Text>
      <View style={styles.inputWrap}>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          value={phoneNumber}
          placeholder="Утасны дугаар"
          placeholderTextColor="#9B9B9B"
          onChangeText={onChangePhone}
          keyboardType="phone-pad"
        />
      </View>

      <Text style={styles.fieldLabel}>И-мэйл хаяг</Text>
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
          !canContinue && styles.buttonDisabled,
          pressed && styles.buttonPressed,
        ]}
        onPress={onSubmit}
        disabled={!canContinue}
      >
        <Text style={styles.buttonText}>Үргэлжлүүлэх</Text>
      </Pressable>
    </>
  );
}
