const {
  Characteristic,
  CharacteristicEventTypes,
  Service,
} = require("hap-nodejs");
const sakuma = require("../../controller/sakuma");

class Asari {
  constructor() {
    this.service = new Service.HumiditySensor("Asari", "asari");
    this.characteristic = this.service.getCharacteristic(Characteristic.CurrentRelativeHumidity);

    this.characteristic.on(CharacteristicEventTypes.GET, (callback) => {
      callback(undefined, sakuma.humid);
    });
  }
}

module.exports = new Asari()
