import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LeftArrowIcon from "@/components/icons/_serviceIcons/leftarrowIcon";
import CallIcon from "@/components/icons/call";
import { styles } from "./order.styles";

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
