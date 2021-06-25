import { Characteristic, CharacteristicEventTypes, Service } from "hap-nodejs";

import KohinataService from "../../abstract/service";
import Sakurai from "../../controller/sakurai";

class Santaclaus extends KohinataService {

  constructor() {
    super(new Service.Fanv2("Santaclaus", "santaclaus"));
    this.addOn();
  }

  private addOn() {
    const chara = this.addChara("on", Characteristic.On, false);
    chara.on(CharacteristicEventTypes.GET, (callback) => {
      callback(undefined, this.data["on"]);
    })
    chara.on(CharacteristicEventTypes.SET, (state, callback) => {
      this.data["on"] = state;
      this.call("on", state);
      Sakurai.push(1)
      callback();
    });
  }
}

export default new Santaclaus();
