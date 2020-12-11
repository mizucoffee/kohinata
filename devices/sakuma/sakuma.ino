#include <WiFi.h>
#include <WiFiClient.h>
#include <WebServer.h>
#include <Wire.h>
#include <MHZ19.h>
#include <ClosedCube_HDC1080.h>
#include <ClosedCube_OPT3001.h>
#include "wifi_info.h"

IPAddress local_IP(192, 168, 101, 201);
IPAddress gateway(192, 168, 101, 129);
IPAddress subnet(255, 255, 255, 128);
IPAddress primaryDNS(8, 8, 8, 8);
IPAddress secondaryDNS(8, 8, 4, 4);

WebServer server(80);

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
void setup(void) {
  Serial2.begin(9600);

  myMHZ19.begin(Serial2); // 二酸化炭素センサ
  hdc1080.begin(0x40);    // 温度/湿度センサ
  opt3001.begin(0x44);    // 周辺光センサ

  configureSensor();

  WiFi.config(local_IP, gateway, subnet, primaryDNS, secondaryDNS);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
  server.on("/", []() {
    server.send(200, "text/plain", "Environment Sensor Service Sakuma");
  });
  server.on("/data", []() {
    if(server.method() != HTTP_GET) return server.send(404, "text/plain", "404 Not found");

    String temp = String(hdc1080.readTemperature());
    String humid = String(hdc1080.readHumidity());
    String co2 = String(myMHZ19.getCO2());
    String lux = String(opt3001.readResult().lux);
    server.send(200, "application/json", "{\"temp\":" + temp + ", \"humid\":" + humid + ", \"co2\":" + co2 + ", \"lux\":" + lux + "}");
  });
  server.onNotFound([]() {
    server.send(404, "text/plain", "404 Not found");
  });
  server.begin();
}

void loop(void) {
  server.handleClient();
}
