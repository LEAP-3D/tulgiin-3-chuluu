import TsahilgaanIcon from "@/components/icons/_serviceIcons/tsahilgaanIcon";
import SantehnikIcon from "@/components/icons/_serviceIcons/santehnikIcon";
import TsoojIcon from "@/components/icons/_serviceIcons/tsoojIcon";
import BudagIcon from "@/components/icons/_serviceIcons/budagIcon";
import MujaanIcon from "@/components/icons/_serviceIcons/mujaanIcon";
import ShawijUstgalIcon from "@/components/icons/_serviceIcons/shawijustgalIcon";
import ShalIcon from "@/components/icons/_serviceIcons/shalIcon";
import HalaaltIcon from "@/components/icons/_serviceIcons/halaaltIcon";
import AgaarjuulaltIcon from "@/components/icons/_serviceIcons/agaarjuulaltIcon";
import NvvlgeltIcon from "@/components/icons/_serviceIcons/nvvlgeltIcon";
import AyulgviBaidalIcon from "@/components/icons/_serviceIcons/ayulgvibaidalIcon";
import InternetIcon from "@/components/icons/_serviceIcons/internetIcon";
import ShilToliIcon from "@/components/icons/_serviceIcons/shiltoliIcon";
import DeewerIcon from "@/components/icons/_serviceIcons/deewerIcon";
import TawilgaIcon from "@/components/icons/_serviceIcons/tawilgaIcon";
import GadnaTalbaiIcon from "@/components/icons/_serviceIcons/gadnatalbaiIcon";
import type { ComponentType } from "react";

export type ProfessionOption = {
  key: string;
  label: string;
  Icon: ComponentType<{ width?: number; height?: number }>;
};

export const PROFESSION_OPTIONS: ProfessionOption[] = [
  { key: "electric", label: "Цахилгаанчин", Icon: TsahilgaanIcon },
  { key: "plumbing", label: "Сантехникч", Icon: SantehnikIcon },
  { key: "lock", label: "Цоож, хаалга засвар", Icon: TsoojIcon },
  { key: "paint", label: "Будагчин", Icon: BudagIcon },
  { key: "carpenter", label: "Мужаан", Icon: MujaanIcon },
  { key: "clean", label: "Ариутгал", Icon: ShawijUstgalIcon },
  { key: "floor", label: "Шал", Icon: ShalIcon },
  { key: "heat", label: "Халаалт", Icon: HalaaltIcon },
  { key: "ac", label: "Агааржуулалт", Icon: AgaarjuulaltIcon },
  { key: "moving", label: "Нүүлгэлт", Icon: NvvlgeltIcon },
  { key: "security", label: "Аюулгүй байдал", Icon: AyulgviBaidalIcon },
  { key: "internet", label: "Интернет засвар", Icon: InternetIcon },
  { key: "glass", label: "Шил, толь", Icon: ShilToliIcon },
  { key: "roof", label: "Дээвэр", Icon: DeewerIcon },
  { key: "furniture", label: "Тавилга угсралт", Icon: TawilgaIcon },
  { key: "garden", label: "Гадна талбай", Icon: GadnaTalbaiIcon },
];

export const SERVICE_AREA_OPTIONS = [
  "Багануур дүүрэг",
  "Баянгол дүүрэг",
  "Баянзүрх дүүрэг",
  "Налайх дүүрэг",
  "Сүхбаатар дүүрэг",
  "Хан-Уул дүүрэг",
  "Чингэлтэй дүүрэг",
  "Сонгинохайрхан дүүрэг",
];
