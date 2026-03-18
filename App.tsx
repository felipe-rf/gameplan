import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { StyleSheet, View } from "react-native";
import {
  InstrumentSans_400Regular,
  InstrumentSans_700Bold,
} from "@expo-google-fonts/instrument-sans";
import { GamesProvider } from "./src/context/GamesContext";
import { INITIAL_GAMES } from "./src/constants/initialGames";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { COLORS } from "./src/styles/theme";

export default function App() {
  const [fontsLoaded] = useFonts({
    InstrumentSans_400Regular,
    InstrumentSans_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

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
