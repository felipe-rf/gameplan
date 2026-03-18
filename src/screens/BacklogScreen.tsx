import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMemo, useRef, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { EmptyState } from "../components/EmptyState";
import { GameCard } from "../components/GameCard";
import { GameForm } from "../components/GameForm";
import { useGames } from "../context/GamesContext";
import { RootStackParamList } from "../navigation/types";
import { COLORS } from "../styles/theme";

type BacklogScreenProps = NativeStackScreenProps<RootStackParamList, "Backlog">;

export function BacklogScreen({ navigation }: BacklogScreenProps) {
  const { games, addBacklogGame, markGamesAsPlayed, removeGames } = useGames();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const longPressTriggeredRef = useRef(false);

  const filteredGames = useMemo(() => {
    const term = searchText.trim().toLowerCase();

    if (!term) {
      return games;
    }

    return games.filter((game) => {
      const searchable = `${game.title}`.toLowerCase();
      return searchable.includes(term);
    });
  }, [games, searchText]);

  function handleAddBacklogGame(title: string, platform: string) {
    const gameId = addBacklogGame(title, platform);
    setShowCreateForm(false);
    navigation.navigate("GameInfo", { gameId }, { pop: true });
  }

  function toggleSelectGame(id: string) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((itemId) => itemId !== id)
        : [...current, id],
    );
  }

  function handleMarkSelectedAsPlayed() {
    markGamesAsPlayed(selectedIds);
    setSelectedIds([]);
    setIsSelectMode(false);
  }

  function handleDeleteSelected() {
    removeGames(selectedIds);
    setSelectedIds([]);
    setIsSelectMode(false);
  }

  function clearSelectionMode() {
    setIsSelectMode(false);
    setSelectedIds([]);
  }

  function handleCardLongPress(id: string) {
    longPressTriggeredRef.current = true;
    setIsSelectMode(true);
    setSelectedIds((current) =>
      current.includes(id) ? current : [...current, id],
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Backlog</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{games.length}</Text>
          </View>
        </View>

        <Text style={styles.subtitle}>
          Segure um card para iniciar selecao multipla.
        </Text>
      </View>

      <View style={styles.controlsCard}>
        <Pressable
          style={styles.createButton}
          onPress={() => setShowCreateForm((current) => !current)}
        >
          <Text style={styles.createButtonText}>+ Novo jogo</Text>
        </Pressable>

        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Buscar por nome"
          placeholderTextColor="#7A7A80"
        />
      </View>

      <FlatList
        data={filteredGames}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          isSelectMode && styles.listWithBulkBar,
        ]}
        ListEmptyComponent={<EmptyState />}
        renderItem={({ item }) => (
          <GameCard
            item={item}
            selectionMode={isSelectMode}
            selected={selectedIds.includes(item.id)}
            onLongPress={(game) => handleCardLongPress(game.id)}
            onPress={(game) => {
              if (longPressTriggeredRef.current) {
                longPressTriggeredRef.current = false;
                return;
              }

              if (isSelectMode) {
                toggleSelectGame(game.id);
                return;
              }

              navigation.navigate("GameInfo", { gameId: game.id });
            }}
          />
        )}
      />

      {isSelectMode && (
        <View style={styles.bulkActionsBar}>
          <View style={styles.bulkHeaderRow}>
            <Text style={styles.bulkActionsText}>
              {selectedIds.length} selecionados
            </Text>
            <Pressable onPress={clearSelectionMode}>
              <Text style={styles.bulkCancelText}>Cancelar selecao</Text>
            </Pressable>
          </View>

          <View style={styles.bulkButtonsRow}>
            <Pressable
              style={[
                styles.bulkButton,
                styles.bulkPlayedButton,
                !selectedIds.length && styles.bulkButtonDisabled,
              ]}
              disabled={!selectedIds.length}
              onPress={handleMarkSelectedAsPlayed}
            >
              <Text style={styles.bulkButtonText}>Marcar jogados</Text>
            </Pressable>

            <Pressable
              style={[
                styles.bulkButton,
                styles.bulkDeleteButton,
                !selectedIds.length && styles.bulkButtonDisabled,
              ]}
              disabled={!selectedIds.length}
              onPress={handleDeleteSelected}
            >
              <Text style={styles.bulkButtonText}>Excluir selecionados</Text>
            </Pressable>
          </View>
        </View>
      )}

      <Modal
        transparent
        animationType="fade"
        visible={showCreateForm}
        onRequestClose={() => setShowCreateForm(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Novo jogo</Text>
              <Pressable onPress={() => setShowCreateForm(false)}>
                <Text style={styles.modalCloseText}>Fechar</Text>
              </Pressable>
            </View>

            <GameForm onAddGame={handleAddBacklogGame} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  headerCard: {
    backgroundColor: COLORS.panel,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    gap: 4,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: "800",
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  countBadge: {
    minWidth: 34,
    height: 28,
    borderRadius: 999,
    backgroundColor: "#12233F",
    borderColor: COLORS.blue,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  countBadgeText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 12,
  },
  controlsCard: {
    backgroundColor: COLORS.panel,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    gap: 10,
  },
  createButton: {
    backgroundColor: COLORS.blue,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  searchInput: {
    backgroundColor: "#111924",
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    color: COLORS.textPrimary,
    fontSize: 15,
  },
  list: {
    flexGrow: 1,
    paddingBottom: 20,
    gap: 10,
  },
  listWithBulkBar: {
    paddingBottom: 96,
  },
  bulkActionsBar: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    backgroundColor: "#1A2330",
    borderColor: "#314155",
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 8,
    shadowColor: "#000000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  bulkActionsText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "700",
  },
  bulkHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bulkCancelText: {
    color: "#D7E2F2",
    fontSize: 12,
    fontWeight: "700",
  },
  bulkButtonsRow: {
    flexDirection: "row",
    gap: 8,
  },
  bulkButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: "center",
  },
  bulkPlayedButton: {
    backgroundColor: COLORS.green,
  },
  bulkDeleteButton: {
    backgroundColor: COLORS.red,
  },
  bulkButtonDisabled: {
    opacity: 0.5,
  },
  bulkButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  modalCard: {
    width: "100%",
    maxWidth: 520,
    backgroundColor: COLORS.panel,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: "800",
  },
  modalCloseText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: "700",
  },
});
