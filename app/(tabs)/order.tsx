import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LeftArrowIcon from "@/components/icons/_serviceIcons/leftarrowIcon";
import MessageIcon from "@/components/icons/zurwas";
import CallIcon from "@/components/icons/call";

export default function OrderScreen() {
  const [showDetail, setShowDetail] = useState(false);

  const timeline = useMemo(
    () => [
      { title: "Захиалга илгээгдсэн", time: "10:30", active: true },
      { title: "Засварчин хүлээн авсан", time: "--:--", active: false },
      { title: "Засварчин явж байна", time: "--:--", active: false },
      { title: "Ажил эхэлсэн", time: "--:--", active: false },
      { title: "Ажил дууссан", time: "--:--", active: false },
    ],
    [],
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {!showDetail ? (
          <View style={styles.listScreen}>
            <Text style={styles.pageTitle}>Таны захиалга</Text>

            <Pressable
              style={({ pressed }) => [
                styles.orderCard,
                pressed && styles.cardPressed,
              ]}
              onPress={() => setShowDetail(true)}
            >
              <View style={styles.orderMeta}>
                <Text style={styles.orderStatus}>Хүлээгдэж буй</Text>
                <View style={styles.orderRow}>
                  <View style={styles.orderIcon}>
                    <Text style={styles.orderIconText}>⚡</Text>
                  </View>
                  <Text style={styles.orderTitle}>Цахилгаан</Text>
                </View>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.detailScreen}>
            <View style={styles.detailHeader}>
              <Pressable
                onPress={() => setShowDetail(false)}
                hitSlop={10}
                style={styles.backButton}
              >
                <LeftArrowIcon width={20} height={20} />
              </Pressable>
              <Text style={styles.detailTitle}>
                Захиалгын дэлгэрэнгүй мэдээлэл
              </Text>
            </View>

            <View style={styles.profileCard}>
              <View style={styles.profileTop}>
                <View style={styles.avatar} />
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>Баатар Болд</Text>
                  <Text style={styles.profileRole}>Сантехникийн мэргэжилтэн</Text>
                </View>
                <View style={styles.ratingWrap}>
                  <Text style={styles.star}>★</Text>
                  <Text style={styles.ratingText}>4.8</Text>
                </View>
              </View>

              <View style={styles.profileStats}>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Захиалга</Text>
                  <Text style={styles.statValue}>127</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Ажилласан жил</Text>
                  <Text style={styles.statValue}>5 жил</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Үйлчлэх бүс</Text>
                  <Text style={styles.statValue}>БЗД, СХД, ЧД</Text>
                </View>
              </View>

              <View style={styles.profileActions}>
                <Pressable
                  style={({ pressed }) => [
                    styles.messageButton,
                    pressed && styles.cardPressed,
                  ]}
                >
                  <Text style={styles.messageText}>Зурвас</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.callButton,
                    pressed && styles.callPressed,
                  ]}
                >
                  <CallIcon width={22} height={22} color="#FFFFFF" />
                </Pressable>
              </View>
            </View>

            <View style={styles.statusCard}>
              <Text style={styles.statusTitle}>Статус</Text>
              {timeline.map((item, index) => {
                const isLast = index === timeline.length - 1;
                return (
                  <View key={item.title} style={styles.statusRow}>
                    <View style={styles.statusLeft}>
                      <View
                        style={[
                          styles.statusDot,
                          item.active && styles.statusDotActive,
                        ]}
                      />
                      {!isLast && <View style={styles.statusLine} />}
                    </View>
                    <View style={styles.statusRight}>
                      <Text
                        style={[
                          styles.statusText,
                          item.active && styles.statusTextActive,
                        ]}
                      >
                        {item.title}
                      </Text>
                      <Text style={styles.statusTime}>{item.time}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  listScreen: {
    gap: 16,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F1F1F",
  },
  orderCard: {
    backgroundColor: "#F8F8F8",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardPressed: {
    opacity: 0.7,
  },
  orderMeta: {
    gap: 8,
  },
  orderStatus: {
    fontSize: 12,
    color: "#8E8E8E",
  },
  orderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  orderIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF0D6",
  },
  orderIconText: {
    fontSize: 16,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F1F1F",
  },
  chevron: {
    fontSize: 22,
    color: "#8E8E8E",
  },
  detailScreen: {
    gap: 16,
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F1F1F",
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    gap: 14,
  },
  profileTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EDEDED",
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F1F1F",
  },
  profileRole: {
    fontSize: 12,
    color: "#7A7A7A",
  },
  ratingWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  star: {
    color: "#F7B500",
    fontSize: 14,
  },
  ratingText: {
    fontWeight: "600",
    color: "#1F1F1F",
  },
  profileStats: {
    gap: 10,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statLabel: {
    fontSize: 12,
    color: "#7A7A7A",
  },
  statValue: {
    fontSize: 12,
    color: "#1F1F1F",
    fontWeight: "600",
  },
  profileActions: {
    flexDirection: "row",
    gap: 12,
  },
  messageButton: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1F1F1F",
    paddingVertical: 12,
    alignItems: "center",
  },
  messageText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F1F1F",
  },
  callButton: {
    width: 64,
    borderRadius: 16,
    backgroundColor: "#1F1F1F",
    alignItems: "center",
    justifyContent: "center",
  },
  callPressed: {
    opacity: 0.75,
  },
  statusCard: {
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 18,
    padding: 16,
    gap: 14,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F1F1F",
  },
  statusRow: {
    flexDirection: "row",
    gap: 12,
  },
  statusLeft: {
    width: 18,
    alignItems: "center",
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#CFCFCF",
  },
  statusDotActive: {
    backgroundColor: "#2AA928",
  },
  statusLine: {
    flex: 1,
    width: 2,
    backgroundColor: "#D6D6D6",
    marginTop: 4,
  },
  statusRight: {
    flex: 1,
    gap: 4,
  },
  statusText: {
    fontSize: 13,
    color: "#1F1F1F",
  },
  statusTextActive: {
    fontWeight: "600",
  },
  statusTime: {
    fontSize: 12,
    color: "#9B9B9B",
  },
});
