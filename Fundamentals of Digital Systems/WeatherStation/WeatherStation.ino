// WeatherStation.ino
// Mini Weather Station Project

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <DHT.h>
#include <Adafruit_BMP280.h>

// OLED settings
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

// DHT settings
#define DHTPIN 2
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// Pressure sensor
Adafruit_BMP280 bmp;

// Pins
#define BUZZER 8
#define POT_PIN A0

// Variables
float temperature;
float humidity;
float pressure;
int thresholdTemp;

void setup() {
  serial.begin(9600);

  pinMode(BUZZER, OUTPUT)
}