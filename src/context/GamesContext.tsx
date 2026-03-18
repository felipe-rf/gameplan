import { createContext, PropsWithChildren, useContext, useMemo } from "react";
import { useGamePersistence } from "../hooks/useGamePersistence";
import { GameItem, GameStatus } from "../types/gameitem";
import { PlayedRegister } from "../types/playedregister";

type GamesContextValue = {
  games: GameItem[];
  pendingGames: GameItem[];
  playedCount: number;
  playedRegisters: PlayedRegister[];
  addBacklogGame: (title: string, platform: string) => string;
  togglePlayed: (id: string) => void;
  setGameStatus: (id: string, status: GameStatus) => void;
  registerSession: (gameId: string) => void;
  removeGame: (id: string) => void;
  markGamesAsPlayed: (ids: string[]) => void;
  removeGames: (ids: string[]) => void;
};

const GamesContext = createContext<GamesContextValue | null>(null);

type GamesProviderProps = PropsWithChildren<{
  initialGames: GameItem[];
}>;

export function GamesProvider({ initialGames, children }: GamesProviderProps) {
  const {
    games,
    setGames,
    playedRegisters,
    addPlayedRegister,
    removeGameRegisters,
  } = useGamePersistence({ initialGames });

  const pendingGames = useMemo(
    () => games.filter((game) => game.status !== "finished"),
    [games],
  );

  const playedCount = useMemo(
    () => games.filter((game) => game.status === "finished").length,
    [games],
  );

  function addBacklogGame(title: string, platform: string) {
    const id = `${Date.now()}`;
    const newGame: GameItem = {
      id,
      title,
      platform,
      played: false,
      status: "playing",
      createdAt: new Date().toISOString(),
    };

    setGames((current) => [newGame, ...current]);
    return id;
  }

  function togglePlayed(id: string) {
    const targetGame = games.find((game) => game.id === id);

    if (targetGame && targetGame.status !== "finished") {
      addPlayedRegister(targetGame.id);
    }

    setGames((current) =>
      current.map((game) => {
        if (game.id !== id) {
          return game;
        }

        const nextStatus = game.status === "finished" ? "playing" : "finished";
        return {
          ...game,
          played: nextStatus === "finished",
          status: nextStatus,
        };
      }),
    );
  }

  function registerSession(gameId: string) {
    addPlayedRegister(gameId);

    setGames((current) =>
      current.map((game) =>
        game.id === gameId
          ? { ...game, played: true, status: "playing" }
          : game,
      ),
    );
  }

  function setGameStatus(id: string, status: GameStatus) {
    setGames((current) =>
      current.map((game) =>
        game.id === id
          ? {
              ...game,
              status,
              played: status === "finished",
            }
          : game,
      ),
    );
  }

  function removeGame(id: string) {
    setGames((current) => current.filter((game) => game.id !== id));
    removeGameRegisters(id);
  }

  function markGamesAsPlayed(ids: string[]) {
    if (!ids.length) {
      return;
    }

    const idSet = new Set(ids);

    setGames((current) =>
      current.map((game) =>
        idSet.has(game.id)
          ? { ...game, played: true, status: "finished" }
          : game,
      ),
    );

    ids.forEach((id) => addPlayedRegister(id));
  }

  function removeGames(ids: string[]) {
    if (!ids.length) {
      return;
    }

    const idSet = new Set(ids);
    setGames((current) => current.filter((game) => !idSet.has(game.id)));
    ids.forEach((id) => removeGameRegisters(id));
  }

  const value = useMemo(
    () => ({
      games,
      pendingGames,
      playedCount,
      playedRegisters,
      addBacklogGame,
      togglePlayed,
      setGameStatus,
      registerSession,
      removeGame,
      markGamesAsPlayed,
      removeGames,
    }),
    [games, pendingGames, playedCount, playedRegisters],
  );

  return (
    <GamesContext.Provider value={value}>{children}</GamesContext.Provider>
  );
}

export function useGames() {
  const context = useContext(GamesContext);

  if (!context) {
    throw new Error("useGames must be used within a GamesProvider");
  }

  return context;
}
