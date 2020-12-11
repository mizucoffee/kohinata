#include <WiFi.h>
#include <WiFiClient.h>
#include <WebServer.h>
#include <IRremoteESP8266.h>
#include <IRsend.h>
#include <ir_Mitsubishi.h>
#include "wifi_info.h"

IPAddress local_IP(192, 168, 101, 200);
IPAddress gateway(192, 168, 101, 129);
IPAddress subnet(255, 255, 255, 128);
IPAddress primaryDNS(8, 8, 8, 8);
IPAddress secondaryDNS(8, 8, 4, 4);

WebServer server(80);

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

void setup(void) {
  irsend.begin();
  WiFi.config(local_IP, gateway, subnet, primaryDNS, secondaryDNS);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }

  server.on("/", []() {
    server.send(200, "text/plain", "IR Contoller Service Shibuya");
  });
  server.on("/send", []() {
    if(server.method() != HTTP_POST) return server.send(404, "text/plain", "404 Not found");
    if(!server.hasArg("data")) return server.send(400, "text/plain", "400 Invalid request");
    send(server.arg("data"));
    server.send(200, "text/plain", "200 Ok");
  });
  server.onNotFound([]() {
    server.send(404, "text/plain", "404 Not found");
  });
  server.begin();
}

void loop(void) {
  server.handleClient();
}

String send(String text) {
  char type = text[0];
  String data = text.substring(1);

  switch (type) {
    case 'm':
      sendMitsubishi(data);
      return "mitsubishi";
    case 'p':
      sendPanasonic(data);
      return "mitsubishi";
    default:
      return "unknown";
  }
}