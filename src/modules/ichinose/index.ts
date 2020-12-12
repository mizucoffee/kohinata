import { Categories } from "hap-nodejs";
import * as git from "git-rev-sync";
import KohinataAccessory from "../../abstract/accessory";
import ichinose from "./ichinose";

class IchinoseAccessory extends KohinataAccessory {
  constructor() {
    super("Ichinose", "net.mizucoffee.kohinata.ichinose");

    this.setManufacturer("mizucoffee");
    this.setModel("Ichinose");
    this.setSerialNumber(`ichinose_${git.short()}`);
    this.setFirmwareRevision(process.env.npm_package_version);

    this.accessory.addService(ichinose.service); // 空調
  }

  publish() {
    this.accessory.publish({
      username: "A8:A1:59:31:F1:45",
      pincode: "083-57-082",
      port: 47127,
      category: Categories.AIR_CONDITIONER,
    });
  }
}

export default IchinoseAccessory;
