const socket = io();
const usersList = document.getElementById('users-list');
const textInput = document.getElementById('text-input');
const chatForm = document.getElementById('chat-form');

const redirectToLogin = () => {
    window.location = '/';
};

//Renderiza mensaje en el HTML, según quien lo envió (bot, otro cliente o msj mio)
const renderMessage = (socketId, data) => {
    const div = document.createElement('div');
    let className;
    let html;

    if (data.id) {
        if (socketId === data.id) {
            //Es un msj propio
            className = 'my-messages-container';
            html = `
                    <div class="my-messages">
                        <span><b>Yo</b> ${data.time}</span><br />
                        <span>${data.text}</span>
                    </div>`;
        } else {
            //Es un msj de otro cliente
            className = 'other-messages-container';
            html = `
                    <div class="other-messages">
                        <span><b>${data.username}</b> ${data.time}</span><br />
                        <span>${data.text}</span>
                    </div>
            `;
        }
    } else {
        //Es un msj del BOT
        className = 'bot-messages';
        html = `<b>${data.username} dice: </b><i>${data.text}</i>`;
    }

    div.classList.add(className);
    div.innerHTML = html;
    document.getElementById('messages').appendChild(div);
};

//Renderiza usuarios conectados en el HTML
const renderUsers = (users) => {
    usersList.innerHTML = "";
    users.forEach(usr => {
        const div = document.createElement('div');
        let html = `
                    <div class="row px-1">
                        <span class="text-light">
                        <div class="d-inline-block mx-2 users-icon"></div>
                        ${usr.username}
                        </span>
                    </div>
        `;

        div.innerHTML = html;
        usersList.appendChild(div);
    });
};

//Join chat
//Se puede acceder al queryString por el script agregado en chat.html: src="https://cdnjs.cloudflare.com/ajax/libs/qs/6.10.3/qs.min.js"
const {username} = Qs.parse(window.location.search, {
    ignoreQueryPrefix: true
});
socket.emit('join-chat', {username});

//Escuchamos los usuarios conectados y renderizamos en el HTML
socket.on('users-connected', (users) => {
    renderUsers(users);
});

//Escuchamos el aviso con los mensajes iniciales
socket.on('messages', (data) => {
    if (data.length > 0) {
        data.forEach(msj => {
            renderMessage('algunClienteQueNoSeLlameAsi', msj)
        });
    }
})

//Escuchamos cuando hay un nuevo mensaje enviado por el servidor y renderizamos en el HTML
socket.on('chat-message', (data) => {
    renderMessage(socket.id, data);
});

//Enviamos el mensaje al servidor a través del submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault(); //para que no se recargue la página cuando enviamos el mensaje
    const msj = textInput.value; //Obtenemos el mensaje del textInput
    socket.emit('new-message', msj); //Enviamos mensaje al server
    textInput.value = ""; //Blanqueamos el textInput una vez enviado el mensaje
});
