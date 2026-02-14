import { MaterialCommunityIcons } from "@expo/vector-icons";

export type ServiceOption = {
  key: string;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

export const SERVICE_LABELS: Record<string, string> = {
  electric: "Цахилгаан",
  plumbing: "Сантехник",
  lock: "Цоож, хаалга засвар",
  paint: "Будаг",
  carpenter: "Мужаан",
  clean: "Ариутгал",
  heat: "Халаалт",
  internet: "Интернет",
  ac: "Агааржуулалт",
  security: "Аюулгүй байдал",
  glass: "Шил, толь",
  furniture: "Тавилга",
  floor: "Шал",
  roof: "Дээвэр",
  moving: "Нүүлгэлт",
  garden: "Гадна талбай",
};

export const SERVICE_ICON_NAMES: Record<
  string,
  keyof typeof MaterialCommunityIcons.glyphMap
> = {
  electric: "power-plug",
  plumbing: "water",
  lock: "lock",
  paint: "format-paint",
  carpenter: "hammer",
  clean: "broom",
  heat: "fire",
  internet: "wifi",
  ac: "fan",
  security: "shield-check",
  glass: "mirror",
  furniture: "sofa",
  floor: "floor-plan",
  roof: "home-roof",
  moving: "truck-fast",
  garden: "pine-tree",
};

export const SERVICE_EMOJIS: Record<string, string> = {
  electric: "⚡",
  plumbing: "🚰",
  lock: "🔒",
  paint: "🎨",
  carpenter: "🔨",
  clean: "🧼",
  heat: "🔥",
  internet: "📶",
  ac: "❄️",
  security: "🛡️",
  glass: "🪟",
  furniture: "🛋️",
  floor: "🧱",
  roof: "🏠",
  moving: "🚚",
  garden: "🌲",
};

export const SERVICE_OPTIONS: ServiceOption[] = [
  { key: "electric", label: "Цахилгаан", icon: "power-plug" },
  { key: "plumbing", label: "Сантехник", icon: "water" },
  { key: "lock", label: "Цоож", icon: "lock" },
  { key: "paint", label: "Будаг", icon: "format-paint" },
  { key: "carpenter", label: "Мужаан", icon: "hammer" },
  { key: "clean", label: "Ариутгал", icon: "broom" },
  { key: "heat", label: "Халаалт", icon: "fire" },
  { key: "internet", label: "Интернет", icon: "wifi" },
  { key: "ac", label: "Агааржуулалт", icon: "fan" },
  { key: "security", label: "Аюулгүй байдал", icon: "shield-check" },
  { key: "glass", label: "Шил, толь", icon: "mirror" },
  { key: "furniture", label: "Тавилга", icon: "sofa" },
  { key: "floor", label: "Шал", icon: "floor-plan" },
  { key: "roof", label: "Дээвэр", icon: "home-roof" },
  { key: "moving", label: "Нүүлгэлт", icon: "truck-fast" },
  { key: "garden", label: "Гадна талбай", icon: "pine-tree" },
];
