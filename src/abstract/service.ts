import { Characteristic, CharacteristicChange, CharacteristicEventTypes, CharacteristicGetCallback, CharacteristicSetCallback, CharacteristicValue, Service, VoidCallback, WithUUID } from "hap-nodejs";

abstract class KohinataService {
  protected characteristics: Map<String, Characteristic> = new Map();
  service: Service;
  private callback: Array<[string, (state: any) => void]> = [];
  protected data: any = {};

  constructor(service: Service) {
    this.service = service;
  }

  addChara(name: string, type: WithUUID<{new (): Characteristic;}>, value?: any) {
    const chara = this.service.getCharacteristic(type);
    this.characteristics.set(name, chara);
    if(value != undefined) this.data[name] = value;
    return chara;
  }

  getChara(name: string) {
    return this.characteristics.get(name);
  }

  onGET(name: string, callback: ((change: CharacteristicChange) => void) | ((cb: CharacteristicGetCallback<CharacteristicValue>, context?: any, connectionID?: string) => void) | ((value: CharacteristicValue, cb: CharacteristicSetCallback, context?: any, connectionID?: string) => void) | VoidCallback) {
    this.characteristics.get(name).on(CharacteristicEventTypes.GET, callback);
  }

  onSET(name: string, callback: ((change: CharacteristicChange) => void) | ((cb: CharacteristicGetCallback<CharacteristicValue>, context?: any, connectionID?: string) => void) | ((value: CharacteristicValue, cb: CharacteristicSetCallback, context?: any, connectionID?: string) => void) | VoidCallback) {
    this.characteristics.get(name).on(CharacteristicEventTypes.SET, callback);
  }

  updateValue(name: string, value: any) {
    this.getChara(name).updateValue(value);
    if(this.data[name] != undefined) this.data[name] = value;
  }

  on(name: string | Array<string>, cb: (state: any) => void) {
    if(typeof name == 'string')
      this.callback.push([name, cb])
    else
      name.forEach(n => this.callback.push([n, cb]))
  }

  protected call(name: string, state: any) {
    this.callback.filter(c => c[0] == name).forEach(c => c[1](state))
  }
}


export default KohinataService;