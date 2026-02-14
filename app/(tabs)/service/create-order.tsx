import { CreateOrderView } from "./_components/create-order/CreateOrderView";
import { useCreateOrderController } from "./_components/create-order/useCreateOrderController";

export default function CreateOrderScreen() {
  const controller = useCreateOrderController();
  return <CreateOrderView controller={controller} />;
}
