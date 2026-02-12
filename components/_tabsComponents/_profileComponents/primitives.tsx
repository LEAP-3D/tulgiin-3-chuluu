import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./index.styles";

type FieldRowProps = {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  editable: boolean;
  keyboardType?: "default" | "phone-pad";
  inputMode?: "text" | "tel" | "numeric";
  textContentType?: "none" | "telephoneNumber";
  autoComplete?: "off" | "tel";
};

export function FieldRow({
  icon,
  placeholder,
  value,
  onChangeText,
  editable,
  keyboardType,
  inputMode,
  textContentType,
  autoComplete,
}: FieldRowProps) {
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

export function Divider() {
  return <View style={styles.divider} />;
}

type MenuRowProps = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  onPress?: () => void;
};

export function MenuRow({ icon, label, onPress }: MenuRowProps) {
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
