// EXPRESIONES REGULARES (Regex)
// Explicación: Las regex son patrones que usamos para validar si un texto cumple ciertas reglas

// Regex para correo: verifica que tenga formato correo@dominio.com
var regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Regex para nombre: solo permite letras (con tildes) y espacios
var regexNombre = /^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$/;

// Regex para contraseña segura: debe tener al menos una minúscula, una mayúscula, un número, un símbolo y mínimo 6 caracteres
var regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

// Regex para celular: solo números, entre 7 y 12 dígitos
var regexCelular = /^[0-9]{7,12}$/;

// Variables globales para guardar los datos de los usuarios
// Como no podemos usar una base de datos, guardamos todo en variables
var usuariosNombres = []; // Guarda los nombres
var usuariosCorreos = []; // Guarda los correos
var usuariosCelulares = []; // Guarda los celulares
var usuariosPasswords = []; // Guarda las contraseñas
var usuariosIntentos = []; // Cuenta los intentos fallidos de cada usuario
var usuariosBloqueados = []; // Dice si el usuario está bloqueado (true/false)

// FUNCIÓN: Mostrar u ocultar formularios
function mostrarFormulario(cual) {
    // Ocultar todos los formularios
    document.getElementById('formRegistro').classList.remove('activo');
    document.getElementById('formLogin').classList.remove('activo');
    document.getElementById('formRecuperar').classList.remove('activo');
    document.getElementById('formBienvenida').classList.remove('activo');
    
    // Mostrar el formulario que queremos
    if (cual === 'registro') {
        document.getElementById('formRegistro').classList.add('activo');
        limpiarMensajes();
    } else if (cual === 'login') {
        document.getElementById('formLogin').classList.add('activo');
        limpiarMensajes();
    } else if (cual === 'recuperar') {
        document.getElementById('formRecuperar').classList.add('activo');
        limpiarMensajes();
    }
}

// FUNCIÓN: Mostrar/ocultar contraseña
function togglePassword(idInput) {
    var input = document.getElementById(idInput);
    if (input.type === 'password') {
        input.type = 'text';
    } else {
        input.type = 'password';
    }
}

// FUNCIÓN: Mostrar mensaje en pantalla
function mostrarMensaje(idMensaje, texto, tipo) {
    var elemento = document.getElementById(idMensaje);
    elemento.textContent = texto;
    elemento.className = 'mensaje activo ' + tipo;
}

// FUNCIÓN: Limpiar todos los mensajes
function limpiarMensajes() {
    var mensajes = document.querySelectorAll('.mensaje');
    for (var i = 0; i < mensajes.length; i++) {
        mensajes[i].classList.remove('activo');
    }
}

// FUNCIÓN: Buscar la posición de un usuario por su correo
function buscarUsuario(correo) {
    for (var i = 0; i < usuariosCorreos.length; i++) {
        if (usuariosCorreos[i] === correo) {
            return i; // Retorna la posición donde está el usuario
        }
    }
    return -1; // Si no lo encuentra, retorna -1
}

// FUNCIÓN: Registrar un nuevo usuario
function registrarUsuario() {
    // Obtener los valores que el usuario escribió
    var nombre = document.getElementById('nombreRegistro').value;
    var correo = document.getElementById('correoRegistro').value;
    var celular = document.getElementById('celularRegistro').value;
    var password = document.getElementById('passwordRegistro').value;

    // VALIDACIONES - Verificar que los campos no estén vacíos
    if (nombre === '' || correo === '' || celular === '' || password === '') {
        mostrarMensaje('mensajeRegistro', 'Todos los campos son obligatorios', 'error');
        return;
    }

    // Validar nombre con regex
    if (!regexNombre.test(nombre)) {
        mostrarMensaje('mensajeRegistro', 'El nombre solo puede contener letras y espacios', 'error');
        return;
    }

    // Validar correo con regex
    if (!regexCorreo.test(correo)) {
        mostrarMensaje('mensajeRegistro', 'El correo electrónico no es válido', 'error');
        return;
    }

    // Validar celular con regex
    if (!regexCelular.test(celular)) {
        mostrarMensaje('mensajeRegistro', 'El celular debe tener entre 7 y 12 dígitos', 'error');
        return;
    }

    // Validar contraseña con regex
    if (!regexPassword.test(password)) {
        mostrarMensaje('mensajeRegistro', 'La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula, un número y un símbolo', 'error');
        return;
    }

    // Verificar si el correo ya está registrado
    if (buscarUsuario(correo) !== -1) {
        mostrarMensaje('mensajeRegistro', 'Este correo ya está registrado', 'error');
        return;
    }

    // Si todo está bien, guardar el usuario
    usuariosNombres.push(nombre);
    usuariosCorreos.push(correo);
    usuariosCelulares.push(celular);
    usuariosPasswords.push(password);
    usuariosIntentos.push(0); // Empieza con 0 intentos fallidos
    usuariosBloqueados.push(false); // No está bloqueado

    // Mostrar mensaje de éxito
    mostrarMensaje('mensajeRegistro', '¡Cuenta creada exitosamente! Ya puedes iniciar sesión', 'exito');

    // Limpiar el formulario
    document.getElementById('nombreRegistro').value = '';
    document.getElementById('correoRegistro').value = '';
    document.getElementById('celularRegistro').value = '';
    document.getElementById('passwordRegistro').value = '';

    // Esperar 2 segundos y cambiar al login
    setTimeout(function() {
        mostrarFormulario('login');
    }, 2000);
}

// FUNCIÓN: Iniciar sesión
function iniciarSesion() {
    var correo = document.getElementById('correoLogin').value;
    var password = document.getElementById('passwordLogin').value;

    // Validar que los campos no estén vacíos
    if (correo === '' || password === '') {
        mostrarMensaje('mensajeLogin', 'Debes completar todos los campos', 'error');
        return;
    }

    // Buscar al usuario
    var posicion = buscarUsuario(correo);

    // Si el usuario no existe
    if (posicion === -1) {
        mostrarMensaje('mensajeLogin', 'Usuario o contraseña incorrectos', 'error');
        return;
    }

    // Verificar si la cuenta está bloqueada
    if (usuariosBloqueados[posicion] === true) {
        mostrarMensaje('mensajeLogin', 'Cuenta bloqueada por intentos fallidos. Debes recuperar tu contraseña', 'error');
        document.getElementById('enlaceRecuperar').style.display = 'inline';
        return;
    }

    // Verificar la contraseña
    if (usuariosPasswords[posicion] === password) {
        // Contraseña correcta - Reiniciar intentos y dar bienvenida
        usuariosIntentos[posicion] = 0;
        
        document.getElementById('mensajeBienvenida').textContent = 'Bienvenido al sistema, ' + usuariosNombres[posicion];
        document.getElementById('formLogin').classList.remove('activo');
        document.getElementById('formBienvenida').classList.add('activo');
        
        // Limpiar campos
        document.getElementById('correoLogin').value = '';
        document.getElementById('passwordLogin').value = '';
    } else {
        // Contraseña incorrecta - Incrementar intentos
        usuariosIntentos[posicion] = usuariosIntentos[posicion] + 1;

        if (usuariosIntentos[posicion] >= 3) {
            // Bloquear la cuenta
            usuariosBloqueados[posicion] = true;
            mostrarMensaje('mensajeLogin', 'Cuenta bloqueada por intentos fallidos. Debes recuperar tu contraseña', 'error');
            document.getElementById('enlaceRecuperar').style.display = 'inline';
        } else {
            var intentosRestantes = 3 - usuariosIntentos[posicion];
            mostrarMensaje('mensajeLogin', 'Usuario o contraseña incorrectos. Te quedan ' + intentosRestantes + ' intentos', 'error');
        }
    }
}

// FUNCIÓN: Recuperar contraseña
function recuperarPassword() {
    var correo = document.getElementById('correoRecuperar').value;
    var nuevaPass = document.getElementById('nuevaPassword').value;

    // Validar campos vacíos
    if (correo === '' || nuevaPass === '') {
        mostrarMensaje('mensajeRecuperar', 'Debes completar todos los campos', 'error');
        return;
    }

    // Buscar al usuario
    var posicion = buscarUsuario(correo);

    if (posicion === -1) {
        mostrarMensaje('mensajeRecuperar', 'Este correo no está registrado', 'error');
        return;
    }

    // Validar la nueva contraseña con regex
    if (!regexPassword.test(nuevaPass)) {
        mostrarMensaje('mensajeRecuperar', 'La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula, un número y un símbolo', 'error');
        return;
    }

    // Actualizar la contraseña
    usuariosPasswords[posicion] = nuevaPass;
    
    // Desbloquear la cuenta y reiniciar intentos
    usuariosBloqueados[posicion] = false;
    usuariosIntentos[posicion] = 0;

    // Mostrar mensaje de éxito
    mostrarMensaje('mensajeRecuperar', 'Contraseña actualizada. Ahora puedes iniciar sesión', 'exito');

    // Limpiar campos
    document.getElementById('correoRecuperar').value = '';
    document.getElementById('nuevaPassword').value = '';

    // Esperar 2 segundos y volver al login
    setTimeout(function() {
        mostrarFormulario('login');
        document.getElementById('enlaceRecuperar').style.display = 'none';
    }, 2000);
}

// FUNCIÓN: Cerrar sesión
function cerrarSesion() {
    mostrarFormulario('login');
}