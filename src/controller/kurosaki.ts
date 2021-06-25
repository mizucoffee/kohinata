import axios from "axios";

class Kurosaki {
  position = 0;
  
  constructor() {
    const update = () => {
      axios.get('http://192.168.101.202/position').then(res => {
        this.position = res.data.position;
        setTimeout(update, 1000)
      }).catch(e => {
        console.log(e)
        setTimeout(update, 1000)
      })
    }
    update()
  }

  setPosition(pos) {
    axios.post(`http://192.168.101.202/position?target=${pos}`);
  }
}

export default new Kurosaki();