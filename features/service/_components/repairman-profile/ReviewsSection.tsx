import { Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { styles } from "../../repairman-profile.styles";
import { REVIEWS } from "./constants";

export function ReviewsSection() {
  return (
    <>
      <View style={styles.reviewHeader}>
        <Text style={styles.sectionTitle}>Сэтгэгдэл</Text>
        <Text style={styles.reviewAll}>Бүгд</Text>
      </View>

      {REVIEWS.map((review) => (
        <View key={review.id} style={styles.reviewCard}>
          <View style={styles.reviewTopRow}>
            <View style={styles.reviewAvatar}>
              <Text style={styles.reviewAvatarText}>X</Text>
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
          <Text style={styles.reviewDate}>{review.date}</Text>
        </View>
      ))}
    </>
  );
}
