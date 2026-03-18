import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../styles/theme";
import { GameFilter } from "../types/gameitem";

type FilterTabsProps = {
  selectedFilter: GameFilter;
  onSelectFilter: (filter: GameFilter) => void;
};

const FILTER_ITEMS: Array<{ value: GameFilter; label: string }> = [
  { value: "all", label: "Todos" },
  { value: "played", label: "Jogados" },
  { value: "pending", label: "Pendentes" },
];

export function FilterTabs({
  selectedFilter,
  onSelectFilter,
}: FilterTabsProps) {
  return (
    <View style={styles.filters}>
      {FILTER_ITEMS.map((item) => {
        const selected = selectedFilter === item.value;

        return (
          <Pressable
            key={item.value}
            style={[styles.filterButton, selected && styles.filterButtonActive]}
            onPress={() => onSelectFilter(item.value)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selected && styles.filterButtonTextActive,
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  filters: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  filterButton: {
    borderWidth: 1,
    borderColor: "#2D3642",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  filterButtonActive: {
    backgroundColor: COLORS.blue,
    borderColor: COLORS.blue,
  },
  filterButtonText: {
    color: "#9DA7B3",
    fontSize: 13,
    fontWeight: "600",
  },
  filterButtonTextActive: {
    color: "#FFFFFF",
  },
});
