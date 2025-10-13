const track = document.querySelector('.carousel-track');
const slides = Array.from(track.children);
const nextButton = document.querySelector('.carousel-button--right');
const prevButton = document.querySelector('.carousel-button--left');
const slideWidth = slides[0].getBoundingClientRect().width;

// --- Variables para el arrastre ---
let isDown = false;
let startX;
let currentTranslate;
let prevTranslate;
let animationID;
let currentIndex = 0;

// --- Funciones de Arrastre ---

// Posición inicial del arrastre
const startDrag = (e) => {
  isDown = true;
  track.classList.add('dragging');
  
  startX = getPositionX(e);
  // currentTranslate es la posición actual de la pista
  currentTranslate = currentIndex * -slideWidth;
  prevTranslate = currentTranslate;
  
  // Detenemos la animación si existe
  cancelAnimationFrame(animationID);
};

// Movimiento durante el arrastre
const drag = (e) => {
  if (!isDown) return; // Si no estamos arrastrando, no hacemos nada
  e.preventDefault();
  
  const currentPosition = getPositionX(e);
  const movedBy = currentPosition - startX;
  
  // Calculamos la nueva posición
  currentTranslate = prevTranslate + movedBy;
  
  // Aplicamos la transformación
  setSliderPosition();
};

// Fin del arrastre
const endDrag = () => {
  if (!isDown) return;
  isDown = false;
  track.classList.remove('dragging');
  
  // Lógica para "ajustar" (snap) al slide más cercano
  const movedBy = currentTranslate - prevTranslate;
  
  // Si el arrastre fue significativo, movemos al siguiente/anterior
  if (movedBy < -100 && currentIndex < slides.length - 1) {
    currentIndex += 1;
  } else if (movedBy > 100 && currentIndex > 0) {
    currentIndex -= 1;
  }
  
  // Ajustamos la posición al slide actual con animación
  setPositionByIndex();
};

// --- Funciones Auxiliares ---

const getPositionX = (e) => {
  return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
};

const setSliderPosition = () => {
  track.style.transform = `translateX(${currentTranslate}px)`;
};

const setPositionByIndex = () => {
  currentTranslate = currentIndex * -slideWidth;
  prevTranslate = currentTranslate;
  setSliderPosition();
};

// --- Event Listeners ---

// Eventos de ratón
track.addEventListener('mousedown', startDrag);
track.addEventListener('mousemove', drag);
track.addEventListener('mouseup', endDrag);
track.addEventListener('mouseleave', endDrag);

// Eventos táctiles (para móviles)
track.addEventListener('touchstart', startDrag);
track.addEventListener('touchmove', drag);
track.addEventListener('touchend', endDrag);

// Prevenimos el menú contextual al hacer clic derecho
window.addEventListener('contextmenu', (e) => e.preventDefault());const track = document.querySelector('.carousel-track');
const slides = Array.from(track.children);
const slideWidth = slides[0].getBoundingClientRect().width;

// --- Variables para el arrastre ---
let isDown = false;
let startX;
let currentTranslate;
let prevTranslate;
let animationID;

// --- ¡NUEVA LÓGICA PARA EL CARRUSEL INFINITO! ---

// 1. Clonamos todos los slides y los añadimos al final
const slidesFragment = document.createDocumentFragment();
slides.forEach(slide => slidesFragment.appendChild(slide.cloneNode(true)));
track.appendChild(slidesFragment);

// 2. Clonamos el ÚLTIMO slide y lo añadimos al principio
const lastSlideClone = slides[slides.length - 1].cloneNode(true);
track.prepend(lastSlideClone);

// 3. Obtenemos todos los slides (originales + clones) y recalculamos el ancho
const allSlides = Array.from(track.children);
const newSlideWidth = allSlides[0].getBoundingClientRect().width;

// 4. Posicionamos el carrusel en el PRIMER slide REAL (índice 1, no el clon)
let currentIndex = 1;
currentTranslate = -newSlideWidth;
prevTranslate = currentTranslate;
setSliderPosition();


// --- Funciones de Arrastre (sin cambios en su mayoría) ---

const startDrag = (e) => {
  isDown = true;
  track.classList.add('dragging');
  startX = getPositionX(e);
  currentTranslate = currentIndex * -newSlideWidth;
  prevTranslate = currentTranslate;
  cancelAnimationFrame(animationID);
};

const drag = (e) => {
  if (!isDown) return;
  e.preventDefault();
  const currentPosition = getPositionX(e);
  const movedBy = currentPosition - startX;
  currentTranslate = prevTranslate + movedBy;
  setSliderPosition();
};

// --- ¡LA FUNCIÓN MÁS IMPORTANTE! ---
const endDrag = () => {
  if (!isDown) return;
  isDown = false;
  track.classList.remove('dragging');

  const movedBy = currentTranslate - prevTranslate;

  if (movedBy < -100) currentIndex += 1;
  if (movedBy > 100) currentIndex -= 1;

  // --- AQUÍ OCURRE LA MAGIA DEL BUCLE ---
  
  // Si hemos llegado al clon del PRIMER slide (al final)
  if (currentIndex === 0) {
    track.style.transition = 'none'; // Quitamos la animación para el salto
    currentTranslate = -(allSlides.length - 2) * newSlideWidth;
    prevTranslate = currentTranslate;
    currentIndex = allSlides.length - 2; // Volvemos al último slide REAL
    setSliderPosition();
    // Volvemos a poner la animación para el siguiente movimiento
    setTimeout(() => {
      track.style.transition = 'transform 0.5s ease-in-out';
    }, 50);
  } 
  // Si hemos llegado al clon del ÚLTIMO slide (al principio)
  else if (currentIndex === allSlides.length - 1) {
    track.style.transition = 'none'; // Quitamos la animación para el salto
    currentTranslate = -newSlideWidth;
    prevTranslate = currentTranslate;
    currentIndex = 1; // Volvemos al primer slide REAL
    setSliderPosition();
    // Volvemos a poner la animación
    setTimeout(() => {
      track.style.transition = 'transform 0.5s ease-in-out';
    }, 50);
  } 
  // Si es un movimiento normal, solo ajustamos la posición
  else {
    setPositionByIndex();
  }
};

// --- Funciones Auxiliares ---

const getPositionX = (e) => e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;

const setSliderPosition = () => {
  track.style.transform = `translateX(${currentTranslate}px)`;
};

const setPositionByIndex = () => {
  currentTranslate = currentIndex * -newSlideWidth;
  prevTranslate = currentTranslate;
  setSliderPosition();
};

// --- Event Listeners (sin cambios) ---
track.addEventListener('mousedown', startDrag);
track.addEventListener('mousemove', drag);
track.addEventListener('mouseup', endDrag);
track.addEventListener('mouseleave', endDrag);
track.addEventListener('touchstart', startDrag);
track.addEventListener('touchmove', drag);
track.addEventListener('touchend', endDrag);
window.addEventListener('contextmenu', (e) => e.preventDefault());
