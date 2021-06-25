import { Characteristic, CharacteristicEventTypes, Service } from "hap-nodejs";

import KohinataService from "../../abstract/service";
import kurosaki from "../../controller/kurosaki";

class Hori extends KohinataService {

  constructor() {
    super(new Service.WindowCovering("Hori", "hori"));
    this.addCurrentPosition()
    this.addTargetPosition()
  }

  private addCurrentPosition() {
    const chara = this.addChara("current", Characteristic.CurrentPosition, 100);
    chara.on(CharacteristicEventTypes.GET, (callback) => {
      callback(undefined, this.data["current"]);
    })
    setInterval(() => this.updateValue("current", kurosaki.position), 1000)
  }

  private addTargetPosition() {
    const chara = this.addChara("target", Characteristic.TargetPosition, 100);
    chara.on(CharacteristicEventTypes.GET, (callback) => {
      callback(undefined, this.data["target"]);
    })
    chara.on(CharacteristicEventTypes.SET, (state, callback) => {
      this.data['target'] = state;
      kurosaki.setPosition(this.data['target']);
      callback();
    });
  }
}

export default new Hori();
