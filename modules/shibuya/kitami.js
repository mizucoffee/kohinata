const {
  Characteristic,
  CharacteristicEventTypes,
  Service,
} = require("hap-nodejs");
const SerialPort = require("serialport");

class Light {
  constructor() {
    this.port = new SerialPort("COM9", { baudRate: 115200 });
  }
  fullPower() {
    this.port.write("344A9034A4\n");
  }
  off() {
    this.port.write("344A90F464\n");
  }
  fullWhite() {
    this.port.write("344A9C51CD\n");
  }
  fullOrange() {
    this.port.write("344A9CD14D\n");
  }
  changeWhite() {
    this.port.write("344A9C0995\n");
  }
  changeOrange() {
    this.port.write("344A9C8915\n");
  }
  nightLight() {
    this.port.write("344A9074E4\n");
  }
}

class Kitami {
  constructor() {
    this.data = {
      state: true,
      color: 240,
      colorLight: 240, // 制御用
    };
    this.light = new Light();
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
        if (this.data.state) this.light.fullPower();
        else this.light.off();

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
        this.light.changeOrange();
        this.data.colorLight += 4;
        return setTimeout(watchColor, 300);
      }

      if (this.data.color < this.data.colorLight) {
        this.light.changeWhite();
        this.data.colorLight -= 4;
        return setTimeout(watchColor, 300);
      }

      setTimeout(watchColor, 300);
    };

    setTimeout(watchColor, 10);
    setTimeout(() => this.light.fullPower(), 2000);
  }
}

module.exports = Kitami;
