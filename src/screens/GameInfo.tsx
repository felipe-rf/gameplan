import { useMemo, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { useGames } from "../context/GamesContext";
import { RootStackParamList } from "../navigation/types";
import { font, themeColors } from "../styles/theme";
import { GameStatus } from "../types/gameitem";
import { formatDateTime } from "../utils/date";

const STATUS_OPTIONS: Array<{ value: GameStatus; label: string }> = [
  { value: "playing", label: "Playing" },
  { value: "finished", label: "Finished" },
  { value: "ignore", label: "Ignore" },
];

type GameInfoProps = NativeStackScreenProps<RootStackParamList, "GameInfo">;

export function GameInfo({ route, navigation }: GameInfoProps) {
  const { games, playedRegisters, registerSession, setGameStatus, removeGame } =
    useGames();
  const { gameId } = route.params;
  const [isRegisterConfirmVisible, setIsRegisterConfirmVisible] =
    useState(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);

  const gameItem = useMemo(
    () => games.find((game) => game.id === gameId) ?? null,
    [games, gameId],
  );

  const registers = useMemo(
    () => playedRegisters.filter((register) => register.gameId === gameId),
    [playedRegisters, gameId],
  );

  const latestRegister = useMemo(() => {
    if (!registers.length) {
      return null;
    }

    return registers.reduce((latest, current) =>
      new Date(current.createdAt).getTime() >
      new Date(latest.createdAt).getTime()
        ? current
        : latest,
    );
  }, [registers]);

  const sessionsByDay = useMemo(() => {
    const grouped = registers.reduce<Record<string, number>>(
      (acc, register) => {
        const dayKey = new Date(register.createdAt).toISOString().slice(0, 10);
        acc[dayKey] = (acc[dayKey] ?? 0) + 1;
        return acc;
      },
      {},
    );

    return Object.entries(grouped)
      .map(([day, count]) => ({ day, count }))
      .sort((a, b) => b.day.localeCompare(a.day))
      .slice(0, 7);
  }, [registers]);

  const maxSessionsInDay = useMemo(() => {
    if (!sessionsByDay.length) {
      return 1;
    }

    return sessionsByDay.reduce((max, item) => Math.max(max, item.count), 1);
  }, [sessionsByDay]);

  const recentSessionTimes = useMemo(() => {
    return [...registers]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 8);
  }, [registers]);

  const statusLabel =
    gameItem?.status === "playing"
      ? "Playing"
      : gameItem?.status === "finished"
        ? "Finished"
        : "Ignore";

  if (!gameItem) {
    return (
      <View style={styles.missingContainer}>
        <Text style={styles.missingTitle}>Jogo nao encontrado</Text>
      </View>
    );
  }

  function handleConfirmRegisterSession() {
    registerSession(gameId);
    setIsRegisterConfirmVisible(false);
  }

  function handleConfirmDelete() {
    setIsDeleteConfirmVisible(false);
    removeGame(gameId);
    navigation.navigate("Backlog", undefined, { pop: true });
  }
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.screenContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>{gameItem.title}</Text>
          <Text style={styles.heroSubtitle}>{gameItem.platform}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Stats</Text>
          <Text style={styles.infoLine}>
            Added on: {formatDateTime(gameItem.createdAt)}
          </Text>
          <Text style={styles.infoLine}>
            Total sessions: {registers.length}
          </Text>
          <Text style={styles.infoHighlight}>
            Latest log:{" "}
            {latestRegister
              ? formatDateTime(latestRegister.createdAt)
              : "No logs"}
          </Text>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Mudar status</Text>
          <View style={styles.statusRow}>
            {STATUS_OPTIONS.map((option) => {
              const selected = gameItem.status === option.value;

              return (
                <Pressable
                  key={option.value}
                  style={[
                    styles.statusButton,
                    selected && styles.statusButtonActive,
                  ]}
                  onPress={() => setGameStatus(gameItem.id, option.value)}
                >
                  <Text
                    style={[
                      styles.statusButtonText,
                      selected && styles.statusButtonTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.actionRow}>
          <Pressable
            style={[styles.registerButton, styles.deleteButton]}
            onPress={() => setIsDeleteConfirmVisible(true)}
          >
            <Text style={styles.registerButtonText}>Delete</Text>
          </Pressable>
          <Pressable
            style={styles.registerButton}
            onPress={() => setIsRegisterConfirmVisible(true)}
          >
            <Text style={styles.registerButtonText}>Register session</Text>
          </Pressable>
        </View>
      </View>

      <ConfirmationModal
        visible={isRegisterConfirmVisible}
        title="Confirm register"
        message="Do you want to register a session for this game now?"
        cancelLabel="Cancel"
        confirmLabel="Confirm"
        onCancel={() => setIsRegisterConfirmVisible(false)}
        onConfirm={handleConfirmRegisterSession}
      />

      <ConfirmationModal
        visible={isDeleteConfirmVisible}
        title="Confirm delete"
        message="Do you want to delete this game from the backlog?"
        cancelLabel="Cancel"
        confirmLabel="Delete"
        confirmVariant="danger"
        onCancel={() => setIsDeleteConfirmVisible(false)}
        onConfirm={handleConfirmDelete}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: themeColors.background,
    fontFamily: font.regular,
  },
  screenContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  missingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: themeColors.background,
  },
  missingTitle: {
    color: themeColors.white,
    fontSize: 20,
    fontWeight: "800",
  },
  card: {
    width: "100%",
    maxWidth: 560,
    backgroundColor: themeColors.background,
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  heroSection: {
    alignItems: "center",
    gap: 4,
  },
  heroTitle: {
    color: themeColors.white,
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    fontFamily: font.bold,
  },
  heroSubtitle: {
    color: themeColors.white,
    fontSize: 15,
    textAlign: "center",
  },
  statusBadge: {
    marginTop: 4,
    backgroundColor: themeColors.secondary,
    borderColor: themeColors.white,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  statusBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  infoSection: {
    backgroundColor: themeColors.secondary,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  sectionTitle: {
    color: themeColors.white,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 2,
  },
  infoLine: {
    color: themeColors.white,
    fontSize: 14,
  },
  infoHighlight: {
    marginTop: 2,
    color: themeColors.white,
    fontSize: 14,
    fontWeight: "700",
  },
  chartBlock: {
    gap: 8,
    marginTop: 4,
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  chartLabel: {
    width: 44,
    color: themeColors.primary,
    fontSize: 12,
  },
  chartTrack: {
    flex: 1,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#202934",
    overflow: "hidden",
  },
  chartFill: {
    height: "100%",
    backgroundColor: themeColors.primary,
    borderRadius: 999,
  },
  chartValue: {
    width: 24,
    textAlign: "right",
    color: themeColors.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  timelineWrap: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  timelineChip: {
    backgroundColor: "#222B36",
    borderColor: themeColors.primary,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  timelineChipText: {
    color: themeColors.primary,
    fontSize: 11,
    fontWeight: "700",
  },
  statusRow: {
    flexDirection: "row",
    gap: 8,
  },
  statusButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: themeColors.primary,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: themeColors.secondary,
  },
  statusButtonActive: {
    borderColor: themeColors.primary,
    backgroundColor: themeColors.primary,
  },
  statusButtonText: {
    color: themeColors.white,
    fontSize: 12,
    fontWeight: "700",
  },
  statusButtonTextActive: {
    color: themeColors.secondary,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  registerButton: {
    flex: 1,
    backgroundColor: themeColors.primary,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 9,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: themeColors.danger,
  },
  registerButtonText: {
    color: themeColors.secondary,
    fontSize: 13,
    fontWeight: "700",
  },
});
