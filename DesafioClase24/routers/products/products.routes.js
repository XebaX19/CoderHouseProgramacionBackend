//Importamos librerías
const express = require('express');
const router = express.Router();
const path = require('path');

//Routes (/productos)
router.get('/', async (req, res) => {
    const user = await req.session.user;
    if (user) {
      return res.render('form', {nombreUsuario: user});
    }
    else {
      return res.sendFile(path.resolve('public/login.html'));
    }
});

module.exports = router;