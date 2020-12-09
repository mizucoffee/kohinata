const {
  Characteristic,
  CharacteristicEventTypes,
  Service,
} = require("hap-nodejs");

class Asari {
  constructor(sensor) {
    this.data = 20;
    this.sensor = sensor;
    this.service = new Service.HumiditySensor("Asari", "asari");
    this.characteristic = this.service.getCharacteristic(Characteristic.CurrentRelativeHumidity);

    this.characteristic.on(CharacteristicEventTypes.GET, (callback) => {
      callback(undefined, this.data);
    });

    this.sensor.on("data", (data) => {
      const temp = parseFloat(data.toString().split(",")[1])
      if (Number.isFinite(temp)) this.data = temp
    });
  }
}

module.exports = Asari
