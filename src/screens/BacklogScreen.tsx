import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { EmptyState } from "../components/EmptyState";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { GameCard } from "../components/GameCard";
import { GameForm } from "../components/GameForm";
import { useGames } from "../context/GamesContext";
import { RootStackParamList } from "../navigation/types";
import { font, themeColors } from "../styles/theme";

type BacklogScreenProps = NativeStackScreenProps<RootStackParamList, "Backlog">;

export function BacklogScreen({ navigation }: BacklogScreenProps) {
  const { games, addBacklogGame, markGamesAsPlayed, removeGames } = useGames();
  const { height } = useWindowDimensions();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<"delete" | "register" | null>(
    null,
  );
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

  useEffect(() => {
    if (isSelectMode && selectedIds.length === 0) {
      setIsSelectMode(false);
    }
  }, [isSelectMode, selectedIds]);

  // Reserve space for search bar, button, paddings and keep the list scrollable.
  const listMaxHeight = Math.max(220, height - 280);

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search by name"
          placeholderTextColor={themeColors.secondary}
        />
      </View>

      <View style={[styles.listWrapper, { maxHeight: listMaxHeight }]}>
        <FlatList
          data={filteredGames}
          keyExtractor={(item) => item.id}
          style={styles.flatList}
          contentContainerStyle={[styles.list]}
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
      </View>
      {isSelectMode ? (
        <View style={styles.selectionActionsRow}>
          <Pressable
            style={[styles.selectionActionButton, styles.deleteActionButton]}
            onPress={() => setBulkAction("delete")}
          >
            <Text style={styles.selectionActionText}>Delete</Text>
          </Pressable>
          <Pressable
            style={[styles.selectionActionButton, styles.registerActionButton]}
            onPress={() => setBulkAction("register")}
          >
            <Text style={styles.selectionActionText}>Register session</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          style={styles.createButton}
          onPress={() => setShowCreateForm((current) => !current)}
        >
          <Text style={styles.createButtonText}>Add Game</Text>
        </Pressable>
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
              <Text style={styles.modalTitle}>Add</Text>
              <Pressable onPress={() => setShowCreateForm(false)}>
                <Text style={styles.modalCloseText}>Close</Text>
              </Pressable>
            </View>

            <GameForm onAddGame={handleAddBacklogGame} />
          </View>
        </View>
      </Modal>

      <ConfirmationModal
        visible={bulkAction === "register"}
        title="Confirm register"
        message="Register a session for all selected games?"
        cancelLabel="Cancel"
        confirmLabel="Register"
        onCancel={() => setBulkAction(null)}
        onConfirm={() => {
          setBulkAction(null);
          handleMarkSelectedAsPlayed();
        }}
      />

      <ConfirmationModal
        visible={bulkAction === "delete"}
        title="Confirm delete"
        message="Delete all selected games from backlog?"
        cancelLabel="Cancel"
        confirmLabel="Delete"
        confirmVariant="danger"
        onCancel={() => setBulkAction(null)}
        onConfirm={() => {
          setBulkAction(null);
          handleDeleteSelected();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "Background",
    paddingHorizontal: 32,
    paddingTop: 10,
    gap: 30,
  },
  list: {
    gap: 10,
  },
  listWrapper: {
    width: "100%",
    flexShrink: 1,
  },
  flatList: {
    width: "100%",
  },
  searchBar: {
    flexDirection: "row",
    height: 54,
    paddingTop: 15,
    paddingLeft: 27,
    paddingBottom: 14,
    paddingRight: 42,
    alignItems: "center",
    flexShrink: 0,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 4,
    borderStyle: "solid",
    borderColor: themeColors.secondary,
  },
  searchInput: {
    flex: 1,
    color: themeColors.white,
    fontFamily: font.regular,
    fontSize: 14,
  },
  createButton: {
    backgroundColor: themeColors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  createButtonText: {
    color: themeColors.secondary,
    fontSize: 16,
    fontFamily: font.bold,
    fontWeight: "600",
  },
  selectionActionsRow: {
    width: "100%",
    flexDirection: "row",
    gap: 10,
  },
  selectionActionButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  deleteActionButton: {
    backgroundColor: themeColors.danger,
  },
  registerActionButton: {
    backgroundColor: themeColors.primary,
  },
  selectionActionText: {
    color: themeColors.secondary,
    fontSize: 16,
    fontFamily: font.bold,
    fontWeight: "600",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  modalCard: {
    backgroundColor: themeColors.background,
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    gap: 10,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalTitle: {
    color: themeColors.white,
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    fontFamily: font.bold,
  },
  modalCloseText: {
    color: themeColors.white,
    fontWeight: "700",
    fontFamily: font.bold,
  },
});
