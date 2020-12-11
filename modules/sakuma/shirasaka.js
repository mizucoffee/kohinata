const {
  Characteristic,
  CharacteristicEventTypes,
  Service,
} = require("hap-nodejs");
const sakuma = require("../../controller/sakuma");
const {CO2_LEVELS_NORMAL, CO2_LEVELS_ABNORMAL} = Characteristic.CarbonDioxideDetected

class Shirasaka {
  constructor() {
    this.service = new Service.CarbonDioxideSensor("Shirasaka", "shirasaka");
    this.detectedCharacteristic = this.service.getCharacteristic(Characteristic.CarbonDioxideDetected);
    this.levelCharacteristic = this.service.getCharacteristic(Characteristic.CarbonDioxideLevel);

    this.detectedCharacteristic.on(CharacteristicEventTypes.GET, (callback) => {
      callback(undefined, sakuma.co2 > 1000 ? CO2_LEVELS_ABNORMAL : CO2_LEVELS_NORMAL);
    });
    this.levelCharacteristic.on(CharacteristicEventTypes.GET, (callback) => {
      callback(undefined, sakuma.co2);
    });
  }
}

module.exports = new Shirasaka()
