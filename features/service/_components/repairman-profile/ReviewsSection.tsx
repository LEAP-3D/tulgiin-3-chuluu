import { Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { styles } from "../../repairman-profile.styles";
import type { Review } from "./types";

type Props = {
  reviews: Review[];
};

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString("mn-MN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const getInitial = (name: string) => {
  const trimmed = name.trim();
  if (!trimmed) return "Х";
  return trimmed[0]?.toUpperCase() ?? "Х";
};

export function ReviewsSection({ reviews }: Props) {
  return (
    <>
      <View style={styles.reviewHeader}>
        <Text style={styles.sectionTitle}>Сэтгэгдэл</Text>
        <Text style={styles.reviewAll}>{reviews.length}</Text>
      </View>

      {reviews.length === 0 ? (
        <View style={styles.reviewCard}>
          <Text style={styles.reviewText}>Одоогоор сэтгэгдэл байхгүй байна.</Text>
        </View>
      ) : null}

      {reviews.map((review) => (
        <View key={review.id} style={styles.reviewCard}>
          <View style={styles.reviewTopRow}>
            <View style={styles.reviewAvatar}>
              <Text style={styles.reviewAvatarText}>
                {getInitial(review.author)}
              </Text>
            </View>
            <View style={styles.reviewTitleBlock}>
              <Text style={styles.reviewAuthor}>{review.author}</Text>
            </View>
            <View style={styles.rating}>
              <MaterialCommunityIcons name="star" size={16} color="#F59E0B" />
              <Text style={styles.ratingText}>{review.rating.toFixed(1)}</Text>
            </View>
          </View>
          <Text style={styles.reviewText}>{review.text}</Text>
          <Text style={styles.reviewDate}>{formatDate(review.date)}</Text>
        </View>
      ))}
    </>
  );
}
