
import { Categories } from "hap-nodejs";
import * as git from "git-rev-sync";
import KohinataAccessory from "../../abstract/accessory";

import asari from "./asari";
import moroboshi from "./moroboshi";
import shiomi from "./shiomi";
import shirasaka from "./shirasaka";

class SakumaAccessory extends KohinataAccessory {
  constructor() {
    super("Sakuma", "net.mizucoffee.kohinata.sakuma")

    this.setManufacturer("mizucoffee");
    this.setModel("Sakuma");
    this.setSerialNumber(`sakuma_${git.short()}`);
    this.setFirmwareRevision(process.env.npm_package_version)

    this.accessory.addService(shiomi.service); // 温度
    this.accessory.addService(asari.service); // 湿度
    this.accessory.addService(shirasaka.service); // CO2
    this.accessory.addService(moroboshi.service); // 照度
  }

  publish() {
    this.accessory.publish({
      username: "A8:A1:59:31:F1:42",
      pincode: "078-54-080",
      port: 47130,
      category: Categories.SENSOR,
    });    
  }
}

export default SakumaAccessory
