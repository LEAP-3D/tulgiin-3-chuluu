export const makeKhoroos = (count: number) =>
  Array.from({ length: count }, (_, index) => `${index + 1}-р хороо`);

export const DISTRICTS = [
  { name: "Багануур", khoroos: makeKhoroos(5) },
  { name: "Багахангай", khoroos: makeKhoroos(2) },
  { name: "Баянгол", khoroos: makeKhoroos(10) },
  { name: "Баянзүрх", khoroos: makeKhoroos(10) },
  { name: "Налайх", khoroos: makeKhoroos(8) },
  { name: "Сонгинохайрхан", khoroos: makeKhoroos(10) },
  { name: "Сүхбаатар", khoroos: makeKhoroos(10) },
  { name: "Хан-Уул", khoroos: makeKhoroos(10) },
  { name: "Чингэлтэй", khoroos: makeKhoroos(10) },
];

export const DISTRICT_SHORT: Record<string, string> = {
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
  DISTRICT_SHORT[value] ?? value;
