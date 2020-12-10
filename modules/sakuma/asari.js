const {
  Characteristic,
  CharacteristicEventTypes,
  Service,
} = require("hap-nodejs");

class Asari {
  constructor() {
    this.data = 20;
    this.service = new Service.HumiditySensor("Asari", "asari");
    this.characteristic = this.service.getCharacteristic(Characteristic.CurrentRelativeHumidity);

    this.characteristic.on(CharacteristicEventTypes.GET, (callback) => {
      callback(undefined, this.data);
    });

  }

  setSensor(sensor) {
    this.sensor = sensor;
    this.sensor.on("data", (data) => {
      const temp = parseFloat(data.toString().split(",")[1])
      if (Number.isFinite(temp)) this.data = temp
    });
  }
}

module.exports = new Asari()
