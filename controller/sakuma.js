const axios = require("axios")

class Sakuma {
  constructor() {
    this.temp = 20;
    this.humid = 20;
    this.co2 = 400;
    this.lux = 300;

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

module.exports = new Sakuma();