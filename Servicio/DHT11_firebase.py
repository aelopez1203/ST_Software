# Importacion de modulos
from time import sleep
from dhtxx import DHT11, DHT22
from firebase import firebase
from uuid import getnode as get_mac
import datetime

# Funcion que consulta la colección temperatura_humedad_actual, y retorna el valor de CantLecturas
def ConsultaCantLecturas():
    # Conecta con la base de datos en Firebase
    result = firebase.get('/temperatura_humedad_actual/1','CantLecturas')
    CantLecturas = int(result)
    return CantLecturas

# Funcion que envia confirmación de ejecución
def ResponseSwitch(valor):
    # Conecta con la base de datos en Firebase
    firebase.put('/switch_serv', 'resultado',valor)
    
    

# Obtiene fecha actual para la creacion del archivo adminLogs
x = datetime.datetime.now()

# Crea archivo admin_logs
file = open('/home/pi/sensores/dhtxx-rpi-python3/AdminLogs/AdminLogTempHum_'+str(x)+'.txt', 'w', encoding='utf-8')
# Finaliza archivo admin_logs
file.close()

# Inicia edicion del archivo admin_logs
file = open('/home/pi/sensores/dhtxx-rpi-python3/AdminLogs/AdminLogTempHum_'+str(x)+'.txt', 'a', encoding='utf-8')



# Metodos file.write, para escribir en el archivo de texto
file.write('=================================================')
file.write('\n=         Proceso de adquisicion de datos       =')
file.write('\n=================================================')
file.write('\n')


# Conecta con la base de datos en Firebase
firebase = firebase.FirebaseApplication("https://syspred-f1a54.firebaseio.com/", None)

file.write('\nConexion con Firebase: OK')


# Define la estructura de la coleccion de auditoria
log = {
    'MAC'            : get_mac(),
    'descripcion'    : 'Inicio de recoleccion de datos',
    'fecha'          : datetime.datetime.now(),
    'id_login'       : 'Syspred',
    'ip_publica'     : 'No aplica',
    'tipo_auditoria' : 'Recoleccion de datos'
}

# con el metodo post, registra los nuevos datos en la coleccion temperatura_humedad
resultlog = firebase.post("/auditoria", log)

ResponseSwitch("Response")

# Ajuste pin (BCM) para sus necesidades
dht11 = DHT11(14)
CuentaRegistros = int(ConsultaCantLecturas())

file.close()

while True:
 # Retries 'max_tries' intentos maximos desde DHT11 para obtener un resultado válido
 r = dht11.get_result(max_tries=10)
 
 # Variable de la facha actual
 fecha_actual = datetime.datetime.now()
 CuentaRegistros = CuentaRegistros + 1
 file = open('/home/pi/sensores/dhtxx-rpi-python3/AdminLogs/AdminLogTempHum_'+str(x)+'.txt', 'a', encoding='utf-8')
 
 file.write('\n')
 file.write('\nInicio proceso Nº ' + str(CuentaRegistros))
 file.write('\nFecha: '+str(fecha_actual))
 
 if r:
        
    celsius = float('{0:0.1f}'.format(r[0], r[1]))
    humedad = float('{1:0.1f}'.format(r[0], r[1]))

    file.write('\nTemperatura de: {0:0.1f}ºC Con Humedad de: {1:0.1f}%'.format(r[0], r[1]))
    
    # Seccion convercion Celsius a Fahrenheit
    fahrenheit = 9.0/5.0 * celsius +32

    # Define la estructura de la coleccion
    data = {
        'fecha_muestra':fecha_actual,
        'humedad'      : str(humedad) +'%',
        'id_sensor'    :'DHT11',
        'temperaturaC' : str(celsius)+ '°C',
        'temperaturaF' : str(fahrenheit) + '°F'
    }
    
    # con el metodo post, registra los nuevos datos en la coleccion temperatura_humedad
    result = firebase.post("/temperatura_humedad", data)

    file.write('\nDatos almacenados en Firebase: OK')
    
    # Con el metodo put, actualiza los datos en temperatura_humedad_actual
    firebase.put('/temperatura_humedad_actual/1', 'fecha_muestra',fecha_actual)
    firebase.put('/temperatura_humedad_actual/1', 'humedad',str(humedad) +'%')
    firebase.put('/temperatura_humedad_actual/1', 'id_sensor','DHT11')
    firebase.put('/temperatura_humedad_actual/1', 'temperaturaC',str(celsius) + '°C')
    firebase.put('/temperatura_humedad_actual/1', 'temperaturaF',str(fahrenheit) + '°F')
    firebase.put('/temperatura_humedad_actual/1', 'CantLecturas',int(CuentaRegistros))
    
    file.write('\nRecoleccion y actualizacion de datos: OK')
    
    # Si ingresa datos a la nube, el proceso se realiza satisfactoriamente
    firebase.put('/recolecta_datos', 'OK','true')
    
    
    file.write('\nFin proceso Nº ' + str(CuentaRegistros))
    file.write('\n')
    
    file.close()
    
    ResponseSwitch("None")
    
 else:
     
# Error al ingresar datos a la nube, el proceso se toma fallido
    firebase.put('/recolecta_datos', 'OK','false')
    
    file = open('/home/pi/sensores/dhtxx-rpi-python3/AdminLogs/AdminLogTempHum_'+str(x)+'.txt', 'a', encoding='utf-8')
    file.write('\nFallo al obtener resultados')
    file.write('\nFin proceso Nº ' + str(CuentaRegistros))
    
    file.close()
    
 sleep(1)
