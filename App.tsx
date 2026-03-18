import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { GamesProvider } from "./src/context/GamesContext";
import { INITIAL_GAMES } from "./src/constants/initialGames";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { COLORS } from "./src/styles/theme";

export default function App() {
  return (
    <View style={styles.root}>
      <GamesProvider initialGames={INITIAL_GAMES}>
        <AppNavigator />
      </GamesProvider>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
