import { Characteristic, CharacteristicEventTypes, Service } from "hap-nodejs";
const GET = CharacteristicEventTypes.GET;
import KohinataService from "../../abstract/service";
import sakuma from "../../controller/sakuma";

class Asari extends KohinataService {
  constructor() {
    super(new Service.HumiditySensor("Asari", "asari"))
    this.addHumid()
  }

  private addHumid() {
    const chara = this.addChara("humid", Characteristic.CurrentRelativeHumidity);
    chara.on(GET, (callback) => {
      callback(undefined, sakuma.humid);
    })
    setInterval(() => this.updateValue("humid", sakuma.humid), 1000)
  }
}

export default new Asari()
