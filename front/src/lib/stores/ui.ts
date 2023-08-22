import { writableHook, type WritableHook } from "./hooks";

interface ui {
  chat: {
    toggle: boolean;
    selected: "DM" | "ROOM" | "FRIENDS";
  };
}

const uiInitialValue: ui = {
  chat: {
    toggle: false,
    selected: "ROOM",
  },
};

export const ui = writableHook<ui>({
  initialValue: uiInitialValue,
});
