const divProductos = document.getElementById('divProductos');
const inputEmail = document.getElementById('email');
const inputMensaje = document.getElementById('mensaje');
const formMensajes = document.getElementById('formMensajes');
const selectorUsuario = document.getElementById('selectorUsuario');
const socket = io({
  query: {
    emailUsuario: inputEmail?.value
  }
});

let mensajesUsuarios;
let opcionSeleccionada = undefined;

function clearFile(type) {
  const file = type === 'single' ? document.getElementById('archivo') : document.getElementById('archivos');
  file.value = "";
};

function agregarAlCarrito(codigoProducto) {
  console.log(codigoProducto);
}

function verificaPassword() {
  const password1 = document.getElementById('passwordUsuario');
  const password2 = document.getElementById('passwordUsuarioConfirm');
  let continua = true;

  if (password1.value && password2.value) {
    if (password1.value != password2.value) {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'El password ingresado en ambos campos no coinciden',
        showConfirmButton: true
      });
      continua = false;
    }
  }

  return continua;
}

//Renderiza los productos recibidos en el HTML
const renderProductos = (data) => {
  let html = `
              <br>
              {{#if productos }}
                  <div class="table-responsive">
                      <table class="table table-dark">
                          <tr class="text-warning">
                              <th class="font-weight-bold">Nombre</th>
                              <th class="font-weight-bold">Precio</th>
                              <th class="font-weight-bold">Foto</th>
                              <th></th>
                          </tr>
                          {{#each productos }}
                              <tr>
                                  <td> {{ nombre }}</td>
                                  <td> {{ precio }}</td>
                                  <td> <img src="{{ fotoUrl }}" alt="{{ nombre }}" width="100" height="100"> </td>
                                  <td><p align="center"><input id="btn{{ codigo }}" class="btn btn-warning" type="submit" id="agregar" value="Agregar al carrito" onclick="agregarAlCarrito('{{ codigo }}')"/></p></td>
                              </tr>
                          {{/each }}
                      </table>
                  </div>
              {{else }}
                  <h3 class="alert alert-warning">No se encontraron productos</h3>
              {{/if}}
  `;
  const template = Handlebars.compile(html);
  if (divProductos) {
    divProductos.innerHTML = template({ productos: data });
  }
};

//Escuchamos cuando hay una actualización de la tabla productos y renderizamos el HTML
socket.on('actualiza-productos', (productos) => {
  renderProductos(productos);
});

//Renderiza los mensajes recibidos en el HTML
const renderMensaje = (data) => {
  const div = document.createElement('div');
  let className;
  let html;

  if (data.tipo === 'usuario') {
    //Es un msj propio
    className = 'my-messages-container';
    html = `
            <div class="my-messages">
                <span><b>${data.emailUsuario}</b> ${data.timestamp}</span><br />
                <span>${data.mensaje}</span>
            </div>`;
  } else {
    //Es un msj del sistema
    className = 'other-messages-container';
    html = `
            <div class="other-messages">
                <span><b>Sistema</b> ${data.timestamp}</span><br />
                <span>${data.mensaje}</span>
            </div>
    `;
  }

  div.classList.add(className);
  div.innerHTML = html;
  document.getElementById('divMensajes').appendChild(div);
};

const renderSelectorUsuarios = (usuarios) => {
  if (usuarios.length > 0) {
    usuarios.forEach(user => {
      selectorUsuario.options[selectorUsuario.options.length] = new Option(user, user);
      
      if (opcionSeleccionada && opcionSeleccionada === user) {
        selectorUsuario.value = opcionSeleccionada;
        selectorUsuario.dispatchEvent(new Event('change'));
      }
    });
  }
}

const renderMensajesParaRespuesta = (selectObject) => {
  const valorSeleccionado = selectObject.value;
  document.getElementById('divMensajes').innerHTML = '';
  inputEmail.value = valorSeleccionado;
  opcionSeleccionada = valorSeleccionado;
  
  if (valorSeleccionado != 'Seleccionar usuario a responder') {
    const msjsFiltrados = mensajesUsuarios.filter(msj => msj.emailUsuario === valorSeleccionado);

    msjsFiltrados.forEach(msj => {
      renderMensaje(msj);
    });
  }
}

//Escuchamos cuando hay una actualización de mensajes y renderizamos el HTML
socket.on('actualiza-mensajes', (mensajes) => {
  if (mensajes.length > 0 && document.getElementById('divMensajes')) {
    document.getElementById('divMensajes').innerHTML = '';

    if(selectorUsuario) {
      mensajesUsuarios = [...mensajes];
      const usuariosDistinct = [...new Set(mensajes.map(msj => msj.emailUsuario))];

      //Blanqueamos opciones del select option
      let options = selectorUsuario.getElementsByTagName('option');
      for (let i = options.length-1; i > 0; i--) {
        selectorUsuario.removeChild(options[i]);
      }

      renderSelectorUsuarios(usuariosDistinct);
    } else {
      const mensajesFiltrados = mensajes.filter(msj => msj.emailUsuario === inputEmail.value);
      
      mensajesFiltrados.forEach(msj => {
        renderMensaje(msj);
      });
    }
  }
});

//Enviamos el nuevo mensaje al servidor a través del submit
if (formMensajes) {
  formMensajes.addEventListener('submit', (e) => {
      e.preventDefault(); //para que no se recargue la página cuando enviamos el mensaje

      if (selectorUsuario && document.getElementById('divMensajes').innerHTML.length === 0) {
        inputMensaje.value = "";
        return;
      }

      let tipoMensaje;
      if (selectorUsuario) {
        tipoMensaje = 'sistema';
      } else {
        tipoMensaje = 'usuario';
      }

      //Creamos objeto con los datos cargados en el form
      const nuevoMensaje = {
          emailUsuario: inputEmail.value,
          mensaje: inputMensaje.value,
          tipo: tipoMensaje
      };
      socket.emit('nuevo-mensaje', nuevoMensaje); //Enviamos mensaje al server

      inputMensaje.value = ""; //Blanqueamos el campo una vez enviado el mensaje
  });
}