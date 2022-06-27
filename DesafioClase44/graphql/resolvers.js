const { v4: uuid } = require('uuid');
const Producto = require('../models/dtos/ProductosDto');
const productosDB = [];

const getProductos = () => {
    const productos = Object.values(productosDB); //Devuelve un arreglo con los objetos que contiene
    return productos;
};

//El parámetro se recibe en un objeto, por eso hago el destructuring...
const getProducto = ({ id }) => {
    if(!productosDB[id]) {
        throw new Error('Producto not found');
    }
    return productosDB[id];
};

const createProducto = ({ datos }) => {
    const id = uuid();
    datos._id = id;
    const newProducto = new Producto(datos);
    productosDB[id] = newProducto;
    return newProducto;
};

const updateProducto = ({ id, datos}) => {
    if(!productosDB[id]) {
        throw new Error('Producto not found');
    }
    datos._id = id;
    const updatedProducto = new Producto(datos);
    productosDB[id] = updatedProducto;
    return updatedProducto;
};

const deleteProducto = ({ id }) => {
    if(!productosDB[id]) {
        throw new Error('Producto not found');
    }
    const deletedProducto = productosDB[id];
    delete productosDB[id];
    return deletedProducto;
};

module.exports = {
    getProducto,
    getProductos,
    createProducto,
    updateProducto,
    deleteProducto
}