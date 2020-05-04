from firebase import firebase
from uuid import getnode as get_mac
import datetime
import os

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