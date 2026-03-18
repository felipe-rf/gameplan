import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../styles/theme";
import { GameItem } from "../types/gameitem";
import { formatDateTime } from "../utils/date";

type GameCardProps = {
  item: GameItem;
  onPress?: (game: GameItem) => void;
  onLongPress?: (game: GameItem) => void;
  selected?: boolean;
  selectionMode?: boolean;
};

export function GameCard({
  item,
  onPress,
  onLongPress,
  selected = false,
  selectionMode = false,
}: GameCardProps) {
  const statusLabel =
    item.status === "playing"
      ? "Playing"
      : item.status === "finished"
        ? "Finished"
        : "Ignore";

  return (
    <Pressable
      style={styles.gameCard}
      onPress={() => onPress?.(item)}
      onLongPress={() => onLongPress?.(item)}
      delayLongPress={220}
    >
      {selectionMode && (
        <View
          style={[styles.selectionDot, selected && styles.selectionDotActive]}
        >
          {selected && <View style={styles.selectionDotInner} />}
        </View>
      )}

      <View style={styles.gameInfo}>
        <Text style={styles.gameTitle}>{item.title}</Text>
        <Text style={styles.gamePlatform}>{item.platform}</Text>
        <Text style={styles.gameStatus}>Status: {statusLabel}</Text>
        <Text style={styles.gameMeta}>
          Inserido em {formatDateTime(item.createdAt)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  gameCard: {
    backgroundColor: COLORS.panel,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  selectionDot: {
    width: 18,
    height: 18,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    marginTop: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  selectionDotActive: {
    borderColor: COLORS.blue,
  },
  selectionDotInner: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: COLORS.blue,
  },
  gameInfo: {
    flex: 1,
    gap: 2,
  },
  gameTitle: {
    color: "#F0F6FC",
    fontSize: 16,
    fontWeight: "700",
  },
  gamePlatform: {
    color: "#9BA4AE",
    fontSize: 13,
  },
  gameStatus: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 3,
  },
  gameMeta: {
    marginTop: 4,
    color: COLORS.textMuted,
    fontSize: 12,
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
  },
  smallButton: {
    backgroundColor: COLORS.buttonNeutral,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  smallButtonSuccess: {
    backgroundColor: COLORS.greenSuccess,
  },
  smallButtonDanger: {
    backgroundColor: COLORS.red,
  },
  smallButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
});
