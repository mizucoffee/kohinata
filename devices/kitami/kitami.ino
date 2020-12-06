#include <IRremote.h>

unsigned int pana[83] = {3450, 1700, 450, 450, 450, 450, 450, 1300, 450, 1300, 450, 450, 450, 1300, 450, 450, 450, 450, 450, 450, 450, 1300, 450, 450, 450, 450, 450, 1300, 450, 450, 450, 1300, 450, 450, 450, 1300, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450};

IRsend IrSender;

void sendPana(String data) {
  for (int i = 0; i < data.length(); i++) {
    if (data.charAt(i) == '0') {
      pana[i * 2 + 41] = 450;
    } else {
      pana[i * 2 + 41] = 1300;
    }
  };

  IrSender.sendRaw(pana, sizeof(pana) / sizeof(pana[0]), 38);
}

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(115200);
}

void loop() {
  while (Serial.available() == 0);
  String n = Serial.readStringUntil('\n');

  sendPana(n);
  Serial.println("Sended!");
}
