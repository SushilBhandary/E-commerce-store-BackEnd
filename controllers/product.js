
const Product = require("../models/product")
const formidable = require("formidable")
const _ = require("lodash")
const fs = require("fs")

//midelware
exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
    .populate("category")
    .exec((err, product) => {
        if (err) {
            return res.status(400).json({
                error : "Product not found"
            })
        }
        req.product = product
        next()
    })
}

exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtension = true

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error : "problem with image"
            })
        }

        //destructure the fields
        const { name, description, price, category, stock } = fields

        if ( !name || !description || !price || !category || !stock  ) {
            return res.status(400).json({
                error : "Plese include all fields"
            })
        }

        let product = new Product(fields)

        //handel file here
        if(file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error : "file size too big!"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }

        //save to the DB
        product.save((err, product) => {
            if (err) {
                return res.status(400).json({
                    error : "saving Tshirt in DB failed"
                })
            }
            res.json(product)
        })
    })
}

exports.getProduct = (req, res) => {
    req.product.photo = undefined
    return res.json(req.product)
}

//midelware
exports.photo = (req, res, next, id) => {
    if (req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next()
}

exports.deleteProduct = (req, res) => {
    let product = req.product
    product.remove((err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                error : "Failed to delete the product"
            })
        }
        res.json({
            message: "Deletion was a success",
            deletedProduct
        })
    })
}

exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtension = true

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error : "problem with image"
            })
        }

        //updation code
        let product = req.product
        product = _.extend(product, fields)

        //handel file here
        if(file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error : "file size too big!"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }

        //save to the DB
        product.save((err, product) => {
            if (err) {
                return res.status(400).json({
                    error : "Updation pf product failed"
                })
            }
            res.json(product)
        })
    })
}

exports.getAllProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id"
    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
        if (err) {
            return res.status(400).json({
                error : "Product not found"
            })
        }
        res.json(products)
    })
}

exports.getAllUniqueCategories = (req, res) => {
    Product.distinct("category", {}, (err, category) => {
        if (err) {
            return res.status(400).json({
                error : "No Category found"
            })
        }
        res.json(category)
    })
}



exports.updaetStock = (req, res, next) => {
    let myOperations = req.body.order.product.map( prod => {
        return {
            updateOne : {
                filter : {_id : prod._id},
                update : {$inc: {stock: -prod.count, sold: +prod.count}}
            }
        }
    })

    Product.bulkWrite(myOperations, {}, (err, products) => {
        if (err) {
            return res.status(400).json({
                error : "Bulk operation failed"
            })
        }
    })

    next()
}


