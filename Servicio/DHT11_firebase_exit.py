from firebase import firebase
from uuid import getnode as get_mac
import datetime
import os

# Funcion que envia confirmación de ejecución
def ResponseSwitch(valor):
    # Conecta con la base de datos en Firebase
    firebase.put('/switch_serv', 'resultado', valor)


os.system('pkill -f DHT11_firebase.py')
firebase = firebase.FirebaseApplication("https://syspred-f1a54.firebaseio.com/", None)


# Define la estructura de la coleccion de auditoria
log = {
    'MAC'            : get_mac(),
    'descripcion'    : 'Finaliza de recoleccion de datos',
    'fecha'          :  datetime.datetime.now(),
    'id_login'       : 'Syspred',
    'ip_publica'     : '',
    'tipo_auditoria' : 'Recoleccion de datos'
}

# con el metodo post, registra los nuevos datos en la coleccion temperatura_humedad
resultlog = firebase.post("/auditoria", log)

ResponseSwitch("Response");

# con el metodo post, actualiza los nuevos datos en la coleccion temperatura_humedad
firebase.put('/temperatura_humedad_actual/1', 'CantLecturas',int(0))

ResponseSwitch("None");