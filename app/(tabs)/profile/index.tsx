import ProfileScreen from "@/components/_tabsComponents/_profileComponents";
import { useProfileController } from "@/features/profile/_components/useProfileController";

export default function ProfileTabScreen() {
  const controller = useProfileController();
  return <ProfileScreen {...controller} />;
}
