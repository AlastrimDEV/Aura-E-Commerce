const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

const getProducts = async (req, res) => {
    try {
        const { search, category, sort, minPrice, maxPrice } = req.query;
        let query = {};

        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        if (category && category !== "All") {
            query.category = category;
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        let sortOption = { createdAt: -1 };
        if (sort === "price-low") sortOption = { price: 1 };
        if (sort === "price-high") sortOption = { price: -1 };
        if (sort === "newest") sortOption = { createdAt: -1 };

        const products = await Product.find(query).sort(sortOption);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, description, category, price, stock, sizes, imageUrl: bodyImageUrl } = req.body;

        let imageUrl = bodyImageUrl || '';
        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path);
                imageUrl = result.secure_url;
            } catch (err) {
                console.error("Cloudinary upload error:", err);
            }
        }

        const parsedSizes = Array.isArray(sizes) 
            ? sizes 
            : (typeof sizes === 'string' ? sizes.split(',').map(s => s.trim()) : ["S", "M", "L", "XL"]);

        const product = new Product({
            name,
            description,
            category,
            price: Number(price),
            stock: Number(stock),
            sizes: parsedSizes,
            imageUrl: imageUrl || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error("Create product error:", error);
        res.status(500).json({ message: "Internal server error: " + error.message });
    }
};

const updateProduct = async (req, res) => {
    const { name, description, category, price, stock, sizes, imageUrl: bodyImageUrl } = req.body;

    try {    
        const product = await Product.findById(req.params.id);
        if (product) {
            product.name = name !== undefined ? name : product.name;
            product.description = description !== undefined ? description : product.description;
            product.category = category !== undefined ? category : product.category;
            product.price = price !== undefined ? Number(price) : product.price;
            product.stock = stock !== undefined ? Number(stock) : product.stock;
            
            if (sizes) {
                product.sizes = Array.isArray(sizes) 
                    ? sizes 
                    : (typeof sizes === 'string' ? sizes.split(',').map(s => s.trim()) : product.sizes);
            }

            if (bodyImageUrl) {
                product.imageUrl = bodyImageUrl;
            }

            if (req.file) {
                try {
                    const result = await cloudinary.uploader.upload(req.file.path);
                    product.imageUrl = result.secure_url;
                } catch (err) {
                    console.error("Cloudinary update error:", err);
                }
            }

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ message: "Product removed" });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };