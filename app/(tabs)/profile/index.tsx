import ProfileScreen, {
  ProfileData,
  ProfileField,
} from "@/components/_tabsComponents/_profileComponents";
import { useSignOut } from "@/components/sign-out-button";
import { useState } from "react";
import { Alert } from "react-native";

export default function TabTwoScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    lastName: "Бат",
    firstName: "Энх",
    profession: "Бариста",
    phone: "9900 1122",
    location: "Улаанбаатар",
    avatarUrl: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
    displayName: "Хэрэглэгч",
  });

  const handleChangeField = (field: ProfileField, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditPress = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSavePress = async () => {
    setIsSaving(true);
    try {
      // TODO: Backend руу хадгалалт хийх API холбоно.
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsEditing(false);
      Alert.alert("Амжилттай", "Профайл хадгалагдлаа.");
    } catch {
      Alert.alert("Алдаа", "Хадгалах үед алдаа гарлаа.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoutPress = useSignOut();

  return (
    <ProfileScreen
      profile={profile}
      isEditing={isEditing}
      isSaving={isSaving}
      onChangeField={handleChangeField}
      onEditPress={handleEditPress}
      onSavePress={handleSavePress}
      onLogoutPress={handleLogoutPress}
    />
  );
}
