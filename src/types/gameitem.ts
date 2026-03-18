export type GameFilter = "all" | "played" | "pending";

export type GameStatus = "playing" | "finished" | "ignore";

export type GameItem = {
  id: string;
  title: string;
  platform: string;
  played: boolean;
  status: GameStatus;
  createdAt: string;
};
