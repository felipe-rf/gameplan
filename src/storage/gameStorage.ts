import AsyncStorage from "@react-native-async-storage/async-storage";
import { GameItem } from "../types/gameitem";
import { PlayedRegister } from "../types/playedregister";

const GAMES_STORAGE_KEY = "@gamefm:games";
const PLAYED_REGISTERS_STORAGE_KEY = "@gamefm:played-registers";
const FILTER_OPTIONS_STORAGE_KEY = "@gamefm:filter-options";

type FilterOptions = {
  randomType: "true-random" | "not-played-in-a-while" | "long-time";
  selectedPlatforms: string[];
  includeFinishedGames: boolean;
};

function parseArray<T>(rawValue: string | null): T[] {
  if (!rawValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(rawValue) as unknown;
    return Array.isArray(parsedValue) ? (parsedValue as T[]) : [];
  } catch {
    return [];
  }
}

export async function loadStoredGames(): Promise<GameItem[]> {
  const rawGames = await AsyncStorage.getItem(GAMES_STORAGE_KEY);
  return parseArray<GameItem>(rawGames);
}

export async function saveStoredGames(games: GameItem[]): Promise<void> {
  await AsyncStorage.setItem(GAMES_STORAGE_KEY, JSON.stringify(games));
}

export async function loadPlayedRegisters(): Promise<PlayedRegister[]> {
  const rawRegisters = await AsyncStorage.getItem(PLAYED_REGISTERS_STORAGE_KEY);
  return parseArray<PlayedRegister>(rawRegisters);
}

export async function savePlayedRegisters(
  registers: PlayedRegister[],
): Promise<void> {
  await AsyncStorage.setItem(
    PLAYED_REGISTERS_STORAGE_KEY,
    JSON.stringify(registers),
  );
}

export async function loadFilterOptions(): Promise<FilterOptions | null> {
  try {
    const rawOptions = await AsyncStorage.getItem(FILTER_OPTIONS_STORAGE_KEY);
    if (!rawOptions) {
      return null;
    }
    return JSON.parse(rawOptions) as FilterOptions;
  } catch {
    return null;
  }
}

export async function saveFilterOptions(options: FilterOptions): Promise<void> {
  await AsyncStorage.setItem(
    FILTER_OPTIONS_STORAGE_KEY,
    JSON.stringify(options),
  );
}
