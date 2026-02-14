import { SelectRepairmanView } from "./_components/select-repairman/SelectRepairmanView";
import { useSelectRepairmanController } from "./_components/select-repairman/useSelectRepairmanController";

export default function SelectRepairmanScreen() {
  const controller = useSelectRepairmanController();
  return <SelectRepairmanView controller={controller} />;
}
