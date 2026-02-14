import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./index.styles";
import { FieldRow } from "./primitives";
import type { ProfileData, ProfileErrors, ProfileField } from "./types";
import { WorkTypeChips } from "./WorkTypeChips";
import { ServiceAreaChips } from "./ServiceAreaChips";

type Props = {
  profile: ProfileData;
  onChangeField: (field: ProfileField, value: string) => void;
  onEditPress?: () => void;
  onSavePress?: () => void;
  isSaving?: boolean;
  errors?: ProfileErrors;
  showErrors?: boolean;
};

export function ProfileEditView({
  profile,
  onChangeField,
  onEditPress,
  onSavePress,
  isSaving,
  errors,
  showErrors,
}: Props) {
  return (
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

      <WorkTypeChips workTypes={profile.workTypes ?? []} />
      <ServiceAreaChips serviceAreas={profile.serviceAreas ?? []} />

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
  );
}
