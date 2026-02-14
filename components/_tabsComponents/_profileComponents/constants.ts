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

export const WORK_TYPE_ICON_MAP: Record<string, React.ComponentType<any>> = {
  electric: TsahilgaanIcon,
  plumbing: SantehnikIcon,
  lock: TsoojIcon,
  paint: BudagIcon,
  carpenter: MujaanIcon,
  clean: ShawijUstgalIcon,
  floor: ShalIcon,
  heat: HalaaltIcon,
  ac: AgaarjuulaltIcon,
  moving: NvvlgeltIcon,
  security: AyulgviBaidalIcon,
  internet: InternetIcon,
  glass: ShilToliIcon,
  roof: DeewerIcon,
  furniture: TawilgaIcon,
  garden: GadnaTalbaiIcon,
  "Цахилгаан": TsahilgaanIcon,
  "Цахилгаанчин": TsahilgaanIcon,
  "Сантехник": SantehnikIcon,
  "Сантехникч": SantehnikIcon,
  "Цоож": TsoojIcon,
  "Цоож, хаалга засвар": TsoojIcon,
  "Будаг": BudagIcon,
  "Будагчин": BudagIcon,
  "Мужаан": MujaanIcon,
  "Ариутгал": ShawijUstgalIcon,
  "Шал": ShalIcon,
  "Халаалт": HalaaltIcon,
  "Агааржуулалт": AgaarjuulaltIcon,
  "Нүүлгэлт": NvvlgeltIcon,
  "Аюулгүй байдал": AyulgviBaidalIcon,
  "Интернет": InternetIcon,
  "Интернет засвар": InternetIcon,
  "Шил, толь": ShilToliIcon,
  "Дээвэр": DeewerIcon,
  "Тавилга": TawilgaIcon,
  "Тавилга угсралт": TawilgaIcon,
  "Гадна талбай": GadnaTalbaiIcon,
};

export const WORK_TYPE_LABEL_MAP: Record<string, string> = {
  electric: "Цахилгаан",
  plumbing: "Сантехник",
  lock: "Цоож, хаалга засвар",
  paint: "Будаг",
  carpenter: "Мужаан",
  clean: "Ариутгал",
  floor: "Шал",
  heat: "Халаалт",
  ac: "Агааржуулалт",
  moving: "Нүүлгэлт",
  security: "Аюулгүй байдал",
  internet: "Интернет засвар",
  glass: "Шил, толь",
  roof: "Дээвэр",
  furniture: "Тавилга угсралт",
  garden: "Гадна талбай",
};

export const DISTRICT_SHORT_MAP: Record<string, string> = {
  "Баянзүрх": "БЗД",
  "Баянзүрх дүүрэг": "БЗД",
  "Сонгинохайрхан": "СХД",
  "Сонгинохайрхан дүүрэг": "СХД",
  "Чингэлтэй": "ЧД",
  "Чингэлтэй дүүрэг": "ЧД",
  "Сүхбаатар": "СБД",
  "Сүхбаатар дүүрэг": "СБД",
  "Хан-Уул": "ХУД",
  "Хан-Уул дүүрэг": "ХУД",
  "Баянгол": "БГД",
  "Баянгол дүүрэг": "БГД",
  "Налайх": "НД",
  "Налайх дүүрэг": "НД",
  "Багануур": "БНД",
  "Багануур дүүрэг": "БНД",
  "Багахангай": "БХД",
  "Багахангай дүүрэг": "БХД",
};

export const formatDistrictShort = (value: string) =>
  DISTRICT_SHORT_MAP[value] ?? value;
