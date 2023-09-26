import { writable, type Writable } from "svelte/store";
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
    state: "NONE" | "PLAYING" | "COUNTDOWN" | "QUEUE";
    countDown: number;
    id: number;
    selectedChroma: string;
    controls: {
      up: string;
      down: string;
    };
  };
  modal: "NONE" | "EDITCHAN" | "BROWSECHAN" | "CREATECHAN";
}

function deepCopy<T>(obj: T): T {
  // Check if the input is an object
  if (typeof obj !== "object" || obj === null) {
    return obj; // If not an object, return it as is (base case)
  }

  // Create a new object or array, depending on the type of obj
  const copy: any = Array.isArray(obj) ? [] : {};

  // Recursively copy each property in obj
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      copy[key] = deepCopy(obj[key]);
    }
  }

  return copy as T;
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
    countDown: 0,
    id: 0,
    selectedChroma: "",
    controls: {
      up: "w",
      down: "s",
    },
  },
  modal: "NONE",
};

export const ui = writableHook<ui>({
  initialValue: deepCopy(uiInitialValue),
  copyMethod(value) {
    return { ...value };
  },
  onUpdate(prev, value) {},
  onSet(value) {
    console.log("!set", value);
    if (value.game.id && value.game.state == "QUEUE") {
      value.game.state = "PLAYING";
    } else if (!value.game.id && value.game.state == "PLAYING") value.game.state = "NONE";
  },
});
