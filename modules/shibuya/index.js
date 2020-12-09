const {
  Accessory,
  Categories,
  Characteristic,
  Service,
  uuid,
} = require("hap-nodejs");
const git = require("git-rev-sync")
const Kitami = require("./kitami");
// const Sagikawa = require("./sagisawa");

const accessoryUuid = uuid.generate("net.mizucoffee.kohinata.shibuya");
const accessory = new Accessory("Shibuya", accessoryUuid);

accessory
  .getService(Service.AccessoryInformation)
  .setCharacteristic(Characteristic.Manufacturer, "mizucoffee")
  .setCharacteristic(Characteristic.Model, "Shibuya")
  .setCharacteristic(Characteristic.SerialNumber, `shibuya_${git.short()}`)
  .setCharacteristic(
    Characteristic.FirmwareRevision,
    require("../../package.json").version
  );

const kitami = new Kitami();
// const sagikawa = new Sagikawa();

accessory.addService(kitami.service); // 照明
// accessory.addService(sagikawa.service); // 常夜灯

accessory.publish({
  username: "A8:A1:59:31:F1:48",
  pincode: "080-56-081",
  port: 47129,
  category: Categories.LIGHTBULB,
});
