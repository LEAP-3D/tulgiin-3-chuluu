import SantehnikIcon from "@/components/icons/_serviceIcons/santehnikIcon";
import ShawijustgalIcon from "@/components/icons/_serviceIcons/shawijustgalIcon";

export type HomeCareTip = {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  Icon: React.ComponentType<{ width?: number; height?: number }>;
  steps: string[];
};

export const HOME_CARE_TIPS: HomeCareTip[] = [
  {
    id: "leak",
    title: "Ус алдалт илэрвэл яах вэ?",
    subtitle: "Яаралтай арга хэмжээ авах",
    summary: "Алдалтыг түр зогсоож, эрсдэл багасгах алхмууд",
    Icon: SantehnikIcon,
    steps: [
      "Ерөнхий усны хаалтыг нэн даруй хаа.",
      "Цахилгаан хэрэгсэлд ус хүрсэн бол автомат унтраалгыг салга.",
      "Алдаж буй хэсгийг алчуур эсвэл наалттай түр дарж тогтоогоорой.",
      "Шаланд тогтсон усыг хурдан арилгаж гулсах эрсдэлээс сэргийл.",
      "Мэргэжлийн сантехник дуудан шалтгааныг бүрэн оношлуул.",
    ],
  },
  {
    id: "drain",
    title: "Суултуур бөглөрвөл яах вэ?",
    subtitle: "Гэрийн нөхцөлд шийдэх арга",
    summary: "Энгийн багажаар бөглөрлийг аюулгүй арилгах арга",
    Icon: ShawijustgalIcon,
    steps: [
      "Ус нэмэхгүй, дахин дарж урсгах үйлдлээ түр зогсоо.",
      "Плунжер ашиглан 10-15 удаа даралт өгч соролт үүсгэ.",
      "Бүлээн ус, зөөлөн цэвэрлэгээний бодисоор 10 минут дэвтээж үз.",
      "Металл саваа хүчээр хийхгүй, керамик гадаргууг гэмтээж болзошгүй.",
      "Хэрэв ахиж бөглөрвөл мэргэжлийн үйлчилгээ захиал.",
    ],
  },
];

export const HOME_CARE_TIPS_BY_ID = Object.fromEntries(
  HOME_CARE_TIPS.map((tip) => [tip.id, tip]),
) as Record<string, HomeCareTip>;
