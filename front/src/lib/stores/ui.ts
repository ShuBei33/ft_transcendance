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

interface ui {
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

export const ui = writableHook<ui>({
  initialValue: deepCopy(uiInitialValue),
  copyMethod: (value) => deepCopy(value),
  onUpdate(prev, value) {
    console.log("updatePrev", prev);
    const isGameIdUpdate = prev.game.id != value.game.id;
    if (isGameIdUpdate) {
      if (value.game.id) {
        value.game.countDown.intervalId = Number(
          setInterval(() => {
            ui.update((prev) => {
              let newPrev = deepCopy(prev);
              newPrev.game.countDown.data.secondsLeft--;
              if (!newPrev.game.countDown.data.secondsLeft) newPrev.game.state = "PLAYING";
              else newPrev.game.state = "COUNTDOWN";
              console.log(
                `sec: ${newPrev.game.countDown.data.secondsLeft}, state: ${newPrev.game.state}`
              );
              return newPrev;
            });
            // value.game.countDown.data.secondsLeft--;
          }, countDownDelay)
        );
      } else {
        alert("ooooooooooooooooooooooooooooooooohoo");
        clearInterval(value.game.countDown.intervalId);
        value.game.countDown.data.secondsLeft = 10;
        value.game.state = "NONE";
      }
    }
    console.log("updateNew", value);
  },
  onSet(value) {
    console.log("!set", value);
    // if (value.game.id) {
    //   switch (value.game.state) {
    //     case "QUEUE":
    //       value.game.state = "COUNTDOWN";
    //       break;
    //     case "COUNTDOWN":
    //       alert("start");
    //       value.game.countDown.start(5000);
    //       break;
    //     default:
    //       return;
    //   }
    // } else {
    //   if (value.game.state == "PLAYING") {
    //     value.game.state = "NONE";
    //     value.game.countDown.stop();
    //   } else {
    //     alert("state is " + value.game.state);
    //   }
    // }
    // if (value.game.id && value.game.state == "QUEUE") {
    //   value.game.state = "PLAYING";
    // } else if (!value.game.id && value.game.state == "PLAYING") value.game.state = "NONE";
  },
});
