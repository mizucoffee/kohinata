import { Characteristic, CharacteristicEventTypes, Service } from "hap-nodejs";

import KohinataService from "../../abstract/service";
import sakuma from "../../controller/sakuma";
import { Shibuya, ICHINOSE } from "../../controller/shibuya";

const IchinoseIR = Shibuya.IchinoseIR;

class Ichinose extends KohinataService {  
  oldData = {}

  constructor() {
    super(new Service.HeaterCooler("Ichinose", "ichinose"));
    this.addActive()
    this.addMode()
    this.addTemp()
    this.addRotation()
    this.addSwing()
    this.addTargetHeat()
    this.addTargetCool()
  }

  private addActive() {
    const chara = this.addChara("active", Characteristic.Active, false);
    chara.on(CharacteristicEventTypes.GET, (callback) => {
      callback(undefined, this.data["active"]);
    })
    chara.on(CharacteristicEventTypes.SET, (state, callback) => {
      this.data["active"] = state;
      this.call("active", state);
      this.send();
      callback();
    });
  }

  private addMode() {
    const chara = this.addChara("mode", Characteristic.TargetHeaterCoolerState, 1);
    chara.setProps({ minValue: 1, maxValue: 2 })
    chara.on(CharacteristicEventTypes.GET, (callback) => {
      callback(undefined, this.data["mode"]);
    })
    chara.on(CharacteristicEventTypes.SET, (state, callback) => {
      this.data["mode"] = state;
      this.call("mode", state);
      this.send();
      callback();
    });
  }

  private addTemp() {
    const chara = this.addChara("temp", Characteristic.CurrentTemperature);
    chara.on(CharacteristicEventTypes.GET, (callback) => {
      callback(undefined, sakuma.temp);
    })
    setInterval(() => this.updateValue("temp", sakuma.temp), 1000)
  }

  private addRotation() {
    const chara = this.addChara("rotation", Characteristic.RotationSpeed, 100);
    chara.setProps({ minStep: 20 });
    chara.on(CharacteristicEventTypes.GET, (callback) => {
      callback(undefined, this.data["rotation"]);
    })
    chara.on(CharacteristicEventTypes.SET, (state, callback) => {
      this.data["rotation"] = state;
      this.call("rotation", state);
      this.send();
      callback();
    });
  }

  private addSwing() {
    const chara = this.addChara("swing", Characteristic.SwingMode, 0);
    chara.on(CharacteristicEventTypes.GET, (callback) => {
      callback(undefined, this.data["swing"]);
    })
    chara.on(CharacteristicEventTypes.SET, (state, callback) => {
      this.data["swing"] = state;
      this.call("swing", state);
      this.send();
      callback();
    });
  }

  private addTargetHeat() {
    const chara = this.addChara("heat", Characteristic.HeatingThresholdTemperature, 21);
    chara.setProps({ minValue: 16, maxValue: 31 });
    chara.on(CharacteristicEventTypes.GET, (callback) => {
      callback(undefined, this.data["heat"]);
    })
    chara.on(CharacteristicEventTypes.SET, (state, callback) => {
      this.data["heat"] = state;
      this.call("heat", state);
      this.send();
      callback();
    });
  }

  private addTargetCool() {
    const chara = this.addChara("cool", Characteristic.CoolingThresholdTemperature, 21);
    chara.setProps({ minValue: 16, maxValue: 31 });
    chara.on(CharacteristicEventTypes.GET, (callback) => {
      callback(undefined, this.data["cool"]);
    })
    chara.on(CharacteristicEventTypes.SET, (state, callback) => {
      this.data["cool"] = state;
      this.call("cool", state);
      this.send();
      callback();
    });
  }

  isChanged() {
    const res = Object.keys(this.data).some(key => this.oldData[key] != this.data[key])
    this.oldData = Object.assign({}, this.data)
    return res
  }

  send() {
    if(!this.isChanged()) return
    let speed = 0;
    switch(this.data["rotation"]){
      case 0: speed = ICHINOSE.FAN.QUIET; break;
      case 20: speed = ICHINOSE.FAN.LOW; break;
      case 40: speed = ICHINOSE.FAN.MIDDLE; break;
      case 60: speed = ICHINOSE.FAN.MIDDLE_HIGH; break;
      case 80: speed = ICHINOSE.FAN.HIGH; break;
      case 100: speed = ICHINOSE.FAN.AUTO; break;
    }
    IchinoseIR.send(
      this.data["active"] ? ICHINOSE.STATE.ON : ICHINOSE.STATE.OFF,
      this.data["mode"] == 1 ? ICHINOSE.MODE.HEAT : ICHINOSE.MODE.COOL,
      this.data["mode"] == 1 ? this.data["heat"] : this.data["cool"],
      speed,
      this.data["swing"] ? ICHINOSE.SWING.MOVE : ICHINOSE.SWING.AUTO
    )
  }
}

export default new Ichinose();
