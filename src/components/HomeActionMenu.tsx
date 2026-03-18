import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../styles/theme";

export type HomeAction = "today" | "session" | "backlog";

type HomeActionMenuProps = {
  selectedAction: HomeAction;
  onSelectAction: (action: HomeAction) => void;
};

export function HomeActionMenu({
  selectedAction,
  onSelectAction,
}: HomeActionMenuProps) {
  return (
    <View style={styles.container}>
      <Pressable
        style={[
          styles.primaryAction,
          selectedAction === "today" && styles.primaryActionActive,
        ]}
        onPress={() => onSelectAction("today")}
      >
        <Text style={styles.primaryActionTitle}>O que vou jogar hoje</Text>
        <Text style={styles.primaryActionSubtitle}>
          Escolha com foco no dia
        </Text>
      </Pressable>

      <View style={styles.secondaryRow}>
        <Pressable
          style={[
            styles.secondaryAction,
            selectedAction === "session" && styles.secondaryActionActive,
          ]}
          onPress={() => onSelectAction("session")}
        >
          <Text style={styles.secondaryActionText}>
            Registrar sessao de jogo
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.secondaryAction,
            selectedAction === "backlog" && styles.secondaryActionActive,
          ]}
          onPress={() => onSelectAction("backlog")}
        >
          <Text style={styles.secondaryActionText}>Adicionar ao backlog</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    gap: 10,
  },
  primaryAction: {
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 20,
    alignItems: "center",
  },
  primaryActionActive: {
    borderColor: COLORS.blue,
    backgroundColor: "#12233F",
  },
  primaryActionTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },
  primaryActionSubtitle: {
    marginTop: 6,
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  secondaryRow: {
    flexDirection: "row",
    gap: 10,
  },
  secondaryAction: {
    flex: 1,
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 72,
  },
  secondaryActionActive: {
    borderColor: COLORS.blue,
    backgroundColor: "#12233F",
  },
  secondaryActionText: {
    color: "#F5F7FA",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
});
