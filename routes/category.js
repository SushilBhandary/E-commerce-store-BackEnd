const express = require('express')
const router  = express.Router();
const {isAuthenticated, isAdmin, isSignedIn} = require("../controllers/auth")
const {getCategoryId, createCategory, getCategory, getAllCategory, UpdateCategory, removeCategory} = require("../controllers/category")
const {getUserById} = require("../controllers/user")


//params
router.param("userId", getUserById);
router.param("categoryId", getCategoryId);

//actual routers goes here
 
    //creat 
router.post("/category/create/:userId", isSignedIn, isAuthenticated, isAdmin, createCategory )
    //read
router.get("/category/:categoryId", getCategory )
router.get("/categories", getAllCategory ) 
    //update
router.put("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, UpdateCategory )
    //Delete
router.delete("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, removeCategory )

module.exports = router 