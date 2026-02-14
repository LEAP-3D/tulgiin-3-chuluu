import { StyleSheet } from "react-native";
import { signUpBaseStyles } from "./sign-up.styles.base";
import { signUpOtpStyles } from "./sign-up.styles.otp";
import { signUpSuccessStyles } from "./sign-up.styles.success";

export const styles = StyleSheet.create({
  ...signUpBaseStyles,
  ...signUpOtpStyles,
  ...signUpSuccessStyles,
});
