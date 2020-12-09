const {
  Characteristic,
  CharacteristicEventTypes,
  Service,
} = require("hap-nodejs");
const {CO2_LEVELS_NORMAL, CO2_LEVELS_ABNORMAL} = Characteristic.CarbonDioxideDetected

class Shirasaka {
  constructor(sensor) {
    this.data = 400;
    this.sensor = sensor;
    this.service = new Service.CarbonDioxideSensor("Shirasaka", "shirasaka");
    this.detectedCharacteristic = this.service.getCharacteristic(Characteristic.CarbonDioxideDetected);
    this.levelCharacteristic = this.service.getCharacteristic(Characteristic.CarbonDioxideLevel);

    this.detectedCharacteristic.on(CharacteristicEventTypes.GET, (callback) => {
      callback(undefined, this.data > 1000 ? CO2_LEVELS_ABNORMAL : CO2_LEVELS_NORMAL);
    });
    this.levelCharacteristic.on(CharacteristicEventTypes.GET, (callback) => {
      callback(undefined, this.data);
    });

    this.sensor.on("data", (data) => {
      const co2 = Number(data.toString().split(",")[2])
      if (Number.isFinite(co2)) this.data = co2
    });
  }
}

module.exports = Shirasaka
