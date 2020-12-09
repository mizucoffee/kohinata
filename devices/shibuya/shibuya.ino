#include <IRremoteESP8266.h>
#include <IRsend.h>

IRsend irsend(4);

uint64_t str2uint64(String str) {
  uint64_t val = 0;
  for (int i = 0; i < str.length(); i++)
  {
    val = val * 16 + str[i];
    if ('a' <= str[i])
      val -= 'a' - 10;
    else if ('A' <= str[i])
      val -= 'A' - 10;
    else
      val -= '0';
  }
  return val;
}

void sendPana(uint64_t data) {
  irsend.sendGeneric(3450, 1700, 450, 1300, 450, 450, 450, 0, data, 40, 38, true, 0, 50);
}

void setup() {
  irsend.begin();
  Serial.begin(115200);
}

void loop() {
  while (Serial.available() == 0);
  String n = Serial.readStringUntil('\n');

  sendPana(str2uint64(n));
  Serial.println("Sended!");
}
