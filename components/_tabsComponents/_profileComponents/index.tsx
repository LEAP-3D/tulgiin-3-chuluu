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
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

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
  profession: string;
  phone: string;
  location: string;
  avatarUrl?: string;
  displayName?: string;
};

export type ProfileField = keyof Pick<
  ProfileData,
  "lastName" | "firstName" | "profession" | "phone" | "location"
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
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header card */}
        <View style={[styles.headerCard, isEditing && styles.headerCardEdit]}>
          <View style={styles.avatarWrap}>
            <Image
              source={{
                uri:
                  profile.avatarUrl ??
                  "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
              }}
              style={styles.avatar}
            />
          </View>

          <View style={isEditing ? styles.headerTextRow : undefined}>
            <Text style={[styles.title, isEditing && styles.titleEdit]}>
              {profile.displayName ?? "Хэрэглэгч"}
            </Text>
            {!isEditing && (
              <Pressable
                style={({ pressed }) => [
                  styles.editBtn,
                  pressed && { opacity: 0.85 },
                ]}
                onPress={
                  onEditPress ?? (() => Alert.alert("Засах", "Edit pressed"))
                }
              >
                <Ionicons name="pencil" size={18} color="#fff" />
                <Text style={styles.editText}>Засах</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Info card */}
        {isEditing ? (
          <>
            <View style={styles.inputCard}>
              <FieldRow
                icon={
                  <Ionicons name="person-outline" size={20} color="#8B8B8B" />
                }
                placeholder="Овог"
                value={profile.lastName}
                onChangeText={(value) => onChangeField("lastName", value)}
                editable={isEditing}
              />
            </View>
            <View style={styles.inputCard}>
              <FieldRow
                icon={
                  <Ionicons name="person-outline" size={20} color="#8B8B8B" />
                }
                placeholder="Нэр"
                value={profile.firstName}
                onChangeText={(value) => onChangeField("firstName", value)}
                editable={isEditing}
              />
            </View>
            <View style={styles.inputCard}>
              <FieldRow
                icon={
                  <MaterialCommunityIcons
                    name="briefcase-outline"
                    size={20}
                    color="#8B8B8B"
                  />
                }
                placeholder="Мэргэжил"
                value={profile.profession}
                onChangeText={(value) => onChangeField("profession", value)}
                editable={isEditing}
              />
            </View>
            <View style={styles.inputCard}>
              <FieldRow
                icon={<Ionicons name="call-outline" size={20} color="#8B8B8B" />}
                placeholder="Утасны дугаар"
                keyboardType="phone-pad"
                inputMode="tel"
                textContentType="telephoneNumber"
                autoComplete="tel"
                value={profile.phone}
                onChangeText={(value) => onChangeField("phone", value)}
                editable={isEditing}
              />
            </View>
          </>
        ) : (
          <View style={styles.card}>
            <FieldRow
              icon={
                <Ionicons name="person-outline" size={20} color="#9AA0A6" />
              }
              placeholder="Овог"
              value={profile.lastName}
              onChangeText={(value) => onChangeField("lastName", value)}
              editable={isEditing}
            />
            <Divider />
            <FieldRow
              icon={
                <Ionicons name="person-outline" size={20} color="#9AA0A6" />
              }
              placeholder="Нэр"
              value={profile.firstName}
              onChangeText={(value) => onChangeField("firstName", value)}
              editable={isEditing}
            />
            <Divider />
            <FieldRow
              icon={
                <MaterialCommunityIcons
                  name="briefcase-outline"
                  size={20}
                  color="#9AA0A6"
                />
              }
              placeholder="Мэргэжил"
              value={profile.profession}
              onChangeText={(value) => onChangeField("profession", value)}
              editable={isEditing}
            />
            <Divider />
            <FieldRow
              icon={<Ionicons name="call-outline" size={20} color="#9AA0A6" />}
              placeholder="Утасны дугаар"
              keyboardType="phone-pad"
              inputMode="tel"
              textContentType="telephoneNumber"
              autoComplete="tel"
              value={profile.phone}
              onChangeText={(value) => onChangeField("phone", value)}
              editable={isEditing}
            />
          </View>
        )}

        {/* Location + Logout card */}
        {isEditing ? (
          <View style={styles.inputCard}>
            <FieldRow
              icon={<Ionicons name="location-outline" size={20} color="#8B8B8B" />}
              placeholder="Байршил"
              value={profile.location}
              onChangeText={(value) => onChangeField("location", value)}
              editable={isEditing}
            />
          </View>
        ) : (
          <View style={styles.card}>
            <FieldRow
              icon={
                <Ionicons name="location-outline" size={20} color="#9AA0A6" />
              }
              placeholder="Байршил"
              value={profile.location}
              onChangeText={(value) => onChangeField("location", value)}
              editable={isEditing}
            />
            <Divider />

            <Pressable
              style={({ pressed }) => [
                styles.logoutRow,
                pressed && { backgroundColor: "#FAFAFA" },
              ]}
              onPress={
                onLogoutPress ?? (() => Alert.alert("Гарах", "Logout pressed"))
              }
            >
              <View style={styles.logoutIconBox}>
                <Ionicons name="log-out-outline" size={20} color="#E75A5A" />
              </View>
              <Text style={styles.logoutText}>Гарах</Text>
            </Pressable>
          </View>
        )}

        {isEditing && (
          <Pressable
            style={({ pressed }) => [
              styles.saveBtn,
              pressed && { opacity: 0.85 },
              isSaving && { opacity: 0.6 },
            ]}
            onPress={onSavePress}
            disabled={isSaving}
          >
            <Text style={styles.saveText}>
              {isSaving ? "Хадгалж байна..." : "Хадгалах"}
            </Text>
          </Pressable>
        )}
      </ScrollView>
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
    paddingBottom: 28,
    gap: 14,
  },

  headerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEF0F3",
  },
  headerCardEdit: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  avatarWrap: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "#E9ECF5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  avatar: { width: 76, height: 76, borderRadius: 38 },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    marginBottom: 12,
  },
  titleEdit: {
    marginBottom: 0,
  },
  headerTextRow: {
    flex: 1,
    justifyContent: "center",
  },

  editBtn: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    minWidth: 110,
  },
  editText: { color: "#fff", fontSize: 15, fontWeight: "600" },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#EEF0F3",
    overflow: "hidden",
  },
  inputCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E6E6E6",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  leftIcon: { width: 34, alignItems: "center" },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#111",
    paddingVertical: 0,
  },
  divider: {
    height: 1,
    backgroundColor: "#EEF0F3",
    marginLeft: 48,
  },

  logoutRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  logoutIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#FCE9E9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  logoutText: { fontSize: 15, fontWeight: "600", color: "#111" },

  saveBtn: {
    alignSelf: "flex-end",
    backgroundColor: "#FF9F1C",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 999,
  },
  saveText: { color: "#111", fontSize: 15, fontWeight: "700" },
});
