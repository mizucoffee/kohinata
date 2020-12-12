import { Categories } from "hap-nodejs";
import * as git from "git-rev-sync";
import KohinataAccessory from "../../abstract/accessory";

import kitami from "./kitami";
import sagikawa from "./sagisawa";

class KitamiAccessory extends KohinataAccessory {
  constructor() {
    super("Kitami", "net.mizucoffee.kohinata.kitami")

    this.setManufacturer("mizucoffee");
    this.setModel("Kitami");
    this.setSerialNumber(`kitami_${git.short()}`);
    this.setFirmwareRevision(process.env.npm_package_version)

    kitami.on("on", state => {
      if(state) sagikawa.updateValue("on", false);
    })
    sagikawa.on("nightlight", state => {
      if(state) kitami.updateValue("on", false);
    })

    this.accessory.addService(kitami.service); // 照明
    this.accessory.addService(sagikawa.service); // 常夜灯
  }

  publish() {
    this.accessory.publish({
      username: "A8:A1:59:31:F1:48",
      pincode: "080-56-081",
      port: 47129,
      category: Categories.LIGHTBULB,
    });
  }
}

export default KitamiAccessory