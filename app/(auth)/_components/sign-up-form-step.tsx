import { Link } from "expo-router";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LeftArrowIcon from "@/components/icons/_serviceIcons/leftarrowIcon";
import TsahilgaanIcon from "@/components/icons/_serviceIcons/tsahilgaanIcon";
import SantehnikIcon from "@/components/icons/_serviceIcons/santehnikIcon";
import TsoojIcon from "@/components/icons/_serviceIcons/tsoojIcon";
import BudagIcon from "@/components/icons/_serviceIcons/budagIcon";
import MujaanIcon from "@/components/icons/_serviceIcons/mujaanIcon";
import ShawijUstgalIcon from "@/components/icons/_serviceIcons/shawijustgalIcon";
import ShalIcon from "@/components/icons/_serviceIcons/shalIcon";
import HalaaltIcon from "@/components/icons/_serviceIcons/halaaltIcon";
import AgaarjuulaltIcon from "@/components/icons/_serviceIcons/agaarjuulaltIcon";
import NvvlgeltIcon from "@/components/icons/_serviceIcons/nvvlgeltIcon";
import AyulgviBaidalIcon from "@/components/icons/_serviceIcons/ayulgvibaidalIcon";
import InternetIcon from "@/components/icons/_serviceIcons/internetIcon";
import ShilToliIcon from "@/components/icons/_serviceIcons/shiltoliIcon";
import DeewerIcon from "@/components/icons/_serviceIcons/deewerIcon";
import TawilgaIcon from "@/components/icons/_serviceIcons/tawilgaIcon";
import GadnaTalbaiIcon from "@/components/icons/_serviceIcons/gadnatalbaiIcon";
import { styles } from "../sign-up.styles";

type SignUpFormStepProps = {
  step: "role" | "details" | "area" | "personal";
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
  { key: "electric", label: "Цахилгаанчин", Icon: TsahilgaanIcon },
  { key: "plumbing", label: "Сантехникч", Icon: SantehnikIcon },
  { key: "lock", label: "Цоож, хаалга засвар", Icon: TsoojIcon },
  { key: "paint", label: "Будагчин", Icon: BudagIcon },
  { key: "carpenter", label: "Мужаан", Icon: MujaanIcon },
  { key: "clean", label: "Ариутгал", Icon: ShawijUstgalIcon },
  { key: "floor", label: "Шал", Icon: ShalIcon },
  { key: "heat", label: "Халаалт", Icon: HalaaltIcon },
  { key: "ac", label: "Агааржуулалт", Icon: AgaarjuulaltIcon },
  { key: "moving", label: "Нүүлгэлт", Icon: NvvlgeltIcon },
  { key: "security", label: "Аюулгүй байдал", Icon: AyulgviBaidalIcon },
  { key: "internet", label: "Интернет засвар", Icon: InternetIcon },
  { key: "glass", label: "Шил, толь", Icon: ShilToliIcon },
  { key: "roof", label: "Дээвэр", Icon: DeewerIcon },
  { key: "furniture", label: "Тавилга угсралт", Icon: TawilgaIcon },
  { key: "garden", label: "Гадна талбай", Icon: GadnaTalbaiIcon },
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
      ? workTypes.length > 0
      : !!firstName.trim() &&
        !!lastName.trim() &&
        !!phoneNumber.trim() &&
        !!emailAddress.trim();
  const canContinueAreas = userType === "worker" ? serviceAreas.length > 0 : false;
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
                const selected = workTypes.includes(item.key);
                return (
                  <Pressable
                    key={item.key}
                    style={[styles.chip, selected && styles.chipActive]}
                    onPress={() => onToggleWorkType(item.key)}
                  >
                    <item.Icon width={18} height={18} />
                    <Text
                      style={[styles.chipText, selected && styles.chipTextActive]}
                    >
                      {item.label}
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

        {step === "area" && userType === "worker" && (
          <>
            <Text style={styles.sectionTitle}>Үйлчлэх бүс</Text>
            <Text style={styles.helper}>
              Та өөрийн ажиллах боломжтой бүсийг сонгоно уу
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
                !canContinueAreas && styles.buttonDisabled,
                pressed && styles.buttonPressed,
              ]}
              onPress={onNextStep}
              disabled={!canContinueAreas}
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
