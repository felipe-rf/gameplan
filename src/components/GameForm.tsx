import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { COLORS, font, themeColors } from "../styles/theme";

type GameFormProps = {
  onAddGame: (title: string, platform: string) => void;
};

export function GameForm({ onAddGame }: GameFormProps) {
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("");

  function handleSubmit() {
    const cleanedTitle = title.trim();
    const cleanedPlatform = platform.trim();

    if (!cleanedTitle || !cleanedPlatform) {
      return;
    }

    onAddGame(cleanedTitle, cleanedPlatform);
    setTitle("");
    setPlatform("");
  }

  return (
    <View style={styles.form}>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Nome do jogo"
        placeholderTextColor={themeColors.background}
      />
      <TextInput
        style={styles.input}
        value={platform}
        onChangeText={setPlatform}
        placeholder="Plataforma (PC, PS5, Switch...)"
        placeholderTextColor={themeColors.background}
      />

      <Pressable style={styles.addButton} onPress={handleSubmit}>
        <Text style={styles.addButtonText}>Adicionar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 10,
    marginBottom: 14,
    fontFamily: font.regular,
  },
  input: {
    backgroundColor: themeColors.secondary,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    color: themeColors.white,
    fontFamily: font.regular,
    fontSize: 15,
  },
  addButton: {
    marginTop: 2,
    backgroundColor: themeColors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  addButtonText: {
    color: themeColors.secondary,
    fontWeight: "700",
  },
});
