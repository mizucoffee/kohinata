import { Characteristic, CharacteristicEventTypes, Service } from "hap-nodejs";

import KohinataService from "../../abstract/service";
import Sakurai from "../../controller/sakurai";

class Kitami extends KohinataService {

  constructor() {
    super(new Service.Lightbulb("Totoki", "totoki"));
    this.addOn();
  }

  private addOn() {
    const chara = this.addChara("on", Characteristic.On, false);
    chara.on(CharacteristicEventTypes.GET, (callback) => {
      callback(undefined, this.data["on"]);
    })
    chara.on(CharacteristicEventTypes.SET, (state, callback) => {
      Sakurai.push(0).then(res => {
        callback();
        this.data["on"] = state;
        this.call("on", state);
      }).catch(e => {
        callback();
      })
    });
  }
}

export default new Kitami();
