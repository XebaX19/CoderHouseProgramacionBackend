const authorizer = (req, res, next) => {

    const esAdmin = true; //Configuraremos más adelante con el sistema de Login 

    if (!esAdmin) {
        return res.status(401).json({ error: -1, descripcion: `Método: ${req.method} y Ruta: ${req.originalUrl} no autorizada` });
    }

    next();//para que se ejecute la siguiente instrucción
};

module.exports = authorizer;