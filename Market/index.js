const express = require("express");
const app = express();
const path = require("path");
const mongoose = require('mongoose');
const AppError = require("./err.js");
const methodOverride = require('method-override')

const Product = require("./models/product");

async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/market');
        console.log("connected successfully");
    } catch (err) {
        console.log("erroe occured");
        console.log(err);
    }
}
main();

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

const categories = ["fruit", "vegetable"];

function catchAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(err => next(err))
    }
}

app.get("/products", catchAsync(async (req, res, next) => {
    const { category } = req.query;
    if (category) {
        const products = await Product.find({ category });
        res.render("index", { products, category });
    } else {
        const products = await Product.find({});
        res.render("index", { products, category: "All" });
    }
}));

app.get("/products/new", (req, res) => {
    res.render("create", { categories });
});

app.post("/products", catchAsync(async (req, res, next) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect("/products");
}));

app.get("/products/:id", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        throw new AppError("Product not found", 404);
    }
    res.render("product", { product });
}));

app.delete("/products/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect("/products");
}));

app.get("/products/:id/edit", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        throw new AppError('product not found', 404);
    }
    res.render("edit", { product, categories });
}));

app.put("/products/:id/edit", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true });
    await product.save();
    res.redirect("/products/" + id);
}));

app.use((err, req, res, next) => {
    const { status = 401, message = "Invalid" } = err;
    res.status(status).send(message);
});

app.listen(3000, () => {
    console.log('listening on port 3000');
});