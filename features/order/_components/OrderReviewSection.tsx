import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { orderDetailStyles } from "../order.detail.styles";
import { styles as orderStyles } from "../order.styles";

type OrderReviewSectionProps = {
  isWorkerView: boolean;
  orderStatus?: string | null;
  paymentStatus?: string | null;
  reviewRating?: number | null;
  reviewComment?: string | null;
  reviewedAt?: string | null;
  isSubmitting: boolean;
  onSubmit: (rating: number, comment: string) => void;
};

const formatReviewedAt = (value?: string | null) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleString("mn-MN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function OrderReviewSection({
  isWorkerView,
  orderStatus,
  paymentStatus,
  reviewRating,
  reviewComment,
  reviewedAt,
  isSubmitting,
  onSubmit,
}: OrderReviewSectionProps) {
  const [selectedRating, setSelectedRating] = useState(5);
  const [comment, setComment] = useState("");

  const hasReview =
    typeof reviewRating === "number" &&
    reviewRating >= 1 &&
    reviewRating <= 5 &&
    typeof reviewComment === "string" &&
    reviewComment.trim().length > 0;

  const isEligible = orderStatus === "completed" && paymentStatus === "paid";
  const canSubmit = !isWorkerView && isEligible && !hasReview;

  useEffect(() => {
    if (!canSubmit) return;
    setSelectedRating(5);
    setComment("");
  }, [canSubmit, reviewRating, reviewComment]);

  const submitDisabled = isSubmitting || comment.trim().length === 0;
  const reviewedAtLabel = useMemo(() => formatReviewedAt(reviewedAt), [reviewedAt]);

  if (!isEligible) return null;

  if (hasReview) {
    const ratingValue = Math.max(1, Math.min(5, Math.round(Number(reviewRating))));
    return (
      <View style={orderDetailStyles.profileCard}>
        <Text style={orderDetailStyles.sectionTitleSmall}>
          {isWorkerView ? "Хэрэглэгчийн үнэлгээ" : "Таны үнэлгээ"}
        </Text>
        <Text style={orderDetailStyles.reviewRatingLabel}>
          {"★".repeat(ratingValue)}
          {"☆".repeat(5 - ratingValue)} {ratingValue.toFixed(1)}
        </Text>
        <Text style={orderDetailStyles.reviewBody}>{reviewComment}</Text>
        {reviewedAtLabel ? (
          <Text style={orderDetailStyles.reviewDate}>{reviewedAtLabel}</Text>
        ) : null}
      </View>
    );
  }

  if (!canSubmit) {
    return (
      <View style={orderDetailStyles.profileCard}>
        <Text style={orderDetailStyles.sectionTitleSmall}>Үнэлгээ</Text>
        <Text style={orderDetailStyles.workerStatusText}>
          Хэрэглэгч үнэлгээ үлдээгээгүй байна.
        </Text>
      </View>
    );
  }

  const handleSubmit = () => {
    const trimmed = comment.trim();
    if (selectedRating < 1 || selectedRating > 5) {
      Alert.alert("Алдаа", "Үнэлгээ 1-5 хооронд байх ёстой.");
      return;
    }
    if (!trimmed) {
      Alert.alert("Алдаа", "Сэтгэгдлээ оруулна уу.");
      return;
    }
    onSubmit(selectedRating, trimmed);
  };

  return (
    <View style={orderDetailStyles.profileCard}>
      <Text style={orderDetailStyles.sectionTitleSmall}>Үнэлгээ үлдээх</Text>
      <Text style={orderDetailStyles.workerStatusText}>
        Төлбөр баталгаажсан тул 1-5 үнэлгээ болон сэтгэгдэл үлдээнэ үү.
      </Text>

      <View style={orderDetailStyles.reviewStarsRow}>
        {[1, 2, 3, 4, 5].map((value) => {
          const active = selectedRating >= value;
          return (
            <Pressable
              key={value}
              onPress={() => setSelectedRating(value)}
              style={[
                orderDetailStyles.reviewStarButton,
                active && orderDetailStyles.reviewStarButtonActive,
              ]}
              accessibilityLabel={`${value} од`}
            >
              <Text
                style={[
                  orderDetailStyles.reviewStarText,
                  active && orderDetailStyles.reviewStarTextActive,
                ]}
              >
                {value}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <TextInput
        style={orderDetailStyles.reviewInput}
        value={comment}
        onChangeText={setComment}
        placeholder="Сэтгэгдлээ бичнэ үү..."
        multiline={true}
        textAlignVertical="top"
        maxLength={1000}
      />

      <Pressable
        style={[
          orderStyles.actionButton,
          orderStyles.acceptButton,
          submitDisabled && orderStyles.actionButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={submitDisabled}
        accessibilityLabel="Үнэлгээ хадгалах"
      >
        <Text style={orderStyles.actionText}>
          {isSubmitting ? "Хадгалж байна..." : "Үнэлгээ хадгалах"}
        </Text>
      </Pressable>
    </View>
  );
}
