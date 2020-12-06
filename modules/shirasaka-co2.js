const {
  Accessory,
  Categories,
  Characteristic,
  CharacteristicEventTypes,
  Service,
  uuid,
} = require("hap-nodejs");
const SerialPort = require("serialport");
const { Readline } = SerialPort.parsers;

const co2port = new SerialPort("COM4", { baudRate: 115200 });
const parser = co2port.pipe(new Readline({ delimiter: "\n" }));

const accessoryUuid = uuid.generate("net.mizucoffee.kohinata.shirasaka");
const accessory = new Accessory("Shirasaka CO2", accessoryUuid);

accessory
  .getService(Service.AccessoryInformation)
  .setCharacteristic(Characteristic.Manufacturer, "mizucoffee")
  .setCharacteristic(Characteristic.Model, "Shirasaka")
  .setCharacteristic(Characteristic.SerialNumber, "shirasaka_2020_12_07_0001")
  .setCharacteristic(
    Characteristic.FirmwareRevision,
    require("../package.json").version
  );

const co2service = new Service.CarbonDioxideSensor(
  "Shirasaka",
  "shirasaka-co2"
);

const co2level = co2service.getCharacteristic(
  Characteristic.CarbonDioxideLevel
);
const co2detect = co2service.getCharacteristic(
  Characteristic.CarbonDioxideDetected
);

let currentCo2level = 400;

co2level
  .on(CharacteristicEventTypes.GET, (callback) => {
    console.log("[GET] CO2Level: " + currentCo2level);
    callback(undefined, currentCo2level);
  })

co2detect
  .on(CharacteristicEventTypes.GET, (callback) => {
    const stat = currentCo2level > 1000 ? Characteristic.CarbonDioxideDetected.CO2_LEVELS_ABNORMAL : Characteristic.CarbonDioxideDetected.CO2_LEVELS_NORMAL
    console.log("[GET] CO2Detect: " + stat);
    callback(undefined, stat);
  })

parser.on("data", (data) => {
  if (Number.isFinite(Number(data.toString())))
    currentCo2level = Number(data.toString());
});

accessory.addService(co2service);
accessory.publish({
  username: "A8:A1:59:31:F1:42",
  pincode: "065-50-070",
  port: 47130,
  category: Categories.SENSOR,
});
