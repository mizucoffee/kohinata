const SerialPort = require("serialport");
const port = new SerialPort("COM5", { baudRate: 115200 });

module.exports.fullPower = () => {
    port.write("100000011010010100100\n")
}
module.exports.off = () => {
    port.write("100001111010001100100\n")
}
module.exports.fullWhite = () => {
    port.write("111000101000111001101\n")
}
module.exports.fullOrange = () => {
    port.write("111001101000101001101\n")
}
module.exports.changeWhite = () => {
    port.write("111000000100110010101\n")
}
module.exports.changeOrange = () => {
    port.write("111001000100100010101\n")
}
module.exports.nightLight = () => {
    port.write("100000111010011100100\n");
}