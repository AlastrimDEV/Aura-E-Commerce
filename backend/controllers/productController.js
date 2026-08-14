const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

const getProducts = async (req, res)=>{
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" })
    }
};

const getProductById = async (req, res)=>{
    try{
        const product = await Product.findById(req.params.id);
        if (product){
            res.json(product);
        }else{
            res.status(404).json({ message: "Product not found" })
        }
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Internal server error" })
    }
}

const createProduct = async(req, res)=>{
    try {
        const { name, description, category, price, stock} = req.body;

        let imageUrl = '';
        if (req.file){
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url;
        }

        const product = new Product({
            name,
            description,
            category,
            price,
            stock,
            imageUrl
        })
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" })
    }
}

const updateProduct = async(req, res)=>{
    const { name, description, category, price, stock} = req.body;

    let imageUrl = "";

    try{    
    const product = await Product.findById(req.params.id);
    if (product){
        product.name = name || product.name;
        product.description = description || product.description;
        product.category = category || product.category;
        product.price = price || product.price;
        product.stock = stock || product.stock;
        if (req.file){
            const result = await cloudinary.uploader.upload(req.file.path);
            product.imageUrl = result.secure_url;
        }
        const updatedProduct = await product.save()
        res.json(updatedProduct);
    }else{
        res.status(404).json({message: "Product not found"})
    }
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Internal server error" })
    }
}

const deleteProduct = async (req, res) => {
    try{
        const product = await Product.findById(req.params.id);
        if (product){
            await product.deleteOne();
            res.json({ message: "Product removed" })
        }else{
            res.status(404).json({ message: "Product not found" })
        }
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };