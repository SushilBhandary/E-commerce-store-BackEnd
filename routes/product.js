const express = require('express')
const router  = express.Router();

const { getProductById, createProduct, getProduct, photo, deleteProduct, updateProduct, getAllProducts, getAllUniqueCategories } = require('../controllers/product')
const { getUserById } = require('../controllers/user')
const { isAuthenticated, isAdmin, isSignedIn } = require('../controllers/auth')

//params
router.param("userId", getUserById);
router.param("productId", getProductById);
 
//all actual routes
    //create routes
router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct)
    //read routes
router.get("/product/:productId", getProduct)
router.get("/product/photo/:productId", photo)
    //delete routed
router.delete("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, deleteProduct)
    //update routed
router.put("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, updateProduct)
    //listing routed
router.get("/products", getAllProducts)

router.get("/products/categories", getAllUniqueCategories)


module.exports = router