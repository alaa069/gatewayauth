const express = require('express');
const router = express.Router();
const authentication = require('../controller/validateRequest')
const auth = require('./auth.js');
const products = require('./products.js');
const user = require('./users.js');

/*
 * Routes that can be accessed by any one
 */
router.post('/login', auth.login);
router.get('/login', auth.test);

/*
 * Routes that can be accessed only by autheticated users
 */
router.get('/api/v1/products', authentication, products.getAll);
router.get('/api/v1/product/:id', authentication, products.getOne);
router.post('/api/v1/product/', authentication, products.create);
router.put('/api/v1/product/:id', authentication, products.update);
router.delete('/api/v1/product/:id', authentication, products.delete);

/*
 * Routes that can be accessed only by authenticated & authorized users
 */
router.get('/api/v1/admin/users', authentication, user.getAll);
router.get('/api/v1/admin/user/:id', authentication, user.getOne);
router.post('/api/v1/admin/user/', authentication, user.create);
router.put('/api/v1/admin/user/:id', authentication, user.update);
router.delete('/api/v1/admin/user/:id', authentication, user.delete);

router.all('*', function(req, res) {
  res.json({message:'bad URL'})
})

module.exports = router;