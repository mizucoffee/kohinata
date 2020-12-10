const {
  Characteristic,
  CharacteristicEventTypes,
  Service,
} = require("hap-nodejs");
const { GET, SET } = CharacteristicEventTypes;

const shiomi = require("../sakuma/shiomi");
const Shibuya = require("../shibuya")
const IchinoseIR = Shibuya.Shibuya.IchinoseIR;
const ICHINOSE = Shibuya.ICHINOSE;

class Ichinose {
  constructor(sensor) {    
    this.oldData = {
      active: 0,
      mode: 1,
      speed: 100,
      swing: 0,
      heat: 21,
      cool: 21,
    };
    this.data = {
      active: 0,
      mode: 1,
      speed: 100,
      swing: 0,
      heat: 21,
      cool: 21,
    };
    this.sensor = sensor;
    this.service = new Service.HeaterCooler("Ichinose", "ichinose-ac");
    this.activeCharacteristic = this.service.getCharacteristic(
      Characteristic.Active
    );
    this.thcCharacteristic = this.service.getCharacteristic(
      Characteristic.TargetHeaterCoolerState
    );
    this.tempCharacteristic = this.service.getCharacteristic(
      Characteristic.CurrentTemperature
    );
    this.rotateCharacteristic = this.service.getCharacteristic(
      Characteristic.RotationSpeed
    );
    this.heatTargetCharacteristic = this.service.getCharacteristic(
      Characteristic.HeatingThresholdTemperature
    );
    this.coolTargetCharacteristic = this.service.getCharacteristic(
      Characteristic.CoolingThresholdTemperature
    );
    this.swingTargetCharacteristic = this.service.getCharacteristic(
      Characteristic.SwingMode
    );

    this.thcCharacteristic.setProps({
      minValue: 1,
      maxValue: 2
    })

    this.heatTargetCharacteristic.setProps({
      minValue: 16,
      maxValue: 31,
    });

    this.coolTargetCharacteristic.setProps({
      minValue: 16,
      maxValue: 31,
    });

    this.rotateCharacteristic.setProps({
      minStep: 20,
    });

    const callback = (type) => {
      return (state, cb) => {
        this.data[type] = state;
        this.send();
        cb();
      }
    }

    this.activeCharacteristic
      .on(GET, cb => cb(undefined, this.data.active))
      .on(SET, callback('active'));

    this.thcCharacteristic
      .on(GET, cb => cb(undefined, this.data.mode))
      .on(SET, callback('mode'));

    this.tempCharacteristic
      .on(GET, cb => cb(undefined, shiomi.data))

    this.heatTargetCharacteristic
      .on(GET, cb => cb(undefined, this.data.heat))
      .on(SET, callback('heat'));

    this.coolTargetCharacteristic
      .on(GET, cb => cb(undefined, this.data.cool))
      .on(SET, callback('cool'));

    this.rotateCharacteristic
      .on(GET, cb => cb(undefined, this.data.speed))
      .on(SET, callback('speed'));

    this.swingTargetCharacteristic
      .on(GET, cb => cb(undefined, this.data.swing))
      .on(SET, callback('swing'));
  }

  isChanged() {
    const res = Object.keys(this.data).some(key => this.oldData[key] != this.data[key])
    this.oldData = Object.assign({}, this.data)
    return res
  }

  send() {
    if(!this.isChanged()) return
    let speed = 0;
    switch(this.data.speed){
      case 0: speed = ICHINOSE.FAN.QUIET; break;
      case 20: speed = ICHINOSE.FAN.LOW; break;
      case 40: speed = ICHINOSE.FAN.MIDDLE; break;
      case 60: speed = ICHINOSE.FAN.MIDDLE_HIGH; break;
      case 80: speed = ICHINOSE.FAN.HIGH; break;
      case 100: speed = ICHINOSE.FAN.AUTO; break;
    }
    IchinoseIR.send(
      this.data.active ? ICHINOSE.STATE.ON : ICHINOSE.STATE.OFF,
      this.data.mode == 1 ? ICHINOSE.MODE.HEAT : ICHINOSE.MODE.COOL,
      this.data.mode == 1 ? this.data.heat : this.data.cool,
      speed,
      this.data.swing ? ICHINOSE.SWING.MOVE : ICHINOSE.SWING.AUTO
    )
  }
}

module.exports = Ichinose;
