#include <Chrono.h>
#include <M5Stack.h>
#include <MHZ19.h>
#include <Wire.h>

#include "Lemonade.h"

MHZ19 myMHZ19;
Lemonade lemonade;
Chrono chrono;

void setup() {
  pinMode(21, INPUT_PULLUP);
  pinMode(22, INPUT_PULLUP);

  M5.begin();
  Wire.begin();
  lemonade.begin();
  Serial.begin(115200);
  Serial2.begin(9600);
  myMHZ19.begin(Serial2);

  lemonade.setDisabledBtnA(true);
  lemonade.setMenuTextBtnB("ＯＫ");
  lemonade.setMenuTextBtnC("ＭＥＮＵ");
  lemonade.showLoading("ＬＯＡＤＩＮＧ");

  M5.Lcd.setTextSize(3);

  lemonade.reset();
}

void loop() {
  lemonade.update();
  if (chrono.hasPassed(1000)) {
    chrono.restart();
    M5.Lcd.setCursor(0, 90);
    int co2 = myMHZ19.getCO2();
    M5.Lcd.printf("  CO2  : %dppm \r\n", co2);
    Serial.println(co2);
  }
  delay(10);
}
