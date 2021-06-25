#include <WiFi.h>
#include <WiFiClient.h>
#include <WebServer.h>
#include <M5Stack.h>
#include "Lemonade.h"
#include "wifi_info.h"

IPAddress local_IP(192, 168, 101, 202);
IPAddress gateway(192, 168, 101, 129);
IPAddress subnet(255, 255, 255, 128);
IPAddress primaryDNS(8, 8, 8, 8);
IPAddress secondaryDNS(8, 8, 4, 4);

WebServer server(80);
Lemonade lemonade;

int PUL=16;
int DIR=17;

volatile int target = 100;
volatile int current = 100;

void setup() {
  pinMode (PUL, OUTPUT);
  pinMode (DIR, OUTPUT);
  dacWrite(25,0);
  
  M5.begin();
  lemonade.begin();
  WiFi.config(local_IP, gateway, subnet, primaryDNS, secondaryDNS);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  lemonade.setMenuTextBtnA("ＵＰ");
  lemonade.setDisabledBtnB(true);
  lemonade.setMenuTextBtnC("ＤＯＷＮ");
  lemonade.showLoading("ＬＯＡＤＩＮＧ");
  M5.Lcd.setTextSize(3);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
  server.on("/", []() {
    server.send(200, "text/plain", "Window Blind Control Service Kurosaki");
  });
  server.on("/position", []() {
    if(server.method() == HTTP_GET) {
      server.send(200, "application/json", "{\"ok\": true, \"position\": " + String(current) + "}");
    }
    if(server.method() == HTTP_POST) {
      if(!server.hasArg("target")) return server.send(400, "text/plain", "400 Invalid request");
      int t = server.arg("target").toInt();
      if(t > 100 || t < 0) return server.send(400, "text/plain", "400 Invalid request");
      target = t;
      server.send(200, "application/json", "{\"ok\": true}");
    }
  });
  server.on("/pulse", []() {
    if(server.method() != HTTP_POST) return server.send(404, "text/plain", "404 Not found");
    if(!server.hasArg("direction")) return server.send(400, "text/plain", "400 Invalid request");
    if(!server.hasArg("pulse")) return server.send(400, "text/plain", "400 Invalid request");
    int d = server.arg("direction").toInt();
    int p = server.arg("pulse").toInt();

    digitalWrite(DIR,d);
    for(int i = 0; i < p; i++){
      digitalWrite(PUL,HIGH);
      delayMicroseconds(50);
      digitalWrite(PUL,LOW);
      delayMicroseconds(50);
    }
    
    server.send(200, "application/json", "{\"ok\": true}");
  });
  server.onNotFound([]() {
    server.send(404, "text/plain", "404 Not found");
  });
  server.begin();
  xTaskCreatePinnedToCore(serverHandler, "serverHandler", 4096, NULL, 1, NULL, 0);

  lemonade.reset();
}

void loop() {
  lemonade.update();
  if(target - current < 0) { // DOWN
    digitalWrite(DIR,HIGH);
    for(int j = 0; j < 1200; j++){
      digitalWrite(PUL,HIGH);
      delayMicroseconds(50);
      digitalWrite(PUL,LOW);
      delayMicroseconds(50);
    }
    current--;
  } else if (target - current > 0) { // UP
    digitalWrite(DIR,LOW);
    for(int j = 0; j < 1200; j++){
      digitalWrite(PUL,HIGH);
      delayMicroseconds(50);
      digitalWrite(PUL,LOW);
      delayMicroseconds(50);
    }
    current++;
  }
  M5.Lcd.setCursor(0, 90);
  M5.Lcd.printf("  POS  : %d \r\n", current);
}

void serverHandler(void *pvParameters) {
  while (1) {
    server.handleClient();
    delay(1);
  }
}
