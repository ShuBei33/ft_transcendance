import { writable, type Writable } from "svelte/store";
import { writableHook, type WritableHook } from "./hooks";
import { deepCopy } from "$lib/utils/parsing/deepCopy";

type chatType = {
  labelFocusId: number;
  textInputMap: Map<number, string>;
};

class interval<T> {
  private id: number = -1;
  private data: T;
  constructor(
    private handler: (data: T) => any,
    data: T
  ) {
    this.data = data;
  }
  stop() {
    if (this.id != -1) {
      clearInterval(this.id);
      this.id = -1;
    }
  }
  setData(data: T) {
    this.data = data;
  }
  getData() {
    return this.data;
  }
  start(ms: number) {
    if (this.id != -1) this.id = Number(setInterval(this.handler, ms));
  }
  getId() {
    return this.id;
  }
  getHandler() {
    return this.handler;
  }
  setHander(handler: (data: T) => any) {
    this.handler = handler;
  }
}

type countDownType = {
  id: number;
  seconds: number;
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
    countDown: interval<{ secondLeft: number }>;
    id: number;
    selectedChroma: string;
    controls: {
      up: string;
      down: string;
    };
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
    countDown: new interval(
      (data) => {
        console.log(`seconds left ${data.secondLeft}`);
      },
      {
        secondLeft: 10,
      }
    ),
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
    if (value.game.id) {
      switch (value.game.state) {
        case "QUEUE":
          value.game.state = "COUNTDOWN";
          break;
        case "COUNTDOWN":
          alert("start");
          value.game.countDown.start(5000);
          break;
        default:
          return;
      }
    } else {
      if (value.game.state == "PLAYING") {
        value.game.state = "NONE";
        value.game.countDown.stop();
      } else {
        alert("state is " + value.game.state)
      }
    }
    // if (value.game.id && value.game.state == "QUEUE") {
    //   value.game.state = "PLAYING";
    // } else if (!value.game.id && value.game.state == "PLAYING") value.game.state = "NONE";
  },
});
