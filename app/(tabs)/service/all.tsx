import { ServiceAllView } from "./_components/service-all/ServiceAllView";
import { useServiceAllController } from "./_components/service-all/useServiceAllController";

export default function ServiceAllScreen() {
  const controller = useServiceAllController();
  return <ServiceAllView controller={controller} />;
}
