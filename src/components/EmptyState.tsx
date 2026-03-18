import { StyleSheet, Text } from "react-native";
import { themeColors } from "../styles/theme";

export function EmptyState() {
  return <Text style={styles.emptyText}>No games found.</Text>;
}

const styles = StyleSheet.create({
  emptyText: {
    textAlign: "center",
    color: themeColors.secondary,
    marginTop: 28,
  },
});
