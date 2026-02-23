import TsahilgaanIcon from "@/components/icons/_serviceIcons/tsahilgaanIcon";
import SantehnikIcon from "@/components/icons/_serviceIcons/santehnikIcon";
import TsoojIcon from "@/components/icons/_serviceIcons/tsoojIcon";
import BudagIcon from "@/components/icons/_serviceIcons/budagIcon";
import MujaanIcon from "@/components/icons/_serviceIcons/mujaanIcon";
import ShawijustgalIcon from "@/components/icons/_serviceIcons/shawijustgalIcon";
import HalaaltIcon from "@/components/icons/_serviceIcons/halaaltIcon";
import InternetIcon from "@/components/icons/_serviceIcons/internetIcon";
import AgaarjuulaltIcon from "@/components/icons/_serviceIcons/agaarjuulaltIcon";
import AyulgviBaidalIcon from "@/components/icons/_serviceIcons/ayulgvibaidalIcon";
import ShiltoliIcon from "@/components/icons/_serviceIcons/shiltoliIcon";
import TawilgaIcon from "@/components/icons/_serviceIcons/tawilgaIcon";
import ShalIcon from "@/components/icons/_serviceIcons/shalIcon";
import DeewerIcon from "@/components/icons/_serviceIcons/deewerIcon";
import NvvlgeltIcon from "@/components/icons/_serviceIcons/nvvlgeltIcon";
import GadnatalbaiIcon from "@/components/icons/_serviceIcons/gadnatalbaiIcon";

export type ServiceItem = {
  key: string;
  label: string;
  Icon: React.ComponentType<{ width?: number; height?: number }>;
};

export const SERVICES: ServiceItem[] = [
  { key: "electric", label: "Цахилгаан", Icon: TsahilgaanIcon },
  { key: "plumbing", label: "Сантехник", Icon: SantehnikIcon },
  { key: "lock", label: "Цоож", Icon: TsoojIcon },
  { key: "paint", label: "Будаг", Icon: BudagIcon },
  { key: "carpenter", label: "Мужаан", Icon: MujaanIcon },
  { key: "clean", label: "Ариутгал", Icon: ShawijustgalIcon },
  { key: "heat", label: "Халаалт", Icon: HalaaltIcon },
  { key: "internet", label: "Интернет", Icon: InternetIcon },
  { key: "ac", label: "Агааржуулалт", Icon: AgaarjuulaltIcon },
  { key: "security", label: "Аюулгүй байдал", Icon: AyulgviBaidalIcon },
  { key: "glass", label: "Шил, толь", Icon: ShiltoliIcon },
  { key: "furniture", label: "Тавилга", Icon: TawilgaIcon },
  { key: "floor", label: "Шал", Icon: ShalIcon },
  { key: "roof", label: "Дээвэр", Icon: DeewerIcon },
  { key: "moving", label: "Нүүлгэлт", Icon: NvvlgeltIcon },
  { key: "garden", label: "Гадна талбай", Icon: GadnatalbaiIcon },
];
