import Kitami from "./src/modules/kitami";
import Ichinose from "./src/modules/ichinose";
import Sakuma from "./src/modules/sakuma";

const kitami = new Kitami()
const ichinose = new Ichinose()
const sakuma = new Sakuma()

kitami.publish()
ichinose.publish()
sakuma.publish()

console.log("Accessory setup finished!");
