import { writableHook, type WritableHook } from "./hooks";

interface ui {
  chat: {
    toggle: boolean;
    selected: "DM" | "ROOM" | "FRIEND";
    room: {
      labelFocusId: number;
      textInputMap: Map<number, string>;
    };
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
    room: {
      textInputMap: new Map<number, string>(),
      labelFocusId: -1,
    },
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
    if (value.game.id) value.game.state = "PLAYING";
    else if (!value.game.id && value.game.state == "PLAYING")
      value.game.state = "NONE";
    console.log("!set", value);
  },
});
