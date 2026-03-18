import { Pressable, StyleSheet, Text, View } from "react-native";
import { font, themeColors } from "../styles/theme";
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
      style={styles.root}
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

      <View style={styles.text}>
        <Text style={styles.gameName}>{item.title}</Text>
        <Text style={styles.platform}>{item.platform}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    height: 74,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "rgba(28, 37, 65, 1)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    alignItems: "center",
  },
  gameName: {
    color: "rgba(255, 255, 255, 1)",
    fontFamily: font.bold,
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "700",
  },
  platform: {
    flexDirection: "column",
    justifyContent: "center",
    color: "rgba(255, 255, 255, 1)",
    fontFamily: font.regular,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "400",
  },
  selectionDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: themeColors.primary,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  selectionDotActive: {
    backgroundColor: themeColors.primary,
  },
  selectionDotInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
  },
  text: {
    flexDirection: "column",
    gap: 4,
    alignItems: "flex-start",
    justifyContent: "center",
  },
});
