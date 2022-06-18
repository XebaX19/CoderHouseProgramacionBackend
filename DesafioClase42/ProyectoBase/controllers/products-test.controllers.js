const productsTestControllers = async (req, res) => {
    const user = req.user;
    if (user) {
      return res.render('form', {nombreUsuario: user.email});
    }
    else {
      res.redirect('/login');
    }
};

module.exports = { productsTestControllers };