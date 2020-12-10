#include <IRremoteESP8266.h>
#include <IRsend.h>
#include <ir_Mitsubishi.h>

IRsend irsend(4);
IRMitsubishiAC m(4, false, true);

uint64_t str2uint64(String str) {
  uint64_t val = 0;
  for (int i = 0; i < str.length(); i++)
    val = val * 16 + char2uint8(str[i]);
  return val;
}

uint8_t char2uint8(char c) {
  if ('a' <= c) return c - 'a' + 10;
  if ('A' <= c) return c - 'A' + 10;
  return c - '0';
}

void sendPanasonic(String data) {
  irsend.sendGeneric(3450, 1700, 450, 1300, 450, 450, 450, 0, str2uint64(data), 40, 38, true, 0, 50);
}

void sendMitsubishi(String data) {
  if(data.length() % 2 != 0) return;
  uint8_t state[18] = {0x23, 0xCB, 0x26, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00};

  for (int i = 0; i < data.length() / 2; i++)
    state[i+5] = char2uint8(data[i*2]) * 16 + char2uint8(data[i*2+1]);

  m.setRaw(state);
  m.send(0);
}

void setup() {
  irsend.begin();
  Serial.begin(115200);
}

void loop() {
  while (Serial.available() == 0);
  String n = Serial.readStringUntil('\n');

  char type = n[0];
  String data = n.substring(1);

  switch (type) {
    case 'm':
      Serial.println("Send Mitsubishi Code");
      sendMitsubishi(data);
      break;
    case 'p':
      Serial.println("Send Panasonic Code");
      sendPanasonic(data);
      break;
    default:
      Serial.println("Unknown Code");
  }
}