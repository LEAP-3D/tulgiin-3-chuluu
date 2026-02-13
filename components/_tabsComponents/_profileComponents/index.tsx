import React from "react";
import { View, Text, Pressable, Image, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./index.styles";
import { Divider, FieldRow, MenuRow } from "./primitives";
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

type Props = {
  profile: ProfileData;
  isEditing: boolean;
  onChangeField: (field: ProfileField, value: string) => void;
  onEditPress?: () => void;
  onSavePress?: () => void;
  onLogoutPress?: () => void;
  onNotificationsPress?: () => void;
  onCardLinkPress?: () => void;
  onHelpPress?: () => void;
  onComplaintPress?: () => void;
  isSaving?: boolean;
  errors?: ProfileErrors;
  showErrors?: boolean;
};

export type ProfileData = {
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  workTypes?: string[];
  serviceAreas?: string[];
  avatarUrl?: string;
  displayName?: string;
};

export type ProfileField = keyof Pick<
  ProfileData,
  "lastName" | "firstName" | "email" | "phone"
>;

export type ProfileErrors = {
  lastName?: string;
  firstName?: string;
  email?: string;
  phone?: string;
};

const workTypeIconMap: Record<string, React.ComponentType<any>> = {
  "Цахилгаан": TsahilgaanIcon,
  "Цахилгаанчин": TsahilgaanIcon,
  "Сантехник": SantehnikIcon,
  "Сантехникч": SantehnikIcon,
  "Цоож": TsoojIcon,
  "Цоож, хаалга засвар": TsoojIcon,
  "Будаг": BudagIcon,
  "Будагчин": BudagIcon,
  "Мужаан": MujaanIcon,
  "Ариутгал": ShawijUstgalIcon,
  "Шал": ShalIcon,
  "Халаалт": HalaaltIcon,
  "Агааржуулалт": AgaarjuulaltIcon,
  "Нүүлгэлт": NvvlgeltIcon,
  "Аюулгүй байдал": AyulgviBaidalIcon,
  "Интернет": InternetIcon,
  "Интернет засвар": InternetIcon,
  "Шил, толь": ShilToliIcon,
  "Дээвэр": DeewerIcon,
  "Тавилга": TawilgaIcon,
  "Тавилга угсралт": TawilgaIcon,
  "Гадна талбай": GadnaTalbaiIcon,
};

export default function ProfileScreen({
  profile,
  isEditing,
  onChangeField,
  onEditPress,
  onSavePress,
  onLogoutPress,
  onNotificationsPress,
  onCardLinkPress,
  onHelpPress,
  onComplaintPress,
  isSaving,
  errors,
  showErrors,
}: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
      {isEditing ? (
        <ScrollView contentContainerStyle={styles.editContainer}>
          <Pressable
            style={styles.backRow}
            onPress={onEditPress ?? (() => Alert.alert("Буцах", "Back pressed"))}
            hitSlop={10}
          >
            <Ionicons name="arrow-back" size={18} color="#111" />
            <Text style={styles.backTitle}>Хувийн тохиргоо</Text>
          </Pressable>

          <View style={styles.editAvatarWrap}>
            <Image
              source={{
                uri:
                  profile.avatarUrl ??
                  "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
              }}
              style={styles.editAvatar}
            />
            <View style={styles.cameraBadge}>
              <Ionicons name="camera" size={14} color="#111" />
            </View>
          </View>

          <Text style={styles.inputLabel}>Овог</Text>
          <View
            style={[
              styles.inputCard,
              showErrors && errors?.lastName && styles.inputCardError,
            ]}
          >
            <FieldRow
              icon={<Ionicons name="person-outline" size={18} color="#8B8B8B" />}
              placeholder="Овог"
              value={profile.lastName}
              onChangeText={(value) => onChangeField("lastName", value)}
              editable
            />
          </View>
          {showErrors && errors?.lastName ? (
            <Text style={styles.errorText}>{errors.lastName}</Text>
          ) : null}

          <Text style={styles.inputLabel}>Нэр</Text>
          <View
            style={[
              styles.inputCard,
              showErrors && errors?.firstName && styles.inputCardError,
            ]}
          >
            <FieldRow
              icon={<Ionicons name="person-outline" size={18} color="#8B8B8B" />}
              placeholder="Нэр"
              value={profile.firstName}
              onChangeText={(value) => onChangeField("firstName", value)}
              editable
            />
          </View>
          {showErrors && errors?.firstName ? (
            <Text style={styles.errorText}>{errors.firstName}</Text>
          ) : null}

          <Text style={styles.inputLabel}>И-Мэйл хаяг</Text>
          <View
            style={[
              styles.inputCard,
              showErrors && errors?.email && styles.inputCardError,
            ]}
          >
            <FieldRow
              icon={<Ionicons name="mail-outline" size={18} color="#8B8B8B" />}
              placeholder="somequiett@gmail.com"
              value={profile.email}
              onChangeText={(value) => onChangeField("email", value)}
              editable
              keyboardType="default"
            />
          </View>
          {showErrors && errors?.email ? (
            <Text style={styles.errorText}>{errors.email}</Text>
          ) : null}

          <Text style={styles.inputLabel}>Утасны дугаар</Text>
          <View
            style={[
              styles.inputCard,
              showErrors && errors?.phone && styles.inputCardError,
            ]}
          >
            <FieldRow
              icon={<Ionicons name="call-outline" size={18} color="#8B8B8B" />}
              placeholder="88888888"
              value={profile.phone}
              onChangeText={(value) => onChangeField("phone", value)}
              editable
              keyboardType="phone-pad"
              inputMode="tel"
              textContentType="telephoneNumber"
              autoComplete="tel"
            />
          </View>
          {showErrors && errors?.phone ? (
            <Text style={styles.errorText}>{errors.phone}</Text>
          ) : null}

          {profile.workTypes && profile.workTypes.length > 0 ? (
            <View style={styles.chipSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Мэргэжил</Text>
                <Text style={styles.sectionAction}>Засах</Text>
              </View>
              <View style={styles.chipWrap}>
                {profile.workTypes.map((item) => {
                  const Icon = workTypeIconMap[item];
                  return (
                    <View key={`work-${item}`} style={styles.chip}>
                      {Icon ? <Icon width={18} height={18} /> : null}
                      <Text style={styles.chipText}>{item}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          ) : null}

          {profile.serviceAreas && profile.serviceAreas.length > 0 ? (
            <View style={styles.chipSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Үйлчилгээний бүс</Text>
                <Text style={styles.sectionAction}>Засах</Text>
              </View>
              <View style={styles.chipWrap}>
                {profile.serviceAreas.map((item) => (
                  <View key={`area-${item}`} style={styles.chip}>
                    <Text style={styles.chipText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          <Pressable
            style={({ pressed }) => [
              styles.saveBtnDark,
              pressed && { opacity: 0.85 },
              isSaving && { opacity: 0.6 },
            ]}
            onPress={onSavePress}
            disabled={isSaving}
          >
            <Text style={styles.saveTextDark}>
              {isSaving ? "Хадгалж байна..." : "Хадгалах"}
            </Text>
          </Pressable>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <Pressable style={styles.profileCard} onPress={onEditPress}>
            <View style={styles.profileRow}>
              <View style={styles.avatarMini}>
                {profile.avatarUrl ? (
                  <Image source={{ uri: profile.avatarUrl }} style={styles.avatarImage} />
                ) : (
                  <Ionicons name="person" size={18} color="#8B8B8B" />
                )}
              </View>
              <Text style={styles.profileName}>
                {profile.firstName?.trim() ||
                  profile.displayName ||
                  [profile.lastName, profile.firstName].filter(Boolean).join(" ").trim() ||
                  "Хэрэглэгч"}
              </Text>
            </View>
            <Ionicons name="pencil-outline" size={18} color="#6B6B6B" />
          </Pressable>

          <Pressable style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons name="construct-outline" size={18} color="#111" />
            </View>
            <View style={styles.infoTextWrap}>
              <Text style={styles.infoTitle}>Засварчинаар нэвтрэх</Text>
              <Text style={styles.infoDesc}>
                Та засварчнаар нэвтэрээд нэмэлт орлого олоорой
              </Text>
            </View>
          </Pressable>

          <View style={styles.menuCard}>
            <MenuRow icon="person-outline" label="Хувийн тохиргоо" onPress={onEditPress} />
            <Divider />
            <MenuRow
              icon="notifications-outline"
              label="Мэдэгдэл"
              onPress={onNotificationsPress}
            />
            <Divider />
            <MenuRow icon="card-outline" label="Карт холбох" onPress={onCardLinkPress} />
          </View>

          <View style={styles.menuCard}>
            <MenuRow icon="help-circle-outline" label="Тусламж" onPress={onHelpPress} />
            <Divider />
            <MenuRow icon="flag-outline" label="Гомдол" onPress={onComplaintPress} />
          </View>

          <Pressable
            style={styles.logoutCard}
            onPress={onLogoutPress ?? (() => Alert.alert("Гарах", "Logout pressed"))}
          >
            <View style={styles.logoutIcon}>
              <Ionicons name="log-out-outline" size={18} color="#D44A4A" />
            </View>
            <Text style={styles.logoutTextAlt}>Гарах</Text>
          </Pressable>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
