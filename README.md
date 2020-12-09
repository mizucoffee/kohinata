# kohinata
Mizucoffee -> coffee -> kōhī => "kohi"nata ?  
MIzucoffee HOme => miho => miho "kohinata" !

## 概要
自分の家の家電をHomeKitに対応させるシステムです。   
ユニットはESP32やRaspberry Piなどを組み合わせて実装しています。   

大体専用の仕組みなので引っ越したら全滅しそう。

## アクセサリ説明

### Shibuya
赤外線で家電を制御するアクセサリ。ESP32をベースに実装。

#### Kitami
照明をコントロールするサービス。対象の機器は「Panasonic LGBZ2773」。    
現時点ではオンオフ、色温度の設定に対応しています。

#### Sagikawa
常夜灯をコントロールするサービス。対象の機器は「Panasonic LGBZ2773」。    
通常の照明と排他的に制御するのに難航中。

### Sakuma
環境状態を検出するアクセサリ。ESP32をベースに実装。

#### Shiomi
温度を取得するサービス。センサはMM-ENV01に搭載されているHDC1080。

#### Asari
湿度を取得するサービス。センサはMM-ENV01に搭載されているHDC1080。

#### Moroboshi
照度を取得するサービス。センサはMM-ENV01に搭載されているOPT3001。

#### Shirasaka
二酸化炭素濃度を取得するサービス。センサはMH-Z19B。    
しきい値である1000ppmを超えるとアラートが上がります。