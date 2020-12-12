import { Characteristic, CharacteristicEventTypes, Service } from "hap-nodejs";

import KohinataService from "../../abstract/service";
import sakuma from "../../controller/sakuma";

const { CO2_LEVELS_NORMAL, CO2_LEVELS_ABNORMAL } = Characteristic.CarbonDioxideDetected

class Shirasaka extends KohinataService {
  constructor() {
    super(new Service.CarbonDioxideSensor("Shirasaka", "shirasaka"))
    this.addCO2Detected()
    this.addCO2Level()
  }

  private addCO2Detected() {
    const chara = this.addChara("co2detected", Characteristic.CarbonDioxideDetected);
    chara.on(CharacteristicEventTypes.GET, (callback) => {
      callback(undefined, sakuma.co2 > 1000 ? CO2_LEVELS_ABNORMAL : CO2_LEVELS_NORMAL);
    })
    setInterval(() => {
      this.updateValue("co2detected", sakuma.co2 > 1000 ? CO2_LEVELS_ABNORMAL : CO2_LEVELS_NORMAL);
    }, 1000)
  }

  private addCO2Level() {
    const chara = this.addChara("co2level", Characteristic.CarbonDioxideLevel);
    chara.on(CharacteristicEventTypes.GET, (callback) => {
      callback(undefined, sakuma.co2);
    })
    setInterval(() => this.updateValue("co2level", sakuma.co2), 1000)
  }
}

export default new Shirasaka()
