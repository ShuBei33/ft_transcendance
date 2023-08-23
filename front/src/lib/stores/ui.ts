import { writableHook, type WritableHook } from "./hooks";

interface ui {
  chat: {
    toggle: boolean;
    selected: "DM" | "ROOM" | "FRIEND";
  };
  game: {
    state: "NONE" | "PLAYING" | "QUEUE";
    id: number;
  };
}

export const uiInitialValue: ui = {
  chat: {
    toggle: false,
    selected: "FRIEND",
  },
  game: {
    state: "NONE",
    id: 0,
  },
};

export const ui = writableHook<ui>({
  initialValue: uiInitialValue,
  onUpdate(prev, value) {
    console.log("update", prev, " ", value);
  },
  onSet(value) {
    console.log("!set", value);
  },
});
