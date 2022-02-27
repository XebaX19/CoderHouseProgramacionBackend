const socket = io();
const divProductos = document.getElementById('divProductos');
const formProducto = document.getElementById('formProducto');
const inputNombreProducto = document.getElementById('nombre');
const inputPrecioProducto = document.getElementById('precio');
const inputFotoUrlProducto = document.getElementById('fotoUrl');
const divMensajes = document.getElementById('divMensajes');
const formMensajes = document.getElementById('formMensajes');
const inputEmail = document.getElementById('email');
const inputMensaje = document.getElementById('mensaje');

//Renderiza los productos recibidos en el HTML
const renderProductos = (data) => {
    let html = `
                {{#if productos }}
                    <div class="table-responsive">
                        <table class="table table-dark">
                            <tr class="text-warning">
                                <th class="font-weight-bold">Nombre</th>
                                <th class="font-weight-bold">Precio</th>
                                <th class="font-weight-bold">Foto</th>
                            </tr>
                            {{#each productos }}
                                <tr>
                                    <td> {{ title }}</td>
                                    <td> {{ price }}</td>
                                    <td> <img src="{{ thumbnail }}" alt="{{ title }}" width="100" height="100"> </td>
                                </tr>
                            {{/each }}
                        </table>
                    </div>
                {{else }}
                    <h3 class="alert alert-warning">No se encontraron productos</h3>
                {{/if}}
    `;
    const template = Handlebars.compile(html);
    divProductos.innerHTML = template({productos: data});
};

//Renderiza los mensajes recibidos en el HTML
const renderMensajes = (data) => {
    let html = `
                <div>
                {{#each mensajes }}
                    <div>
                        <span style="font-weight: bold;color: blue;">{{ email }}</span><span style="color: brown;"> [{{ time }}] : </span><span style="font-style: italic;color: green;"> {{ mensaje }}</span>
                    </div>
                {{/each }}
                </div>
    `;
    const template = Handlebars.compile(html);
    divMensajes.innerHTML = template({mensajes: data});
};

//Escuchamos cuando hay una actualización de la tabla productos y renderizamos el HTML
socket.on('actualiza-productos', (productos) => {
    renderProductos(productos);
});

//Escuchamos cuando hay una actualización de mensajes y renderizamos el HTML
socket.on('actualiza-mensajes', (mensajes) => {
    renderMensajes(mensajes);
});

//Enviamos el nuevo producto al servidor a través del submit
formProducto.addEventListener('submit', (e) => {
    e.preventDefault(); //para que no se recargue la página cuando enviamos el mensaje
    const nuevoProducto = { title: inputNombreProducto.value, price: inputPrecioProducto.value, thumbnail: inputFotoUrlProducto.value }; //Creamos objeto con los datos cargados en el form
    socket.emit('nuevo-producto', nuevoProducto); //Enviamos mensaje al server
    
    inputNombreProducto.value = ""; //Blanqueamos el campo una vez enviado el mensaje
    inputPrecioProducto.value = "";
    inputFotoUrlProducto.value = "";
});

//Enviamos el nuevo mensaje al servidor a través del submit
formMensajes.addEventListener('submit', (e) => {
    e.preventDefault(); //para que no se recargue la página cuando enviamos el mensaje
    const nuevoMensaje = { email: inputEmail.value, mensaje: inputMensaje.value }; //Creamos objeto con los datos cargados en el form
    socket.emit('nuevo-mensaje', nuevoMensaje); //Enviamos mensaje al server

    inputMensaje.value = ""; //Blanqueamos el campo una vez enviado el mensaje
});