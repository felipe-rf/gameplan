import { useState } from "react";
import {
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Header } from "../components/Header";
import { useGames } from "../context/GamesContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { COLORS } from "../styles/theme";
import { RootStackParamList } from "../navigation/types";
import { GameItem } from "../types/gameitem";
import { formatDateTime } from "../utils/date";

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation }: HomeScreenProps) {
  const { games, pendingGames, playedCount } = useGames();
  const [isPickModalVisible, setIsPickModalVisible] = useState(false);
  const [pickedGame, setPickedGame] = useState<GameItem | null>(null);

  const playableGames = pendingGames.filter(
    (game) => game.status === "playing",
  );

  function handlePickTodayGame() {
    if (!playableGames.length) {
      setPickedGame(null);
      setIsPickModalVisible(true);
      return;
    }

    const randomIndex = Math.floor(Math.random() * playableGames.length);
    setPickedGame(playableGames[randomIndex]);
    setIsPickModalVisible(true);
  }

  const pickedStatusLabel =
    pickedGame?.status === "playing"
      ? "Playing"
      : pickedGame?.status === "finished"
        ? "Finished"
        : "Ignore";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.homePanel}>
          <Pressable style={styles.mainButton} onPress={handlePickTodayGame}>
            <Text style={styles.mainButtonText}>What should I play</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("Backlog")}
          >
            <Text style={styles.secondaryButtonText}>Backlog</Text>
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
                  <Text style={styles.modalLine}>
                    Platform: {pickedGame.platform}
                  </Text>
                  <Text style={styles.modalLine}>
                    Status: {pickedStatusLabel}
                  </Text>
                  <Text style={styles.modalLine}>
                    Added: {formatDateTime(pickedGame.createdAt)}
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 16,
  },
  homePanel: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
  },
  mainButton: {
    width: "100%",
    maxWidth: 520,
    backgroundColor: COLORS.blue,
    borderRadius: 18,
    minHeight: 220,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#3A86FF",
  },
  mainButtonText: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
  },
  secondaryButton: {
    width: "60%",
    maxWidth: 260,
    backgroundColor: COLORS.panel,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 12,
    minHeight: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "700",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 520,
    backgroundColor: COLORS.panel,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },
  modalGameTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 2,
  },
  modalLine: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: "center",
  },
  modalActions: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  modalButton: {
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  modalCancelButton: {
    backgroundColor: COLORS.buttonNeutral,
  },
  modalPrimaryButton: {
    backgroundColor: COLORS.blue,
  },
  modalCancelText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },
  modalPrimaryText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },
  modalSingleButton: {
    alignSelf: "center",
    marginTop: 10,
  },
});
