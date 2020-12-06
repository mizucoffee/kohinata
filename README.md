# kohinata
MIzucoffee HOme => miho => miho "kohinata" ?

## 概要
自分の家の家電をHomeKitに対応させるシステムです。   
ユニットはESP32やArduino、Raspberry Piなどを組み合わせて実装しています。   

大体専用の仕組みなので引っ越したら全滅しそう。

## アクセサリ説明

### Kitami
照明をコントロールするアクセサリ。対象の機器は「Panasonic LGBZ2773」。
現時点ではオンオフ、色温度の設定に対応しています。

ユニットはArduinoで実装（更新したい）。

### Shirasaka
CO2を検出するユニット。M5StackをベースにMH-Z19Bセンサで検出。
しきい値である1000ppmを超えるとアラートが上がります。