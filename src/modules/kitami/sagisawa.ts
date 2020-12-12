import { Characteristic, CharacteristicEventTypes, Service } from "hap-nodejs";

import KohinataService from "../../abstract/service";
import { Shibuya } from "../../controller/shibuya";

class Sagikawa extends KohinataService {
  constructor() {
    super(new Service.Lightbulb("Sagikawa", "sagikawa"));
    this.addNightLight()
  }

  private addNightLight() {
    const chara = this.addChara("on", Characteristic.On, false);
    chara.on(CharacteristicEventTypes.GET, (callback) => {
      callback(undefined, this.data["on"]);
    })
    chara.on(CharacteristicEventTypes.SET, (state, callback) => {
      this.data["on"] = state;
      this.call("on", state);

      if (this.data["on"]) {
        Shibuya.KitamiIR.nightLight();
      } else {
        Shibuya.KitamiIR.off();
      }
      callback();
    });
  }
}

export default new Sagikawa()
