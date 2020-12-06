const {
  Accessory,
  Categories,
  Characteristic,
  CharacteristicEventTypes,
  Service,
  uuid,
} = require("hap-nodejs");
const Light = require("./light");

const accessoryUuid = uuid.generate("net.mizucoffee.kohinata.kitami");
const accessory = new Accessory("Kitami Light", accessoryUuid);

accessory
  .getService(Service.AccessoryInformation)
  .setCharacteristic(Characteristic.Manufacturer, "mizucoffee")
  .setCharacteristic(Characteristic.Model, "Kitami")
  .setCharacteristic(Characteristic.SerialNumber, "kitami_2020_12_07_0001")
  .setCharacteristic(
    Characteristic.FirmwareRevision,
    require("../package.json").version
  );

const lightService = new Service.Lightbulb("Ceiling Light", "ceiling");
const nightService = new Service.Lightbulb("Night Light", "night");

const onOff = lightService.getCharacteristic(Characteristic.On); // オンオフ
const color = lightService.getCharacteristic(Characteristic.ColorTemperature); // 色温度
// const brightnessCharacteristic = lightService.getCharacteristic(Characteristic.Brightness); // 明るさ
const nightOn = nightService.getCharacteristic(Characteristic.On);

let currentLightState = true;
let currentNightLightState = false;
let currentColor = 240;
let currentColorLight = 240;

onOff
  .on(CharacteristicEventTypes.GET, (callback) => {
    console.log("[GET] 照明: " + currentLightState);
    callback(undefined, currentLightState);
  })
  .on(CharacteristicEventTypes.SET, (value, callback) => {
    console.log("[SET] 照明: " + value);
    currentLightState = value;
    if (currentLightState) Light.fullPower();
    else Light.off();
    callback();
  });

// brightnessCharacteristic
//   .on(CharacteristicEventTypes.GET, (callback) => {
//     console.log("[GET] 照度: " + currentBrightnessLevel);
//     callback(undefined, currentBrightnessLevel);
//   })
//   .on(CharacteristicEventTypes.SET, (value, callback) => {
//     console.log("[SET] 照度: " + value);
//     // currentBrightnessLevel = value;
//     callback();
//   });

color
  .on(CharacteristicEventTypes.GET, (callback) => {
    console.log("[GET] 色温度: " + currentColor);
    callback(undefined, currentColor);
  })
  .on(CharacteristicEventTypes.SET, (value, callback) => {
    console.log("[SET] 色温度: " + value);
    currentColor = value;
    callback();
  });

nightOn
  .on(CharacteristicEventTypes.GET, (callback) => {
    console.log("[GET] 常夜灯: " + currentNightLightState);
    callback(undefined, currentNightLightState);
  })
  .on(CharacteristicEventTypes.SET, (value, callback) => {
    console.log("[SET] 常夜灯: " + value);
    currentNightLightState = value;
    if (currentNightLightState) {
      currentLightState = false;
      Light.nightLight();
    } else Light.off();
    callback();
  });

function watchColor() {
  if (Math.abs(currentColorLight - currentColor) < 4)
    return setTimeout(watchColor, 50);
  console.log("照明: " + currentColorLight, "設定: " + currentColor);

  // if(currentColor < 150) {
  //   currentColor = 140;
  //   currentColorLight = 140;
  //   Light.fullWhite()
  //   return setTimeout(watchColor, 260)
  // }
  // if(currentColor > 490) {
  //   currentColor = 500;
  //   currentColorLight = 500;
  //   Light.fullOrange()
  //   return setTimeout(watchColor, 260)
  // }

  if (currentColor > currentColorLight) {
    Light.changeOrange();
    currentColorLight += 4;
    return setTimeout(watchColor, 300);
  }

  if (currentColor < currentColorLight) {
    Light.changeWhite();
    currentColorLight -= 4;
    return setTimeout(watchColor, 300);
  }

  setTimeout(watchColor, 300);
}
setTimeout(watchColor, 10);

accessory.addService(lightService);
accessory.publish({
  username: "A8:A1:59:31:F1:48",
  pincode: "082-57-082",
  port: 47129,
  category: Categories.LIGHTBULB,
});

setTimeout(() => Light.fullPower(), 2000)

// 全灯 - 30 - 白 = 260K
// 白 = 140K
// 橙 = 500K
// 橙 - 90 - 白
// 1ステップ4ケルビン