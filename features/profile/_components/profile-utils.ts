import { normalizeList } from "@/lib/utils/normalize";

const WORK_TYPE_LABEL_TO_KEY: Record<string, string> = {
  "Цахилгаан": "electric",
  "Цахилгаанчин": "electric",
  "Сантехник": "plumbing",
  "Сантехникч": "plumbing",
  "Цоож": "lock",
  "Цоож, хаалга засвар": "lock",
  "Будаг": "paint",
  "Будагчин": "paint",
  "Мужаан": "carpenter",
  "Ариутгал": "clean",
  "Шал": "floor",
  "Халаалт": "heat",
  "Агааржуулалт": "ac",
  "Нүүлгэлт": "moving",
  "Аюулгүй байдал": "security",
  "Интернет": "internet",
  "Интернет засвар": "internet",
  "Шил, толь": "glass",
  "Дээвэр": "roof",
  "Тавилга": "furniture",
  "Тавилга угсралт": "furniture",
  "Гадна талбай": "garden",
};

export const normalizeWorkTypes = (value: unknown): string[] => {
  const list = normalizeList(value);
  return list.map((item) => WORK_TYPE_LABEL_TO_KEY[item] ?? item);
};
