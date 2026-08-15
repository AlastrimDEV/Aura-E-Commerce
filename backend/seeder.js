const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");

dotenv.config();

const sampleProducts = [
  {
    name: "Minimal Oversized Hoodie",
    description: "Crafted from heavy 450gsm organic cotton french terry. Designed with a dropped shoulder silhouette and subtle tonal embroidery on the sleeve.",
    category: "Hoodies",
    price: 3499,
    stock: 25,
    sizes: ["S", "M", "L", "XL"],
    imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    numReviews: 14
  },
  {
    name: "Essential Heavyweight Tee",
    description: "280gsm combed cotton tee featuring a boxy fit, reinforced ribbed collar, and pre-shrunk finish for daily wear.",
    category: "T-Shirts",
    price: 1499,
    stock: 40,
    sizes: ["S", "M", "L", "XL"],
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    numReviews: 29
  },
  {
    name: "Structured Denim Trucker",
    description: "Classic Japanese selvedge denim jacket in a washed vintage charcoal tint. Custom brass hardware and reinforced seams.",
    category: "Jackets",
    price: 4999,
    stock: 15,
    sizes: ["M", "L", "XL"],
    imageUrl: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    numReviews: 8
  },
  {
    name: "Relaxed Utility Cargo Pants",
    description: "Tough cotton twill cargos with knee darts, deep side bellow pockets, and adjustable hem drawstrings for tailored styling.",
    category: "Pants",
    price: 2999,
    stock: 30,
    sizes: ["S", "M", "L", "XL"],
    imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    numReviews: 19
  },
  {
    name: "Linen Blend Resort Shirt",
    description: "Lightweight breathable linen blend with camp collar design. Perfect for warm climate layering and effortless minimal style.",
    category: "Shirts",
    price: 2299,
    stock: 20,
    sizes: ["S", "M", "L"],
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    numReviews: 11
  },
  {
    name: "Monochrome Embroidered Cap",
    description: "6-panel dad hat constructed from washed cotton canvas featuring minimal AURA micro-embroidery logo on front.",
    category: "Accessories",
    price: 999,
    stock: 50,
    sizes: ["S", "M", "L", "XL"],
    imageUrl: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    numReviews: 22
  },
  {
    name: "Raw Hem Graphic Sweatshirt",
    description: "Crewneck sweatshirt with raw distressed hem detail and soft brushed fleece interior for ultimate winter comfort.",
    category: "Hoodies",
    price: 2799,
    stock: 18,
    sizes: ["S", "M", "L", "XL"],
    imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    numReviews: 16
  },
  {
    name: "Tailored Wide-Leg Trousers",
    description: "Contemporary wide-leg trousers crafted from premium wool-blend fabric with front pleats and side angle pockets.",
    category: "Pants",
    price: 3899,
    stock: 12,
    sizes: ["S", "M", "L"],
    imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    numReviews: 7
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for Seeding...");

    // Delete existing products
    await Product.deleteMany({});
    console.log("Cleared existing products.");

    // Insert sample products
    const inserted = await Product.insertMany(sampleProducts);
    console.log(`Successfully seeded ${inserted.length} clothing products into database!`);

    process.exit();
  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
};

seedDB();
