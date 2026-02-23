import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { baseStyles } from "./styles/base";
import { modalStyles } from "./styles/modals";
import { DISTRICTS } from "@/constants/districts";

type Props = {
  district: string;
  khoroo: string;
  khorooOptions: string[];
  showDistrictPicker: boolean;
  showKhorooPicker: boolean;
  onOpenDistrict: () => void;
  onOpenKhoroo: () => void;
  onCloseDistrict: () => void;
  onCloseKhoroo: () => void;
  onSelectDistrict: (value: string) => void;
  onSelectKhoroo: (value: string) => void;
  districtError?: string;
  khorooError?: string;
};

export function LocationSection({
  district,
  khoroo,
  khorooOptions,
  showDistrictPicker,
  showKhorooPicker,
  onOpenDistrict,
  onOpenKhoroo,
  onCloseDistrict,
  onCloseKhoroo,
  onSelectDistrict,
  onSelectKhoroo,
  districtError,
  khorooError,
}: Props) {
  return (
    <>
      <Text style={baseStyles.label}>Байршил</Text>
      <Pressable
        style={[
          baseStyles.input,
          baseStyles.selectInput,
          districtError && baseStyles.inputError,
        ]}
        onPress={onOpenDistrict}
      >
        <Text
          style={[
            baseStyles.selectText,
            !district && baseStyles.placeholderText,
          ]}
        >
          {district || "Дүүрэг сонгох"}
        </Text>
        <MaterialCommunityIcons name="chevron-down" size={20} color="#9B9B9B" />
      </Pressable>
      {!!districtError && <Text style={baseStyles.errorText}>{districtError}</Text>}

      <Pressable
        style={[
          baseStyles.input,
          baseStyles.selectInput,
          !district && baseStyles.selectDisabled,
          khorooError && baseStyles.inputError,
        ]}
        onPress={onOpenKhoroo}
        disabled={!district}
      >
        <Text
          style={[
            baseStyles.selectText,
            !khoroo && baseStyles.placeholderText,
          ]}
        >
          {khoroo || "Хороо сонгох"}
        </Text>
        <MaterialCommunityIcons name="chevron-down" size={20} color="#9B9B9B" />
      </Pressable>
      {!!khorooError && <Text style={baseStyles.errorText}>{khorooError}</Text>}

      <Modal
        visible={showDistrictPicker}
        transparent
        animationType="fade"
        onRequestClose={onCloseDistrict}
      >
        <View style={modalStyles.selectOverlay}>
          <View style={modalStyles.selectCard}>
            <View style={modalStyles.selectHeader}>
              <Text style={modalStyles.selectTitle}>Дүүрэг сонгох</Text>
              <Pressable onPress={onCloseDistrict} hitSlop={10}>
                <Text style={modalStyles.selectClose}>Хаах</Text>
              </Pressable>
            </View>
            <ScrollView>
              {DISTRICTS.map((item) => (
                <Pressable
                  key={item.name}
                  style={[
                    modalStyles.optionRow,
                    district === item.name && modalStyles.optionRowSelected,
                  ]}
                  onPress={() => onSelectDistrict(item.name)}
                >
                  <Text
                    style={[
                      modalStyles.optionText,
                      district === item.name && modalStyles.optionTextSelected,
                    ]}
                  >
                    {item.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showKhorooPicker}
        transparent
        animationType="fade"
        onRequestClose={onCloseKhoroo}
      >
        <View style={modalStyles.selectOverlay}>
          <View style={modalStyles.selectCard}>
            <View style={modalStyles.selectHeader}>
              <Text style={modalStyles.selectTitle}>Хороо сонгох</Text>
              <Pressable onPress={onCloseKhoroo} hitSlop={10}>
                <Text style={modalStyles.selectClose}>Хаах</Text>
              </Pressable>
            </View>
            <ScrollView>
              {khorooOptions.map((item) => (
                <Pressable
                  key={item}
                  style={[
                    modalStyles.optionRow,
                    khoroo === item && modalStyles.optionRowSelected,
                  ]}
                  onPress={() => onSelectKhoroo(item)}
                >
                  <Text
                    style={[
                      modalStyles.optionText,
                      khoroo === item && modalStyles.optionTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
