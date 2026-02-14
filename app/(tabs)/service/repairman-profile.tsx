import { RepairmanProfileView } from "./_components/repairman-profile/RepairmanProfileView";
import { useRepairmanProfileController } from "./_components/repairman-profile/useRepairmanProfileController";

export default function RepairmanProfileScreen() {
  const controller = useRepairmanProfileController();
  return <RepairmanProfileView controller={controller} />;
}
