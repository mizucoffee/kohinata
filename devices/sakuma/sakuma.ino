#include <Wire.h>
#include <MHZ19.h>
#include <ClosedCube_HDC1080.h>
#include <ClosedCube_OPT3001.h>

MHZ19 myMHZ19;
ClosedCube_HDC1080 hdc1080;
ClosedCube_OPT3001 opt3001;

void configureSensor() {
  OPT3001_Config newConfig;

  newConfig.RangeNumber = B1100;
  newConfig.ConvertionTime = B0;
  newConfig.Latch = B1;
  newConfig.ModeOfConversionOperation = B11;

  opt3001.writeConfig(newConfig);
}

void setup() {
  Serial.begin(115200);
  Serial2.begin(9600);

  myMHZ19.begin(Serial2); // 二酸化炭素センサ
  hdc1080.begin(0x40);    // 温度/湿度センサ
  opt3001.begin(0x44);    // 周辺光センサ

  configureSensor();
}

void loop() {
  Serial.print(hdc1080.readTemperature()); // 温度
  Serial.print(",");
  Serial.print(hdc1080.readHumidity()); // 湿度
  Serial.print(",");
  Serial.print(myMHZ19.getCO2()); // CO2
  Serial.print(",");
  Serial.print(opt3001.readResult().lux); // 周辺光
  Serial.println();
  delay(1000);
}
