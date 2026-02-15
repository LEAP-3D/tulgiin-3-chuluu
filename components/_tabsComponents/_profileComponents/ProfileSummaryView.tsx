import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./index.styles";
import { Divider, MenuRow } from "./primitives";
import type { ProfileData } from "./types";

type Props = {
  profile: ProfileData;
  onEditPress?: () => void;
  onLogoutPress?: () => void;
  onRoleSwitchPress?: () => void;
  onNotificationsPress?: () => void;
  onCardLinkPress?: () => void;
  onHelpPress?: () => void;
  onComplaintPress?: () => void;
};

export function ProfileSummaryView({
  profile,
  onEditPress,
  onLogoutPress,
  onRoleSwitchPress,
  onNotificationsPress,
  onCardLinkPress,
  onHelpPress,
  onComplaintPress,
}: Props) {
  const isWorker =
    profile.role === "worker" ||
    (profile.workTypes?.length ?? 0) > 0 ||
    (profile.serviceAreas?.length ?? 0) > 0;

  return (
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
              [profile.lastName, profile.firstName]
                .filter(Boolean)
                .join(" ")
                .trim() ||
              "Хэрэглэгч"}
          </Text>
        </View>
        <Ionicons name="pencil-outline" size={18} color="#6B6B6B" />
      </Pressable>

      <Pressable style={styles.infoCard} onPress={onRoleSwitchPress}>
        <View style={styles.infoIcon}>
          <Ionicons name="construct-outline" size={18} color="#111" />
        </View>
        <View style={styles.infoTextWrap}>
          <Text style={styles.infoTitle}>
            {isWorker ? "Хэрэглэгчээр нэвтрэх" : "Засварчинаар нэвтрэх"}
          </Text>
          <Text style={styles.infoDesc}>
            {isWorker
              ? "Та хэрэглэгчээр нэвтэрч захиалга өгч болно"
              : "Та засварчнаар нэвтэрээд нэмэлт орлого олоорой"}
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
  );
}
