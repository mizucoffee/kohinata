const {
  Accessory,
  Categories,
  Characteristic,
  Service,
  uuid,
} = require("hap-nodejs");
const git = require("git-rev-sync")
const IchinoseAC = require("./ichinose");

const accessoryUuid = uuid.generate("net.mizucoffee.kohinata.ichinose");
const accessory = new Accessory("Ichinose", accessoryUuid);

accessory
  .getService(Service.AccessoryInformation)
  .setCharacteristic(Characteristic.Manufacturer, "mizucoffee")
  .setCharacteristic(Characteristic.Model, "Ichinose")
  .setCharacteristic(Characteristic.SerialNumber, `ichinose_${git.short()}`)
  .setCharacteristic(
    Characteristic.FirmwareRevision,
    require("../../package.json").version
  );

const ichinoseAc = new IchinoseAC();
accessory.addService(ichinoseAc.service); // 空調

accessory.publish({
  username: "A8:A1:59:31:F1:45",
  pincode: "083-57-082",
  port: 47127,
  category: Categories.AIR_CONDITIONER,
});
