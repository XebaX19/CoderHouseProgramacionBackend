const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const {formatMessage} = require('./utils/utils')

const PORT = process.env.PORT || 8080;
const app = express();
const httpServer = http.createServer(app);
const io = socketIo(httpServer);

const messages = [];
const users = [];

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));

//Routes
app.post('/login', (req, res) => {
    const {username} = req.body;
    res.redirect(`/chat?username=${username}`);
});

app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/public/chat.html');
});

//Listen
httpServer.listen(PORT, () => {
    console.log(`Server is up and running on port: ${PORT}`);
});

//Sockets events
const botName = 'Shut bot';
io.on('connection', (socket) => {
    console.log('New client connection!');

    //Join chat
    socket.on('join-chat', ({username}) => {
        const newUser = {
            id: socket.id,
            username
        };
        users.push(newUser);

        //Send users connected a TODOS los clientes conectados
        io.emit('users-connected', [...users]);

        //Welcome current user
        socket.emit('chat-message', formatMessage(null, botName, 'Welcome to Shut App!'));

        //Envia mensajes almacenados
        socket.emit('messages', [...messages]); //Realiza una copia del arreglo (como se pasa por referencia, si le pasaría directamente "messages" se pisaría la variable que defino inicialmente)


        //Broadcast user connection
        //Mensaje para todos los clientes conectados, EXCEPTO para el que envío el evento
        socket.broadcast.emit('chat-message', formatMessage(null, botName, `${username} has joined the chat!`));

        //Envía todos los mensajes almacenados
        //socket.emit('all-messages', [...messages]);
    });

    //Escuchamos cuando el cliente envía un nuevo mensaje
    socket.on('new-message', (msj) => {
        const user = users.find(user => user.id === socket.id); //Buscamos el usuario que envía el msj
        const newMessage = formatMessage(socket.id, user.username, msj);
        messages.push(newMessage);
        
        //Emitimos el mensaje recibido a TODOS los clientes (incluído el que lo envió)
        io.emit('chat-message', newMessage);
    });

    //Escuchamos cuando el cliente se desconecta
    socket.on('disconnect', () => {
        const userIndex = users.findIndex(user => user.id === socket.id);
        const username = users[userIndex].username;
        users.splice(userIndex, 1);

        //Mensaje para todos los clientes conectados, EXCEPTO para el que envío el evento
        socket.broadcast.emit('users-connected', [...users]);
    
        //Mensaje para todos los clientes conectados, EXCEPTO para el que envío el evento
        socket.broadcast.emit('chat-message', formatMessage(null, botName, `${username} has left the chat!`));
    });
});