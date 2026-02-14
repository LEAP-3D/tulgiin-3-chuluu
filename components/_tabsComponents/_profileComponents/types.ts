export type ProfileData = {
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  workTypes?: string[];
  serviceAreas?: string[];
  avatarUrl?: string;
  displayName?: string;
};

export type ProfileField = keyof Pick<
  ProfileData,
  "lastName" | "firstName" | "email" | "phone"
>;

export type ProfileErrors = {
  lastName?: string;
  firstName?: string;
  email?: string;
  phone?: string;
};

export type ProfileScreenProps = {
  profile: ProfileData;
  isEditing: boolean;
  onChangeField: (field: ProfileField, value: string) => void;
  onEditPress?: () => void;
  onSavePress?: () => void;
  onLogoutPress?: () => void;
  onNotificationsPress?: () => void;
  onCardLinkPress?: () => void;
  onHelpPress?: () => void;
  onComplaintPress?: () => void;
  isSaving?: boolean;
  errors?: ProfileErrors;
  showErrors?: boolean;
};
