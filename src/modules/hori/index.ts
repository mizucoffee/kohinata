import { Categories } from "hap-nodejs";
import * as git from "git-rev-sync";
import KohinataAccessory from "../../abstract/accessory";
import hori from "./hori";

class HoriAccessory extends KohinataAccessory {
  constructor() {
    super("Hori", "net.mizucoffee.kohinata.hori");

    this.setManufacturer("mizucoffee");
    this.setModel("Hori");
    this.setSerialNumber(`hori_${git.short()}`);
    this.setFirmwareRevision(process.env.npm_package_version);

    this.accessory.addService(hori.service); // カーテン
  }

  publish() {
    this.accessory.publish({
      username: "A8:A1:59:31:F1:55",
      pincode: "081-58-080",
      port: 47128,
      category: Categories.WINDOW_COVERING,
    });
  }
}

export default HoriAccessory;
