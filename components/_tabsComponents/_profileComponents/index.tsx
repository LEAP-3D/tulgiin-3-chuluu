import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

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
              value={[profile.lastName, profile.firstName]
                .filter(Boolean)
                .join(" ")
                .trim()}
              onChangeText={(value) => {
                const parts = value.trim().split(/\s+/);
                const nextLast = parts[0] ?? "";
                const nextFirst = parts.slice(1).join(" ");
                onChangeField("lastName", nextLast);
                onChangeField("firstName", nextFirst);
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
                  ([profile.lastName, profile.firstName]
                    .filter(Boolean)
                    .join(" ")
                    .trim() || "Хэрэглэгч")}
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
            <MenuRow
              icon="person-outline"
              label="Хувийн тохиргоо"
              onPress={onEditPress}
            />
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
            onPress={
              onLogoutPress ?? (() => Alert.alert("Гарах", "Logout pressed"))
            }
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

function FieldRow({
  icon,
  placeholder,
  value,
  onChangeText,
  editable,
  keyboardType,
  inputMode,
  textContentType,
  autoComplete,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  editable: boolean;
  keyboardType?: "default" | "phone-pad";
  inputMode?: "text" | "tel" | "numeric";
  textContentType?: "none" | "telephoneNumber";
  autoComplete?: "off" | "tel";
}) {
  return (
    <View style={styles.row}>
      <View style={styles.leftIcon}>{icon}</View>
      <TextInput
        placeholder={placeholder}
  placeholderTextColor="#9AA0A6"
        style={styles.input}
        keyboardType={keyboardType ?? "default"}
        inputMode={inputMode}
        textContentType={textContentType}
        autoComplete={autoComplete}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        selectTextOnFocus={editable}
      />
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F6F7FB" },
  container: {
    padding: 16,
    paddingTop: 30,
    paddingBottom: 28,
    marginTop: 0,
    gap: 12,
  },

  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatarMini: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EDEDED",
    alignItems: "center",
    justifyContent: "center",
  },
  profileName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F1F1F",
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F6F6F6",
    alignItems: "center",
    justifyContent: "center",
  },
  infoTextWrap: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F1F1F",
    marginBottom: 4,
  },
  infoDesc: {
    fontSize: 12,
    color: "#8E8E8E",
    lineHeight: 16,
  },
  menuCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    overflow: "hidden",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  menuText: {
    fontSize: 14,
    color: "#1F1F1F",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#EFEFEF",
    marginLeft: 44,
  },
  logoutCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoutIcon: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: "#FDECEC",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutTextAlt: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F1F1F",
  },

  editContainer: {
    padding: 16,
    paddingTop: 30,
    paddingBottom: 28,
    marginTop: 0,
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  backTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F1F1F",
  },
  editAvatarWrap: {
    alignSelf: "center",
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#EDEDED",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  editAvatar: { width: 72, height: 72, borderRadius: 36 },
  cameraBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#111",
  },
  inputLabel: {
    fontSize: 13,
    color: "#1F1F1F",
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 6,
  },
  inputCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 12,
  },
  leftIcon: { width: 30, alignItems: "center" },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#111",
    paddingVertical: 0,
  },
  saveBtnDark: {
    marginTop: 18,
    backgroundColor: "#111111",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  saveTextDark: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },
});

function MenuRow({
  icon,
  label,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.menuRow} onPress={onPress}>
      <View style={styles.menuLeft}>
        <Ionicons name={icon} size={18} color="#111" />
        <Text style={styles.menuText}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#B0B0B0" />
    </Pressable>
  );
}
