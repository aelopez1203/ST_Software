import sys
import signal
import os
from time import sleep
from threading import Thread
from firebase import firebase

PAHT_CRED = '/home/pi/sensores/dhtxx-rpi-python3/sdk/cred.json'
URL_DB = 'https://syspred-f1a54.firebaseio.com/'
REF_SWITCH_SERV = '/switch_serv'
REF_SWITCH = 'switch'

class IOT():
    
    
    def __init__(self):
        self.firebase = firebase.FirebaseApplication(URL_DB, None)
        self.refSwitch = self.firebase.get(REF_SWITCH_SERV, REF_SWITCH)


    def IniciaServicio(self, estado):
        if estado == 'false':
            os.system('sudo python3 /home/pi/sensores/dhtxx-rpi-python3/DHT11_firebase_exit.py &')
            print('Detener Servicio')
            

    def ValidaEstadoSwitch(self):

        E, i = [], 0

        estado_anterior = self.firebase.get('/switch_serv','switch')
        self.IniciaServicio(estado_anterior)

        E.append(estado_anterior)

        while True:
          estado_actual = self.firebase.get('/switch_serv','switch')
          E.append(estado_actual)
          
          if E[i] != E[-1]:
              self.IniciaServicio(estado_actual)

          del E[0]
          i = i + i
          sleep(0.4)


print ('START !')
iot = IOT()

subproceso_Servicio = Thread(target=iot.ValidaEstadoSwitch)
subproceso_Servicio.daemon = True
subproceso_Servicio.start()

signal.pause()
