import { ScrollView, View } from "react-native";
import type { CreateOrderController } from "./useCreateOrderController";
import { baseStyles } from "./styles/base";
import { Header } from "./Header";
import { ServiceTypeSection } from "./ServiceTypeSection";
import { DateSection } from "./DateSection";
import { LocationSection } from "./LocationSection";
import { DetailsSection } from "./DetailsSection";
import { UrgencySection } from "./UrgencySection";
import { WorkerCard } from "./WorkerCard";
import { SubmitSection } from "./SubmitSection";

export function CreateOrderView({ controller }: { controller: CreateOrderController }) {
  const {
    insetsBottom,
    selectedService,
    formattedDate,
    date,
    tempDate,
    minimumDate,
    district,
    khoroo,
    address,
    description,
    urgency,
    errors,
    selectedWorker,
    showDatePicker,
    showDistrictPicker,
    showKhorooPicker,
    khorooOptions,
    openDatePicker,
    closeDatePicker,
    confirmDatePicker,
    handleDateChange,
    setShowDistrictPicker,
    setShowKhorooPicker,
    handleSelectDistrict,
    handleSelectKhoroo,
    setAddress,
    setDescription,
    setUrgency,
    setErrors,
    handlePrimaryAction,
    handleBack,
  } = controller;
  const hasWorker = !!selectedWorker;

  return (
    <View style={baseStyles.container}>
      <View style={baseStyles.divider} />
      <ScrollView
        contentContainerStyle={[
          baseStyles.content,
          { paddingBottom: (hasWorker ? 136 : 40) + insetsBottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Header title="Захиалга үүсгэх" onBack={handleBack} />

        <ServiceTypeSection
          label={selectedService.label}
          icon={selectedService.icon}
          error={errors.service}
        />

        <DateSection
          formattedDate={formattedDate}
          date={date}
          tempDate={tempDate}
          minimumDate={minimumDate}
          showDatePicker={showDatePicker}
          error={errors.date}
          openDatePicker={openDatePicker}
          closeDatePicker={closeDatePicker}
          confirmDatePicker={confirmDatePicker}
          handleDateChange={handleDateChange}
        />

        <LocationSection
          district={district}
          khoroo={khoroo}
          khorooOptions={khorooOptions}
          showDistrictPicker={showDistrictPicker}
          showKhorooPicker={showKhorooPicker}
          onOpenDistrict={() => setShowDistrictPicker(true)}
          onOpenKhoroo={() => district && setShowKhorooPicker(true)}
          onCloseDistrict={() => setShowDistrictPicker(false)}
          onCloseKhoroo={() => setShowKhorooPicker(false)}
          onSelectDistrict={handleSelectDistrict}
          onSelectKhoroo={handleSelectKhoroo}
          districtError={errors.district}
          khorooError={errors.khoroo}
        />

        <DetailsSection
          address={address}
          description={description}
          onChangeAddress={(value) => {
            setAddress(value);
            if (errors.address) {
              setErrors((prev) => ({ ...prev, address: undefined }));
            }
          }}
          onChangeDescription={(value) => {
            setDescription(value);
            if (errors.description) {
              setErrors((prev) => ({ ...prev, description: undefined }));
            }
          }}
          addressError={errors.address}
          descriptionError={errors.description}
        />

        <UrgencySection
          urgency={urgency}
          error={errors.urgency}
          onChange={(value) => {
            setUrgency(value);
            if (errors.urgency) {
              setErrors((prev) => ({ ...prev, urgency: undefined }));
            }
          }}
        />

        {selectedWorker ? (
          <WorkerCard worker={selectedWorker} serviceLabel={selectedService.label} />
        ) : null}

        {!hasWorker ? (
          <SubmitSection
            isSubmitting={controller.isSubmitting}
            hasWorker={false}
            submitError={controller.submitError}
            onPress={handlePrimaryAction}
          />
        ) : null}
      </ScrollView>

      {hasWorker ? (
        <View
          style={[
            baseStyles.submitStickyBar,
            { paddingBottom: Math.max(insetsBottom, 12) },
          ]}
        >
          <SubmitSection
            isSubmitting={controller.isSubmitting}
            hasWorker
            submitError={controller.submitError}
            onPress={handlePrimaryAction}
            isSticky
          />
        </View>
      ) : null}
    </View>
  );
}
