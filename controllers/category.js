const Category = require("../models/category")


exports.getCategoryId = (req, res, next, id) => {
    Category.findById(id)
    .exec((err, cate) => {
        if (err) {
            return res.status(400).json({
                error : "Categoty not found in DB"
            })
        }
        req.Category = cate
        next()
    })
}

exports.createCategory = (req, res) => {
    const category = new Category(req.body)
    category.save((err, category) => {
        if (err) {
            return res.status(400).json({
                error : "Not able to save  category in DB"
            })
        }
        res.json({ category })
    })
}

exports.getCategory = (req, res) => {
    return res.json(req.category)
}

exports.getAllCategory = (req, res) => {
    Category.find().exec((err, categaries) => {
        if (err) {
            return res.status(400).json({
                error : "No categaries found"
            })
        }
        res.json(categaries)
    })
}

exports.UpdateCategory = (req,res) => {
    const category = req.Category
    category.name = req.body.name

    category.save((err, updatedCategory) => {
        if (err) {
            return res.status(400).json({
                error : "Failed to Update category"
            })
        }
        res.json(updatedCategory)
    })
}

exports.removeCategory = (req, res) => {
    const category = req.Category
    category.remove((err, category) => {
        if (err) {
            return res.status(400).json({
                error : "Failed to delete category"
            })
        }
        res.json({
            message: `${category.name} Successfull deleted`
        })
    }) 
} 