const {
  Characteristic,
  CharacteristicEventTypes,
  Service,
} = require("hap-nodejs");
const sakuma = require("../../controller/sakuma");

class Moroboshi {
  constructor() {
    this.service = new Service.LightSensor("Moroboshi", "moroboshi");
    this.characteristic = this.service.getCharacteristic(Characteristic.CurrentAmbientLightLevel);

    this.characteristic.on(CharacteristicEventTypes.GET, (callback) => {
      callback(undefined, sakuma.lux);
    });
  }
}

module.exports = new Moroboshi()
