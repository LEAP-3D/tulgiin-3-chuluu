import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, Image, Pressable, Text, TextInput, View } from "react-native";
import { baseStyles } from "./styles/base";
import { attachmentStyles } from "./styles/attachments";

type Props = {
  address: string;
  description: string;
  attachmentUrls: string[];
  maxAttachments: number;
  isUploadingAttachment: boolean;
  attachmentError: string | null;
  onChangeAddress: (value: string) => void;
  onChangeDescription: (value: string) => void;
  onAddAttachment: () => void;
  onRemoveAttachment: (index: number) => void;
  addressError?: string;
  descriptionError?: string;
};

export function DetailsSection({
  address,
  description,
  attachmentUrls,
  maxAttachments,
  isUploadingAttachment,
  attachmentError,
  onChangeAddress,
  onChangeDescription,
  onAddAttachment,
  onRemoveAttachment,
  addressError,
  descriptionError,
}: Props) {
  return (
    <>
      <TextInput
        placeholder="Дэлгэрэнгүй хаяг (орц, давхар, код)"
        placeholderTextColor="#A3A3A3"
        style={[baseStyles.input, addressError && baseStyles.inputError]}
        value={address}
        onChangeText={onChangeAddress}
      />
      {!!addressError && <Text style={baseStyles.errorText}>{addressError}</Text>}

      <Text style={baseStyles.label}>Тайлбар</Text>
      <TextInput
        placeholder="Тайлбар бичнэ үү"
        placeholderTextColor="#A3A3A3"
        style={[
          baseStyles.input,
          baseStyles.textArea,
          descriptionError && baseStyles.inputError,
        ]}
        multiline
        value={description}
        onChangeText={onChangeDescription}
      />
      {!!descriptionError && (
        <Text style={baseStyles.errorText}>{descriptionError}</Text>
      )}

      <Text style={baseStyles.label}>Зураг хавсаргах</Text>
      <View style={attachmentStyles.row}>
        {attachmentUrls.map((uri, index) => (
          <View key={`${uri}-${index}`} style={attachmentStyles.thumbWrap}>
            <Image source={{ uri }} style={attachmentStyles.thumbImage} />
            <Pressable
              style={attachmentStyles.removeButton}
              onPress={() => onRemoveAttachment(index)}
              accessibilityLabel="Хавсралт устгах"
            >
              <MaterialCommunityIcons name="close" size={14} color="#FFFFFF" />
            </Pressable>
          </View>
        ))}

        <Pressable
          style={[
            baseStyles.attachBox,
            isUploadingAttachment && attachmentStyles.attachBoxDisabled,
          ]}
          onPress={onAddAttachment}
          disabled={isUploadingAttachment}
        >
          {isUploadingAttachment ? (
            <ActivityIndicator size="small" color="#9B9B9B" />
          ) : (
            <MaterialCommunityIcons name="plus" size={26} color="#9B9B9B" />
          )}
        </Pressable>
      </View>

      <Text style={attachmentStyles.counterText}>
        {attachmentUrls.length}/{maxAttachments} зураг
      </Text>
      {!!attachmentError && <Text style={baseStyles.errorText}>{attachmentError}</Text>}
    </>
  );
}
