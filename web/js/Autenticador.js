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
            location.href="Error/error401.html";
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
        console.log(Valortemperatura_humedad_actual);
        var result = DivClassInicio(Valortemperatura_humedad_actual.temperaturaC,Valortemperatura_humedad_actual.temperaturaF,Valortemperatura_humedad_actual.humedad,Valortemperatura_humedad_actual.CantLecturas);
        console.log(result);
        innerHTML("loadTempC",result);
        
        ConsultaDatosGraficaTiempo();
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
    function ConsultaDatosGraficaTiempo(){
        var tiempo = new Array();
        var temperatura = new Array();
        var temperatura_humedad = firebase.database().ref("temperatura_humedad/");
        temperatura_humedad.orderByChild("fecha_muestra").limitToLast(7).on("child_added", function(snapshot) {
            var Valortemperatura_humedad = snapshot.val();

            
            tiempo.push(Valortemperatura_humedad.hora);
            console.log(tiempo);

            temperatura.push(Valortemperatura_humedad.temperaturaC);
            console.log(temperatura);  // Revisar



            var randomScalingFactorTemperatura = function(posicion){ 
                var temp = temperatura[posicion];
                console.log()
                return Math.round(temp)
            }; 

            // -=========================== Sección Temperatura =============================-
            var lineChartDataT = {
                labels : tiempo,
                datasets : [
                    {
                        label: "My Firts dataset",
                        fillColor : "rgba(48, 164, 255, 0.2)",
                        strokeColor : "rgba(48, 164, 255, 1)",
                        pointColor : "rgba(48, 164, 255, 1)",
                        pointStrokeColor : "#fff",
                        pointHighlightFill : "#fff",
                        pointHighlightStroke : "rgba(48, 164, 255, 1)",
                        data : [randomScalingFactorTemperatura(0),randomScalingFactorTemperatura(1),randomScalingFactorTemperatura(2),randomScalingFactorTemperatura(3),randomScalingFactorTemperatura(4),randomScalingFactorTemperatura(5),randomScalingFactorTemperatura(6)]
                    }
                ]

            }
            var resulttemp = DivClassGraficaT();
                console.log(resulttemp);
                innerHTML("loadTempG",resulttemp);

            var chart1 = document.getElementById("line-chart-temperatura").getContext("2d");
                window.myLine = new Chart(chart1).Line(lineChartDataT, {
                responsive: true,
                scaleLineColor: "rgba(0,0,0,.2)",
                scaleGridLineColor: "rgba(0,0,0,.05)",
                scaleFontColor: "#c5c7cc"
			    });

        });
        
    }


// 
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




    // Variables que genera numeros aleatorios para ser usados en la grafica
    
    var randomScalingFactorHumedad     = function(){ return Math.round(Math.random()*70)};




// -=========================== Secciòn Humedad =============================-

    var lineChartDataH = {
        labels : ["January","February","March","April","May","June","July"],
        datasets : [
            {
                label: "My First dataset",
                fillColor : "rgba(220,220,220,0.2)",
                strokeColor : "rgba(220,220,220,1)",
                pointColor : "rgba(220,220,220,1)",
                pointStrokeColor : "#fff",
                pointHighlightFill : "#fff",
                pointHighlightStroke : "rgba(220,220,220,1)",
                data : [randomScalingFactorHumedad(),randomScalingFactorHumedad(),randomScalingFactorHumedad(),randomScalingFactorHumedad(),randomScalingFactorHumedad(),randomScalingFactorHumedad(),randomScalingFactorHumedad()]
            }
        ]

    }



// ******************************************************************************
// *                Funciones JS para el manejo de Reportes                     *
// ******************************************************************************

function Resportes(){
 //Mostrar Datos de la Base

        firebase.database().ref('temperatura_humedad_actual').on('value',function(snapshot){
            var table= document.getElementById('tablenames');
            table.innerHTML='';
            var data = snapshot.val();
            var con= 0;
            for (const key in data) {
                table.innerHTML+=`
                <tr>
                <th scope="row">
                    ${con+1}
                </th>
                <td>${data[key].fecha_muestra}</td>
                <td>${data[key].humedad}</td>
                <td>${data[key].id_sensor}</td>
                <td>${data[key].temperaturaC}</td>
                <td>${data[key].temperaturaF}</td>
                </tr>

                `;
                con++;
            }
        });

        //Condicion Filtro en la tabla 
        let filterInput = document.getElementById('filter');
        filterInput.addEventListener('keyup',function(){
            let filterValue= document.getElementById('filter').value;
            var table = document.getElementById('tablenames');
            let tr = table.querySelectorAll('tr');

            for (let index = 0; index < tr.length; index++) {
                let val = tr[index].getElementsByTagName('td')[0];
                if (val.innerHTML.indexOf(filterValue) > -1) {
                    tr[index].style.display='';
                } else {
                    tr[index].style.display='none';
                }

            }
        });
}
