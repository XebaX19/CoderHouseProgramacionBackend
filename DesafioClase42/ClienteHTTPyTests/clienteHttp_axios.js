const axios = require('axios').default;

(async () => {
    try {
        //Test Manual: POST /api/productos
        console.log('||------------------------- POST /api/productos -----------------------||');
        const response1 = await axios.post('http://localhost:8080/api/productos', {
            title: 'Calculadora',
            price: 2567.99,
            thumbnail: 'https://exitocol.vtexassets.com/arquivos/ids/257195/Calculadora-Cientifica-Graficadora.jpg'
        });
        console.log(response1.data);
        console.log('||---------------------------------------------------------------------||');
        const idCreado = response1.data._id;

        //Test Manual: GET /api/productos
        console.log('||------------------------ GET /api/productos -------------------------||');
        const response2 = await axios.get('http://localhost:8080/api/productos');
        console.log(response2.data);
        console.log('||---------------------------------------------------------------------||');

        //Test Manual: GET /api/productos/:id
        console.log('||----------------------- GET /api/productos/:id ----------------------||');
        const response3 = await axios.get(`http://localhost:8080/api/productos/${idCreado}`);
        console.log(response3.data);
        console.log('||---------------------------------------------------------------------||');
        
        //Test Manual: PUT /api/productos/:id
        console.log('||--------------------- PUT /api/productos/:id ------------------------||');
        const response4 = await axios.put(`http://localhost:8080/api/productos/${idCreado}`, {
            title: 'CalculadoraActualizada',
            price: 9999.99,
            thumbnail: 'https://exitocol.vtexassets.com/arquivos/ids/257195/Calculadora-Cientifica-Graficadora.jpg' 
        });
        console.log(response4.data);
        console.log('||---------------------------------------------------------------------||');

        //Test Manual: GET /api/productos/:id
        console.log('||------------------ GET /api/productos/:id ---(luego de actualizar)---||');
        const response5 = await axios.get(`http://localhost:8080/api/productos/${idCreado}`);
        console.log(response5.data);
        console.log('||---------------------------------------------------------------------||');

        //Test Manual: DELETE /api/productos/:id
        console.log('||--------------------- DELETE /api/productos/:id ---------------------||');
        const response6 = await axios.delete(`http://localhost:8080/api/productos/${idCreado}`);
        console.log(response6.data);
        console.log('||---------------------------------------------------------------------||');

    } catch (error) {
        console.log(error.message);
    }
})();