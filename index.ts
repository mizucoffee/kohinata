import Kitami from "./src/modules/kitami";
import Ichinose from "./src/modules/ichinose";
import Sakuma from "./src/modules/sakuma";
// import Hori from "./src/modules/hori";
import Totoki from "./src/modules/totoki";
import Santaclaus from "./src/modules/santaclaus";

const kitami = new Kitami()
const ichinose = new Ichinose()
const sakuma = new Sakuma()
// const hori = new Hori()
const totoki = new Totoki()
const santaclaus = new Santaclaus()

kitami.publish()
ichinose.publish()
sakuma.publish()
// hori.publish()
totoki.publish()
santaclaus.publish()

console.log("Accessory setup finished!");
