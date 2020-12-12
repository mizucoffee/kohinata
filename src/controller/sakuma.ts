const axios = require("axios")

class Sakuma {
  temp = 20;
  humid = 20;
  co2 = 400;
  lux = 300;
  
  constructor() {
    const update = () => {
      axios.get('http://192.168.101.201/data').then(res => {
        this.temp = res.data.temp;
        this.humid = res.data.humid;
        this.co2 = res.data.co2;
        this.lux = res.data.lux;
        setTimeout(update, 1000)
      }).catch(e => {
        console.log(e.name)
        setTimeout(update, 1000)
      })
    }
    update()
  }
}

export default new Sakuma();