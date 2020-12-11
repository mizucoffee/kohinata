const {
  Characteristic,
  CharacteristicEventTypes,
  Service,
} = require("hap-nodejs");
const sakuma = require("../../controller/sakuma");

class Shiomi {
  constructor() {
    this.service = new Service.TemperatureSensor("Shiomi", "shiomi");
    this.characteristic = this.service.getCharacteristic(Characteristic.CurrentTemperature);

    this.characteristic.on(CharacteristicEventTypes.GET, (callback) => {
      callback(undefined, sakuma.temp);
    });
  }
}

module.exports = new Shiomi()
