import { Categories } from "hap-nodejs";
import * as git from "git-rev-sync";
import KohinataAccessory from "../../abstract/accessory";

import santaclaus from "./santaclaus";

class SantaclausAccessory extends KohinataAccessory {
  constructor() {
    super("Santaclaus", "net.mizucoffee.kohinata.santaclaus")

    this.setManufacturer("mizucoffee");
    this.setModel("Santaclaus");
    this.setSerialNumber(`santaclaus_${git.short()}`);
    this.setFirmwareRevision(process.env.npm_package_version)

    this.accessory.addService(santaclaus.service);
  }

  publish() {
    this.accessory.publish({
      username: "A8:A1:59:31:F1:68",
      pincode: "081-56-080",
      port: 47150,
      category: Categories.FAN,
    });
  }
}

export default SantaclausAccessory