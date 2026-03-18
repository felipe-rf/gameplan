import { StyleSheet, Text } from "react-native";
import { COLORS } from "../styles/theme";

export function EmptyState() {
  return (
    <Text style={styles.emptyText}>Nenhum jogo encontrado nesse filtro.</Text>
  );
}

const styles = StyleSheet.create({
  emptyText: {
    textAlign: "center",
    color: COLORS.textMuted,
    marginTop: 28,
  },
});
