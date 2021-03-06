const ContenedorMemory = require('../../contenedores/ContenedorMemory');

const arrayProductos = [
    {
        "nombre": "Calculadora",
        "descripcion": "Calculadora cientifica",
        "codigo": "P001",
        "fotoUrl": "https://exitocol.vtexassets.com/arquivos/ids/257195/Calculadora-Cientifica-Graficadora.jpg",
        "precio": 1456.15,
        "stock": 12,
        "categoria": "Varios",
        "timestamp": "2022-03-28T17:41:13.361Z",
        "_id": 1
    },
    {
        "nombre": "Reloj",
        "descripcion": "Reloj de pared",
        "codigo": "P002",
        "fotoUrl": "https://us.123rf.com/450wm/monticello/monticello1911/monticello191100379/135078958-reloj-de-pared-aislado-sobre-fondo-blanco-nueve-.jpg?ver=6",
        "precio": 974.99,
        "stock": 7,
        "categoria": "Varios",
        "timestamp": "2022-03-28T17:42:13.361Z",
        "_id": 2
    },
    {
        "nombre": "Agenda",
        "descripcion": "Agenda 2022",
        "codigo": "P003",
        "fotoUrl": "https://cloudfront-eu-central-1.images.arcpublishing.com/prisa/AGYRBXKZQH6C4KYQU6IGD2BDIE.jpg",
        "precio": 674.35,
        "stock": 22,
        "categoria": "Libreria",
        "timestamp": "2022-03-28T17:43:13.361Z",
        "_id": 3
    }
];

class ProductosMemoryDao extends ContenedorMemory {
    constructor() {
        super(arrayProductos);
    }
}

module.exports = ProductosMemoryDao;