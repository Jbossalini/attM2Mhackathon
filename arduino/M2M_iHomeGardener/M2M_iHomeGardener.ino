#include <ATTCloudClient.h>

// Longest variable is 32 chars
PROGMEM const prog_uchar   M2MIO_USERNAME[]      = "team1@att.com";
PROGMEM const prog_uchar   M2MIO_PASSWORD[]      = "fae0ff07ff6ca075eac3d83ab86dfdf9";    // MD5 key of password
PROGMEM const prog_uchar  M2MIO_DOMAIN[]         = "c33bc6429f9b5de446c97409e033458c";
PROGMEM const prog_uchar  M2MIO_DEVICE_TYPE[]    = "things";
PROGMEM const prog_uchar  M2MIO_DEVICE_ID[]      = "gardenbot";

PROGMEM const prog_uchar M2MIO_CLIENT_ID[] =          "things/gardenbot";

ATTCloudClient acc;
ATT3GModemClient c;

void cmdCallBack(char *topic, uint8_t* payload, unsigned int len);

int buttonState = 0;


void setup() {

  while( !Serial) ;
  delay(1500);

  Serial.begin(115200); // port to communicate to PC
  Serial1.begin(115200); // port that talks to 3G modem

  Serial.println(F("M2M Demo Begin (LEO)."));

  c = ATT3GModemClient();
  acc = ATTCloudClient(cmdCallBack,c);

  //acc.test();

  //  Serial.println(F("Debug: 1"));

  if (!acc.connect(M2MIO_CLIENT_ID,M2MIO_USERNAME,M2MIO_PASSWORD) ) {
   Serial.println(F("Unable to connect to network (12)"));
    //return;
  }

  //  acc.publish(M2MIO_DOMAIN,M2MIO_DEVICE_TYPE,M2MIO_DEVICE_ID,"{\"foo\":001}");
  //acc.setDomainStuffThing(M2MIO_DOMAIN,M2MIO_DEVICE_TYPE,M2MIO_DEVICE_ID);
  // acc.sendKV("test1","0001");
  // acc.sendKV("test2",1);
  // acc.sendKV("test3",(boolean)true);

  // acc.startMessage();
  // acc.addKVToMessage("test3",22);
  // acc.endMessage();
  // acc.sendMessage();
   
  //acc.disconnect();

  acc.setDomainStuffThing(M2MIO_DOMAIN,M2MIO_DEVICE_TYPE,M2MIO_DEVICE_ID);
  acc.sendKV("button",2);
  acc.registerForCommands();
  
  pinMode(4, INPUT);
  

  //analogReference(INTERNAL);

  
}

int Thermistor(int RawADC) {
  float vcc = 4.91;                       // only used for display purposes, if used
                                        // set to the measured Vcc.
float pad = 9850;                       // balance/pad resistor value, set this to
                                        // the measured resistance of your pad resistor
float thermr = 10000; 
  long Resistance;  
  float Temp;  // Dual-Purpose variable to save space.

  Resistance=((1024 * pad / RawADC) - pad); 
  Temp = log(Resistance); // Saving the Log(resistance) so not to calculate  it 4 times later
  Temp = 1 / (0.001129148 + (0.000234125 * Temp) + (0.0000000876741 * Temp * Temp * Temp));
  Temp = Temp - 273.15;  // Convert Kelvin to Celsius                      

  //temp = (Temp * 9.0)/ 5.0 + 32.0;                  // Convert to Fahrenheit
  return Temp;                                      // Return the Temperature
}

void cmdCallBack(char *topic, uint8_t* payload, unsigned int len) {
  Serial.println(F("In the cmdCallBack()"));

  Serial.println((char*)payload);
}




void loop() {
  buttonState = digitalRead(4);
  Serial.println("Loop...");
  if (buttonState == HIGH) {
    acc.sendKV("button",1);
    Serial.println("button: 1");
  }
  else {
    acc.sendKV("button",0);
    Serial.println("button: 0");
  }
  
  int temp=Thermistor(analogRead(4));
  Serial.print("Temp:");
  Serial.println(temp);
  // temp = 
  acc.sendKV("temperature",temp);
  
  //acc.publish(M2MIO_DOMAIN,M2MIO_DEVICE_TYPE,M2MIO_DEVICE_ID,"{\"foo\":123}");
  int light=(analogRead(3))/10;
  Serial.print("Light:");
  Serial.println(light);
  acc.sendKV("light",light);
  
  int soil=analogRead(0)/8;
  Serial.print("Moisture:");
  Serial.println(soil);
  acc.sendKV("moisture",soil);
  delay(2000);
  acc.loop();
}




