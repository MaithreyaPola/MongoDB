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

app.get("/products", async (req, res) => {
    try {
        const { category } = req.query;
        if (category) {
            const products = await Product.find({ category });
            res.render("index", { products, category });
        } else {
            const products = await Product.find({});
            res.render("index", { products, category: "All" });
        }
    } catch (err) {
        next(err);
    }
});

app.get("/products/new", (req, res) => {
    res.render("create", { categories });
});

app.post("/products", async (req, res, next) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.redirect("/products");
    }
    catch (err) {
        next(err);
    }
});

app.get("/products/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        // console.log(product);
        if (!product) {
            throw new AppError("Product not found", 404);
        }
        res.render("product", { product });
    } catch (err) {
        next(err);
    }
});

app.delete("/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        res.redirect("/products");
    } catch (err) {
        next(err);
    }
});

app.get("/products/:id/edit", async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render("edit", { product, categories });
});

app.put("/products/:id/edit", async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true });
        if (!product) {
            throw new AppError("Product id not found");
        }
        await product.save();
        res.redirect("/products/" + id);
    } catch (err) {
        next(err);
    }
});

app.use((err, req, res, next) => {
    const { status = 401, message = "Invalid" } = err;
    res.status(status).send(message);
});

app.listen(3000, () => {
    console.log('listening on port 3000');
});