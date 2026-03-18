import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../styles/theme";

type HeaderProps = {
  playedCount: number;
  totalCount: number;
};

export function Header({ playedCount, totalCount }: HeaderProps) {
  return (
    <View>
      <Text style={styles.title}>GameFM</Text>
      <Text style={styles.subtitle}>
        {playedCount}/{totalCount} jogos jogados
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 16,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});
