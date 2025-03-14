import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";

dotenv.config();

const router = express.Router();

const generateToken = (admin) => {
  return jwt.sign({ email: admin.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Admin Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const token = generateToken({ email });
    res.status(200).json({ message: "Login successful", token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

// Add Category
router.post("/add-category", authenticateAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Remove Category
router.delete("/remove-category/:id", authenticateAdmin, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Category removed" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Add Product
router.post("/add-product", authenticateAdmin, async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const product = await Product.create({ name, description, price, category, stock });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Remove Product
router.delete("/remove-product/:id", authenticateAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product removed" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Edit Product
router.put("/edit-product/:id", authenticateAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

console.log("Admin routes loaded at /api/admin");
export default router;
