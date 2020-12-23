/*
   Lemonade.h - Simple GUI Library for M5Stack.
   Created by Mizucoffee, April 7, 2020.
   MIT License.
*/

#ifndef Lemonade_h
#define Lemonade_h
#include "Arduino.h"
#include <M5Stack.h>

class Lemonade {
  public:

    // ==================
    //  Common
    // ==================
    Lemonade(void) {};
    ~Lemonade(void) {};
    void begin(void);
    void update(void);
    void reset();


    // ==================
    //  Button
    // ==================
    void drawMenu(boolean);
    void setMenuColor(uint32_t);
    void setDisabledBtnA(uint8_t);
    void setDisabledBtnB(uint8_t);
    void setDisabledBtnC(uint8_t);
    void setMenuTextBtnA(char*);
    void setMenuTextBtnB(char*);
    void setMenuTextBtnC(char*);
    void showLoading(char*);

    // ==================
    //  ListMenu
    // ==================
    void showMenu(String[]);

    // ==================
    //  Battery
    // ==================

  private:
    void getButtonStatus(void);

    uint8_t is_btn_a_disabled;
    uint8_t is_btn_b_disabled;
    uint8_t is_btn_c_disabled;

    uint8_t btn_a_before;
    uint8_t btn_b_before;
    uint8_t btn_c_before;

    uint32_t menu_line_color = 0xFFFB;
    uint32_t menu_fill_color = 0xAD43;
    uint32_t menu_disabled_fill_color = 0xB5B2;

    char* menu_1;
    char* menu_2;
    char* menu_3;

    uint8_t btn_a;
    uint8_t btn_b;
    uint8_t btn_c;
};
#endif