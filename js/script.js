const fecha = document.querySelector('#fecha');
const input = document.querySelector('#input');
const lista = document.querySelector('#lista-tareas');
const enter = document.querySelector('#enter');
const check = 'fa-check-circle';
const nocheck = 'fa-circle';
const tachado = 'tachado';
let id;
let almacenTareas;

// Función que colocará la fecha
const FECHA = new Date();
fecha.innerHTML = FECHA.toLocaleDateString({ weekday: 'long', month: 'short', day: 'numeric' });


// Función para guardar en el Local Storage utilizando una promesa
function guardarEnLocalStorage(key, data) {
  return new Promise((resolve, reject) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

// Función para cargar desde el Local Storage utilizando una promesa
function cargarDesdeLocalStorage(key) {
  return new Promise((resolve, reject) => {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        resolve(JSON.parse(data));
      } else {
        resolve([]);
      }
    } catch (error) {
      reject(error);
    }
  });
}


// Función para agregar una nueva tarea
function addTarea(tarea, id, realizada, eliminada) {
  if (eliminada) {
    return;
  }

  const hecho = realizada ? check : nocheck;
  const linea = realizada ? tachado : '';

  const elemento = `<li id='elemento'>
        <i class="far ${hecho}" data="realizada" id=${id}></i>
        <p class="text ${linea}">${tarea}</p>
        <i class="fas fa-trash de" data="eliminada" id=${id}></i>
        </li>`;

  lista.insertAdjacentHTML('beforeend', elemento);
}

// Función para marcar una tarea como realizada o no realizada
function tareaHecha(accion) {
  accion.classList.toggle(check);
  accion.classList.toggle(nocheck);
  accion.parentNode.querySelector('.text').classList.toggle(tachado);
  almacenTareas[accion.id].realizada = almacenTareas[accion.id].realizada ? false : true;
}

// Función para borrar una tarea
function tareaBorrada(accion) {
  accion.parentNode.parentNode.removeChild(accion.parentNode);
  almacenTareas[accion.id].eliminada = true;
}

// Función para cargar tareas desde el almacenamiento
function cargarAlmacen(DATA) {
  DATA.forEach(function (i) {
    addTarea(i.nombre, i.id, i.realizada, i.eliminada);
  });
}


// Al hacer click en el boton se agrega la tarea nueva
enter.addEventListener('click', () => {
  const tarea = input.value;
  if (tarea) {
    addTarea(tarea, id, false, false);
    almacenTareas.push({
      nombre: tarea,
      id: id,
      realizada: false,
      eliminada: false,
    });

    guardarEnLocalStorage('Almacen', almacenTareas)
      .then(() => {
        input.value = '';
        id++;
        console.log(almacenTareas);
      })
      .catch(error => {
        console.error('Error al guardar en el Local Storage:', error);
      });
  }
});

// Al apretar enter tambien se agrega la tarea

document.addEventListener('keyup', function (event) {
  if (event.key == 'Enter') {
    const tarea = input.value;
    if (tarea) {
      addTarea(tarea, id, false, false);
      almacenTareas.push({
        nombre: tarea,
        id: id,
        realizada: false,
        eliminada: false,
      });

      guardarEnLocalStorage('Almacen', almacenTareas)
        .then(() => {
          input.value = '';
          id++;
          console.log(almacenTareas);
        })
        .catch(error => {
          console.error('Error al guardar en el Local Storage:', error);
        });
    }
  }
});

lista.addEventListener('click', function (event) {
  const accion = event.target;
  const accionData = accion.attributes.data.value;
  if (accionData == 'realizada') {
    tareaHecha(accion);
  } else if (accionData == 'eliminada') {
    tareaBorrada(accion);
  }

  guardarEnLocalStorage('Almacen', almacenTareas)
    .catch(error => {
      console.error('Error al guardar en el Local Storage:', error);
    });
});

// Manejo del Local Storage
cargarDesdeLocalStorage('Almacen')
  .then(data => {
    almacenTareas = data;
    id = almacenTareas.length;
    cargarAlmacen(almacenTareas);
  })
  .catch(error => {
    console.error('Error al cargar desde el Local Storage:', error);
    almacenTareas = [];
    id = 0;
  });
