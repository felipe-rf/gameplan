import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { font, themeColors } from "../styles/theme";

type ConfirmationModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmVariant?: "primary" | "danger";
};

export function ConfirmationModal({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
  confirmVariant = "primary",
}: ConfirmationModalProps) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalText}>{message}</Text>

          <View style={styles.modalActions}>
            <Pressable
              style={[styles.modalButton, styles.modalCancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.modalCancelText}>{cancelLabel}</Text>
            </Pressable>

            <Pressable
              style={[
                styles.modalButton,
                confirmVariant === "danger"
                  ? styles.modalDangerButton
                  : styles.modalConfirmButton,
              ]}
              onPress={onConfirm}
            >
              <Text
                style={[
                  styles.modalConfirmText,
                  confirmVariant === "danger" && styles.modalDangerText,
                ]}
              >
                {confirmLabel}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: themeColors.background,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  modalTitle: {
    color: themeColors.white,
    fontSize: 17,
    fontWeight: "800",
    fontFamily: font.bold,
  },
  modalText: {
    color: themeColors.white,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: font.regular,
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
    backgroundColor: themeColors.secondary,
  },
  modalConfirmButton: {
    backgroundColor: themeColors.primary,
  },
  modalDangerButton: {
    backgroundColor: themeColors.danger,
  },
  modalCancelText: {
    color: themeColors.white,
    fontWeight: "700",
    fontSize: 13,
    fontFamily: font.bold,
  },
  modalConfirmText: {
    color: themeColors.secondary,
    fontWeight: "700",
    fontSize: 13,
    fontFamily: font.bold,
  },
  modalDangerText: {
    color: themeColors.white,
  },
});
