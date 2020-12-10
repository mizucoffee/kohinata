const {
  Characteristic,
  CharacteristicEventTypes,
  Service,
} = require("hap-nodejs");

class Shiomi {
  constructor() {
    this.data = 20;
    this.service = new Service.TemperatureSensor("Shiomi", "shiomi");
    this.characteristic = this.service.getCharacteristic(Characteristic.CurrentTemperature);

    this.characteristic.on(CharacteristicEventTypes.GET, (callback) => {
      callback(undefined, this.data);
    });
  }

  setSensor(sensor) {
    this.sensor = sensor;
    this.sensor.on("data", (data) => {
      const temp = parseFloat(data.toString().split(",")[0])
      if (Number.isFinite(temp)) this.data = temp
    });
  }
}

module.exports = new Shiomi()
