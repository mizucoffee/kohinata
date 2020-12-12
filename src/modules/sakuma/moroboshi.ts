import { Characteristic, CharacteristicEventTypes, Service } from "hap-nodejs";

import KohinataService from "../../abstract/service";
import sakuma from "../../controller/sakuma";

class Moroboshi extends KohinataService {
  constructor() {
    super(new Service.LightSensor("Moroboshi", "moroboshi"))
    this.addIlluminance()
  }

  private addIlluminance() {
    const chara = this.addChara("illuminance", Characteristic.CurrentAmbientLightLevel);
    chara.on(CharacteristicEventTypes.GET, (callback) => {
      callback(undefined, sakuma.lux);
    })
    setInterval(() => this.updateValue("illuminance", sakuma.lux), 1000)
  }
}

export default new Moroboshi()
