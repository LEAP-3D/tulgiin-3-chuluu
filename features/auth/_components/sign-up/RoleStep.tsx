import { Pressable, Text, View } from "react-native";
import { Link } from "expo-router";
import { styles } from "../../sign-up.styles";

type Props = {
  userType: "user" | "worker" | null;
  onChangeUserType: (value: "user" | "worker") => void;
  onNext: () => void;
  canContinue: boolean;
};

export function RoleStep({ userType, onChangeUserType, onNext, canContinue }: Props) {
  return (
    <>
      <Text style={styles.subtitle}>Та аль хэрэглэгч вэ?</Text>
      <Text style={styles.helper}>
        Та өөрийн хэрэгцээнд тохирох төрлийг сонгоно уу
      </Text>

      <View style={styles.roleGroup}>
        <Pressable
          style={[styles.roleButton, userType === "user" && styles.roleButtonActive]}
          onPress={() => onChangeUserType("user")}
        >
          <Text
            style={[
              styles.roleButtonText,
              userType === "user" && styles.roleButtonTextActive,
            ]}
          >
            Захиалагч
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.roleButton,
            userType === "worker" && styles.roleButtonActive,
          ]}
          onPress={() => onChangeUserType("worker")}
        >
          <Text
            style={[
              styles.roleButtonText,
              userType === "worker" && styles.roleButtonTextActive,
            ]}
          >
            Засварчин
          </Text>
        </Pressable>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          !canContinue && styles.buttonDisabled,
          pressed && styles.buttonPressed,
        ]}
        onPress={onNext}
        disabled={!canContinue}
      >
        <Text style={styles.buttonText}>Үргэлжлүүлэх</Text>
      </Pressable>

      <View style={styles.linkContainer}>
        <Text style={styles.linkMuted}>Бүртгэлтэй юу?</Text>
        <Link href="/sign-in">
          <Text style={styles.linkAccent}>Нэвтрэх</Text>
        </Link>
      </View>
    </>
  );
}
