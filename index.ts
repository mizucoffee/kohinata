import Kitami from "./src/modules/kitami";
import Ichinose from "./src/modules/ichinose";
import Sakuma from "./src/modules/sakuma";
import Hori from "./src/modules/hori";

const kitami = new Kitami()
const ichinose = new Ichinose()
const sakuma = new Sakuma()
const hori = new Hori()

kitami.publish()
ichinose.publish()
sakuma.publish()
hori.publish()

console.log("Accessory setup finished!");
