const mongoose = require('mongoose');

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

// const product1 = new Product({
//     name: "apple",
//     price: 2,
//     category: "fruit"
// });

// product1.save().then(p => console.log(p)).catch(err => console.log(err));

const productInfo = [
    {
        name: "banana",
        price: 1,
        category: "fruit"
    },
    {
        name: "carrot",
        price: 3,
        category: "vegetable"
    },
    {
        name: "cabbage",
        price: 5,
        category: "vegetable"
    }
];

// Product.insertMany(productInfo);

// (async () => {
//     try {
//         const namesToDelete = ['banana', 'carrot', 'cabbage'];
//         const result = await Product.deleteMany({ name: { $in: namesToDelete } });
//         console.log(result.deletedCount);
//     } catch (error) {
//         console.error('Error deleting documents:', error);
//     }
// });