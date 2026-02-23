import { SignUpFormStep } from "@/features/auth/_components/sign-up-form-step";
import { SignUpVerifyStep } from "@/features/auth/_components/sign-up-verify-step";
import { useSignUpController } from "@/features/auth/_components/sign-up/useSignUpController";

export default function Page() {
  const controller = useSignUpController();

  if (controller.pendingVerification) {
    return (
      <SignUpVerifyStep
        code={controller.code}
        errorMessage={controller.errorMessage}
        debugInfo={controller.debugInfo}
        showSuccess={controller.showSuccess}
        onBack={controller.onBackVerification}
        onChangeCode={(value) => controller.setCode(value.replace(/\D/g, ""))}
        onVerify={controller.onVerifyPress}
        codeInputRef={controller.codeInputRef}
      />
    );
  }

  return (
    <SignUpFormStep
      step={controller.formStep}
      firstName={controller.firstName}
      lastName={controller.lastName}
      emailAddress={controller.emailAddress}
      phoneNumber={controller.phoneNumber}
      userType={controller.userType}
      workTypes={controller.workTypes}
      serviceAreas={controller.serviceAreas}
      errorMessage={controller.errorMessage}
      debugInfo={controller.debugInfo}
      showSuccess={controller.showSuccess}
      onBackStep={() =>
        controller.setFormStep((prev) => {
          if (prev === "personal") return "area";
          if (prev === "area") return "details";
          return "role";
        })
      }
      onNextStep={() =>
        controller.setFormStep((prev) => {
          if (prev === "role") return "details";
          if (prev === "details" && controller.userType === "worker") return "area";
          if (prev === "area") return "personal";
          return prev;
        })
      }
      onChangeUserType={(value) => {
        controller.setUserType(value);
        if (value !== "worker") {
          controller.setWorkTypes([]);
          controller.setServiceAreas([]);
        }
      }}
      onToggleWorkType={(value) =>
        controller.setWorkTypes((prev) =>
          prev.includes(value)
            ? prev.filter((item) => item !== value)
            : [...prev, value],
        )
      }
      onToggleServiceArea={(value) =>
        controller.setServiceAreas((prev) =>
          prev.includes(value)
            ? prev.filter((item) => item !== value)
            : [...prev, value],
        )
      }
      onChangeFirstName={controller.setFirstName}
      onChangeLastName={controller.setLastName}
      onChangePhone={(value) => controller.setPhoneNumber(value.replace(/\D/g, ""))}
      onChangeEmail={controller.setEmailAddress}
      onSubmit={controller.onSignUpPress}
    />
  );
}
