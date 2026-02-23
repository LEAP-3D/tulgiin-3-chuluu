import { SelectRepairmanView } from "@/features/service/_components/select-repairman/SelectRepairmanView";
import { useSelectRepairmanController } from "@/features/service/_components/select-repairman/useSelectRepairmanController";

export default function SelectRepairmanScreen() {
  const controller = useSelectRepairmanController();
  return <SelectRepairmanView controller={controller} />;
}
