const { Accessory, Categories, Characteristic, Service, uuid } = require("hap-nodejs");
const git = require("git-rev-sync")

const asari = require("./asari");
const moroboshi = require("./moroboshi");
const shiomi = require("./shiomi");
const shirasaka = require("./shirasaka");

const accessoryUuid = uuid.generate("net.mizucoffee.kohinata.sakuma");
const accessory = new Accessory("Sakuma", accessoryUuid);

accessory
  .getService(Service.AccessoryInformation)
  .setCharacteristic(Characteristic.Manufacturer, "mizucoffee")
  .setCharacteristic(Characteristic.Model, "Sakuma")
  .setCharacteristic(Characteristic.SerialNumber, `sakuma_${git.short()}`)
  .setCharacteristic(
    Characteristic.FirmwareRevision,
    require("../../package.json").version
  );

accessory.addService(shiomi.service); // 温度
accessory.addService(asari.service); // 湿度
accessory.addService(shirasaka.service); // CO2
accessory.addService(moroboshi.service); // 照度

accessory.publish({
  username: "A8:A1:59:31:F1:42",
  pincode: "078-54-080",
  port: 47130,
  category: Categories.SENSOR,
});
