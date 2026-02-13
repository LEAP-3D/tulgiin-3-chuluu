import React from "react";
import { View, Text, Pressable, Image, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./index.styles";
import { Divider, FieldRow, MenuRow } from "./primitives";

type Props = {
  profile: ProfileData;
  isEditing: boolean;
  onChangeField: (field: ProfileField, value: string) => void;
  onEditPress?: () => void;
  onSavePress?: () => void;
  onLogoutPress?: () => void;
  isSaving?: boolean;
};

export type ProfileData = {
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  displayName?: string;
};

export type ProfileField = keyof Pick<
  ProfileData,
  "lastName" | "firstName" | "email" | "phone"
>;

export default function ProfileScreen({
  profile,
  isEditing,
  onChangeField,
  onEditPress,
  onSavePress,
  onLogoutPress,
  isSaving,
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

          <Text style={styles.inputLabel}>Овог нэр</Text>
          <View style={styles.inputCard}>
            <FieldRow
              icon={<Ionicons name="person-outline" size={18} color="#8B8B8B" />}
              placeholder="Хэрэглэгч"
              value={[profile.lastName, profile.firstName].filter(Boolean).join(" ").trim()}
              onChangeText={(value) => {
                const parts = value.trim().split(/\s+/);
                onChangeField("lastName", parts[0] ?? "");
                onChangeField("firstName", parts.slice(1).join(" "));
              }}
              editable
            />
          </View>

          <Text style={styles.inputLabel}>И-Мэйл хаяг</Text>
          <View style={styles.inputCard}>
            <FieldRow
              icon={<Ionicons name="mail-outline" size={18} color="#8B8B8B" />}
              placeholder="somequiett@gmail.com"
              value={profile.email}
              onChangeText={(value) => onChangeField("email", value)}
              editable
              keyboardType="default"
            />
          </View>

          <Text style={styles.inputLabel}>Утасны дугаар</Text>
          <View style={styles.inputCard}>
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
                <Ionicons name="person" size={18} color="#8B8B8B" />
              </View>
              <Text style={styles.profileName}>
                {profile.displayName ??
                  ([profile.lastName, profile.firstName].filter(Boolean).join(" ").trim() ||
                    "Хэрэглэгч")}
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
            <MenuRow icon="notifications-outline" label="Мэдэгдэл" />
            <Divider />
            <MenuRow icon="card-outline" label="Карт холбох" />
          </View>

          <View style={styles.menuCard}>
            <MenuRow icon="help-circle-outline" label="Тусламж" />
            <Divider />
            <MenuRow icon="flag-outline" label="Гомдол" />
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
