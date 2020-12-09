const {
  Characteristic,
  CharacteristicEventTypes,
  Service,
} = require("hap-nodejs");

class Shiomi {
  constructor(sensor) {
    this.data = 20;
    this.sensor = sensor;
    this.service = new Service.TemperatureSensor("Shiomi", "shiomi");
    this.characteristic = this.service.getCharacteristic(Characteristic.CurrentTemperature);

    this.characteristic.on(CharacteristicEventTypes.GET, (callback) => {
      callback(undefined, this.data);
    });

    this.sensor.on("data", (data) => {
      const temp = parseFloat(data.toString().split(",")[0])
      if (Number.isFinite(temp)) this.data = temp
    });
  }
}

module.exports = Shiomi
