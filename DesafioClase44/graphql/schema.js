const { buildSchema } = require('graphql');

const schema = buildSchema(`
    type Producto {
        id: ID!,
        title: String,
        price: Float,
        thumbnail: String
    }

    input ProductoInput {
        title: String,
        price: Float,
        thumbnail: String
    }    

    type Query {
        getProductos: [Producto],
        getProducto(id: ID!): Producto
    }

    type Mutation {
        createProducto(datos: ProductoInput): Producto,
        updateProducto(id: ID!, datos: ProductoInput): Producto,
        deleteProducto(id: ID!): Producto
    }
`);

module.exports = schema;