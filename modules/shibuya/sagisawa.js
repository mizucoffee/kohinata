const {
  Characteristic,
  CharacteristicEventTypes,
  Service,
} = require("hap-nodejs");

class Sagikawa {
  constructor() {
    this.data = false;
    this.service = new Service.Lightbulb("Sagikawa", "sagikawa");
    this.characteristic = this.service.getCharacteristic(Characteristic.On);

    this.characteristic
      .on(CharacteristicEventTypes.GET, (callback) => {
        callback(undefined, this.data);
      })
      .on(CharacteristicEventTypes.SET, (state, callback) => {
        this.data = state;
        if (this.data) Light.nightLight();
        else Light.off();
        callback();
      });
  }
}

module.exports = Sagikawa
