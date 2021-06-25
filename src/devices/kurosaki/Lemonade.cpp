#include "Lemonade.h"
#include "sdfonts.h"

#define SD_PN 4

void fontDisp(uint16_t x, uint16_t y, uint8_t* buf, uint32_t color) {
  uint8_t bn = SDfonts.getRowLength();

  for (uint8_t i = 0; i < SDfonts.getLength(); i += bn ) {
    for (uint8_t j = 0; j < bn; j++) {
      for (uint8_t k = 0; k < 8; k++) {
        if (buf[i + j] & 0x80 >> k) {
          M5.Lcd.drawPixel(x + 8 * j + k , y + i / bn, color);
        }
      }
    }
  }
}

void fontDumpCenter(uint16_t x, uint16_t y, char* pUTF8, uint8_t sz, uint32_t color) {
  uint8_t buf[MAXFONTLEN];
  SDfonts.open();
  SDfonts.setFontSize(sz);

  int length = 0;

  char* p = pUTF8;
  while ( p = SDfonts.getFontData(buf, p) ) {
    length += 1;
  }

  int margin = length * sz / 2;

  uint16_t mojisu = 0;
  while ( pUTF8 = SDfonts.getFontData(buf, pUTF8) ) {
    fontDisp(x - margin + mojisu * sz, y, buf, color);
    ++mojisu;
  }

  SDfonts.close();
}

void Lemonade::begin()
{
  Lemonade::drawMenu(true);
}

void Lemonade::update()
{
  M5.update();
  getButtonStatus();
}

void Lemonade::getButtonStatus()
{
  Lemonade::btn_a_before = Lemonade::btn_a;
  Lemonade::btn_b_before = Lemonade::btn_b;
  Lemonade::btn_c_before = Lemonade::btn_c;

  Lemonade::btn_a = M5.BtnA.isPressed();
  Lemonade::btn_b = M5.BtnB.isPressed();
  Lemonade::btn_c = M5.BtnC.isPressed();

  if (Lemonade::btn_a_before != Lemonade::btn_a) {
    // Observe
    Lemonade::drawMenu(false);
  }
  if (Lemonade::btn_b_before != Lemonade::btn_b) {
    // Observe
    Lemonade::drawMenu(false);
  }
  if (Lemonade::btn_c_before != Lemonade::btn_c) {
    // Observe
    Lemonade::drawMenu(false);
  }
}

void Lemonade::setMenuColor(uint32_t line)
{
  Lemonade::menu_line_color = line;
  Lemonade::drawMenu(true);
}


void Lemonade::setDisabledBtnA(uint8_t disabled)
{
  Lemonade::is_btn_a_disabled = disabled;
  Lemonade::drawMenu(true);
}
void Lemonade::setDisabledBtnB(uint8_t disabled)
{
  Lemonade::is_btn_b_disabled = disabled;
  Lemonade::drawMenu(true);
}
void Lemonade::setDisabledBtnC(uint8_t disabled)
{
  Lemonade::is_btn_c_disabled = disabled;
  Lemonade::drawMenu(true);
}

void Lemonade::setMenuTextBtnA(char* text)
{
  Lemonade::menu_1 = text;
  Lemonade::drawMenu(true);
}

void Lemonade::setMenuTextBtnB(char* text)
{
  Lemonade::menu_2 = text;
  Lemonade::drawMenu(true);
}

void Lemonade::setMenuTextBtnC(char* text)
{
  Lemonade::menu_3 = text;
  Lemonade::drawMenu(true);
}


void Lemonade::showLoading(char* text)
{
  fontDumpCenter(160, 102, text, 16, menu_line_color);
}


void Lemonade::reset()
{
  M5.Lcd.clear();
  Lemonade::drawMenu(true);
}


void Lemonade::drawMenu(boolean refresh)
{
  if (refresh) {
    if (!Lemonade::is_btn_a_disabled) {
      M5.Lcd.fillRect(20, 205, 90, 30, menu_fill_color);
    } else {
      M5.Lcd.fillRect(20, 205, 90, 30, menu_disabled_fill_color);
    }
    if (!Lemonade::is_btn_b_disabled) {
      M5.Lcd.fillRect(115, 205, 90, 30, menu_fill_color);
    } else {
      M5.Lcd.fillRect(115, 205, 90, 30, menu_disabled_fill_color);
    }
    if (!Lemonade::is_btn_c_disabled) {
      M5.Lcd.fillRect(210, 205, 90, 30, menu_fill_color);
    } else {
      M5.Lcd.fillRect(210, 205, 90, 30, menu_disabled_fill_color);
    }
    fontDumpCenter(65, 212, Lemonade::menu_1, 16, menu_line_color);
    fontDumpCenter(160, 212, Lemonade::menu_2, 16, menu_line_color);
    fontDumpCenter(255, 212, Lemonade::menu_3, 16, menu_line_color);
  }

  if (Lemonade::btn_a_before != Lemonade::btn_a && !Lemonade::is_btn_a_disabled) {
    if (Lemonade::btn_a) {
      M5.Lcd.fillRect(20, 205, 90, 30, menu_line_color);
      fontDumpCenter(65, 212,  Lemonade::menu_1, 16, menu_fill_color);
    } else {
      M5.Lcd.fillRect(20, 205, 90, 30, menu_fill_color);
      fontDumpCenter(65, 212,  Lemonade::menu_1, 16, menu_line_color);
    }
  }
  if (Lemonade::btn_b_before != Lemonade::btn_b && !Lemonade::is_btn_b_disabled) {
    if (Lemonade::btn_b) {
      M5.Lcd.fillRect(115, 205, 90, 30, menu_line_color);
      fontDumpCenter(160, 212,  Lemonade::menu_2, 16, menu_fill_color);
    } else {
      M5.Lcd.fillRect(115, 205, 90, 30, menu_fill_color);
      fontDumpCenter(160, 212,  Lemonade::menu_2, 16, menu_line_color);
    }
  }
  if (Lemonade::btn_c_before != Lemonade::btn_c && !Lemonade::is_btn_c_disabled) {
    if (Lemonade::btn_c) {
      M5.Lcd.fillRect(210, 205, 90, 30, menu_line_color);
      fontDumpCenter(255, 212,  Lemonade::menu_3, 16, menu_fill_color);
    } else {
      M5.Lcd.fillRect(210, 205, 90, 30, menu_fill_color);
      fontDumpCenter(255, 212,  Lemonade::menu_3, 16, menu_line_color);
    }
  }
}