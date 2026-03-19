import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BacklogScreen } from "../screens/BacklogScreen";
import { GameInfo } from "../screens/GameInfo";
import { HomeScreen } from "../screens/HomeScreen";
import { themeColors } from "../styles/theme";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

const NAV_THEME = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: themeColors.background,
  },
};

export function AppNavigator() {
  return (
    <NavigationContainer theme={NAV_THEME}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          animation: "fade",
          headerTitle: "",
          headerStyle: {
            backgroundColor: themeColors.background,
            borderBottomWidth: 0,
          },
          headerTintColor: themeColors.white,
          headerTitleStyle: { fontWeight: "700" },
          contentStyle: { backgroundColor: themeColors.background },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Backlog" component={BacklogScreen} />
        <Stack.Screen name="GameInfo" component={GameInfo} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
