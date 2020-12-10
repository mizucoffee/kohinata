const {
  Characteristic,
  CharacteristicEventTypes,
  Service,
} = require("hap-nodejs");

class Moroboshi {
  constructor() {
    this.data = 300;
    this.service = new Service.LightSensor("Moroboshi", "moroboshi");
    this.characteristic = this.service.getCharacteristic(Characteristic.CurrentAmbientLightLevel);

    this.characteristic.on(CharacteristicEventTypes.GET, (callback) => {
      callback(undefined, this.data);
    });

  }
  
  setSensor(sensor) {
    this.sensor = sensor;
    this.sensor.on("data", (data) => {
      const lux = parseFloat(data.toString().split(",")[3])
      if (Number.isFinite(lux)) this.data = lux
    });
  }
}

module.exports = new Moroboshi()
