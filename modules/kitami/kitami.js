const {
  Characteristic,
  CharacteristicEventTypes,
  Service,
} = require("hap-nodejs");

const { KitamiIR } = require("../../controller/shibuya").Shibuya;

class Kitami {
  constructor() {
    this.data = {
      state: true,
      color: 240,
      colorLight: 240, // 制御用
    };
    this.service = new Service.Lightbulb("Kitami", "kitami");
    this.onOffCharacteristic = this.service.getCharacteristic(
      Characteristic.On
    ); // オンオフ
    this.colorCharacteristic = this.service.getCharacteristic(
      Characteristic.ColorTemperature
    ); // 色温度
    // this.brightnessCharacteristic = lightService.getCharacteristic(Characteristic.Brightness); // 明るさ

    this.onOffCharacteristic
      .on(CharacteristicEventTypes.GET, (callback) => {
        callback(undefined, this.data.state);
      })
      .on(CharacteristicEventTypes.SET, (state, callback) => {
        this.data.state = state;
        if (this.data.state) KitamiIR.fullPower();
        else KitamiIR.off();

        callback();
      });

    // brightnessCharacteristic
    // .on(CharacteristicEventTypes.GET, (callback) => {
    //     console.log("[GET] 照度: " + currentBrightnessLevel);
    //     callback(undefined, currentBrightnessLevel);
    // })
    // .on(CharacteristicEventTypes.SET, (value, callback) => {
    //     console.log("[SET] 照度: " + value);
    //     // currentBrightnessLevel = value;
    //     callback();
    // });

    this.colorCharacteristic
      .on(CharacteristicEventTypes.GET, (callback) => {
        callback(undefined, this.data.color);
      })
      .on(CharacteristicEventTypes.SET, (color, callback) => {
        this.data.color = color;
        callback();
      });

    const watchColor = () => {
      if (Math.abs(this.data.colorLight - this.data.color) < 4)
        return setTimeout(watchColor, 300);

      // if(this.data.color < 150) {
      // this.data.color = 140;
      // this.data.colorLight = 140;
      // Light.fullWhite()
      // return setTimeout(watchColor, 260)
      // }
      // if(this.data.color > 490) {
      // this.data.color = 500;
      // this.data.colorLight = 500;
      // Light.fullOrange()
      // return setTimeout(watchColor, 260)
      // }

      if (this.data.color > this.data.colorLight) {
        KitamiIR.changeOrange();
        this.data.colorLight += 4;
        return setTimeout(watchColor, 300);
      }

      if (this.data.color < this.data.colorLight) {
        KitamiIR.changeWhite();
        this.data.colorLight -= 4;
        return setTimeout(watchColor, 300);
      }

      setTimeout(watchColor, 300);
    };

    setTimeout(watchColor, 10);
    setTimeout(() => KitamiIR.fullPower(), 2000);
  }
}

module.exports = new Kitami();
