import { useState } from "react";
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useGames } from "../context/GamesContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { GameItem } from "../types/gameitem";
import { formatDateTime } from "../utils/date";
import { themeColors, font } from "../styles/theme";
type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;

type RandomType = "true-random" | "not-played-in-a-while" | "long-time";

const RANDOM_TYPE_OPTIONS: Array<{ value: RandomType; label: string }> = [
  { value: "true-random", label: "True Random" },
  { value: "not-played-in-a-while", label: "Games not played in a while" },
  {
    value: "long-time",
    label: "Games not played in a long time",
  },
];

export function HomeScreen({ navigation }: HomeScreenProps) {
  const { games, playedRegisters } = useGames();
  const { width } = useWindowDimensions();
  const [isPickModalVisible, setIsPickModalVisible] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [pickedGame, setPickedGame] = useState<GameItem | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [includeFinishedGames, setIncludeFinishedGames] = useState(false);
  const [randomType, setRandomType] = useState<RandomType>("true-random");

  const availablePlatforms = Array.from(
    new Set(games.map((game) => game.platform).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b));

  const lastPlayedByGameId = playedRegisters.reduce<Record<string, number>>(
    (acc, register) => {
      const ts = new Date(register.createdAt).getTime();
      const current = acc[register.gameId] ?? 0;
      acc[register.gameId] = Math.max(current, ts);
      return acc;
    },
    {},
  );

  const filteredPool = games.filter((game) => {
    if (game.status === "ignore") {
      return false;
    }

    if (!includeFinishedGames && game.status !== "playing") {
      return false;
    }

    if (
      selectedPlatforms.length &&
      !selectedPlatforms.includes(game.platform)
    ) {
      return false;
    }

    return true;
  });

  function pickTrueRandom(pool: GameItem[]) {
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
  }

  function pickNotPlayedInAWhile(pool: GameItem[]) {
    const now = Date.now();
    const weighted = pool.map((game) => {
      const lastPlayed =
        lastPlayedByGameId[game.id] ?? new Date(game.createdAt).getTime();
      const age = Math.max(1, now - lastPlayed);
      return { game, weight: age };
    });

    const totalWeight = weighted.reduce((sum, item) => sum + item.weight, 0);
    let cursor = Math.random() * totalWeight;

    for (const item of weighted) {
      cursor -= item.weight;
      if (cursor <= 0) {
        return item.game;
      }
    }

    return weighted[weighted.length - 1].game;
  }

  function pickLongTime(pool: GameItem[]) {
    const now = Date.now();
    const ordered = [...pool].sort((a, b) => {
      const aLast = lastPlayedByGameId[a.id] ?? new Date(a.createdAt).getTime();
      const bLast = lastPlayedByGameId[b.id] ?? new Date(b.createdAt).getTime();
      return now - bLast - (now - aLast);
    });

    return ordered[0];
  }

  function handlePickTodayGame() {
    if (!filteredPool.length) {
      setPickedGame(null);
      setIsPickModalVisible(true);
      return;
    }

    const picked =
      randomType === "true-random"
        ? pickTrueRandom(filteredPool)
        : randomType === "not-played-in-a-while"
          ? pickNotPlayedInAWhile(filteredPool)
          : pickLongTime(filteredPool);

    setPickedGame(picked);
    setIsPickModalVisible(true);
  }

  function togglePlatform(platform: string) {
    setSelectedPlatforms((current) =>
      current.includes(platform)
        ? current.filter((item) => item !== platform)
        : [...current, platform],
    );
  }

  const pickedStatusLabel =
    pickedGame?.status === "playing"
      ? "Playing"
      : pickedGame?.status === "finished"
        ? "Finished"
        : "Ignore";

  const pickedLastPlayedLabel = pickedGame
    ? lastPlayedByGameId[pickedGame.id]
      ? formatDateTime(
          new Date(lastPlayedByGameId[pickedGame.id]).toISOString(),
        )
      : "Never"
    : "-";

  const contentWidth = Math.min(280, Math.max(220, width - 32));
  const mainButtonSize = Math.min(280, Math.max(220, contentWidth));
  const titleFontSize = width < 380 ? 30 : width < 768 ? 36 : 40;
  const secondaryFontSize = width < 380 ? 18 : 20;

  return (
    <SafeAreaView style={styles.root}>
      <View style={[styles.group1, { width: contentWidth }]}>
        <Pressable
          style={[
            styles.mainButton,
            { width: mainButtonSize, height: mainButtonSize },
          ]}
          onPress={handlePickTodayGame}
        >
          <Text style={[styles.whatShouldIPlay, { fontSize: titleFontSize }]}>
            What should I play?
          </Text>
        </Pressable>

        <Pressable
          style={[styles.secondButton, { width: contentWidth }]}
          onPress={() => navigation.navigate("Backlog")}
        >
          <Text style={[styles.backlog, { fontSize: secondaryFontSize }]}>
            Backlog
          </Text>
        </Pressable>
      </View>

      <Modal
        transparent
        animationType="fade"
        visible={isPickModalVisible}
        onRequestClose={() => setIsPickModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>What should I play?</Text>

            {pickedGame ? (
              <>
                <Text style={styles.modalGameTitle}>{pickedGame.title}</Text>
                <Text style={styles.modalLine}>{pickedGame.platform}</Text>
                <Text style={styles.modalLine}>
                  Status: {pickedStatusLabel}
                </Text>
                <Text style={styles.modalLine}>
                  Last Played: {pickedLastPlayedLabel}
                </Text>

                <View style={styles.modalActions}>
                  <Pressable
                    style={[styles.modalButton, styles.modalCancelButton]}
                    onPress={() => setIsPickModalVisible(false)}
                  >
                    <Text style={styles.modalCancelText}>Close</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.modalButton, styles.modalPrimaryButton]}
                    onPress={() => {
                      setIsPickModalVisible(false);
                      navigation.navigate("GameInfo", {
                        gameId: pickedGame.id,
                      });
                    }}
                  >
                    <Text style={styles.modalPrimaryText}>Open details</Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.modalLine}>
                  No game with status "playing" found in your backlog.
                </Text>
                <Pressable
                  style={[
                    styles.modalButton,
                    styles.modalPrimaryButton,
                    styles.modalSingleButton,
                  ]}
                  onPress={() => setIsPickModalVisible(false)}
                >
                  <Text style={styles.modalPrimaryText}>Ok</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: themeColors.background,
  },
  backlog: {
    color: themeColors.white,
    textAlign: "center",
    fontFamily: font.bold,
    fontStyle: "normal",
    fontWeight: "700",
  },
  group1: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: 360,
    paddingHorizontal: 40,
    gap: 20,
  },
  secondButton: {
    flexDirection: "row",
    minHeight: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    backgroundColor: themeColors.secondary,
    shadowColor: themeColors.background,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 4 },
  },
  whatShouldIPlay: {
    color: themeColors.background,
    textAlign: "center",
    fontFamily: font.bold,
    fontStyle: "normal",
    fontWeight: "700",
  },
  mainButton: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    backgroundColor: themeColors.primary,
    shadowColor: themeColors.background,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 4 },
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
  modalTitle: {
    color: themeColors.white,
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  modalGameTitle: {
    color: themeColors.white,
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
  },
  modalLine: {
    color: themeColors.white,
    fontSize: 14,
    textAlign: "center",
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: themeColors.primary,
  },
  modalPrimaryButton: {
    backgroundColor: themeColors.primary,
  },
  modalPrimaryText: {
    color: themeColors.secondary,
    fontWeight: "700",
  },
  modalCancelButton: {
    backgroundColor: themeColors.secondary,
  },
  modalCancelText: {
    color: themeColors.white,
    fontWeight: "700",
  },
  modalSingleButton: {
    flex: 0,
    alignSelf: "center",
    paddingHorizontal: 24,
  },
});
