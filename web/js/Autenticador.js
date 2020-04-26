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

// Función que toma el valor de cada id de los elementos en la pagina por Ej: los Id de los elementos input
function getID(id){
    return document.getElementById(id).value;
}

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

// ******************************************************************************
// *           Funciones JS para el manejo de datos de las graficas             *
// ******************************************************************************


// Variables que genera numeros aleatorios para ser usados en la grafica
var randomScalingFactorTemperatura = function(){ return Math.round(Math.random()*1000)}; 
var randomScalingFactorHumedad     = function(){ return Math.round(Math.random()*1000)};

var lineChartDataT = {
    labels : ["January","February","March","April","May","June","July"],
    datasets : [
        {
            label: "My Firts dataset",
            fillColor : "rgba(48, 164, 255, 0.2)",
            strokeColor : "rgba(48, 164, 255, 1)",
            pointColor : "rgba(48, 164, 255, 1)",
            pointStrokeColor : "#fff",
            pointHighlightFill : "#fff",
            pointHighlightStroke : "rgba(48, 164, 255, 1)",
            data : [randomScalingFactorTemperatura(),randomScalingFactorTemperatura(),randomScalingFactorTemperatura(),randomScalingFactorTemperatura(),randomScalingFactorTemperatura(),randomScalingFactorTemperatura(),randomScalingFactorTemperatura()]
        }
    ]

}

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

