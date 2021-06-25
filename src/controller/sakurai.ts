import axios from "axios";

class Sakurai {
  push(pos) {
    return axios.post(`http://iot03.l.mizucoffee.com/push?data=${pos}`);
  }
}

export default new Sakurai();