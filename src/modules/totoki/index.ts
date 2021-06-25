import { Categories } from "hap-nodejs";
import * as git from "git-rev-sync";
import KohinataAccessory from "../../abstract/accessory";

import totoki from "./totoki";

class TotokiAccessory extends KohinataAccessory {
  constructor() {
    super("Totoki", "net.mizucoffee.kohinata.totoki")

    this.setManufacturer("mizucoffee");
    this.setModel("Totoki");
    this.setSerialNumber(`totoki_${git.short()}`);
    this.setFirmwareRevision(process.env.npm_package_version)

    this.accessory.addService(totoki.service);
  }

  publish() {
    this.accessory.publish({
      username: "A8:A1:59:31:F1:61",
      pincode: "086-58-088",
      port: 47139,
      category: Categories.LIGHTBULB,
    });
  }
}

export default TotokiAccessory