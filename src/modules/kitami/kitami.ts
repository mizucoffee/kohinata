import { Characteristic, CharacteristicEventTypes, Service } from "hap-nodejs";

import KohinataService from "../../abstract/service";
import { Shibuya } from "../../controller/shibuya";
const KitamiIR = Shibuya.KitamiIR;

class Kitami extends KohinataService {

  constructor() {
    super(new Service.Lightbulb("Kitami", "kitami"));

    this.addOn();
    this.addColor();
    // this.addBrightness();

    // const watchColor = () => {
    //   if (Math.abs(this.data.colorLight - this.data.color) < 4)
    //     return setTimeout(watchColor, 300);

    //   // if(this.data.color < 150) {
    //   // this.data.color = 140;
    //   // this.data.colorLight = 140;
    //   // Light.fullWhite()
    //   // return setTimeout(watchColor, 260)
    //   // }
    //   // if(this.data.color > 490) {
    //   // this.data.color = 500;
    //   // this.data.colorLight = 500;
    //   // Light.fullOrange()
    //   // return setTimeout(watchColor, 260)
    //   // }

    //   if (this.data.color > this.data.colorLight) {
    //     KitamiIR.changeOrange();
    //     this.data.colorLight += 4;
    //     return setTimeout(watchColor, 300);
    //   }

    //   if (this.data.color < this.data.colorLight) {
    //     KitamiIR.changeWhite();
    //     this.data.colorLight -= 4;
    //     return setTimeout(watchColor, 300);
    //   }

    //   setTimeout(watchColor, 300);
    // };

    // setTimeout(watchColor, 10);

    // const watchBrightness = () => {
    //   if (Math.abs(this.data.brightnessLight - this.data.brightness) < 1)
    //     return setTimeout(watchBrightness, 300);

    //   // if(this.data.color < 150) {
    //   // this.data.color = 140;
    //   // this.data.colorLight = 140;
    //   // Light.fullWhite()
    //   // return setTimeout(watchColor, 260)
    //   // }
    //   // if(this.data.color > 490) {
    //   // this.data.color = 500;
    //   // this.data.colorLight = 500;
    //   // Light.fullOrange()
    //   // return setTimeout(watchColor, 260)
    //   // }

    //   if (this.data.brightness > this.data.brightnessLight) {
    //     KitamiIR.bright();
    //     this.data.brightnessLight += 1;
    //     return setTimeout(watchBrightness, 300);
    //   }

    //   if (this.data.brightness < this.data.brightnessLight) {
    //     KitamiIR.dark();
    //     this.data.brightnessLight -= 1;
    //     return setTimeout(watchBrightness, 300);
    //   }

    //   setTimeout(watchBrightness, 300);
    // };

    // setTimeout(watchBrightness, 10);
    setTimeout(() => KitamiIR.fullPower(), 2000);
  }

  private addOn() {
    const chara = this.addChara("on", Characteristic.On, true);
    chara.on(CharacteristicEventTypes.GET, (callback) => {
      callback(undefined, this.data["on"]);
    })
    chara.on(CharacteristicEventTypes.SET, (state, callback) => {
      this.data["on"] = state;
      this.call("on", state);
      if (this.data["on"]) {
        KitamiIR.fullPower();
      } else {
        KitamiIR.off();
      }
      callback();
    });
  }

  private addColor() {
    const chara = this.addChara("color", Characteristic.ColorTemperature, 240);
    chara.on(CharacteristicEventTypes.GET, (callback) => {
      callback(undefined, this.data["color"]);
    })
    chara.on(CharacteristicEventTypes.SET, (state, callback) => {
      this.data["color"] = state;
      callback();
    });
  }

  private addBrightness() {
    const chara = this.addChara("brightness", Characteristic.Brightness, 90);
    chara.setProps({
      minValue: 0,
      maxValue: 90,
    });
    chara.on(CharacteristicEventTypes.GET, (callback) => {
      callback(undefined, this.data["brightness"]);
    })
    chara.on(CharacteristicEventTypes.SET, (state, callback) => {
      this.data["brightness"] = state;
      callback();
    });
  }
}

export default new Kitami();
