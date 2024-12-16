import {
  Accessory,
  Characteristic,
  Service,
  uuid,
} from "hap-nodejs";

abstract class KohinataAccessory {
  accessory: Accessory;
  info: Service;

  constructor(name: string, id: string) {
    this.accessory = new Accessory(name, uuid.generate(id));
    const info = this.accessory.getService(Service.AccessoryInformation) 
    if (!info) throw new Error("AccessoryInformation service not found")
    this.info = info
  }

  protected setManufacturer(manufacturer: string) {
    this.info.setCharacteristic(Characteristic.Manufacturer, manufacturer)
  }

  protected setModel(model: string) {
    this.info.setCharacteristic(Characteristic.Model, model)
  }

  protected setSerialNumber(serialNumber: string) {
    this.info.setCharacteristic(Characteristic.SerialNumber, serialNumber)
  }

  protected setFirmwareRevision(firmwareRevision: string) {
    this.info.setCharacteristic(Characteristic.FirmwareRevision, firmwareRevision)
  }
}

export default KohinataAccessory;
