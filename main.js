/**
 * The canvas context is an object with properties and methods
 * you can use to render graphics inside the canvas element.
 */
const TABLERO = document.getElementById('tablero');
const TABLERO_CTX = TABLERO.getContext('2d');
const REINICIAR_BTN = document.getElementById('reiniciar');
const PUNTAJE_TXT = document.getElementById('puntaje');

/**
 * Controles
 */
const LEFT_KEY = 37;
const RIGHT_KEY = 39;
const UP_KEY = 38;
const DOWN_KEY = 40;

/**
 * Variables
 */
let dx, dy, timeout, comida, puntaje, culebra;

function inicializar() {
  dx = 10;
  dy = 0;
  timeout = 100;
  comida;
  puntaje = 0;
  culebra = [
    { x: 50, y: 100 }, // Cabeza
    { x: 40, y: 100 },
    { x: 30, y: 100 }
  ];
  crearComida();
  main();
}

function limpiarTablero() {
  TABLERO_CTX.fillStyle = 'black';
  TABLERO_CTX.fillRect(0, 0, TABLERO.width, TABLERO.height);
}

function dibujarCulebra() {
  TABLERO_CTX.fillStyle = 'green';
  for (let i = 0; i < culebra.length; i++) {
    TABLERO_CTX.fillRect(culebra[i].x, culebra[i].y, 10, 10);  
  }
}

function incrementarPuntos() {
  puntaje += 10;
  PUNTAJE_TXT.innerText = puntaje;
}

function aumentarVelocidad() {
  if (timeout > 0) {
    timeout -= 2;
  }
}

function moverCulebra() {
  const CABEZA = {
    x: culebra[0].x + dx,
    y: culebra[0].y + dy
  };
  // Poner la nueva cabeza delante de la anterior
  culebra.unshift(CABEZA);
  // Si la cabeza y la comida estan en la misma posición
  // significa que comió y se crea una comida nueva
  if (CABEZA.x === comida.x && CABEZA.y === comida.y) {
    incrementarPuntos();
    aumentarVelocidad();
    crearComida();
  } else {
    // Quitar el último cuadrado del cuerpo si no ha comido
    culebra.pop();
  }
}

function cambiarDireccion(event) {
  const YENDO_ARRIBA = dy === -10;
  const YENDO_ABAJO = dy === 10;
  const YENDO_DERECHA = dx === 10;  
  const YENDO_IZQUIERDA = dx === -10;
  if (event.keyCode === LEFT_KEY && !YENDO_DERECHA) {
    dx = -10;
    dy = 0;  
  }

  if (event.keyCode === UP_KEY && !YENDO_ABAJO) {
    dx = 0;
    dy = -10;
  }

  if (event.keyCode === RIGHT_KEY && !YENDO_IZQUIERDA) {
    dx = 10;
    dy = 0;
  }

  if (event.keyCode === DOWN_KEY && !YENDO_ARRIBA) {
    dx = 0;
    dy = 10;
  }
}

function perdioJuego() {
  const CABEZA = culebra[0];
  for (let i = 4; i < culebra.length; i++) {
    // Se inicia i en 4 porque las únicas partes con las que la cabeza
    // puede chocar son las que estan a partir de esa posición
    if (CABEZA.x === culebra[i].x && CABEZA.y === culebra[i].y) {
      return true;
    }
  }
  // Se resta 10 para restar el ancho de la cabeza
  return CABEZA.x > TABLERO.width - 10
  || CABEZA.x < 0
  || CABEZA.y > TABLERO.height - 10
  || CABEZA.y < 0;
}

function generarPosicion(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function crearComida() {
  const POS_X = generarPosicion(0, TABLERO.width - 10);
  const POS_Y = generarPosicion(0, TABLERO.height - 10);
  comida = {
    x: POS_X,
    y: POS_Y
  };
  for (let i = 0; i < culebra.length; i++) {
    if (culebra[i].x === comida.x && culebra[i].y === comida.y) {
      return crearComida();
    }
  }
}

function dibujarComida() {
  TABLERO_CTX.fillStyle = 'yellow';
  TABLERO_CTX.fillRect(comida.x, comida.y, 10, 10);
}

function terminarJuego() {
  limpiarTablero();
  REINICIAR_BTN.disabled = false;
  TABLERO_CTX.fillStyle = 'red';
  TABLERO_CTX.font = 'bold 24px Arial';
  TABLERO_CTX.fillText('¡Perdiste!', 45, 105);
}

function reiniciar() {
  inicializar();
  REINICIAR_BTN.disabled = true;
  PUNTAJE_TXT.innerText = puntaje;
}

function main() {
  if (perdioJuego()) {
    terminarJuego();
    return;
  };
  setTimeout(function() {
    limpiarTablero();
    moverCulebra();
    dibujarCulebra();
    dibujarComida();
    main();
  }, timeout);
}

document.addEventListener('keydown', cambiarDireccion);
REINICIAR_BTN.addEventListener('click', reiniciar);

inicializar();
