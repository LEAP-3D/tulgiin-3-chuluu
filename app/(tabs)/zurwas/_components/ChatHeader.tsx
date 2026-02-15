import * as React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LeftArrowIcon from "@/components/icons/_serviceIcons/leftarrowIcon";
import { styles } from "./styles";

type Props = {
  title: string;
  subtitle?: string;
  meta?: string;
  avatarUrl?: string | null;
  onBack: () => void;
  onCopyOrderId?: () => void;
  topInset?: number;
};

export function ChatHeader({
  title,
  subtitle,
  meta,
  avatarUrl,
  onBack,
  onCopyOrderId,
  topInset = 0,
}: Props) {
  return (
    <View style={[styles.headerRow, { paddingTop: 12 + topInset }]}>
      <Pressable style={styles.backButton} onPress={onBack}>
        <LeftArrowIcon width={22} height={22} color="#1F1F1F" />
      </Pressable>
      {avatarUrl ? (
        <Image source={{ uri: avatarUrl }} style={styles.headerAvatarImage} />
      ) : (
        <View style={styles.headerAvatar}>
          <Ionicons name="person" size={18} color="#FFFFFF" />
        </View>
      )}
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
        {!!subtitle && (
          <Text
            style={styles.headerSubtitle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {subtitle}
          </Text>
        )}
        {!!meta && (
          <View style={styles.headerMetaRow}>
            <Text style={styles.headerMeta} numberOfLines={1} ellipsizeMode="tail">
              {meta}
            </Text>
            {!!onCopyOrderId && (
              <Pressable style={styles.copyButton} onPress={onCopyOrderId} hitSlop={8}>
                <Ionicons name="copy-outline" size={16} color="#8C8C8C" />
              </Pressable>
            )}
          </View>
        )}
      </View>
    </View>
  );
}
