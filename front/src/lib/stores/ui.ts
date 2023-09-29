import { writable, type Writable } from "svelte/store";
import { writableHook, type WritableHook } from "./hooks";
import { deepCopy } from "$lib/utils/parsing/deepCopy";

type chatType = {
  labelFocusId: number;
  textInputMap: Map<number, string>;
};

type countDownType<T> = {
  intervalId: number;
  data: T;
};

interface uiType {
  chat: {
    toggle: boolean;
    selected: "DM" | "ROOM" | "FRIEND";
    room: chatType;
    dm: chatType;
  };
  game: {
    state: "NONE" | "PLAYING" | "COUNTDOWN" | "QUEUE";
    countDown: countDownType<{ secondsLeft: number }>;
    id: number;
    selectedChroma: string;
    controls: {
      up: string;
      down: string;
    };
  };
  modal: "NONE" | "EDITCHAN" | "BROWSECHAN" | "CREATECHAN";
}
// 1 second
export const countDownDelay = 1000 / 2;

export const uiInitialValue: uiType = {
  chat: {
    toggle: false,
    selected: "FRIEND",
    room: {
      textInputMap: new Map(),
      labelFocusId: -1,
    },
    dm: {
      textInputMap: new Map(),
      labelFocusId: -1,
    },
  },
  game: {
    state: "NONE",
    countDown: {
      intervalId: -1,
      data: {
        secondsLeft: 10,
      },
    },
    id: 0,
    selectedChroma: "",
    controls: {
      up: "w",
      down: "s",
    },
  },
  modal: "NONE",
};

export const ui = writableHook<uiType>({
  initialValue: deepCopy(uiInitialValue),
  copyMethod: (value) => deepCopy(value),
  // Middleware for values update
  onUpdate(prev, value) {
    const isGameIdUpdate = prev.game.id != value.game.id;
    if (isGameIdUpdate) {
      if (value.game.id) {
        value.game.state = "COUNTDOWN";
        value.game.countDown.intervalId = Number(
          setInterval(() => {
            ui.update((prev) => {
              if (prev.game.countDown.data.secondsLeft == 0) {
                value.game.state = "PLAYING";
                clearInterval(prev.game.countDown.intervalId);
                prev.game.countDown.data.secondsLeft = 10;
              } else prev.game.countDown.data.secondsLeft--;
              return prev;
            });
          }, countDownDelay)
        );
      } else {
        value.game.state = "NONE";
      }
    }
    return value;
  },
  onSet(value) {},
});

export const updateGameId = (id: number, delay?: number) => {
  ui.update((prev) => {
    prev.game.id = id;
    return prev;
  });
};

export const updateGameState = (state: uiType["game"]["state"]) => {
  ui.update((prev) => {
    prev.game.state = state;
    return prev;
  });
};
