import { useEffect, useState } from "react";
import {
  loadPlayedRegisters,
  loadStoredGames,
  savePlayedRegisters,
  saveStoredGames,
} from "../storage/gameStorage";
import { GameItem } from "../types/gameitem";
import { PlayedRegister } from "../types/playedregister";

type UseGamePersistenceParams = {
  initialGames: GameItem[];
};

function normalizeStoredGames(games: GameItem[]): GameItem[] {
  return games.map((game) => {
    if (game.status) {
      return game;
    }

    return {
      ...game,
      status: game.played ? "finished" : "playing",
    };
  });
}

export function useGamePersistence({ initialGames }: UseGamePersistenceParams) {
  const [games, setGames] = useState<GameItem[]>([]);
  const [playedRegisters, setPlayedRegisters] = useState<PlayedRegister[]>([]);
  const [isStorageLoaded, setIsStorageLoaded] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [storedGames, storedRegisters] = await Promise.all([
          loadStoredGames(),
          loadPlayedRegisters(),
        ]);

        setGames(
          storedGames.length
            ? normalizeStoredGames(storedGames)
            : normalizeStoredGames(initialGames),
        );
        setPlayedRegisters(storedRegisters);
      } catch {
        setGames(normalizeStoredGames(initialGames));
        setPlayedRegisters([]);
      } finally {
        setIsStorageLoaded(true);
      }
    }

    loadData();
  }, [initialGames]);

  useEffect(() => {
    if (!isStorageLoaded) {
      return;
    }

    saveStoredGames(games).catch(() => undefined);
  }, [games, isStorageLoaded]);

  useEffect(() => {
    if (!isStorageLoaded) {
      return;
    }

    savePlayedRegisters(playedRegisters).catch(() => undefined);
  }, [playedRegisters, isStorageLoaded]);

  function addPlayedRegister(gameId: string) {
    const register: PlayedRegister = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      gameId,
      createdAt: new Date().toISOString(),
    };

    setPlayedRegisters((current) => [register, ...current]);
  }

  function removeGameRegisters(gameId: string) {
    setPlayedRegisters((current) =>
      current.filter((register) => register.gameId !== gameId),
    );
  }

  return {
    games,
    setGames,
    playedRegisters,
    addPlayedRegister,
    removeGameRegisters,
    isStorageLoaded,
  };
}
