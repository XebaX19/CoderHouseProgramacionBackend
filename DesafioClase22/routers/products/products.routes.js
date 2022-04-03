//Importamos librerías
const express = require('express');
const router = express.Router();

//Routes (/productos)
router.get('/', async (req, res) => {
    res.render('form');
});

module.exports = router;