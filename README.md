# kohinata
Mizucoffee -> coffee -> kōhī => "kohi"nata ?  
MIzucoffee HOme => miho => miho "kohinata" !

## 概要
自分の家の家電をHomeKitに対応させるシステムです。   
ユニットはESP32やRaspberry Piなどを組み合わせて実装しています。   

大体専用の仕組みなので引っ越したら全滅しそう。

## アクセサリ説明

### Shibuya
赤外線で家電を制御するユニット。ESP32をベースに実装。

#### Kitami
照明をコントロールするアクセサリ。対象の機器は「Panasonic LGBZ2773」。
現時点ではオンオフ、色温度の設定に対応しています。

### Sakuma
環境状態を検出するユニット。ESP32をベースに実装。

#### MM-ENV01
- 温度: Shiomi (HDC1080)
- 湿度: Asari (HDC1080)
- 周辺光: Moroboshi (OPT3001)

#### MH-Z19B
- 二酸化炭素: Shirasaka (MH-Z19B)

しきい値である1000ppmを超えるとアラートが上がります。