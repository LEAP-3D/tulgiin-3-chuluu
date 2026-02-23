import { ServiceAllView } from "@/features/service/_components/service-all/ServiceAllView";
import { useServiceAllController } from "@/features/service/_components/service-all/useServiceAllController";

export default function ServiceAllScreen() {
  const controller = useServiceAllController();
  return <ServiceAllView controller={controller} />;
}
