#include <WiFi.h>
#include <WiFiClient.h>
#include <WebServer.h>
#include <M5Stack.h>
#include "ESP32Servo.h"
#include "wifi_info.h"

#define COUNT 100;

IPAddress local_IP(192, 168, 105, 12);
IPAddress gateway(192, 168, 104, 1);
IPAddress subnet(255, 255, 254, 0);
IPAddress primaryDNS(8, 8, 8, 8);
IPAddress secondaryDNS(8, 8, 4, 4);

WebServer server(80);
Servo servo1;
Servo servo2;
volatile int a = 0;
volatile int b = 0;
String hostname = "iot03";

void setup() {
  M5.begin();

  WiFi.config(local_IP, gateway, subnet, primaryDNS, secondaryDNS);
  WiFi.mode(WIFI_STA);
  WiFi.setHostname(hostname.c_str());
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) delay(500);
  
  servo1.attach(21,500,2100);
  servo2.attach(17,500,2100);

  server.on("/", []() {
    server.send(200, "text/plain", "Wall Switch Control Service Sakurai");
  });
  server.on("/push", []() {
    if(server.method() != HTTP_POST) return server.send(404, "text/plain", "404 Not found");
    if(!server.hasArg("data")) return server.send(400, "text/plain", "400 Invalid request");
    if(server.arg("data") == "0") a = COUNT;
    if(server.arg("data") == "1") b = COUNT;
    server.send(200, "text/plain", "200 Ok");
  });
  server.onNotFound([]() {
    server.send(404, "text/plain", "404 Not found");
  });
  server.begin();

  xTaskCreatePinnedToCore(serverHandler, "serverHandler", 4096, NULL, 1, NULL, 0);

  M5.Lcd.clear(BLACK);
  M5.Lcd.setTextColor(YELLOW);
  M5.Lcd.setTextSize(2);
  M5.Lcd.setCursor(45, 10);
  M5.Lcd.println("Wall Switch Sakurai");
  M5.Lcd.setCursor(3, 35);
  M5.Lcd.println("Press button A to Light");
  M5.Lcd.println("Press button B to Vent fan");
  M5.Lcd.println("");
  M5.Lcd.println(WiFi.localIP());
  M5.Lcd.setTextColor(RED);
}

void loop() {
  M5.update();
 
  if(M5.BtnA.isPressed()) a = COUNT;
  if(M5.BtnB.isPressed()) b = COUNT;

  servo1.write(a > 0 ? 130 : 180);
  servo2.write(b > 0 ? 120 : 180);

  a--;
  b--;
  delay(2);
}

void serverHandler(void *pvParameters) {
  while (1) {
    server.handleClient();
    delay(1);
  }
}
