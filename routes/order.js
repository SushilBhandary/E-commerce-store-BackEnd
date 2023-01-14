const express = require('express')
const router  = express.Router();

const { getUserById, pushOrderInPurchaseList } = require('../controllers/user')
const { isAuthenticated, isAdmin, isSignedIn } = require('../controllers/auth')
const { updaetStock } = require('../controllers/product')
const { getOrderById, createOrder, getAllOrders, getOrdersStatus, updateStatus } = require('../controllers/order')

//param
router.param("userId", getUserById);
router.param("orderId", getOrderById);

//Actual router
    //create router
router.post("/order/create/:userId", isSignedIn, isAuthenticated, pushOrderInPurchaseList, updaetStock, createOrder)
    //read router
router.get("/order/all/:userId", isSignedIn, isAuthenticated, isAdmin, getAllOrders)
    //Status of order
 router.get("/order/status/:userId", isSignedIn, isAuthenticated, isAdmin, getOrdersStatus)
    //Update router
router.put("/order/create/:orderId/status/:userId", isSignedIn, isAuthenticated, isAdmin, updateStatus)

module.exports = router