import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LeftArrowIcon from "@/components/icons/_serviceIcons/leftarrowIcon";
import { styles } from "../sign-up.styles";

type SignUpFormStepProps = {
  step: "role" | "details" | "personal";
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  userType: "user" | "worker" | null;
  workTypes: string[];
  serviceAreas: string[];
  errorMessage: string | null;
  debugInfo: string | null;
  showSuccess: boolean;
  onBackStep: () => void;
  onNextStep: () => void;
  onChangeUserType: (value: "user" | "worker") => void;
  onToggleWorkType: (value: string) => void;
  onToggleServiceArea: (value: string) => void;
  onChangeFirstName: (value: string) => void;
  onChangeLastName: (value: string) => void;
  onChangePhone: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onSubmit: () => void;
};

const professionOptions = [
  { key: "electric", label: "Цахилгаан", icon: "power-plug" },
  { key: "plumbing", label: "Сантехник", icon: "water" },
  { key: "lock", label: "Цоож", icon: "lock" },
  { key: "paint", label: "Будаг", icon: "format-paint" },
  { key: "carpenter", label: "Мужаан", icon: "hammer" },
  { key: "clean", label: "Ариутгал", icon: "broom" },
  { key: "heat", label: "Халаалт", icon: "fire" },
  { key: "internet", label: "Интернет", icon: "wifi" },
  { key: "ac", label: "Агааржуулалт", icon: "fan" },
  { key: "security", label: "Аюулгүй байдал", icon: "shield-check" },
  { key: "glass", label: "Шил, толь", icon: "mirror" },
  { key: "furniture", label: "Тавилга", icon: "sofa" },
  { key: "floor", label: "Шал", icon: "floor-plan" },
  { key: "roof", label: "Дээвэр", icon: "home-roof" },
  { key: "moving", label: "Нүүлгэлт", icon: "truck-fast" },
  { key: "garden", label: "Гадна талбай", icon: "pine-tree" },
];

const serviceAreaOptions = [
  "Багануур дүүрэг",
  "Баянгол дүүрэг",
  "Баянзүрх дүүрэг",
  "Налайх дүүрэг",
  "Сүхбаатар дүүрэг",
  "Хан-Уул дүүрэг",
  "Чингэлтэй дүүрэг",
  "Сонгинохайрхан дүүрэг",
];

export function SignUpFormStep({
  step,
  firstName,
  lastName,
  emailAddress,
  phoneNumber,
  userType,
  workTypes,
  serviceAreas,
  errorMessage,
  debugInfo,
  showSuccess,
  onBackStep,
  onNextStep,
  onChangeUserType,
  onToggleWorkType,
  onToggleServiceArea,
  onChangeFirstName,
  onChangeLastName,
  onChangePhone,
  onChangeEmail,
  onSubmit,
}: SignUpFormStepProps) {
  const canContinueRole = !!userType;
  const canContinueDetails =
    userType === "worker"
      ? workTypes.length > 0 && serviceAreas.length > 0
      : !!firstName.trim() &&
        !!lastName.trim() &&
        !!phoneNumber.trim() &&
        !!emailAddress.trim();
  const canSubmitPersonal =
    !!firstName.trim() &&
    !!lastName.trim() &&
    !!phoneNumber.trim() &&
    !!emailAddress.trim();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {step !== "role" && (
          <Pressable style={styles.backButton} onPress={onBackStep} hitSlop={10}>
            <LeftArrowIcon width={20} height={20} />
          </Pressable>
        )}
        <Text style={styles.title}>Бүртгүүлэх</Text>
        {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
        {!!debugInfo && __DEV__ && <Text style={styles.debugText}>{debugInfo}</Text>}
        {step === "role" && (
          <>
            <Text style={styles.subtitle}>Та аль хэрэглэгч вэ?</Text>
            <Text style={styles.helper}>
              Та өөрийн хэрэгцээнд тохирох төрлийг сонгоно уу
            </Text>

            <View style={styles.roleGroup}>
              <Pressable
                style={[
                  styles.roleButton,
                  userType === "user" && styles.roleButtonActive,
                ]}
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
                !canContinueRole && styles.buttonDisabled,
                pressed && styles.buttonPressed,
              ]}
              onPress={onNextStep}
              disabled={!canContinueRole}
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
        )}

        {step === "details" && userType === "worker" && (
          <>
            <Text style={styles.sectionTitle}>Мэргэжил</Text>
            <Text style={styles.helper}>
              Та өөрийн мэргэжлүүдээ сонгоно уу
            </Text>
            <View style={styles.chipGroup}>
              {professionOptions.map((item) => {
                const selected = workTypes.includes(item.label);
                return (
                  <Pressable
                    key={item.key}
                    style={[styles.chip, selected && styles.chipActive]}
                    onPress={() => onToggleWorkType(item.label)}
                  >
                    <MaterialCommunityIcons
                      name={item.icon as any}
                      size={16}
                      color={selected ? "#F59E0B" : "#8E8E8E"}
                    />
                    <Text
                      style={[styles.chipText, selected && styles.chipTextActive]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.sectionTitle}>Үйлчлэх бүс</Text>
            <Text style={styles.helper}>
              Та өөрийн ажиллах боломжтой бүсүүдийг сонгоно уу
            </Text>
            <View style={styles.chipGroup}>
              {serviceAreaOptions.map((area) => {
                const selected = serviceAreas.includes(area);
                return (
                  <Pressable
                    key={area}
                    style={[styles.chip, selected && styles.chipActive]}
                    onPress={() => onToggleServiceArea(area)}
                  >
                    <Text
                      style={[styles.chipText, selected && styles.chipTextActive]}
                    >
                      {area}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                !canContinueDetails && styles.buttonDisabled,
                pressed && styles.buttonPressed,
              ]}
              onPress={onNextStep}
              disabled={!canContinueDetails}
            >
              <Text style={styles.buttonText}>Үргэлжлүүлэх</Text>
            </Pressable>
          </>
        )}

        {step === "details" && userType === "user" && (
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
                !canContinueDetails && styles.buttonDisabled,
                pressed && styles.buttonPressed,
              ]}
              onPress={onSubmit}
              disabled={!canContinueDetails}
            >
              <Text style={styles.buttonText}>Үргэлжлүүлэх</Text>
            </Pressable>
          </>
        )}

        {step === "personal" && userType === "worker" && (
          <>
            <Text style={styles.sectionTitle}>Хувийн мэдээлэл</Text>
            <Text style={styles.helper}>
              Та өөрийн хувийн мэдээллээ оруулна уу
            </Text>

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
                !canSubmitPersonal && styles.buttonDisabled,
                pressed && styles.buttonPressed,
              ]}
              onPress={onSubmit}
              disabled={!canSubmitPersonal}
            >
              <Text style={styles.buttonText}>Үргэлжлүүлэх</Text>
            </Pressable>
          </>
        )}
      </ScrollView>

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
    </SafeAreaView>
  );
}
