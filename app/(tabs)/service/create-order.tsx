import { CreateOrderView } from "@/features/service/_components/create-order/CreateOrderView";
import { useCreateOrderController } from "@/features/service/_components/create-order/useCreateOrderController";

export default function CreateOrderScreen() {
  const controller = useCreateOrderController();
  return <CreateOrderView controller={controller} />;
}
