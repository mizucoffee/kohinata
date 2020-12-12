import { Characteristic, CharacteristicEventTypes, Service } from "hap-nodejs";

import KohinataService from "../../abstract/service";
import sakuma from "../../controller/sakuma";

class Shiomi extends KohinataService {
  constructor() {
    super(new Service.TemperatureSensor("Shiomi", "shiomi"))
    this.addTemp()
  }

  private addTemp() {
    const chara = this.addChara("temp", Characteristic.CurrentTemperature);
    chara.on(CharacteristicEventTypes.GET, (callback) => {
      callback(undefined, sakuma.temp);
    })
    setInterval(() => this.updateValue("temp", sakuma.temp), 1000)
  }
}

export default new Shiomi()

