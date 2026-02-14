import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, TextInput, View } from "react-native";
import { baseStyles } from "./styles/base";

type Props = {
  address: string;
  description: string;
  onChangeAddress: (value: string) => void;
  onChangeDescription: (value: string) => void;
  addressError?: string;
  descriptionError?: string;
};

export function DetailsSection({
  address,
  description,
  onChangeAddress,
  onChangeDescription,
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
      <Pressable style={baseStyles.attachBox} onPress={() => console.log("add")}>
        <MaterialCommunityIcons name="plus" size={26} color="#9B9B9B" />
      </Pressable>
    </>
  );
}
