import { writableHook, type WritableHook } from "./hooks";

interface ui {
  chat: {
    toggle: boolean;
    selected: "DM" | "ROOM" | "FRIEND";
  };
  game: {
    state: "NONE" | "PLAYING" | "QUEUE";
  };
}

export const uiInitialValue: ui = {
  chat: {
    toggle: false,
    selected: "FRIEND",
  },
  game: {
    state: "NONE",
  },
};

export const ui = writableHook<ui>({
  initialValue: uiInitialValue,
});
