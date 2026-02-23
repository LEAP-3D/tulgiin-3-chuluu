import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Modal, Platform, Pressable, Text, View } from "react-native";
import { baseStyles } from "./styles/base";
import { modalStyles } from "./styles/modals";

type Props = {
  formattedDate: string;
  date: Date | null;
  tempDate: Date;
  minimumDate: Date;
  showDatePicker: boolean;
  error?: string;
  openDatePicker: () => void;
  closeDatePicker: () => void;
  confirmDatePicker: () => void;
  handleDateChange: (_event: unknown, selectedDate?: Date) => void;
};

export function DateSection({
  formattedDate,
  date,
  tempDate,
  minimumDate,
  showDatePicker,
  error,
  openDatePicker,
  closeDatePicker,
  confirmDatePicker,
  handleDateChange,
}: Props) {
  return (
    <>
      <Text style={baseStyles.label}>Он/сар/өдөр</Text>
      <Pressable
        style={[
          baseStyles.input,
          baseStyles.dateInput,
          error && baseStyles.inputError,
        ]}
        onPress={openDatePicker}
      >
        <Text
          style={[
            baseStyles.dateText,
            !formattedDate && baseStyles.placeholderText,
          ]}
        >
          {formattedDate || "Он/сар/өдөр сонгох"}
        </Text>
        <MaterialCommunityIcons
          name="calendar-month"
          size={20}
          color="#9B9B9B"
        />
      </Pressable>
      {!!error && <Text style={baseStyles.errorText}>{error}</Text>}

      {showDatePicker && Platform.OS !== "ios" && (
        <DateTimePicker
          value={date ?? new Date()}
          mode="date"
          display="default"
          minimumDate={minimumDate}
          onChange={handleDateChange}
        />
      )}

      {Platform.OS === "ios" && (
        <Modal
          visible={showDatePicker}
          transparent
          animationType="fade"
          onRequestClose={closeDatePicker}
        >
          <View style={modalStyles.dateModalOverlay}>
            <View style={modalStyles.dateModalCard}>
              <View style={modalStyles.dateModalHeader}>
                <Pressable onPress={closeDatePicker} hitSlop={10}>
                  <Text style={modalStyles.dateModalCancel}>Болих</Text>
                </Pressable>
                <Text style={modalStyles.dateModalTitle}>Огноо сонгох</Text>
                <Pressable onPress={confirmDatePicker} hitSlop={10}>
                  <Text style={modalStyles.dateModalDone}>Болсон</Text>
                </Pressable>
              </View>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                minimumDate={minimumDate}
                onChange={handleDateChange}
              />
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}
