const {
  Accessory,
  Categories,
  Characteristic,
  Service,
  uuid,
} = require("hap-nodejs");
const git = require("git-rev-sync")
const kitami = require("./kitami");
// const Sagikawa = require("./sagisawa");

const accessoryUuid = uuid.generate("net.mizucoffee.kohinata.kitami");
const accessory = new Accessory("Kitami", accessoryUuid);

accessory
  .getService(Service.AccessoryInformation)
  .setCharacteristic(Characteristic.Manufacturer, "mizucoffee")
  .setCharacteristic(Characteristic.Model, "Kitami")
  .setCharacteristic(Characteristic.SerialNumber, `kitami_${git.short()}`)
  .setCharacteristic(
    Characteristic.FirmwareRevision,
    require("../../package.json").version
  );

// const sagikawa = new Sagikawa();

accessory.addService(kitami.service); // 照明
// accessory.addService(sagikawa.service); // 常夜灯

accessory.publish({
  username: "A8:A1:59:31:F1:48",
  pincode: "080-56-081",
  port: 47129,
  category: Categories.LIGHTBULB,
});
