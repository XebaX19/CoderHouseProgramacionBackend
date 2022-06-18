const request = require('supertest')('http://localhost:8080');
const expect = require('chai').expect;

describe('Casos de Test API RESTful Desafío Clase 42', () => {
    
    let idProductoCreado;
    let nuevoProducto;
    let precioActualizado = 12345.67

    describe('Test POST /api/productos', () => {
        
        it('Debería devolver 404 al no haber productos dados de alta', async () => {
            let response = await request.get('/api/productos');

            expect(response.status).to.eql(404);
        });

        it('Debería agregar un nuevo producto', async () => {
            nuevoProducto = {
                title: 'Calculadora',
                price: 958.99,
                thumbnail: 'https://exitocol.vtexassets.com/arquivos/ids/257195/Calculadora-Cientifica-Graficadora.jpg'
            };

            let response = await request.post('/api/productos').send(nuevoProducto);
            idProductoCreado = response?.body?._id;

            expect(response.status).to.eql(201);
            expect(response.body).to.include.keys('_id', 'title', 'price', 'thumbnail');
            expect(response.body.title).to.eql(nuevoProducto.title);
            expect(response.body.price).to.eql(nuevoProducto.price);
            expect(response.body.thumbnail).to.eql(nuevoProducto.thumbnail);
        });
    });

    describe('Test GET /api/productos', () => {
        it('Debería devolver 200 y los productos dados de alta', async () => {
            let response = await request.get('/api/productos');

            expect(response.status).to.eql(200);
            expect(response.body.length).to.greaterThan(0);
        });
    });

    describe('Test GET /api/productos/:id', () => {
        it('Debería devolver 200 y el producto consultado', async () => {
            let response = await request.get(`/api/productos/${idProductoCreado}`);

            expect(response.status).to.eql(200);
            expect(response.body).to.include.keys('_id', 'title', 'price', 'thumbnail');
            expect(response.body.title).to.eql(nuevoProducto.title);
            expect(response.body.price).to.eql(nuevoProducto.price);
            expect(response.body.thumbnail).to.eql(nuevoProducto.thumbnail);
        });

        it('Debería devolver 404 al consultar un producto inexistente', async () => {
            let response = await request.get(`/api/productos/NOEXISTE`);

            expect(response.status).to.eql(404);
        });
    });

    describe('Test PUT /api/productos/:id', () => {
        it('Debería actualizar el producto anteriormente creado', async () => {
            let productoActualizado = {};
            Object.assign(productoActualizado, nuevoProducto);
            productoActualizado._id = idProductoCreado;
            productoActualizado.price = precioActualizado;
            let response = await request.put(`/api/productos/${idProductoCreado}`).send(productoActualizado);

            expect(response.status).to.eql(200);
        });

        it('Debería devolver 200 y el producto actualizado', async () => {
            let response = await request.get(`/api/productos/${idProductoCreado}`);

            expect(response.status).to.eql(200);
            expect(response.body).to.include.keys('_id', 'title', 'price', 'thumbnail');
            expect(response.body.title).to.eql(nuevoProducto.title);
            expect(response.body.price).to.eql(precioActualizado);
            expect(response.body.thumbnail).to.eql(nuevoProducto.thumbnail);
        });

        it('Debería devolver 404 al actualizar un producto inexistente', async () => {
            let response = await request.put(`/api/productos/NOEXISTE`);

            expect(response.status).to.eql(404);
        });
    });

    describe('Test DELETE /api/productos/:id', () => {
        it('Debería eliminar el producto anteriormente creado', async () => {
            let response = await request.delete(`/api/productos/${idProductoCreado}`);

            expect(response.status).to.eql(200);
        });

        it('Debería devolver 404 al eliminar un producto inexistente', async () => {
            let response = await request.delete(`/api/productos/${idProductoCreado}`);

            expect(response.status).to.eql(404);
        });
    });
});