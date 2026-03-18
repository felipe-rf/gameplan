import { GameItem } from "../types/gameitem";

export const INITIAL_GAMES: GameItem[] = [
  {
    id: "1",
    title: "The Witcher 3",
    platform: "PC",
    played: true,
    status: "finished",
    createdAt: "2026-03-10T18:00:00.000Z",
  },
  {
    id: "2",
    title: "Hades",
    platform: "Switch",
    played: false,
    status: "playing",
    createdAt: "2026-03-11T20:30:00.000Z",
  },
];
