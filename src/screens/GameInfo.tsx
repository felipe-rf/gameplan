import { useMemo, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useGames } from "../context/GamesContext";
import { RootStackParamList } from "../navigation/types";
import { COLORS } from "../styles/theme";
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
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

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
    setIsConfirmVisible(false);
  }

  function onRemove(id: string) {
    setIsConfirmVisible(false);
    removeGame(id);
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
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>{statusLabel}</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Resumo</Text>
          <Text style={styles.infoLine}>
            Jogado: {gameItem.played ? "Sim" : "Nao"}
          </Text>
          <Text style={styles.infoLine}>
            Adicionado em: {formatDateTime(gameItem.createdAt)}
          </Text>
          <Text style={styles.infoLine}>
            Total de sessoes: {registers.length}
          </Text>
          <Text style={styles.infoHighlight}>
            Ultimo registro:{" "}
            {latestRegister
              ? formatDateTime(latestRegister.createdAt)
              : "Sem registros"}
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Visualizacao de sessoes</Text>

          {sessionsByDay.length ? (
            <View style={styles.chartBlock}>
              {sessionsByDay.map((item) => {
                const widthPercent = Math.max(
                  12,
                  Math.round((item.count / maxSessionsInDay) * 100),
                );
                const dayLabel = new Date(
                  `${item.day}T00:00:00`,
                ).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                });

                return (
                  <View key={item.day} style={styles.chartRow}>
                    <Text style={styles.chartLabel}>{dayLabel}</Text>
                    <View style={styles.chartTrack}>
                      <View
                        style={[
                          styles.chartFill,
                          { width: `${widthPercent}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.chartValue}>{item.count}x</Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <Text style={styles.infoLine}>Sem sessoes registradas ainda.</Text>
          )}

          {recentSessionTimes.length > 0 && (
            <View style={styles.timelineWrap}>
              {recentSessionTimes.map((session) => (
                <View key={session.id} style={styles.timelineChip}>
                  <Text style={styles.timelineChipText}>
                    {formatDateTime(session.createdAt)}
                  </Text>
                </View>
              ))}
            </View>
          )}
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
            style={styles.registerButton}
            onPress={() => setIsConfirmVisible(true)}
          >
            <Text style={styles.registerButtonText}>Registrar sessao</Text>
          </Pressable>

          <Pressable
            style={[styles.registerButton, styles.deleteButton]}
            onPress={(event) => {
              event.stopPropagation();
              onRemove(gameItem.id);
            }}
          >
            <Text style={styles.registerButtonText}>Excluir</Text>
          </Pressable>
        </View>
      </View>

      <Modal
        transparent
        animationType="fade"
        visible={isConfirmVisible}
        onRequestClose={() => setIsConfirmVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Confirmar registro</Text>
            <Text style={styles.modalText}>
              Deseja registrar uma sessao para este jogo agora?
            </Text>

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setIsConfirmVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={[styles.modalButton, styles.modalConfirmButton]}
                onPress={handleConfirmRegisterSession}
              >
                <Text style={styles.modalConfirmText}>Confirmar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    backgroundColor: COLORS.background,
  },
  missingTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: "800",
  },
  card: {
    width: "100%",
    maxWidth: 560,
    backgroundColor: COLORS.panel,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  heroSection: {
    alignItems: "center",
    gap: 4,
  },
  heroTitle: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
  },
  heroSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 15,
    textAlign: "center",
  },
  statusBadge: {
    marginTop: 4,
    backgroundColor: "#12233F",
    borderColor: COLORS.blue,
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
    backgroundColor: "#121820",
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 2,
  },
  infoLine: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  infoHighlight: {
    marginTop: 2,
    color: COLORS.textPrimary,
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
    color: COLORS.textSecondary,
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
    backgroundColor: COLORS.blue,
    borderRadius: 999,
  },
  chartValue: {
    width: 24,
    textAlign: "right",
    color: COLORS.textPrimary,
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
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  timelineChipText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: "700",
  },
  statusRow: {
    flexDirection: "row",
    gap: 8,
  },
  statusButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: COLORS.panel,
  },
  statusButtonActive: {
    borderColor: COLORS.blue,
    backgroundColor: "#12233F",
  },
  statusButtonText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "700",
  },
  statusButtonTextActive: {
    color: "#FFFFFF",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  registerButton: {
    flex: 1,
    backgroundColor: COLORS.blue,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 9,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: COLORS.red,
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 480,
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: "800",
  },
  modalText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  modalActions: {
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  modalButton: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  modalCancelButton: {
    backgroundColor: COLORS.buttonNeutral,
  },
  modalConfirmButton: {
    backgroundColor: COLORS.green,
  },
  modalCancelText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },
  modalConfirmText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },
});
