const express = require("express");
const app = express();
const path = require("path");
const mongoose = require('mongoose');
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
    const { category } = req.query;
    if (category) {
        const products = await Product.find({ category });
        res.render("index", { products, category });
    } else {
        const products = await Product.find({});
        res.render("index", { products, category: "All" });
    }
});

app.get("/products/new", (req, res) => {
    res.render("create", { categories });
});

app.post("/products", async (req, res) => {
    // console.log(req.body);
    const newProduct = new Product(req.body);
    await newProduct.save();
    // console.log(newProduct);
    res.redirect("/products");
});

app.get("/products/:id", async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    // console.log(product);
    res.render("product", { product });
});

app.delete("/products/:id", async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect("/products");
});

app.get("/products/:id/edit", async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render("edit", { product, categories });
});

app.put("/products/:id/edit", async (req, res) => {
    const { id } = req.params;
    // console.log(req.body);
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true });
    await product.save();
    res.redirect("/products/" + id);
});

app.listen(3000, () => {
    console.log('listening on port 3000');
});