import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LeftArrowIcon from "@/components/icons/_serviceIcons/leftarrowIcon";
import { styles } from "../sign-up.styles";
import { RoleStep } from "./sign-up/RoleStep";
import { WorkerDetailsStep } from "./sign-up/WorkerDetailsStep";
import { WorkerAreaStep } from "./sign-up/WorkerAreaStep";
import { UserDetailsStep } from "./sign-up/UserDetailsStep";
import { WorkerPersonalStep } from "./sign-up/WorkerPersonalStep";

type SignUpFormStepProps = {
  step: "role" | "details" | "area" | "personal";
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  userType: "user" | "worker" | null;
  workTypes: string[];
  serviceAreas: string[];
  errorMessage: string | null;
  debugInfo: string | null;
  showSuccess: boolean;
  onBackStep: () => void;
  onNextStep: () => void;
  onChangeUserType: (value: "user" | "worker") => void;
  onToggleWorkType: (value: string) => void;
  onToggleServiceArea: (value: string) => void;
  onChangeFirstName: (value: string) => void;
  onChangeLastName: (value: string) => void;
  onChangePhone: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onSubmit: () => void;
};

export function SignUpFormStep({
  step,
  firstName,
  lastName,
  emailAddress,
  phoneNumber,
  userType,
  workTypes,
  serviceAreas,
  errorMessage,
  debugInfo,
  showSuccess,
  onBackStep,
  onNextStep,
  onChangeUserType,
  onToggleWorkType,
  onToggleServiceArea,
  onChangeFirstName,
  onChangeLastName,
  onChangePhone,
  onChangeEmail,
  onSubmit,
}: SignUpFormStepProps) {
  const canContinueRole = !!userType;
  const canContinueDetails =
    userType === "worker"
      ? workTypes.length > 0
      : !!firstName.trim() &&
        !!lastName.trim() &&
        !!phoneNumber.trim() &&
        !!emailAddress.trim();
  const canContinueAreas = userType === "worker" ? serviceAreas.length > 0 : false;
  const canSubmitPersonal =
    !!firstName.trim() &&
    !!lastName.trim() &&
    !!phoneNumber.trim() &&
    !!emailAddress.trim();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {step !== "role" && (
          <Pressable style={styles.backButton} onPress={onBackStep} hitSlop={10}>
            <LeftArrowIcon width={20} height={20} />
          </Pressable>
        )}
        <Text style={styles.title}>Бүртгүүлэх</Text>
        {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
        {!!debugInfo && __DEV__ && <Text style={styles.debugText}>{debugInfo}</Text>}

        {step === "role" && (
          <RoleStep
            userType={userType}
            onChangeUserType={onChangeUserType}
            onNext={onNextStep}
            canContinue={canContinueRole}
          />
        )}

        {step === "details" && userType === "worker" && (
          <WorkerDetailsStep
            workTypes={workTypes}
            onToggleWorkType={onToggleWorkType}
            onNext={onNextStep}
            canContinue={canContinueDetails}
          />
        )}

        {step === "area" && userType === "worker" && (
          <WorkerAreaStep
            serviceAreas={serviceAreas}
            onToggleServiceArea={onToggleServiceArea}
            onNext={onNextStep}
            canContinue={canContinueAreas}
          />
        )}

        {step === "details" && userType === "user" && (
          <UserDetailsStep
            firstName={firstName}
            lastName={lastName}
            phoneNumber={phoneNumber}
            emailAddress={emailAddress}
            onChangeFirstName={onChangeFirstName}
            onChangeLastName={onChangeLastName}
            onChangePhone={onChangePhone}
            onChangeEmail={onChangeEmail}
            onSubmit={onSubmit}
            canContinue={canContinueDetails}
          />
        )}

        {step === "personal" && userType === "worker" && (
          <WorkerPersonalStep
            firstName={firstName}
            lastName={lastName}
            phoneNumber={phoneNumber}
            emailAddress={emailAddress}
            onChangeFirstName={onChangeFirstName}
            onChangeLastName={onChangeLastName}
            onChangePhone={onChangePhone}
            onChangeEmail={onChangeEmail}
            onSubmit={onSubmit}
            canContinue={canSubmitPersonal}
          />
        )}
      </ScrollView>

      {showSuccess && (
        <View style={styles.successOverlay}>
          <View style={styles.successCard}>
            <View style={styles.successIcon}>
              <Text style={styles.successIconText}>✓</Text>
            </View>
            <Text style={styles.successText}>Амжилттай нэвтэрлээ!</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
