import { writableHook, type WritableHook } from "./hooks";

type chatType = {
  labelFocusId: number;
  textInputMap: Map<number, string>;
};

interface ui {
  chat: {
    toggle: boolean;
    selected: "DM" | "ROOM" | "FRIEND";
    room: chatType;
    dm: chatType;
  };
  game: {
    state: "NONE" | "PLAYING" | "QUEUE";
    id: number;
    selectedChroma: string;
  };
  modal: "NONE" | "EDITCHAN" | "BROWSECHAN" | "CREATECHAN";
}

export const uiInitialValue: ui = {
  chat: {
    toggle: false,
    selected: "FRIEND",
    room: {
      textInputMap: new Map<number, string>(),
      labelFocusId: -1,
    },
    dm: {
      textInputMap: new Map<number, string>(),
      labelFocusId: -1,
    },
  },
  game: {
    state: "NONE",
    id: 0,
    selectedChroma: ''
  },
  modal: "NONE",
};

export const ui = writableHook<ui>({
  initialValue: uiInitialValue,
  onUpdate(prev, value) {
    // console.log("update", prev, " ", value);
  },
  onSet(value) {
    console.log("!set", value);
    if (value.game.id) value.game.state = "PLAYING";
    else if (!value.game.id && value.game.state == "PLAYING") value.game.state = "NONE";
    // console.log("!set", value);
  },
});
