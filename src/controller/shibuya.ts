import axios from "axios";

function send(data: string) {
  axios.post(`http://iot01.l.mizucoffee.com/send?data=${data}`);
}

const ICHINOSE = {
  STATE: {
    ON: "20",
    OFF: "00",
  },
  MODE: {
    HEAT: 0,
    DRY: 1,
    COOL: 2,
  },
  FAN: {
    AUTO: 0,
    QUIET: 6,
    LOW: 1,
    MIDDLE: 2,
    MIDDLE_HIGH: 3,
    HIGH: 4,
  },
  SWING: {
    AUTO: 0,
    S1: 1,
    S2: 2,
    S3: 3,
    S4: 4,
    S5: 5,
    MOVE: 7,
  },
  DRY: {
    LOW: "04",
    MIDDLE: "02",
    HIGH: "00",
  },
};

const Shibuya = {
  KitamiIR: {
    fullPower: () => send("p344A9034A4"),
    off: () => send("p344A90F464"),
    fullWhite: () => send("p344A9C51CD"),
    fullOrange: () => send("p344A9CD14D"),
    changeWhite: () => send("p344A9C0995"),
    changeOrange: () => send("p344A9C8915"),
    nightLight: () => send("p344A9074E4"),
    bright: () => send("p344A9054C4"),
    dark: () => send("p344A90D444"),
  },
  IchinoseIR: {
    send: (on, mode, temp, fan, swing) => {
      let data = "";
      data += on;

      if (mode == ICHINOSE.MODE.HEAT) data += "09";
      if (mode == ICHINOSE.MODE.DRY) data += "11";
      if (mode == ICHINOSE.MODE.COOL) data += "19";

      if (temp % 1 == 0) temp = temp - 16;
      data += `00${parseInt(
        `00000000${Math.floor(temp).toString(2)}`.slice(-8),
        2
      ).toString(16)}`.slice(-2);

      if (mode == ICHINOSE.MODE.HEAT) data += "00";
      if (mode == ICHINOSE.MODE.DRY) data += ICHINOSE.DRY.MIDDLE; // 除湿モード
      if (mode == ICHINOSE.MODE.COOL) data += "06";
     
      let fanData = "11";
      fanData += `000${swing.toString(2)}`.slice(-3);
      fanData += `000${fan.toString(2)}`.slice(-3);
      data += `00${parseInt(fanData, 2).toString(16)}`.slice(-2);

      send(`m${data.toUpperCase()}`);
    },
  },
};

export { Shibuya, ICHINOSE };
