window.onload;

var firebaseConfig = {
    apiKey: "AIzaSyDwZL4-tA0OC4MzYzjeZt4l4ODMGnz7yQw",
    authDomain: "syspred-f1a54.firebaseapp.com",
    databaseURL: "https://syspred-f1a54.firebaseio.com",
    projectId: "syspred-f1a54",
    storageBucket: "syspred-f1a54.appspot.com",
    messagingSenderId: "28877218963",
    appId: "1:28877218963:web:053bfbcb126c417cead966",
    measurementId: "G-YCRJT3X7FH"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var ValorSwitch;


// ******************************************************************************
// *      Funciones Globales JS que pueden ser usados por otras funciones       *
// ******************************************************************************

// Función que toma el valor de cada id de los elementos en la pagina por Ej: los Id de los elementos input
function getID(id){
    return document.getElementById(id).value;
}


function innerHTML(id,result){
    return document.getElementById(id).innerHTML=result;
}

// Funcion que retorna numero mayor de un arreglo
function numeroMax(arreglo){
    var max = Math.max.apply(null, arreglo);
    return max;
}

// Funcion que retorna numero menor de un arreglo
function numeroMin(arreglo){
    var min = Math.min.apply(null, arreglo);
    return min;
}

// Funcion que retorna numero con dos decimales
function dosDecimales(n) {
    let t=n.toString();
    let regex=/(\d*.\d{0,2})/;
    return t.match(regex)[0];
  }

// ******************************************************************************
// *              Funciones JS Para la autenticación con Firebase               *
// ******************************************************************************

// Funcion de acceso al sistema
function acceso(){
    event.preventDefault();
    var emailA = document.getElementById('your_name').value;
    var passA = document.getElementById('your_pass').value;

    firebase.auth().signInWithEmailAndPassword(emailA, passA)
        .then(function(result){
            RedireccionarIndex(emailA);
            
        })
    .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert("Credenciales incorrectas.")
    });
}

// Función que registra nuevo usuario de autenticación en el sistema
function registrar(){
    event.preventDefault();
    var email = document.getElementById('email').value;
    var pass  = document.getElementById('pass').value;
    var pass2 = document.getElementById('pass2').value;
    
    if(pass==pass2){
        IngresaValoresPagRegUsuario();

        firebase.auth().createUserWithEmailAndPassword(email, pass)
            .then(function(result){
                alert("Se registra usuario correctamente.");
                verificar();
            })
        .catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                alert("Error al registrar usuario"+errorMessage)
        });

    }else{
        alert('Contraseñas no coinciden.')
    }

    
}

// Función que envia email de verificaión
function verificar(){
    event.preventDefault();
    var user = firebase.auth().currentUser;

    user.sendEmailVerification().then(function(){
        console.log('Enviando Correo...');

    }).catch(function(error){
        console.log(error);
    });
}

// Función de observador para obtener el usuario actual
function observador(){
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
        console.log('Existe usuario activo...')
        //RedireccionarIndex(user);
        var displayName = user.displayName;

        var email = user.email;
        console.log('***********************');
        console.log('Verificación de email: ');
        console.log(user.emailVerified);
        console.log('***********************');

        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        }else{
            console.log('No existe usuario activo..');
            location.href="error/error401.html";
            console.log('Entro aqui');
        }
    });
}

// Función que redirige a la ventana correspondiente
function RedireccionarIndex(emailA){
    var user = emailA;
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            console.log('Existe usuario activo...')
            //RedireccionarIndex(user);
            var displayName = user.displayName;

            var email = user.email;
            console.log('***********************');
            console.log('Verificación de email: ');
            console.log(user.emailVerified);
            console.log('***********************');

            var verificaEmail = user.emailVerified;
            }else{
                console.log('No existe usuario activo..')
            }
        if(verificaEmail){
                // Muestra la pagina Index
            alert("Autenticación Correcta.");
            location.href="pages/index.html";
        }else{
                alert('Se requiere verificación de correo eléctronico.')
            }
    });
    
}

// Función que redirección a la pestaña de login.html
function RedireccionarLogin(){
    event.preventDefault();
    location.href="../../login.html";
}

// Función cerrar sesión
function cerrar_sesion(){
    firebase.auth().signOut().then(function() {
        console.log('Se ha cerrado sesión correctamente');
       
    }).catch(function(error) {
        console.log('No se puede cerrar sesión');
    });
}

// ******************************************************************************
// *       Funciones JS para la consulta e ingreso de datos en Firebase         *
// ******************************************************************************

// Función que toma los valores del formulario de registro y valida si son nulos
function IngresaValoresPagRegUsuario(){
    var id = getID("documento");
    var apellidos = getID("apellidos");
    var nombre = getID("nombre");
    var email = getID("email");
    var edad = getID("edad");
    var telefono = getID("telefono");
    var usuario = getID("usuario");
    var contrasena = getID("pass");
    var contrasena2 = getID("pass2");
    var correo = getID("email");
    var Rol = 'Administrador';
    var password = '123'
    
    if(contrasena.length==0||contrasena2.length==0||id.length==0||apellidos.length==0||nombre.length==0||email.length==0||edad.length==0||telefono.length==0||usuario.length==0){
        alert('No se permiten campos vacios.')

    }else{
        // Prepara datos de la colección persona y los ordena para ser almacenados en Realtime Database
        var arrayDataPersona = arrayJSONpersona(apellidos,email,id,edad,nombre,telefono,usuario);
        var persona = firebase.database().ref("personas/"+id);
        persona.set(arrayDataPersona);
        alert('Se almacenan datos personales');

        // Prepara datos de la colección login y los ordena para ser almacenados en Realtime Database
        var arrayDataLogin = arrayJSONlogin(password,id,Rol,usuario,correo);
        var login = firebase.database().ref("login/"+usuario);
        login.set(arrayDataLogin);
        alert('Se almacenan datos de login');
    }
}

// Funcion que almacena los datos del formulario de registro y los convierte en un array
function arrayJSONpersona(apellidos,email,id,edad,nombre,telefono,usuario){
    var data = {
        apellidos : apellidos,
        email : email,
        id : id,
        edad : edad,
        nombre : nombre,
        telefono : telefono,
        usuario : usuario
    };
    return data;
}


// Funcion que almacena los datos del formulario de registro y los convierte en un array
function arrayJSONlogin(password,id,Rol,user,correo){
    var data = {
        password : password,
        id : id,
        Rol : Rol,
        user : user,
        correo : correo
    };
    return data;
}

// ********************************************************************************
// * Funciones JS para el Control de inicio y Detencion del servicio RaspBerry PI *
// ********************************************************************************

// Funcion que consulta la coleccion switch_serv en firebase Resultado
function ConsultarSwitch_Result(tipo){
    var switch_serv = firebase.database().ref("switch_serv/");
    var Valorswitch_serv = "";
    var msj = "";

    switch_serv.on("value",function(data){
        Valorswitch_serv = data.val();
    });    
}

// Funcion que consulta la coleccion switch_serv en firebase Switch
function ConsultarSwitch_Serv(tipo){
    var switch_serv = firebase.database().ref("switch_serv/");
    var Valorswitch_serv = "";
    switch_serv.on("value",function(data){
        Valorswitch_serv = data.val();
        //console.log(Valorswitch_serv);
        //var result = SeccionOff(Valorswitch_serv.switch,Valorswitch_serv.resultado);
        var result

        if(Valorswitch_serv.switch == "true"){
            result = SeccionSwitch('fa-toggle-on','On');
            msj = "Servicio Iniciado";
            ValorSwitch = Valorswitch_serv.switch;
        }
        if(Valorswitch_serv.switch == "false"){
            result = SeccionSwitch('fa-toggle-off','Off');
            msj = "Servicio Detenido";
            ValorSwitch = Valorswitch_serv.switch;
        }
        if(Valorswitch_serv.resultado == "Response"){
            alert(msj);
        }
        innerHTML("loadSwitch",result); 

        
    });
    
}


// Reconstruye la seccion del menu para iniciar o detener servicio Rapsberry PI
function SeccionSwitch(clase,modo){
    return  '<li class="active"><a href="index.html"><em class="fa fa-dashboard">&nbsp;</em> Inicio</a></li>'+
            '<li><a href="#" onclick="ValEstActual()"><em class="fa '+clase+'">&nbsp;</em> Servicio '+modo+'</a></li>'+
            '<li><a href="Reporte.html"><em class="fa fa-navicon">&nbsp;</em> Reportes</a></li>'+
            '<li class="parent "><a data-toggle="collapse" href="#sub-item-1">'+
                '<em class="fa fa-users">&nbsp;</em> Usuarios <span data-toggle="collapse" href="#sub-item-1" class="icon pull-right"><em class="fa fa-plus"></em></span>'+
                '</a>'+
                '<ul class="children collapse" id="sub-item-1">'+
                    '<li><a class="" href="Registrar.html">'+
                        '<span class="fa fa-arrow-right">&nbsp;</span> Registrar'+
                    '</a></li>'+
                    '<li><a class="" href="Modificar.html">'+
                        '<span class="fa fa-arrow-right">&nbsp;</span> Actualizar'+
                    '</a></li>'+
                '</ul>'+
            '</li>'+
            '<li><a href="../login.html"><em class="fa fa-power-off">&nbsp;</em> Cerrar Sesión</a></li>';
}

function ValEstActual(){
    var estado = ValorSwitch
    var msjIni = "Servicio Iniciado";
    var msjDet = "Servicio Detenido";
    var result = "";

    if(estado == "true"){
        ChangeSwitch("false");
    }
    if(estado == "false"){
        ChangeSwitch("true");
    }
}

//Actualiza en Firebase el estado del Switch
function ChangeSwitch(Action){
    var switch_serv = firebase.database().ref("switch_serv/");
    var obj = {
        resultado : "None",
        switch    : Action
    }
    switch_serv.update(obj);
}

// ******************************************************************************
// *           Funciones JS para la consulta de datos de Firebase               *
// ******************************************************************************

// Funcion que consulta la coleccion temperatura_humedad_actual en firebase
function ConsultarTemp_Humedad(){
    var temperatura_humedad_actual = firebase.database().ref("temperatura_humedad_actual/");
    temperatura_humedad_actual.on("child_changed",function(data){
        var Valortemperatura_humedad_actual = data.val();
        //console.log(Valortemperatura_humedad_actual);
        var result = DivClassInicio(Valortemperatura_humedad_actual.temperaturaC,Valortemperatura_humedad_actual.temperaturaF,Valortemperatura_humedad_actual.humedad,Valortemperatura_humedad_actual.CantLecturas);
        //console.log(result);
        innerHTML("loadTempC",result);
        
        ConsultaDatosGraficaTempHum(); //Ejecuta funcion graficas
    });
}

// Reconstruye la seccion del DIV mostrando los datos consultados en Firebase
function DivClassInicio(temperaturaC,temperaturaF,humedad,CantLecturas){
    return '<div class="col-xs-6 col-md-3 col-lg-3 no-padding">'+
                '<div class="panel panel-teal panel-widget border-right">'+
                    '<div class="row no-padding"><em class="fa fa-xl fa-navicon color-blue"></em>'+
                        '<div class="large">'+temperaturaC+'</div>'+
                        '<div class="text-muted">Temperatura Actual en Celsius</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
            '<div class="col-xs-6 col-md-3 col-lg-3 no-padding">'+
                '<div class="panel panel-blue panel-widget border-right">'+
                    '<div class="row no-padding"><em class="fa fa-xl fa-inbox color-orange"></em>'+
                        '<div class="large">'+temperaturaF+'</div>'+
                        '<div class="text-muted">Temperatura Actual en Fahrenheit</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
            '<div class="col-xs-6 col-md-3 col-lg-3 no-padding">'+
                '<div class="panel panel-orange panel-widget border-right">'+
                    '<div class="row no-padding"><em class="fa fa-xl fa-home color-teal"></em>'+
                        '<div class="large">'+humedad+'</div>'+
                        '<div class="text-muted">Porcentaje Humedad Actual</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
            '<div class="col-xs-6 col-md-3 col-lg-3 no-padding">'+
                '<div class="panel panel-red panel-widget ">'+
                    '<div class="row no-padding"><em class="fa fa-xl fa-search color-red"></em>'+
                        '<div class="large">'+CantLecturas+'</div>'+
                        '<div class="text-muted">Cantidad de lecturas</div>'+
                    '</div>'+
                '</div>'+
            '</div>';
}

// ******************************************************************************
// *           Funciones JS para el manejo de datos de las graficas             *
// ******************************************************************************

// Funcion que trae los datos de temperatura y humedad mas recientes (Ultimos 7 registros)
function ConsultaDatosGraficaTempHum(){
    var tiempo = new Array();
    var temperatura = new Array();
    var humedad = new Array();
    var temperatura_humedad = firebase.database().ref("temperatura_humedad/");
    temperatura_humedad.orderByChild("fecha_muestra").limitToLast(7).on("child_added", function(snapshot) {
        var Valortemperatura_humedad = snapshot.val();

        tiempo.push(Valortemperatura_humedad.hora);
        //console.log(tiempo);

        temperatura.push(Valortemperatura_humedad.temperaturaC);
        //console.log(temperatura);  

        humedad.push(Valortemperatura_humedad.humedad);
        //console.log(humedad); 

        // Variables que genera numeros aleatorios para ser usados en la grafica

        var randomScalingFactorHumedad = function(posicion){ 
            var temp = humedad[posicion];
            //console.log()
            return Math.round(temp)
        }; 

        var randomScalingFactorTemperatura = function(posicion){ 
            var temp = temperatura[posicion];
            //console.log()
            return Math.round(temp)
        }; 


        // -=========================== Sección Temperatura =============================-
        var lineChartDataT = {
            labels : tiempo,
            datasets : [
                {
                    label: "My Firts dataset",
                    fillColor : "rgba(48, 164, 255, 0.2)",
                    strokeColor : "rgba(211, 43, 43, 1)",
                    pointColor : "rgba(48, 164, 255, 1)",
                    pointStrokeColor : "#fff",
                    pointHighlightFill : "#fff",
                    pointHighlightStroke : "rgba(48, 164, 255, 1)",
                    data : [randomScalingFactorTemperatura(0),randomScalingFactorTemperatura(1),randomScalingFactorTemperatura(2),randomScalingFactorTemperatura(3),randomScalingFactorTemperatura(4),randomScalingFactorTemperatura(5),randomScalingFactorTemperatura(6)]
                }
            ]
        }

        // -=========================== Secciòn Humedad =============================-
        var lineChartDataH = {
            labels : tiempo,
            datasets : [
                {
                    label: "My First dataset",
                    fillColor : "rgba(220,220,220,0.2)",
                    strokeColor : "rgba(48, 164, 255, 1)",
                    pointColor : "rgba(220,220,220,1)",
                    pointStrokeColor : "#fff",
                    pointHighlightFill : "#fff",
                    pointHighlightStroke : "rgba(220,220,220,1)",
                    data : [randomScalingFactorHumedad(0),randomScalingFactorHumedad(1),randomScalingFactorHumedad(2),randomScalingFactorHumedad(3),randomScalingFactorHumedad(4),randomScalingFactorHumedad(5),randomScalingFactorHumedad(6)]
                }
            ]
        }
        // toma valor del codigo html para utilizar el Html sección temperatura
        var resulttemp = DivClassGraficaT();
            //console.log(resulttemp);
            innerHTML("loadTempG",resulttemp);

        var chart1 = document.getElementById("line-chart-temperatura").getContext("2d");
            window.myLine = new Chart(chart1).Line(lineChartDataT, {
            responsive: true,
            scaleLineColor: "rgba(0,0,0,.2)",
            scaleGridLineColor: "rgba(0,0,0,.05)",
            scaleFontColor: "#c5c7cc"
        });

        // toma valor del codigo html para utilizar el Html sección humedad
        var resulttemp = DivClassGraficaH();
            //console.log(resulttemp);
            innerHTML("loadHumG",resulttemp);    
        
        var chart2 = document.getElementById("line-chart-humedad").getContext("2d");
            window.myLine = new Chart(chart2).Line(lineChartDataH, {
            responsive: true,
            scaleLineColor: "rgba(0,0,0,.2)",
            scaleGridLineColor: "rgba(0,0,0,.05)",
            scaleFontColor: "#c5c7cc"
        });
    });
}


// función que reconstruye sección de la grafica de temperatura
function DivClassGraficaT(){
    return '<div class="col-md-12">'+
				'<div class="panel panel-default">'+
					'<div class="panel-heading">'+
						'Monitoreo Temperatura en °C'+
						'<span class="pull-right clickable panel-toggle panel-button-tab-left"><em class="fa fa-toggle-up"></em></span>'+
					'</div>'+
					'<div class="panel-body">'+
						'<div class="canvas-wrapper">'+
							'<canvas class="main-chart" id="line-chart-temperatura" height="200" width="600"></canvas>'+
						'</div>'+
					'</div>'+
				'</div>'+
            '</div>';       
}

// función que reconstruye sección de la grafica de humedad
function DivClassGraficaH(){
    return '<div class="col-md-12">'+
                '<div class="panel panel-default">'+
                    '<div class="panel-heading">'+
                        'Monitoreo Humedad'+
                        '<span class="pull-right clickable panel-toggle panel-button-tab-left"><em class="fa fa-toggle-up"></em></span>'+
                    '</div>'+
                    '<div class="panel-body">'+
                        '<div class="canvas-wrapper">'+
                            '<canvas class="main-chart" id="line-chart-humedad" height="200" width="600"></canvas>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>';      
}

// ******************************************************************************
// *                Funciones JS para validar estado del sensor                 *
// ******************************************************************************

// Funcion que consulta la coleccion recolecta_datos en firebase 
function ConsultarEstadoSensor(){
    var EstadoSensor = firebase.database().ref("recolecta_datos/");
    var ValorEstadoSensor = "";
    EstadoSensor.on("value",function(data){
        ValorEstadoSensor = data.val();      

        if(ValorEstadoSensor.OK == "Error_Sensor"){
            msj = "Fallo de comunicación con el Sensor DHT11";
            alert(msj);
        }      
    });
    
}

// ******************************************************************************
// *                Funciones JS para el manejo de Reportes                     *
// ******************************************************************************

function Reportes(){
    var fechaini   = getID("fechaini");
    var fechafin   = getID("fechafin");
    var ArrayTemp  = new Array();
    var ArrayHume  = new Array();
    var MaxTC      = 0;
    var MinTC      = 0;
    var PromTc     = 0;
    var mediaT     = 0;
    var MaxH       = 0;
    var MinH       = 0;
    var PromH      = 0;
    var mediaH     = 0;

    var hoy = new Date();
    var dd = hoy.getDate();
    var mm = hoy.getMonth()+1;
    var yyyy = hoy.getFullYear();

    if(dd<10) {
        dd='0'+dd;
    } 
     
    if(mm<10) {
        mm='0'+mm;
    }

    var fecha_act = yyyy + "-" + mm + "-" + dd
    console.log('Fecha actual: '+fecha_act);

    if(fechaini > fecha_act){
        alert('Fecha inicio no puede ser mayor a la actual');
    }
    else if(fechafin > fecha_act){
        alert('Fecha fin no puede ser mayor a la actual');
    }
    else if(fechafin == ""){
        alert('fecha fin no se admite nulo');
    }
    else if(fechaini == ""){
        alert('fecha inicio no se admite nulo');
    }
    else if (fechaini > fechafin){
        alert('Fecha inicio no puede ser mayor a la final');
    }else{
        console.log(fechaini);
        console.log(fechafin);
        var r_temperatura_humedad = firebase.database().ref("temperatura_humedad/");
        r_temperatura_humedad.orderByChild("fecha_muestra").startAt(fechaini+"T00:00:00.000000").endAt(fechafin+"T23:59:59.000000")
        .on("child_added", function(snapshot){
            var Valorr_temperatura_humedad = snapshot.val();

        //Temperatura
            //Agrega valores al arreglo por cada iteración
            ArrayTemp.push(Valorr_temperatura_humedad.temperaturaC);
            //Valida por iteración cual es el numero mayor
            MaxTC = numeroMax(ArrayTemp);
            //Valida por iteración cual es el numero menor
            MinTC = numeroMin(ArrayTemp);
            //Promedio de temperatura
            let sumT = ArrayTemp.reduce((previous, current) => current += previous);
            PromTc  = dosDecimales(sumT / ArrayTemp.length);
            //Media de temperatura
            ArrayTemp.sort((a, b) => a - b);
            let lowMiddleT = Math.floor((ArrayTemp.length - 1) / 2);
            let highMiddleT = Math.ceil((ArrayTemp.length - 1) / 2);
            mediaT = (ArrayTemp[lowMiddleT] + ArrayTemp[highMiddleT]) / 2;


            console.log('Temperatura maxima es de: '+MaxTC);
            console.log('Temperatura minima es de: '+MinTC);
            console.log('Promedio de temperatura: ' +PromTc);
            console.log('Media de temperatura: ' +mediaT);
            
        //Humedad
            //Agrega valores al arreglo por cada iteración
            ArrayHume.push(Valorr_temperatura_humedad.humedad);
            //Valida por iteración cual es el numero mayor
            MaxH = numeroMax(ArrayHume);
            //Valida por iteración cual es el numero menor
            MinH = numeroMin(ArrayHume);
            //Promedio de humedad
            let sumH = ArrayHume.reduce((previous, current) => current += previous);
            PromH  = dosDecimales(sumH / ArrayHume.length);
            //Media de Humedad
            ArrayHume.sort((a, b) => a - b);
            let lowMiddleH = Math.floor((ArrayHume.length - 1) / 2);
            let highMiddleH = Math.ceil((ArrayHume.length - 1) / 2);
            mediaH = (ArrayHume[lowMiddleH] + ArrayHume[highMiddleH]) / 2;


            console.log('Humedad maxima es de: '+MaxH);
            console.log('Humedad minima es de: '+MinH);
            console.log('Promedio de Humedad: ' +PromH);
            console.log('Media de humedad: ' +mediaH);
            

        });
        
        pdf()
        
    }
}

function pdf() { 
    // Choose the element that our invoice is rendered in.
    const element = DivClassReporte();
    // Choose the element and save the PDF for our user.
    html2pdf()
      .set({ html2canvas: { scale: 4 } })
      .from(element)
      .save();
}

// función que reconstruye sección de PDF
function DivClassReporte(){
    return  '<html>																																	'+
    '<head>                                                                                                                                 '+
    '    <meta charset="utf-8">                                                                                                             '+
    '    <title>A simple, clean, and responsive HTML invoice template</title>                                                               '+
    '                                                                                                                                       '+
    '    <style>                                                                                                                            '+
    '    .invoice-box {                                                                                                                     '+
    '        max-width: 800px;                                                                                                              '+
    '        margin: auto;                                                                                                                  '+
    '        padding: 30px;                                                                                                                 '+
    '        border: 1px solid #eee;                                                                                                        '+
    '        box-shadow: 0 0 10px rgba(0, 0, 0, .15);                                                                                       '+
    '        font-size: 16px;                                                                                                               '+
    '        line-height: 24px;                                                                                                             '+
    '        font-family: '+"Helvetica Neue"+', '+"Helvetica"+', Helvetica, Arial, sans-serif;                                                      '+
    '        color: #555;                                                                                                                   '+
    '    }                                                                                                                                  '+
    '                                                                                                                                       '+
    '    .invoice-box table {                                                                                                               '+
    '        width: 100%;                                                                                                                   '+
    '        line-height: inherit;                                                                                                          '+
    '        text-align: left;                                                                                                              '+
    '    }                                                                                                                                  '+
    '                                                                                                                                       '+
    '    .invoice-box table td {                                                                                                            '+
    '        padding: 5px;                                                                                                                  '+
    '        vertical-align: top;                                                                                                           '+
    '    }                                                                                                                                  '+
    '                                                                                                                                       '+
    '    .invoice-box table tr td:nth-child(2) {                                                                                            '+
    '        text-align: right;                                                                                                             '+
    '    }                                                                                                                                  '+
    '                                                                                                                                       '+
    '    .invoice-box table tr.top table td {                                                                                               '+
    '        padding-bottom: 20px;                                                                                                          '+
    '    }                                                                                                                                  '+
    '                                                                                                                                       '+
    '    .invoice-box table tr.top table td.title {                                                                                         '+
    '        font-size: 45px;                                                                                                               '+
    '        line-height: 45px;                                                                                                             '+
    '        color: #333;                                                                                                                   '+
    '    }                                                                                                                                  '+
    '                                                                                                                                       '+
    '    .invoice-box table tr.information table td {                                                                                       '+
    '        padding-bottom: 40px;                                                                                                          '+
    '    }                                                                                                                                  '+
    '                                                                                                                                       '+
    '    .invoice-box table tr.heading td {                                                                                                 '+
    '        background: #eee;                                                                                                              '+
    '        border-bottom: 1px solid #ddd;                                                                                                 '+
    '        font-weight: bold;                                                                                                             '+
    '    }                                                                                                                                  '+
    '                                                                                                                                       '+
    '    .invoice-box table tr.details td {                                                                                                 '+
    '        padding-bottom: 20px;                                                                                                          '+
    '    }                                                                                                                                  '+
    '                                                                                                                                       '+
    '    .invoice-box table tr.item td{                                                                                                     '+
    '        border-bottom: 1px solid #eee;                                                                                                 '+
    '    }                                                                                                                                  '+
    '                                                                                                                                       '+
    '    .invoice-box table tr.item.last td {                                                                                               '+
    '        border-bottom: none;                                                                                                           '+
    '    }                                                                                                                                  '+
    '                                                                                                                                       '+
    '    .invoice-box table tr.total td:nth-child(2) {                                                                                      '+
    '        border-top: 2px solid #eee;                                                                                                    '+
    '        font-weight: bold;                                                                                                             '+
    '    }                                                                                                                                  '+
    '                                                                                                                                       '+
    '    @media only screen and (max-width: 600px) {                                                                                        '+
    '        .invoice-box table tr.top table td {                                                                                           '+
    '            width: 100%;                                                                                                               '+
    '            display: block;                                                                                                            '+
    '            text-align: center;                                                                                                        '+
    '        }                                                                                                                              '+
    '                                                                                                                                       '+
    '        .invoice-box table tr.information table td {                                                                                   '+
    '            width: 100%;                                                                                                               '+
    '            display: block;                                                                                                            '+
    '            text-align: center;                                                                                                        '+
    '        }                                                                                                                              '+
    '    }                                                                                                                                  '+
    '                                                                                                                                       '+
    '    /** RTL **/                                                                                                                        '+
    '    .rtl {                                                                                                                             '+
    '        direction: rtl;                                                                                                                '+
    '        font-family: Tahoma, '+"Helvetica Neue"+', '+"Helvetica"+', Helvetica, Arial, sans-serif;                                              '+
    '    }                                                                                                                                  '+
    '                                                                                                                                       '+
    '    .rtl table {                                                                                                                       '+
    '        text-align: right;                                                                                                             '+
    '    }                                                                                                                                  '+
    '                                                                                                                                       '+
    '    .rtl table tr td:nth-child(2) {                                                                                                    '+
    '        text-align: left;                                                                                                              '+
    '    }                                                                                                                                  '+
    '    </style>                                                                                                                           '+
    '</head>                                                                                                                                '+
    '                                                                                                                                       '+
    '<body>                                                                                                                                 '+
    '    <div class="invoice-box">                                                                                                          '+
    '        <table cellpadding="0" cellspacing="0">                                                                                        '+
    '            <tr class="top">                                                                                                           '+
    '                <td colspan="2">                                                                                                       '+
    '                    <table>                                                                                                            '+
    '                        <tr>                                                                                                           '+
    '                            <td class="title">                                                                                         '+
    '                                <img src="" style="width:100%; max-width:300px;">            '+
    '                            </td>                                                                                                      '+
    '                                                                                                                                       '+
    '                            <td>                                                                                                       '+
    '                                Invoice #: 123<br>                                                                                     '+
    '                                Created: January 1, 2015<br>                                                                           '+
    '                                Due: February 1, 2015                                                                                  '+
    '                            </td>                                                                                                      '+
    '                        </tr>                                                                                                          '+
    '                    </table>                                                                                                           '+
    '                </td>                                                                                                                  '+
    '            </tr>                                                                                                                      '+
    '                                                                                                                                       '+
    '            <tr class="information">                                                                                                   '+
    '                <td colspan="2">                                                                                                       '+
    '                    <table>                                                                                                            '+
    '                        <tr>                                                                                                           '+
    '                            <td>                                                                                                       '+
    '                                Sparksuite, Inc.<br>                                                                                   '+
    '                                12345 Sunny Road<br>                                                                                   '+
    '                                Sunnyville, CA 12345                                                                                   '+
    '                            </td>                                                                                                      '+
    '                                                                                                                                       '+
    '                            <td>                                                                                                       '+
    '                                Acme Corp.<br>                                                                                         '+
    '                                John Doe<br>                                                                                           '+
    '                                john@example.com                                                                                       '+
    '                            </td>                                                                                                      '+
    '                        </tr>                                                                                                          '+
    '                    </table>                                                                                                           '+
    '                </td>                                                                                                                  '+
    '            </tr>                                                                                                                      '+
    '                                                                                                                                       '+
    '            <tr class="heading">                                                                                                       '+
    '                <td>                                                                                                                   '+
    '                    Payment Method                                                                                                     '+
    '                </td>                                                                                                                  '+
    '                                                                                                                                       '+
    '                <td>                                                                                                                   '+
    '                    Check #                                                                                                            '+
    '                </td>                                                                                                                  '+
    '            </tr>                                                                                                                      '+
    '                                                                                                                                       '+
    '            <tr class="details">                                                                                                       '+
    '                <td>                                                                                                                   '+
    '                    Check                                                                                                              '+
    '                </td>                                                                                                                  '+
    '                                                                                                                                       '+
    '                <td>                                                                                                                   '+
    '                    1000                                                                                                               '+
    '                </td>                                                                                                                  '+
    '            </tr>                                                                                                                      '+
    '                                                                                                                                       '+
    '            <tr class="heading">                                                                                                       '+
    '                <td>                                                                                                                   '+
    '                    Item                                                                                                               '+
    '                </td>                                                                                                                  '+
    '                                                                                                                                       '+
    '                <td>                                                                                                                   '+
    '                    Price                                                                                                              '+
    '                </td>                                                                                                                  '+
    '            </tr>                                                                                                                      '+
    '                                                                                                                                       '+
    '            <tr class="item">                                                                                                          '+
    '                <td>                                                                                                                   '+
    '                    Website design                                                                                                     '+
    '                </td>                                                                                                                  '+
    '                                                                                                                                       '+
    '                <td>                                                                                                                   '+
    '                    $300.00                                                                                                            '+
    '                </td>                                                                                                                  '+
    '            </tr>                                                                                                                      '+
    '                                                                                                                                       '+
    '            <tr class="item">                                                                                                          '+
    '                <td>                                                                                                                   '+
    '                    Hosting (3 months)                                                                                                 '+
    '                </td>                                                                                                                  '+
    '                                                                                                                                       '+
    '                <td>                                                                                                                   '+
    '                    $75.00                                                                                                             '+
    '                </td>                                                                                                                  '+
    '            </tr>                                                                                                                      '+
    '                                                                                                                                       '+
    '            <tr class="item last">                                                                                                     '+
    '                <td>                                                                                                                   '+
    '                    Domain name (1 year)                                                                                               '+
    '                </td>                                                                                                                  '+
    '                                                                                                                                       '+
    '                <td>                                                                                                                   '+
    '                    $10.00                                                                                                             '+
    '                </td>                                                                                                                  '+
    '            </tr>                                                                                                                      '+
    '                                                                                                                                       '+
    '            <tr class="total">                                                                                                         '+
    '                <td></td>                                                                                                              '+
    '                                                                                                                                       '+
    '                <td>                                                                                                                   '+
    '                   Total: $385.00                                                                                                      '+
    '                </td>                                                                                                                  '+
    '            </tr>                                                                                                                      '+
    '        </table>                                                                                                                       '+
    '    </div>                                                                                                                             '+
    '</body>                                                                                                                                '+
    '</html>                                                                                                                                ';  
}
